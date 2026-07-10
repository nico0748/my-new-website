import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import type { CSSProperties } from "react";

export const meta: LearnMeta = {
  id: "component-design",
  title: "コンポーネント設計と管理",
  description: "TaskFlow を題材に、画面をコンポーネント（TaskList / TaskItem / TaskForm）へ分割し、@Component デコレータ・@Input/@Output・新制御フロー @for/@if で組み立てる。React の props/コールバックと対比しながら Angular の作法を掴む。",
  domain: "angular-practice",
  section: "components-di",
  order: 1,
  level: "practice",
  tags: ["Angular", "コンポーネント", "設計"],
  updated: "2026-07-07",
  minutes: 13,
};

const box = (color: string): CSSProperties => ({
  position: "relative", border: `2px solid ${color}`, borderRadius: 8,
  padding: "24px 12px 12px", marginTop: 14, background: "var(--color-surface)",
});
const tag = (bg: string): CSSProperties => ({
  position: "absolute", top: -10, left: 12, background: bg, color: "#fff",
  fontSize: 11.5, fontWeight: 700, padding: "2px 10px", borderRadius: 999, whiteSpace: "nowrap",
});
const itemRow: CSSProperties = {
  display: "flex", alignItems: "center", gap: 8, border: "1px solid var(--color-border)",
  borderRadius: 6, padding: "7px 10px", marginTop: 8, fontSize: 14, color: "var(--color-text)",
};
const cbox: CSSProperties = { width: 14, height: 14, border: "2px solid var(--color-text-secondary)", borderRadius: 3, flexShrink: 0 };
const cboxOn: CSSProperties = { width: 14, height: 14, border: "2px solid var(--color-primary)", background: "var(--color-primary)", borderRadius: 3, flexShrink: 0 };
const itemTag: CSSProperties = { marginLeft: "auto", fontSize: 10.5, color: "var(--color-navy)", fontWeight: 700 };

