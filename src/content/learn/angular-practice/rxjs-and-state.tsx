import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain, StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "rxjs-and-state",
  title: "RxJS と Observable で状態を管理する",
  description: "Angular の核である RxJS を、TaskFlow の状態管理を題材に。Observable と Promise の違い、subscribe/unsubscribe、async pipe、BehaviorSubject でのストア、そして signals との対比まで。",
  domain: "angular-practice",
  section: "rxjs-state",
  order: 1,
  level: "practice",
  tags: ["Angular", "RxJS", "状態管理"],
  updated: "2026-07-07",
  minutes: 14,
};

export default function Article() {
  return (
    <>
      <Lead>
        Angular で状態を扱う上で避けて通れないのが <strong>RxJS</strong>。中心にあるのが <Cmd>Observable</Cmd>（時間で流れる値のストリーム）です。
        TaskFlow のタスク一覧を題材に、Observable の考え方・<Cmd>async pipe</Cmd>・<Cmd>BehaviorSubject</Cmd> のストア、そして新方式の <Cmd>signals</Cmd> との対比までを実践します。
      </Lead>

      <Section>Observable とは — 時間で流れる値のストリーム</Section>
      <p>
        <Cmd>Promise</Cmd> は「1 回だけ、いつか届く 1 個の値」でした。<Cmd>Observable</Cmd> は「<strong>時間の経過とともに、0 個・1 個・何個でも値が流れてくる川</strong>」です。
        タスクの追加・完了トグルのように<strong>状態が何度も変化する</strong>ものは、この「川（ストリーム）」で表すと自然に扱えます。
      </p>
      <FlowChain
        nodes={[
          { label: "発生源", sub: "add / toggle", variant: "primary" },
          { label: "Observable", sub: "値の川", variant: "alt" },
          { label: "operator", sub: "map / filter" },
          { label: "subscribe", sub: "受け取り", variant: "cta" },
        ]}
        caption="発生源で流れた値が operator を通り、subscribe した先へ届く"
      />
      <ComparisonTable
        headers={["観点", "Promise", "Observable（RxJS）"]}
        rows={[
          ["値の個数", "1 個だけ", "0〜複数（何度でも流れる）"],
          ["時間", "一度きり（解決したら終わり）", "時間経過で流れ続ける（ストリーム）"],
          ["起動", "作った瞬間に実行される", "subscribe して初めて流れ出す（遅延）"],
          ["キャンセル", "できない", "unsubscribe で購読解除できる"],
          ["変換", "then でつなぐ程度", "map / filter など豊富な operator"],
        ]}
      />
      <Callout variant="info" title="向き不向き">
        「1 回の HTTP レスポンス」のような単発は Promise でも Observable でも扱えます（Angular の <Cmd>HttpClient</Cmd> は Observable を返します）。
        一方「タスク一覧が編集で何度も変わる」ような<strong>継続的に変化する状態</strong>は、Observable の独壇場です。
      </Callout>

      <Section>subscribe と unsubscribe — メモリリークに注意</Section>
      <p>
        Observable は <Cmd>subscribe()</Cmd> して初めて値が流れ出します（それまでは何も起きない）。そして<strong>購読を止めるには <Cmd>unsubscribe()</Cmd> が要ります</strong>。
        コンポーネントが破棄されても購読が残ると、参照が解放されず<strong>メモリリーク</strong>や二重処理の原因になります。
      </p>
      <Code lang="ts" filename="手動 subscribe（破棄時に unsubscribe が必要）">{`import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskService } from './task.service';

export class TaskListComponent implements OnInit, OnDestroy {
  private taskService = inject(TaskService);
  private sub?: Subscription;
  tasks: Task[] = [];

  ngOnInit() {
    // 手動 subscribe: 値を受け取れるが、後始末が要る
    this.sub = this.taskService.tasks$.subscribe((list) => {
      this.tasks = list;
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();   // ← これを忘れるとメモリリーク
  }
}`}</Code>
      <Callout variant="warn" title="手動 subscribe は「後始末」がつきまとう">
        購読が増えるほど <Cmd>unsubscribe</Cmd> の管理が煩雑になります。テンプレートで表示するだけなら、次の <strong>async pipe</strong> を使えば
        購読・解除が<strong>自動</strong>になり、この問題自体が消えます。実務ではまず async pipe を検討します。
      </Callout>

      <Section>async pipe — テンプレートで自動 subscribe / unsubscribe</Section>
      <p>
        <Cmd>async</Cmd> パイプは、テンプレート内で Observable を<strong>自動で subscribe し、値を取り出し、破棄時に自動で unsubscribe</strong> します。
        後始末が要らず、Angular で最も推奨される受け取り方です。
      </p>
      <Code lang="ts" filename="async pipe（後始末不要）">{`import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TaskService } from './task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [AsyncPipe],   // async パイプを使うので import
  template: \`
    <ul>
      <!-- tasks$ を async で開き、流れてきた配列を task で回す -->
      @for (task of tasks$ | async; track task.id) {
        <li [class.done]="task.done">{{ task.title }}</li>
      } @empty {
        <li>タスクはありません</li>
      }
    </ul>
  \`,
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  // Observable をそのまま公開。subscribe はテンプレート（async）に任せる
  tasks$ = this.taskService.tasks$;
}`}</Code>
      <KVList
        items={[
          { key: "tasks$ | async", val: "Observable を購読し、流れてきた最新値を取り出す。$ 末尾は「Observable である」慣習の目印" },
          { key: "自動 unsubscribe", val: "コンポーネント破棄時に async pipe が購読解除する（手動の後始末が不要）" },
          { key: "@for ... track", val: "配列を回す新制御構文。track で各行を id により一意識別（差分更新が効く）" },
        ]}
      />

      <Section>サービスで状態を持つ — BehaviorSubject でストアを作る</Section>
      <p>
        複数の画面で共有する状態（タスク一覧）は、<strong>サービス</strong>に集約して DI で配ります（React の Context 相当）。
        中核が <Cmd>BehaviorSubject</Cmd>：<strong>「現在値を 1 個保持する」Observable</strong> で、subscribe した瞬間に今の値をすぐ流します。
      </p>
      <Code lang="ts" filename="src/app/task.service.ts">{`import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })   // アプリ全体で 1 インスタンス共有
export class TaskService {
  // 内部は private の BehaviorSubject（現在値を保持）
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  // 外部へは Observable としてだけ公開（勝手に next されないよう read-only 化）
  readonly tasks$ = this.tasksSubject.asObservable();

  add(title: string) {
    const current = this.tasksSubject.value;   // 現在値を読む
    const next = [...current, { id: crypto.randomUUID(), title, done: false }];
    this.tasksSubject.next(next);              // 新しい配列を流す
  }

  toggle(id: string) {
    const next = this.tasksSubject.value.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    this.tasksSubject.next(next);
  }
}`}</Code>
      <StepFlow
        steps={[
          { title: "コンポーネントが add('牛乳を買う') を呼ぶ", desc: "サービスのメソッド経由でのみ状態を変える" },
          { title: "サービスが新しい配列を next() で流す", desc: "BehaviorSubject が現在値を更新し、購読者へ配信" },
          { title: "tasks$ を async で購読中のテンプレートが自動再描画", desc: "一覧・詳細など複数画面が同じ最新値を受け取る" },
        ]}
        caption="単一情報源（サービス）→ next → 購読中の全ビューへ配信"
      />
      <Callout variant="tip" title="なぜ BehaviorSubject か">
        ただの <Cmd>Subject</Cmd> は「subscribe した後に流れた値」しか受け取れません。あとから購読したコンポーネントは<strong>今の一覧を取りこぼします</strong>。
        <Cmd>BehaviorSubject</Cmd> は<strong>現在値を保持</strong>するので、いつ購読しても「今の状態」がすぐ届きます。ストア用途はこちらが定番です。
      </Callout>

      <Section>operator を少しだけ — map / filter</Section>
      <p>
        流れてくる値は <Cmd>pipe()</Cmd> の中の operator で加工できます。<Cmd>map</Cmd> は各値を変換、<Cmd>filter</Cmd> は条件に合う値だけ通します
        （配列メソッドの Observable 版だと思うと入りやすい）。「未完了だけ」の派生 Observable も宣言的に作れます。
      </p>
      <Code lang="ts" filename="派生 Observable（未完了だけ・件数）">{`import { map } from 'rxjs';

// 未完了タスクだけの一覧（tasks$ から派生させる）
readonly pending$ = this.tasks$.pipe(
  map((tasks) => tasks.filter((t) => !t.done)),
);

// 残り件数
readonly pendingCount$ = this.pending$.pipe(
  map((tasks) => tasks.length),
);`}</Code>
      <p>テンプレートでは <Cmd>{"{{ pendingCount$ | async }} 件残り"}</Cmd> のように、これも async で表示できます。</p>

      <Section>signals との対比 — もう一つの新方式</Section>
      <p>
        Angular 16+ では、状態管理の新方式 <Cmd>signals</Cmd> が加わりました。<Cmd>signal()</Cmd> で状態を作り、<Cmd>computed()</Cmd> で派生値を作ります。
        RxJS より<strong>同期的で単純</strong>（subscribe / unsubscribe や async pipe が不要）で、「コンポーネント内の UI 状態」に向きます。
      </p>
      <Code lang="ts" filename="signals 版のストア（比較用）">{`import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TaskStore {
  // signal: 現在値を持つ「読める箱」。() で読み、set/update で書く
  private tasks = signal<Task[]>([]);
  readonly all = this.tasks.asReadonly();

  // computed: 依存 signal が変わると自動で再計算される派生値
  readonly pendingCount = computed(() => this.tasks().filter((t) => !t.done).length);

  add(title: string) {
    this.tasks.update((list) => [...list, { id: crypto.randomUUID(), title, done: false }]);
  }
}`}</Code>
      <p>テンプレートでは async 不要で、関数呼び出しのように読みます: <Cmd>{"@for (t of store.all(); track t.id) { ... }"}</Cmd>。</p>
      <ComparisonTable
        headers={["観点", "RxJS（Observable）", "signals（16+）"]}
        rows={[
          ["扱う対象", "非同期・イベント・時間で流れる値", "同期的な UI 状態・派生値"],
          ["購読/解除", "subscribe / unsubscribe（または async pipe）", "不要（自動で追跡・更新）"],
          ["テンプレ表示", "| async パイプ", "signal() を関数呼び出しで読む"],
          ["派生値", "pipe(map(...)) 等の operator", "computed(() => ...)"],
          ["強み", "HTTP・WebSocket・複雑な非同期の合成", "手軽・高速・きめ細かい再描画"],
        ]}
      />
      <Callout variant="info" title="どちらを使う？">
        排他ではなく<strong>併用</strong>します。目安は「<strong>HTTP・WebSocket・時間で流れる非同期</strong>は RxJS」「<strong>画面内の単純な状態・派生</strong>は signals」。
        Observable と signal は相互変換（<Cmd>toSignal</Cmd> / <Cmd>toObservable</Cmd>）もでき、少しずつ signals へ寄せる流れが 2025-2026 の潮流です。
      </Callout>

      <Bridge course="ソフトウェア工学（Observer パターン）／ 並行・非同期 ／ 単一情報源">
        Observable は、講義で学ぶ <strong>Observer パターン</strong>（観測対象が変化を購読者へ通知する）の実装そのものです。
        「値の川を <Cmd>map</Cmd> / <Cmd>filter</Cmd> で加工して subscribe する」のは、<strong>ストリーム処理</strong>・関数型のデータフローの考え方に対応します。
        <Cmd>unsubscribe</Cmd> を意識するのは、資源（購読）の<strong>ライフタイム管理</strong>——OS の授業で扱うリソース解放と同じ発想です。
        サービスの <Cmd>BehaviorSubject</Cmd> に状態を集約するのは、UI の不整合を防ぐ<strong>単一情報源（single source of truth）</strong>の設計原則です。
      </Bridge>

      <Quiz
        question="タスク一覧をテンプレートに表示するだけのコンポーネントで、購読の後始末（unsubscribe 忘れ＝メモリリーク）を避ける最も素直な方法は？"
        options={[
          <>constructor で <Cmd>subscribe</Cmd> する</>,
          <>テンプレートで <Cmd>{"tasks$ | async"}</Cmd> を使い、購読・解除を Angular に任せる</>,
          <><Cmd>Promise</Cmd> に変換してから表示する</>,
          <><Cmd>ngOnInit</Cmd> で subscribe すれば解除は不要</>,
        ]}
        answer={1}
        explanation={<><Cmd>async</Cmd> パイプは自動で subscribe し、コンポーネント破棄時に自動で unsubscribe します。表示だけなら手動 subscribe より安全でコードも短くなります。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "Observable は時間で流れる値のストリーム。単発の Promise と違い 0〜複数の値を流し、subscribe で起動・unsubscribe で解除",
          "手動 subscribe は unsubscribe 忘れ＝メモリリークに注意。表示だけなら async パイプで購読・解除を自動化する",
          "共有状態はサービスに集約し DI で配る。BehaviorSubject は現在値を保持し、next() で更新を全購読者へ配信（単一情報源）",
          "内部は private の Subject、外部へは asObservable() で read-only 公開。派生は pipe(map/filter) で宣言的に作る",
          "signals（16+）は同期的で購読不要な新方式。HTTP など非同期は RxJS、画面内状態は signals と使い分け・併用する",
        ]}
      />
    </>
  );
}
