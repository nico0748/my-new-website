import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, KVList, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { StepFlow, SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "angular-router-basics",
  title: "Angular Router でルーティング（設定と原理）",
  description: "SPA が「ページを再読み込みせず画面を切り替える」原理（History API）を押さえ、Angular Router で TaskFlow の一覧・詳細・新規作成を配線する。router-outlet・routerLink・ActivatedRoute まで。",
  domain: "angular-practice",
  section: "routing",
  order: 1,
  level: "practice",
  tags: ["Angular", "ルーティング", "Router"],
  updated: "2026-07-07",
  minutes: 13,
};

export default function Article() {
  return (
    <>
      <Lead>
        タスク管理アプリ <strong>TaskFlow</strong> には「一覧」「詳細」「新規作成」の 3 画面があります。URL に応じて表示を切り替えるのが<strong>ルーティング</strong>。
        SPA では、これを<strong>ページ全体を再読み込みせず</strong>に行うのが肝です。まず原理（React 記事と同じ）を押さえ、<Cmd>Angular Router</Cmd> で配線します。
      </Lead>

      <Section>SPA のルーティングとは（原理）</Section>
      <p>
        従来の Web は、リンクを踏むたびに<strong>サーバーから新しい HTML を取得</strong>し、ページ全体が再読み込みされました。
        SPA（シングルページアプリ）は違います。最初に 1 枚の HTML と JS を読み込んだ後は、
        <strong>URL を書き換えつつ、JavaScript が表示するコンポーネントだけを差し替えます</strong>。この点は React でも Angular でもまったく同じです。
      </p>
      <SequenceDiagram
        actors={["ブラウザ(JS)", "Router"]}
        messages={[
          { from: 0, to: 1, label: "① routerLink クリック（/tasks/1 へ）" },
          { from: 1, to: 1, label: "② history.pushState で URL 変更" },
          { from: 1, to: 0, label: "③ router-outlet に一致画面を描画", cta: true },
        ]}
        caption="ページ全体を再読み込みせず、URL と表示を切り替える"
      />
      <Callout variant="info" title="鍵は History API">
        ブラウザには <Cmd>history.pushState()</Cmd> という API があり、<strong>ページを再読み込みせずに URL を書き換え</strong>られます。
        戻る/進むボタンを押すと <Cmd>popstate</Cmd> イベントが発火します。Angular Router はこの仕組みを包み、
        「今の URL」に一致するコンポーネントを <Cmd>{"<router-outlet>"}</Cmd> の位置に描画してくれます。これが SPA ルーティングの正体です。
      </Callout>

      <Section>ルートを定義する — app.routes.ts</Section>
      <p>
        Angular（standalone 構成）では「どの URL でどのコンポーネントを出すか」を <Cmd>Routes</Cmd> 配列に書きます。
        React の <Cmd>{"<Routes>/<Route>"}</Cmd> に相当しますが、Angular は<strong>ただの配列データ</strong>で宣言する点が特徴です。
      </p>
      <Code lang="ts" filename="src/app/app.routes.ts">{`import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list.component';
import { TaskDetailComponent } from './pages/task-detail.component';
import { NewTaskComponent } from './pages/new-task.component';
import { NotFoundComponent } from './pages/not-found.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },          // 一覧（/）
  { path: 'tasks/new', component: NewTaskComponent },  // 新規作成
  { path: 'tasks/:id', component: TaskDetailComponent },// 詳細（動的）
  { path: '**', component: NotFoundComponent },        // 404 フォールバック
];`}</Code>
      <KVList
        items={[
          { key: "path: ''", val: "URL がルート（/）と一致したら component を表示する" },
          { key: ":id（コロン）", val: "動的セグメント。/tasks/1 でも /tasks/2 でもマッチし、id を取り出せる" },
          { key: "path: '**'", val: "どれにも一致しないときのワイルドカード（404 表示）" },
          { key: "component", val: "その URL で描画する standalone コンポーネント" },
        ]}
      />
      <Callout variant="warn" title="具体的なパスを :id より先に書く">
        <Cmd>tasks/new</Cmd> を <Cmd>tasks/:id</Cmd> より<strong>先に</strong>置きます。Angular は配列を<strong>上から順に照合</strong>するため、
        逆にすると <Cmd>new</Cmd> が <Cmd>:id</Cmd>（id="new"）として先にマッチしてしまいます。<Cmd>'**'</Cmd> は必ず<strong>最後</strong>に置きます。
      </Callout>

      <Section>Router を有効化する — app.config.ts</Section>
      <p>
        定義した <Cmd>routes</Cmd> をアプリに登録します。standalone 構成では <Cmd>provideRouter(routes)</Cmd> を
        <Cmd>app.config.ts</Cmd> の <Cmd>providers</Cmd> に渡すだけです（React の <Cmd>{"<BrowserRouter>"}</Cmd> でアプリを包むのに相当）。
      </p>
      <Code lang="ts" filename="src/app/app.config.ts">{`import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),   // ← ここで Router を有効化
  ],
};`}</Code>
      <Code lang="ts" filename="src/main.ts">{`import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig);`}</Code>

      <Section>描画位置を置く — router-outlet</Section>
      <p>
        ルートに一致したコンポーネントが「どこに」表示されるかを決めるのが <Cmd>{"<router-outlet />"}</Cmd> です。
        React には対応物がなく（<Cmd>{"<Route element>"}</Cmd> がその場に描画される）、Angular は<strong>差し込み口を明示的に置く</strong>のが違いです。
      </p>
      <Code lang="ts" filename="src/app/app.component.ts">{`import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],  // テンプレで使う機能を import
  template: \`
    <header>
      <a routerLink="/">TaskFlow</a>
      <a routerLink="/tasks/new">新規作成</a>
    </header>

    <!-- 一致したページがこの位置に描画される -->
    <router-outlet />
  \`,
})
export class AppComponent {}`}</Code>

      <Section>画面を移動する — routerLink</Section>
      <p>
        遷移には <Cmd>href</Cmd> ではなく <Cmd>routerLink</Cmd> を使います。<Cmd>{"<a href>"}</Cmd> はページ全体を再読み込みしてしまい、
        SPA の利点（速い遷移・状態の保持）が消えるからです。React の <Cmd>{"<Link>"}</Cmd> に相当します。
      </p>
      <Code lang="ts" filename="src/app/pages/task-list.component.ts">{`template: \`
  <ul>
    @for (task of tasks; track task.id) {
      <li>
        <!-- 文字列リテラルの単純パス -->
        <a routerLink="/tasks/new">新規</a>

        <!-- 動的パスは配列で組み立てる（[routerLink] のバインド構文） -->
        <a [routerLink]="['/tasks', task.id]">{{ task.title }}</a>
      </li>
    }
  </ul>
\``}</Code>
      <KVList
        items={[
          { key: "routerLink=\"/tasks/new\"", val: "固定パス。ただの文字列でよい" },
          { key: "[routerLink]=\"['/tasks', id]\"", val: "動的パス。角括弧でバインドし、配列でセグメントを組む（/tasks/1 になる）" },
          { key: "<a href>", val: "使わない。サーバーへリクエスト＋全体再読み込みが起きる（SPA が台無し）" },
        ]}
      />

      <Section>URL からパラメータを取り出す — ActivatedRoute</Section>
      <p>
        詳細ページでは、URL の <Cmd>:id</Cmd> を <Cmd>ActivatedRoute</Cmd> から受け取ります。React の <Cmd>useParams</Cmd> に相当しますが、
        Angular には<strong>2 通り</strong>あります。使い分けが重要です。
      </p>
      <Code lang="ts" filename="src/app/pages/task-detail.component.ts">{`import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  template: \`<p>タスク {{ id }} の詳細</p>\`,
})
export class TaskDetailComponent {
  private route = inject(ActivatedRoute);   // DI で注入（2025 標準は inject()）

  // ① スナップショット: 「今のこの瞬間の値」を一度だけ読む
  id = this.route.snapshot.paramMap.get('id');   // /tasks/1 なら "1"
}`}</Code>
      <Callout variant="warn" title="snapshot は「一度きり」— 同じルートで id だけ変わると更新されない">
        <Cmd>snapshot</Cmd> はコンポーネント生成時の値を 1 回読むだけです。<strong>/tasks/1 から /tasks/2 へ「同じ TaskDetailComponent のまま」遷移</strong>すると、
        Angular はコンポーネントを作り直さないため <Cmd>snapshot</Cmd> は 1 のまま。こういう画面では、次の <Cmd>paramMap</Cmd>（Observable）を購読します。
      </Callout>
      <p>
        <Cmd>paramMap</Cmd> は URL パラメータの<strong>変化を流し続ける Observable</strong> です。<Cmd>subscribe</Cmd> しておけば、
        id が変わるたびにコールバックが呼ばれます（RxJS は「RxJS と状態管理」の章で詳しく）。
      </p>
      <Code lang="ts" filename="task-detail.component.ts（Observable 版）">{`import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class TaskDetailComponent {
  private route = inject(ActivatedRoute);
  id = '';

  constructor() {
    // ② Observable: id が変わるたびに毎回発火する
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id') ?? '';
      // ここで this.id を使ってタスクを読み込み直す、など
    });
  }
}`}</Code>
      <KVList
        items={[
          { key: "snapshot.paramMap.get('id')", val: "今の値を一度だけ読む。ページ間で必ず作り直される単純な画面ならこれで十分" },
          { key: "paramMap.subscribe(...)", val: "id の変化を毎回受け取る。同じルート内で id だけ変わる画面はこちら（Observable）" },
        ]}
      />

      <Section>プログラムから遷移する — Router.navigate</Section>
      <p>「作成ボタンを押したら一覧へ戻る」のように、<strong>処理の後に遷移</strong>したいときは <Cmd>Router</Cmd> を注入して <Cmd>navigate()</Cmd> します。React の <Cmd>useNavigate</Cmd> に相当します。</p>
      <Code lang="ts" filename="src/app/pages/new-task.component.ts">{`import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-task',
  standalone: true,
  template: \`<form (ngSubmit)="save()"><!-- 入力欄 --></form>\`,
})
export class NewTaskComponent {
  private router = inject(Router);

  save() {
    // ...タスクを保存する処理...
    this.router.navigate(['/']);   // 保存できたら一覧（/）へ
    // 動的パスも配列で: this.router.navigate(['/tasks', newId]);
  }
}`}</Code>

      <Section>まとめ — 遷移の流れ</Section>
      <StepFlow
        steps={[
          { title: "routerLink をクリック（または navigate 実行）", desc: "遷移を依頼する" },
          { title: "History API で URL を書き換え", desc: "ページは再読み込みしない（pushState）" },
          { title: "Router が現在の URL と routes 配列を照合", desc: "上から順に path とマッチするルートを探す" },
          { title: "router-outlet に一致 component を描画", desc: "画面のうち差し込み口だけが差し替わる" },
        ]}
        caption="Angular SPA ルーティングの一巡"
      />

      <Bridge course="ネットワーク / 状態機械 / RxJS（Observable）">
        URL は<strong>アプリの「今の状態」を表す住所</strong>です。ルーティングは「URL という<strong>状態</strong>」から「表示（コンポーネント）」への写像——
        講義で学ぶ<strong>状態機械</strong>の考え方に対応します。<Cmd>history.pushState</Cmd> はネットワークの授業で触れる
        <strong>ブラウザ History API</strong> で、URL を変えても<strong>サーバーへリクエストを送らない</strong>のがポイント（だから速い）。
        Angular 独自の勘所は <Cmd>ActivatedRoute.paramMap</Cmd> が <strong>Observable（時間で流れる値のストリーム）</strong>である点。
        「URL の変化を購読する」という発想は、RxJS の<strong>データフロー</strong>そのものです。
      </Bridge>

      <Quiz
        question="/tasks/1 から /tasks/2 へ、同じ TaskDetailComponent のまま遷移したのに詳細が 1 のまま更新されない。原因として最も妥当なのは？"
        options={[
          <><Cmd>routerLink</Cmd> の書き方が間違っている</>,
          <><Cmd>snapshot.paramMap</Cmd> で一度だけ読んでおり、id の変化を購読していないから</>,
          <><Cmd>provideRouter</Cmd> を呼び忘れているから</>,
          <><Cmd>router-outlet</Cmd> が 2 つあるから</>,
        ]}
        answer={1}
        explanation={<><Cmd>snapshot</Cmd> は生成時の値を 1 回読むだけ。同じコンポーネントが再利用されると更新されません。<Cmd>route.paramMap.subscribe(...)</Cmd>（Observable）で id の変化を毎回受け取れば解決します。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "SPA は History API（pushState/popstate）で、再読み込みせず URL と表示を切り替える（React と同じ原理）",
          "ルートは app.routes.ts の Routes 配列（path/component）。provideRouter(routes) を app.config.ts で有効化",
          "描画位置は <router-outlet />。遷移は routerLink（href は再読み込みで NG）。動的パスは [routerLink]=\"['/tasks', id]\"",
          "URL パラメータは ActivatedRoute。snapshot（一度きり）と paramMap（Observable・毎回発火）を使い分ける",
          "処理後の遷移は inject(Router) の navigate([...])。具体パスを :id より先、'**' は最後（404）",
        ]}
      />
    </>
  );
}
