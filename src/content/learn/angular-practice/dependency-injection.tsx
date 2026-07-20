import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider, Figure } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "dependency-injection",
  title: "依存性注入（DI）とサービス",
  description: "Angular の核心 DI を TaskFlow で理解する。@Injectable のサービスにロジックを寄せ、コンストラクタ注入と inject() で受け取る。providedIn:'root' のシングルトンと、Injector が型をキーに依存を解決する仕組み（IoC）を図解。テストでモックに差し替えられる利点も。",
  domain: "angular-practice",
  section: "components-di",
  order: 2,
  level: "practice",
  tags: ["Angular", "DI", "サービス"],
  updated: "2026-07-07",
  minutes: 13,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>依存性注入（DI: Dependency Injection）</strong>は Angular の核心です。コンポーネントは<strong>表示に専念</strong>し、
        データ取得や更新などの<strong>ロジックはサービス</strong>へ寄せます。そのサービスを、コンポーネントが自分で <Cmd>new</Cmd> する
        のではなく、Angular が<strong>外から渡してくれる（注入する）</strong>のが DI です。React には DI が言語機能として無いため、
        ここは Angular ならではの発想です。TaskFlow の <Cmd>TaskService</Cmd> を題材に仕組みを掴みます。
      </Lead>

      <Section>なぜ DI か — 単一責任とテスト容易性</Section>
      <p>
        コンポーネントの中に <Cmd>fetch</Cmd> やデータ加工を直接書くと、部品が「表示」と「ロジック」の両方を抱えて肥大化します。
        ロジックを<strong>サービス</strong>に分けると、次の 2 つが手に入ります。
      </p>
      <KVList
        items={[
          { key: "単一責任", val: "コンポーネントは表示、サービスはロジック。役割が分かれて読みやすく、再利用しやすい" },
          { key: "テスト容易性", val: "サービスを本物ではなくモック（偽物）に差し替えて注入でき、コンポーネント単体でテストできる" },
        ]}
      />
      <Callout variant="info" title="new しない、という発想">
        コンポーネントが <Cmd>new TaskService()</Cmd> と自分で作ると、その具体クラスに<strong>強く結合</strong>してしまい、
        テストで差し替えられません。DI は「<strong>必要なものを宣言だけして、生成と受け渡しは Angular に任せる</strong>」ことで、
        この結合を断ち切ります。これが後述の<strong>制御の反転（IoC）</strong>です。
      </Callout>

      <Section>サービスを作る — @Injectable</Section>
      <p>
        サービスは <Cmd>@Injectable</Cmd> デコレータを付けたクラスです。<Cmd>providedIn: 'root'</Cmd> と書くと、
        アプリ全体で使える 1 つのインスタンス（後述のシングルトン）として登録されます。TaskFlow のタスク管理ロジックをここに集約します。
      </p>
      <Code lang="ts" filename="src/app/task.service.ts">{`import { Injectable } from '@angular/core';
import type { Task } from './task.model';

@Injectable({ providedIn: 'root' })   // アプリ全体で使えるサービスとして登録
export class TaskService {
  private tasks: Task[] = [
    { id: '1', title: '牛乳を買う', done: false },
    { id: '2', title: 'Angular を学ぶ', done: true },
  ];

  getTasks(): Task[] {
    return this.tasks;
  }

  add(title: string): void {
    this.tasks = [
      ...this.tasks,
      { id: crypto.randomUUID(), title, done: false },
    ];
  }

  toggle(id: string): void {
    this.tasks = this.tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
  }
}`}</Code>
      <Callout variant="tip" title="ロジックはここに集約">
        <Cmd>getTasks</Cmd> / <Cmd>add</Cmd> / <Cmd>toggle</Cmd> という<strong>操作</strong>を 1 か所にまとめました。
        画面がいくつあっても、タスクの追加・切替はこのサービスを呼ぶだけ。React でいえば<strong>カスタムフックや Context の
        ロジック層</strong>に近い役割ですが、Angular ではそれが DI で配られる<strong>クラス</strong>になります。
      </Callout>

      <Section>注入する — 2 つの受け取り方</Section>
      <p>
        コンポーネントは <Cmd>TaskService</Cmd> を「使いたい」と宣言するだけで受け取れます。受け取り方は 2 通りあります。
      </p>

      <SubSection>① コンストラクタ注入</SubSection>
      <p>
        コンストラクタの引数に <Cmd>private taskService: TaskService</Cmd> と<strong>型を書くだけ</strong>。Angular がその型を見て、
        対応するインスタンスを生成・注入し、<Cmd>this.taskService</Cmd> として使えるようにします。
      </p>
      <Code lang="ts" filename="src/app/task-list.component.ts">{`import { Component } from '@angular/core';
import { TaskItemComponent } from './task-item.component';
import { TaskService } from './task.service';
import type { Task } from './task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent],
  template: \`
    <ul>
      @for (task of tasks; track task.id) {
        <app-task-item [task]="task" (toggle)="onToggle($event)" />
      }
    </ul>
  \`,
})
export class TaskListComponent {
  tasks: Task[] = [];

  // 型を書くだけで Angular が TaskService を注入してくれる
  constructor(private taskService: TaskService) {
    this.tasks = this.taskService.getTasks();
  }

  onToggle(id: string) {
    this.taskService.toggle(id);
    this.tasks = this.taskService.getTasks();
  }
}`}</Code>

      <SubSection>② inject() 関数</SubSection>
      <p>
        Angular 14 以降は <Cmd>inject()</Cmd> 関数でも受け取れます。フィールド初期化として書け、継承やミックスインで扱いやすく、
        新しいコードではこちらもよく使われます（2025-2026 の標準的な選択肢）。
      </p>
      <Code lang="ts" filename="inject() で受け取る">{`import { Component, inject } from '@angular/core';
import { TaskService } from './task.service';

@Component({ /* ... */ })
export class TaskListComponent {
  private taskService = inject(TaskService);   // 関数で注入
  tasks = this.taskService.getTasks();
}`}</Code>
      <ComparisonTable
        headers={["受け取り方", "書き方", "向き"]}
        rows={[
          ["コンストラクタ注入", <Cmd>constructor(private s: TaskService)</Cmd>, "従来からある基本形。分かりやすい"],
          [<Cmd>inject()</Cmd>, <Cmd>private s = inject(TaskService)</Cmd>, "フィールドで注入。継承や関数的な構成に強い"],
        ]}
      />
      <Callout variant="info" title="どちらでも注入されるものは同じ">
        書き方が違うだけで、<strong>Angular の Injector が同じサービスを解決して渡す</strong>という本質は同じです。
        まずはコンストラクタ注入で仕組みを理解し、慣れたら <Cmd>inject()</Cmd> も使い分けます。
      </Callout>

      <Section>providedIn: 'root' はシングルトン</Section>
      <p>
        <Cmd>providedIn: 'root'</Cmd> で登録したサービスは、アプリ全体で<strong>ただ 1 つのインスタンス</strong>が共有されます
        （＝<strong>シングルトン</strong>）。どのコンポーネントから注入しても<strong>同じ実体</strong>が返るため、
        サービスに状態（<Cmd>tasks</Cmd> 配列など）を持たせれば、それがそのまま<strong>アプリ全体の共有状態</strong>になります。
      </p>
      <Callout variant="tip" title="DI が状態共有の手段にもなる">
        一覧画面と詳細画面が<strong>同じ <Cmd>TaskService</Cmd> インスタンス</strong>を受け取るので、片方で <Cmd>add()</Cmd> した
        タスクはもう片方からも見えます。React の Context / Zustand が担う「グローバル状態の共有」を、Angular では
        <strong>シングルトンサービス＋DI</strong>で実現できるのがポイントです（リアクティブに反映させる仕組みは「RxJS と状態管理」章で扱います）。
      </Callout>

      <Section>DI の仕組み — Injector が型をキーに解決する（IoC）</Section>
      <p>
        DI を担うのは <strong>Injector（インジェクタ）</strong>です。コンポーネントが「<Cmd>TaskService</Cmd> がほしい」と宣言すると、
        Injector が<strong>その型をキー</strong>に登録済みのインスタンスを探し（無ければ生成し）、コンポーネントへ返します。
        「自分で生成せず、外から渡してもらう」この流れが<strong>制御の反転（IoC: Inversion of Control）</strong>です。
      </p>
      <SequenceDiagram
        actors={["Component", "Injector", "TaskService"]}
        messages={[
          { from: 0, to: 1, label: "TaskService がほしい（型で依頼）" },
          { from: 1, to: 2, label: "登録を確認 / 初回は生成", cta: true },
          { from: 2, to: 1, label: "シングルトンのインスタンス" },
          { from: 1, to: 0, label: "注入して返す" },
        ]}
        caption="Component は型を宣言するだけ。生成と受け渡しは Injector が肩代わりする（＝制御の反転）"
      />
      <p>
        コンポーネントは「何がほしいか（型）」を言うだけで、「どう作るか」「どこから持ってくるか」を知りません。
        この<strong>関心の分離</strong>によって、依存の差し替えが自由になります。
      </p>
      <Figure
        src="/learn/shots/angular-practice/dependency-injection-01.svg"
        alt="Angular DevTools の Injector Tree タブ。TaskService が Root Injector に解決され、コンポーネントへ注入されている"
        caption="Angular DevTools の Injector Tree なら、どのサービスがどの Injector で解決されたか実物で追える"
      />

      <Section>テスト時にモックへ差し替えられる</Section>
      <p>
        DI の最大の実利がこれです。テストでは、本物の <Cmd>TaskService</Cmd> の代わりに<strong>モック（偽の実装）</strong>を
        Injector に登録すれば、コンポーネントは何も変えずにモックを受け取ります。ネットワークや本物のデータに依存せず、
        コンポーネントの表示ロジックだけを検証できます。
      </p>
      <Code lang="ts" filename="task-list.component.spec.ts">{`import { TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from './task.service';

// 本物の代わりに使うモック
class MockTaskService {
  getTasks() {
    return [{ id: '1', title: 'テスト用タスク', done: false }];
  }
  toggle() {}
}

TestBed.configureTestingModule({
  imports: [TaskListComponent],
  providers: [
    // TaskService を要求したら MockTaskService を渡す、と Injector に指示
    { provide: TaskService, useClass: MockTaskService },
  ],
});`}</Code>
      <Callout variant="warn" title="差し替えられるのは DI のおかげ">
        コンポーネントが <Cmd>new TaskService()</Cmd> していたら、この差し替えは不可能でした。<strong>「型で依頼し、Injector が解決する」</strong>
        という間接化があるからこそ、<Cmd>provide</Cmd> の設定 1 つで実装を切り替えられます。テスト容易性は DI の設計から自然に得られる果実です。
      </Callout>

      <Bridge course="デザインパターン（依存性注入・IoC・DIP）">
        DI は、講義で学ぶ<strong>依存性注入パターン</strong>と<strong>制御の反転（IoC）</strong>の教科書的な実装です。
        通常は「呼び出す側が呼ばれる側を生成・制御」しますが、IoC ではその制御をフレームワーク（Injector）に<strong>反転</strong>して預けます。
        さらに背後には SOLID の<strong>依存性逆転の原則（DIP: Dependency Inversion Principle）</strong>があります
        ——上位モジュール（コンポーネント）は下位の<strong>具体実装ではなく抽象（型）に依存</strong>すべき、という原則です。
        <Cmd>{"{ provide: TaskService, useClass: MockTaskService }"}</Cmd> で実装を差し替えられるのは、まさに「抽象に依存し、
        具体を注入する」構造ができているから。React には DI が言語/フレームワーク機能として無く、Context やカスタムフックで
        近い分離を手作りしますが、Angular は<strong>DI を第一級の機能</strong>として備えている点が対照的です。
      </Bridge>

      <Quiz
        question="Angular で @Injectable({ providedIn: 'root' }) を付けたサービスの性質として正しいのは？"
        options={[
          <>コンポーネントごとに毎回 new され、状態は共有されない</>,
          <>アプリ全体で 1 インスタンスを共有するシングルトンで、状態共有にも使える</>,
          <>テスト時にモックへ差し替えることはできない</>,
          <>テンプレートでしか使えず、他のサービスからは注入できない</>,
        ]}
        answer={1}
        explanation={<><Cmd>providedIn: 'root'</Cmd> はアプリ全体で<strong>1 つのインスタンス（シングルトン）</strong>を共有します。どこから注入しても同じ実体なので、サービスに持たせた状態はアプリ全体で共有されます。DI により <Cmd>provide</Cmd> 設定でモックに差し替えることも可能です。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "コンポーネントは表示に専念、ロジックは @Injectable のサービスへ寄せる（単一責任）",
          "サービスは @Injectable({ providedIn: 'root' }) で登録。getTasks/add/toggle のような操作を集約",
          "注入は 2 通り: コンストラクタ注入（型を書く）と inject(TaskService) 関数。渡るものは同じ",
          "providedIn:'root' はシングルトン。1 インスタンスを全体で共有＝状態共有の手段にもなる",
          "Injector が型をキーに依存を解決＝制御の反転(IoC)。provide 設定でモックに差し替えられ、テストが容易",
          "React には DI が言語機能として無く Context 等で代替。Angular は DI を第一級の機能として備える",
        ]}
      />
    </>
  );
}