export default function Article() {
  return (
    <>
      <Lead>
        Angular の画面も<strong>コンポーネント</strong>（UI の部品）の組み合わせで作ります。ここでは TaskFlow のタスク一覧を題材に、
        画面を <Cmd>TaskList</Cmd> / <Cmd>TaskItem</Cmd> / <Cmd>TaskForm</Cmd> へ分割し、<strong>@Component デコレータ</strong>・
        <strong>@Input / @Output</strong>・<strong>新制御フロー @for / @if</strong> で組み立てます。React の props / コールバックと対比しながら、
        Angular 特有の「デコレータ＋テンプレート」の作法を掴みます。
      </Lead>

      <Section>分割の考え方 — 単一責任</Section>
      <p>
        1 つのコンポーネントに<strong>1 つの役割</strong>を持たせます。大きな画面をそのまま書くのではなく、
        「一覧」「1 件の行」「追加フォーム」のように意味のかたまりで切り出すと、読みやすく再利用しやすくなります。
        考え方は React と同じですが、Angular では各部品が <Cmd>@Component</Cmd> で装飾されたクラスになります。
      </p>
      <div className="dgm">
        <div style={box("var(--color-primary)")}>
          <span style={tag("var(--color-primary)")}>TaskListPage — 画面（親・状態を持つ）</span>

          <div style={box("var(--color-cta)")}>
            <span style={tag("var(--color-cta)")}>TaskForm — 追加フォーム</span>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, border: "1px solid var(--color-border)", borderRadius: 6, padding: "6px 10px", color: "var(--color-text-secondary)", fontSize: 13 }}>新しいタスク…</div>
              <div style={{ background: "var(--color-cta)", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 600 }}>追加</div>
            </div>
          </div>

          <div style={box("var(--color-navy)")}>
            <span style={tag("var(--color-navy)")}>TaskList — 一覧（@for で TaskItem を並べる）</span>
            <div style={itemRow}><span style={cbox} />牛乳を買う<span style={itemTag}>= TaskItem</span></div>
            <div style={itemRow}><span style={cboxOn} />Angular を学ぶ<span style={itemTag}>= TaskItem</span></div>
          </div>
        </div>
        <div className="dgm-caption">1 つの画面（親）を、役割ごとの部品（子）に切り分ける ─ これがコンポーネント設計</div>
      </div>

      <Section>まず型を決める — interface Task</Section>
      <p>
        データの形（型）を先に決めると、以降のコードが安全になります。ここは TypeScript のインターフェースなので React と同じです。
      </p>
      <Code lang="ts" filename="src/app/task.model.ts">{`export interface Task {
  id: string;
  title: string;
  done: boolean;
}`}</Code>

      <Section>@Component デコレータ — クラスに「部品」の情報を与える</Section>
      <p>
        Angular のコンポーネントは<strong>クラス</strong>です。そのクラスの直前に <Cmd>@Component(&#123;...&#125;)</Cmd> という
        <strong>デコレータ</strong>を付けて、「このクラスは UI 部品だ」という<strong>メタ情報</strong>を与えます。主な設定はこの 4 つです。
      </p>
      <KVList
        items={[
          { key: "selector", val: "HTML タグ名。<app-task-item> のように書くとこの部品が描画される" },
          { key: "standalone: true", val: "単独で使えるコンポーネント。旧来の NgModule 登録が不要（2025-2026 の標準）" },
          { key: "imports", val: "テンプレートで使う他のコンポーネントやディレクティブを列挙（standalone の要）" },
          { key: "template", val: "この部品の HTML。インラインで書くか templateUrl で外部ファイルを指定" },
        ]}
      />
      <Callout variant="tip" title="standalone が今の標準">
        かつては <Cmd>@NgModule</Cmd> にコンポーネントをまとめて登録する必要がありましたが、いまは
        <strong><Cmd>standalone: true</Cmd> が既定</strong>で、各コンポーネントが自分の <Cmd>imports</Cmd> に必要な依存を書きます。
        新規コードは standalone で書きます（本コースも standalone 前提）。
      </Callout>

      <Section>テンプレート構文 — 3 つの記法</Section>
      <p>
        Angular のテンプレートは HTML に 3 種類の“印”を足したものです。ここを押さえるとテンプレートが読めます。
      </p>
      <ComparisonTable
        headers={["記法", "向き", "意味", "React 相当"]}
        rows={[
          [<Cmd>{"{{ 式 }}"}</Cmd>, "TS → 画面", "補間。値を文字列として埋め込む", <Cmd>{"{式}"}</Cmd>],
          [<Cmd>{'[prop]="式"'}</Cmd>, "TS → 子/DOM", "プロパティバインディング。値を属性へ渡す", <Cmd>{"prop={式}"}</Cmd>],
          [<Cmd>{'(event)="式"'}</Cmd>, "DOM → TS", "イベントバインディング。ハンドラを呼ぶ", <Cmd>{"onEvent={fn}"}</Cmd>],
        ]}
      />
      <Callout variant="info" title="[ ] は入力、( ) は出力">
        角カッコ <Cmd>[ ]</Cmd> は「データを<strong>受け取る（入力）</strong>」、丸カッコ <Cmd>( )</Cmd> は「イベントを
        <strong>送り出す（出力）</strong>」と覚えると混乱しません。両方まとめた <Cmd>[(ngModel)]</Cmd>（双方向バインディング）は
        「フォーム」章で扱います。
      </Callout>

      <Section>@Input で親→子、@Output で子→親</Section>
      <p>
        親から子へデータを渡すのが <Cmd>@Input</Cmd>、子から親へ通知を送るのが <Cmd>@Output</Cmd> ＋ <Cmd>EventEmitter</Cmd> です。
        React では props とコールバック関数でしたが、Angular では<strong>デコレータで「入口」と「出口」を宣言</strong>します。
      </p>
      <ComparisonTable
        headers={["向き", "Angular", "React 相当"]}
        rows={[
          ["親 → 子（データ）", <><Cmd>@Input() task!: Task;</Cmd></>, "props（task）"],
          ["子 → 親（通知）", <><Cmd>@Output() toggle = new EventEmitter&lt;string&gt;();</Cmd></>, "コールバック props（onToggle）"],
        ]}
      />
      <p>
        親のテンプレートでは <Cmd>{'[task]="t"'}</Cmd> で入力を渡し、<Cmd>{'(toggle)="onToggle($event)"'}</Cmd> で出力を受けます。
        子が <Cmd>this.toggle.emit(id)</Cmd> を呼ぶと、その値が親の <Cmd>$event</Cmd> に届きます。
      </p>
      <Callout variant="tip" title="子は emit するだけ（React と同じ思想）">
        子コンポーネントは自分で状態を書き換えず、<strong>@Output を <Cmd>emit()</Cmd> して親に依頼する</strong>だけにします。
        「状態を持つのは親、表示するのは子」という役割分担は React とまったく同じ。仕組みが props/コールバックから
        @Input/@Output に変わっただけです（＝データは上から下、通知は下から上）。
      </Callout>

      <Section>子コンポーネント — TaskItem</Section>
      <p>1 件のタスクを表示する部品です。<Cmd>@Input</Cmd> で受け取り、チェック時に <Cmd>@Output</Cmd> で親へ通知します。</p>
      <Code lang="ts" filename="src/app/task-item.component.ts">{`import { Component, Input, Output, EventEmitter } from '@angular/core';
import type { Task } from './task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  template: \`
    <li [class.done]="task.done">
      <label>
        <input
          type="checkbox"
          [checked]="task.done"
          (change)="toggle.emit(task.id)" />
        {{ task.title }}
      </label>
    </li>
  \`,
})
export class TaskItemComponent {
  @Input() task!: Task;                          // 親からデータを受け取る
  @Output() toggle = new EventEmitter<string>(); // 親へ通知を送り出す
}`}</Code>

      <Section>親コンポーネント — 一覧画面（@for / @if）</Section>
      <p>
        タスクの<strong>状態を持ち</strong>、子部品を組み合わせるのが親（画面）です。一覧の描画には<strong>新制御フロー</strong>の
        <Cmd>@for</Cmd> と <Cmd>@if</Cmd> を使います（Angular 17 以降の標準。旧 <Cmd>*ngFor</Cmd> / <Cmd>*ngIf</Cmd> の後継）。
      </p>
      <Code lang="ts" filename="src/app/task-list.component.ts">{`import { Component } from '@angular/core';
import { TaskItemComponent } from './task-item.component';
import type { Task } from './task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskItemComponent],   // テンプレートで使う子を宣言
  template: \`
    <h1>タスク一覧</h1>

    @if (tasks.length > 0) {
      <ul>
        @for (task of tasks; track task.id) {
          <app-task-item
            [task]="task"
            (toggle)="onToggle($event)" />
        }
      </ul>
    } @else {
      <p>タスクはまだありません。</p>
    }
  \`,
})
export class TaskListComponent {
  tasks: Task[] = [
    { id: '1', title: '牛乳を買う', done: false },
    { id: '2', title: 'Angular を学ぶ', done: true },
  ];

  // done を反転した新しい配列を作って状態を更新する
  onToggle(id: string) {
    this.tasks = this.tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
  }
}`}</Code>
      <Callout variant="warn" title="@for の track は必須（React の key に相当）">
        <Cmd>@for</Cmd> には <Cmd>track</Cmd> が<strong>必須</strong>です。<Cmd>track task.id</Cmd> のように
        <strong>安定した一意の値</strong>を指定すると、Angular は再描画時に「どの要素が同じか」を対応づけ、
        変わった行だけを更新します。React の <Cmd>key</Cmd> とまったく同じ役割で、指定を誤ると並び替えで DOM が崩れます。
      </Callout>

      <Section>TaskItem のコードを 1 行ずつ読む</Section>
      <p>
        ここまで書いた <Cmd>TaskItemComponent</Cmd> を、上から順に読み解きます。1 つのコンポーネントには
        <strong>「import → @Component デコレータ → class → @Input/@Output → template」</strong>がひととおり詰まっています。
        肝は<strong>「デコレータ＝クラスにメタ情報を与える」</strong>という Angular の中心的な考え方です。
      </p>
      <Code lang="ts" filename="src/app/task-item.component.ts（全体）">{`import { Component, Input, Output, EventEmitter } from '@angular/core'; // ① 部品化に必要な道具
import type { Task } from './task.model';                              // ② 型を取り込む

@Component({                                   // ③ デコレータ = クラスにメタ情報を付与
  selector: 'app-task-item',                   //    このタグ名で描画される
  standalone: true,                            //    単独で使える（NgModule 不要）
  template: \`                                   // ④ この部品の HTML（インライン）
    <li [class.done]="task.done">              //    [class.x] は条件付きクラス
      <label>
        <input
          type="checkbox"
          [checked]="task.done"                // ⑤ [prop]="式" 入力（TS→DOM）
          (change)="toggle.emit(task.id)" />   // ⑥ (event)="式" 出力（DOM→TS）
        {{ task.title }}                        // ⑦ {{ }} 補間で値を埋め込む
      </label>
    </li>
  \`,
})
export class TaskItemComponent {               // ⑧ export + クラス宣言
  @Input() task!: Task;                        // ⑨ 親→子（データの入口）
  @Output() toggle = new EventEmitter<string>(); // ⑩ 子→親（通知の出口）
}`}</Code>
      <p>
        まず骨格から。③ の <Cmd>@Component(&#123;...&#125;)</Cmd> が Angular の心臓部です。<strong>デコレータ</strong>とは
        「その直後のクラスに<strong>付加情報（メタデータ）</strong>を紐づける仕組み」で、Angular のコンパイラはこの情報を読んで
        「このクラスを <Cmd>&lt;app-task-item&gt;</Cmd> というタグで、この template を使って描画する部品にする」と解釈します。
        React が「関数＝コンポーネント」なのに対し、Angular は<strong>「クラス＋デコレータ＝コンポーネント」</strong>という点が最大の違いです。
        以下、<strong>import</strong> と <strong>@Input / @Output</strong> をもう少し詳しく見ます。
      </p>

      <SubSection>import — @angular/core から道具を取り込む</SubSection>
      <p>
        コンポーネントを作る道具（<Cmd>Component</Cmd>・<Cmd>Input</Cmd>・<Cmd>Output</Cmd>・<Cmd>EventEmitter</Cmd>）は
        <strong>@angular/core</strong> パッケージから名前付きで取り込みます。型（<Cmd>Task</Cmd>）は <Cmd>import type</Cmd> で取り込むと
        ビルド時に消えて実行コードに残りません（ここは React/TypeScript と同じ作法）。
      </p>
      <Code lang="ts" filename="import の使い分け">{`import { Component, Input, Output, EventEmitter } from '@angular/core'; // パッケージ（値）
import type { Task } from './task.model';                              // 自分のファイル（型だけ）`}</Code>

      <SubSection>@Input / @Output — プロパティに付ける“印”</SubSection>
      <p>
        <Cmd>@Input</Cmd> と <Cmd>@Output</Cmd> は<strong>クラスのプロパティに付けるデコレータ</strong>です。
        これを付けたプロパティだけが、親テンプレートから <Cmd>[task]</Cmd> / <Cmd>(toggle)</Cmd> として見えるようになります。
        <Cmd>task!</Cmd> の <Cmd>!</Cmd> は「親から必ず渡される（＝初期化は Angular が行う）」ことを TypeScript に伝える印です。
      </p>
      <KVList
        items={[
          { key: "@Input() task!: Task", val: "親から渡される入力。親テンプレートで [task]=\"...\" として渡す" },
          { key: "@Output() toggle = new EventEmitter<string>()", val: "親へ送る出力。this.toggle.emit(id) で発火し、親は (toggle)=\"...\" で受ける" },
          { key: "EventEmitter<string>", val: "emit する値の型。ここでは string（タスク id）を親へ渡す" },
          { key: "$event", val: "親テンプレート側で emit された値を受け取る変数名（(toggle)=\"onToggle($event)\"）" },
        ]}
      />

      <Bridge course="ソフトウェア工学（コンポーネント指向）／コンパイラ（AOT）">
        コンポーネント分割は、講義で学ぶ<strong>単一責任の原則</strong>と<strong>モジュール分割</strong>の実践そのもの。
        <Cmd>@Input</Cmd>/<Cmd>@Output</Cmd> は<strong>モジュール間のインターフェース（契約）</strong>にあたり、
        「データは上から下、通知は下から上」という一方向データフローで状態変化の経路を追いやすくします。
        また Angular の <strong>@Component デコレータ</strong>が持つ template は、実行時に文字列を解釈するのではなく、
        ビルド時に <strong>AOT（Ahead-of-Time）コンパイル</strong>で最適化された JavaScript に変換されます。
        これは講義の<strong>コンパイラ（字句解析・構文解析・コード生成）</strong>そのもので、テンプレートの型チェックや
        高速な描画は「事前コンパイル」の恩恵です。デコレータという<strong>メタプログラミング</strong>で宣言を書き、
        コンパイラがそれを実行コードへ落とす、という設計を体感できます。
      </Bridge>

      <Quiz
        question="Angular の @for でリストを描画するとき、React の key に相当し、要素の同一性を対応づけるために必須の指定はどれ？"
        options={[
          <Cmd>index</Cmd>,
          <Cmd>track</Cmd>,
          <Cmd>key</Cmd>,
          <Cmd>ref</Cmd>,
        ]}
        answer={1}
        explanation={<><Cmd>track</Cmd> です。<Cmd>@for (task of tasks; track task.id)</Cmd> のように<strong>安定した一意の値</strong>を指定し、再描画時に新旧の要素を対応づけます。Angular では <Cmd>track</Cmd> は必須で、指定を誤ると並び替えで DOM が崩れます（React の <Cmd>key</Cmd> と同じ役割）。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "コンポーネントは「クラス＋@Component デコレータ」。selector / standalone / imports / template を設定する",
          "テンプレートは {{ }} 補間・[prop]=\"式\" 入力・(event)=\"式\" 出力の 3 記法で読む",
          "親→子は @Input（データ）、子→親は @Output + EventEmitter（emit で通知）。React の props/コールバックに対応",
          "一覧は @for(…; track id)、条件表示は @if/@else（新制御フロー）。track は React の key に相当し必須",
          "デコレータ＝クラスにメタ情報を与える仕組み。template はビルド時に AOT コンパイルされる",
        ]}
      />
    </>
  );
}
