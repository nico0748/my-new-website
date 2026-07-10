import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KeyPoints, Bridge, Quiz, Divider } from "../../../components/learn/kit";
import { SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "httpclient-crud",
  title: "HttpClient で CRUD（データ取得と API 連携）",
  description: "provideHttpClient() を登録し、HttpClient を DI した TaskService で getTasks / createTask / updateTask / deleteTask を実装。Observable と型付き get<Task[]>、catchError でのエラーハンドリングまで。fetch(Promise) の React と対比する。",
  domain: "angular-practice",
  section: "forms-http",
  order: 1,
  level: "practice",
  tags: ["Angular", "HttpClient", "CRUD"],
  updated: "2026-07-07",
  minutes: 13,
};

export default function Article() {
  return (
    <>
      <Lead>
        TaskFlow の一覧・詳細・新規作成は、すべてバックエンド API との通信で成り立ちます。Angular では
        <strong>HttpClient</strong> を <strong>DI（依存性注入）</strong>で受け取り、返り値を <strong>Observable</strong> として扱うのが標準です。
        ここでは <Cmd>provideHttpClient()</Cmd> を登録し、CRUD を <Cmd>TaskService</Cmd> に関数化して UI とつなぎます。
        React の <Cmd>fetch</Cmd>（Promise）との違いも対比します。
      </Lead>

      <Section>CRUD と HTTP メソッドの対応</Section>
      <p>
        アプリのデータ操作は突き詰めると 4 つ——<strong>作る・読む・更新する・削除する（CRUD）</strong>。
        REST API ではリソース（tasks）を URL で表し、操作を HTTP メソッドで分けます。TaskFlow の各操作に対応させます。
      </p>
      <ComparisonTable
        headers={["CRUD", "HTTP メソッド", "TaskFlow での操作", "HttpClient"]}
        rows={[
          ["Create（作成）", "POST", "新規タスクを追加", <Cmd>http.post()</Cmd>],
          ["Read（読取）", "GET", "一覧・詳細を表示", <Cmd>http.get()</Cmd>],
          ["Update（更新）", "PATCH / PUT", "完了フラグ切替・編集", <Cmd>http.patch()</Cmd>],
          ["Delete（削除）", "DELETE", "タスクを削除", <Cmd>http.delete()</Cmd>],
        ]}
      />
      <Callout variant="tip" title="PATCH と PUT">
        <Cmd>PUT</Cmd> は<strong>全体置換</strong>、<Cmd>PATCH</Cmd> は<strong>一部だけ更新</strong>。「完了フラグだけ変える」なら PATCH が自然です。
        <Cmd>GET</Cmd>/<Cmd>PUT</Cmd>/<Cmd>DELETE</Cmd> は冪等、<Cmd>POST</Cmd> は非冪等——リトライ設計で効いてきます。
      </Callout>

      <Section>provideHttpClient() を登録する</Section>
      <p>
        Angular では機能を <strong>プロバイダ</strong>として <Cmd>app.config.ts</Cmd> に登録します。HttpClient を使うには
        <Cmd>provideHttpClient()</Cmd> を <Cmd>providers</Cmd> に足すだけ。これで <Cmd>HttpClient</Cmd> がアプリ全体に DI 可能になります。
      </p>
      <Code lang="ts" filename="src/app/app.config.ts">{`import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),  // これで HttpClient が DI 可能に
  ],
};`}</Code>
      <Callout variant="info" title="withFetch() とは">
        <Cmd>withFetch()</Cmd> は内部の通信実装に <strong>fetch API</strong> を使う指定です（従来の XMLHttpRequest ではなく）。
        SSR（サーバーサイドレンダリング）との相性が良く、2025 年時点の標準的な選択です。付けなくても動きますが推奨されます。
      </Callout>

      <Section>TaskService に HttpClient を DI する</Section>
      <p>
        通信ロジックはコンポーネントに散らさず、<strong>サービス</strong>にまとめます。<Cmd>inject()</Cmd> 関数で HttpClient を受け取り、
        CRUD の各操作を Observable を返すメソッドとして実装します。
      </p>
      <Code lang="ts" filename="src/app/task.service.ts">{`import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

@Injectable({ providedIn: "root" })
export class TaskService {
  private http = inject(HttpClient);      // コンストラクタ不要。inject() で DI
  private readonly base = "/api/tasks";

  // Read（一覧）— 型付き get<Task[]>
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.base);
  }

  // Read（1件）
  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(\`\${this.base}/\${id}\`);
  }

  // Create
  createTask(title: string): Observable<Task> {
    return this.http.post<Task>(this.base, { title, done: false });
  }

  // Update（部分更新：done の切り替えなど）
  updateTask(id: string, patch: Partial<Task>): Observable<Task> {
    return this.http.patch<Task>(\`\${this.base}/\${id}\`, patch);
  }

  // Delete
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(\`\${this.base}/\${id}\`);
  }
}`}</Code>
      <Callout variant="tip" title="型付き get<Task[]> の利点">
        <Cmd>{"http.get<Task[]>()"}</Cmd> のようにジェネリクスで返り値の型を指定すると、以降 <Cmd>tasks.map(t =&gt; t.title)</Cmd> のように
        <strong>補完とコンパイル時チェックが効きます</strong>。実行時に変換されるわけではなく「この JSON はこの型のはず」という契約。
        <Cmd>fetch</Cmd> の <Cmd>res.json()</Cmd> は <Cmd>any</Cmd> になりがちなので、この型付けは Angular の HttpClient の実務的な強みです。
      </Callout>

      <Section>コンポーネント側で表示する</Section>
      <p>
        サービスが返す Observable を、コンポーネントで<strong>購読（subscribe）</strong>するか、テンプレートの
        <Cmd>async</Cmd> パイプに渡します。async パイプは購読と解除（unsubscribe）を自動でやってくれるので実務ではこちらが主流です。
      </p>
      <Code lang="ts" filename="task-list.component.ts（async パイプ）">{`import { Component, inject } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import { TaskService, Task } from "./task.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [AsyncPipe],
  template: \`
    <ul>
      @for (task of tasks$ | async; track task.id) {
        <li>{{ task.title }}</li>
      }
    </ul>
  \`,
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  // Observable<Task[]> をそのままテンプレートへ。async パイプが購読する
  tasks$: Observable<Task[]> = this.taskService.getTasks();
}`}</Code>
      <p>
        書き換え系（作成・更新・削除）は結果を state に反映したいので、<Cmd>subscribe</Cmd> で受けるのが分かりやすいです。
      </p>
      <Code lang="ts" filename="subscribe で state に反映">{`export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks: Task[] = [];

  ngOnInit() {
    this.taskService.getTasks().subscribe((list) => (this.tasks = list));
  }

  onAdd(title: string) {
    this.taskService.createTask(title).subscribe((created) => {
      this.tasks = [...this.tasks, created];   // 返ってきた1件を足す
    });
  }

  onToggle(task: Task) {
    this.taskService.updateTask(task.id, { done: !task.done })
      .subscribe((updated) => {
        this.tasks = this.tasks.map((t) => (t.id === updated.id ? updated : t));
      });
  }

  onDelete(id: string) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter((t) => t.id !== id);
    });
  }
}`}</Code>
      <Callout variant="warn" title="subscribe しないと通信は起きない">
        HttpClient の Observable は <strong>Cold（コールド）</strong>——<Cmd>subscribe</Cmd> するか <Cmd>async</Cmd> パイプに渡すまで、
        HTTP リクエストは<strong>1 回も飛びません</strong>。「メソッドを呼んだのに通信が起きない」ときは購読忘れを疑いましょう。
        逆に複数回 subscribe すると<strong>その回数だけ</strong>リクエストが飛びます。
      </Callout>

      <Section>ブラウザと API の往復</Section>
      <p>一覧取得（GET）と新規作成（POST）で、ブラウザ・HttpClient・API サーバーの間を何が行き交うかを見ます。</p>
      <SequenceDiagram
        actors={["コンポーネント", "HttpClient", "API サーバー"]}
        messages={[
          { from: 0, to: 1, label: "getTasks() を呼ぶ" },
          { from: 1, to: 2, label: "GET /api/tasks" },
          { from: 2, to: 1, label: "200 OK + JSON 配列" },
          { from: 1, to: 0, label: "Observable が値を emit", cta: true },
          { from: 0, to: 1, label: "createTask(title)" },
          { from: 1, to: 2, label: "POST /api/tasks + body" },
          { from: 2, to: 1, label: "201 Created + 作成された1件" },
          { from: 1, to: 0, label: "created を emit", cta: true },
        ]}
        caption="GET で一覧を取得し、POST で作成する往復。応答は Observable 経由で流れてくる"
      />

      <Section>エラーハンドリング（catchError）</Section>
      <p>
        通信は失敗しうるもの——ネットワーク断・404・500。Angular では RxJS の <Cmd>catchError</Cmd> オペレータで
        <Cmd>pipe</Cmd> の途中に割り込み、<Cmd>HttpErrorResponse</Cmd> を受けて処理します。
      </p>
      <Code lang="ts" filename="task.service.ts（catchError）">{`import { Observable, catchError, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";

getTasks(): Observable<Task[]> {
  return this.http.get<Task[]>(this.base).pipe(
    catchError((err: HttpErrorResponse) => {
      // err.status（404 / 500 など）や err.message でログ・分岐
      console.error(\`タスク取得に失敗: \${err.status}\`);
      // 呼び出し側にエラーを伝播（握りつぶさない）
      return throwError(() => new Error("タスクを取得できませんでした"));
    })
  );
}`}</Code>
      <Callout variant="info" title="fetch と違い HTTP エラーは error に流れる">
        <Cmd>fetch</Cmd> は 404/500 でも Promise が resolve し、自分で <Cmd>res.ok</Cmd> を確認する必要がありました。
        HttpClient は<strong>2xx 以外を自動でエラー</strong>として扱い、<Cmd>subscribe</Cmd> の <Cmd>error</Cmd> コールバックや
        <Cmd>catchError</Cmd> に流します。<Cmd>this.taskService.getTasks().subscribe(&#123; next: ..., error: ... &#125;)</Cmd> のように受けられます。
      </Callout>

      <Bridge course="ネットワーク／非同期プログラミング（REST・Observable）">
        CRUD は、データベースの授業で学ぶ <Cmd>INSERT/SELECT/UPDATE/DELETE</Cmd> と一対一で対応し、REST はそれを
        「リソース（名詞）× HTTP メソッド（動詞）」で表現する設計思想です。Angular が返り値に <strong>Observable</strong> を選ぶのは、
        非同期処理を<strong>「時間とともに値が流れるストリーム」</strong>として統一的に扱うため。1 回きりの HTTP でも、
        <Cmd>catchError</Cmd>・<Cmd>retry</Cmd>・<Cmd>switchMap</Cmd> などのオペレータで<strong>宣言的に合成</strong>でき、
        入力監視やポーリングなど連続的な非同期にもそのまま拡張できます。これが Promise（1 回で完結）との設計思想の違いです。
      </Bridge>

      <Section>React（fetch）との対比</Section>
      <ComparisonTable
        headers={["観点", "React（crud-basics）", "Angular（HttpClient）"]}
        rows={[
          ["通信 API", <><Cmd>fetch</Cmd>（Promise）</>, <><Cmd>HttpClient</Cmd>（Observable）</>],
          ["取得の受け方", "await / .then()", "subscribe / async パイプ"],
          ["型付け", "res.json() は any になりがち", <><Cmd>{"get<Task[]>()"}</Cmd> で型付き</>],
          ["HTTP エラー", "res.ok を自分で確認", "2xx 以外を自動でエラー化"],
          ["取得先の解決", "import した関数を呼ぶ", "inject() で DI（差し替え可能）"],
          ["後処理", "1 回で完結（Promise）", "オペレータで合成（catchError 等）"],
        ]}
      />
      <Callout variant="tip" title="DI がテストで効く">
        Angular は <Cmd>TaskService</Cmd> を <Cmd>inject()</Cmd> で受け取るので、テスト時に<strong>モック実装に差し替え</strong>られます。
        React で import した関数を直接呼ぶ場合はモック化に一手間かかる場面があり、DI は疎結合とテスト容易性で優位です。
      </Callout>

      <Quiz
        question="TaskService の getTasks() を呼んだのに、ネットワークタブに GET リクエストが1件も出ません。最も可能性が高い原因は？"
        options={[
          <>provideHttpClient() を登録し忘れている</>,
          <>返り値の Observable を subscribe / async パイプで購読していない</>,
          <>get に型引数 &lt;Task[]&gt; を付け忘れている</>,
          <>base の URL が間違っている</>,
        ]}
        answer={1}
        explanation={<>HttpClient の Observable は <strong>Cold</strong> で、<Cmd>subscribe</Cmd> するか <Cmd>async</Cmd> パイプに渡すまで通信は発生しません。メソッドを呼んだだけでは「まだ何も起きていない」状態です。型引数は補完/型のためで通信の有無には無関係、URL 間違いなら 404 が出るはずです。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "provideHttpClient(withFetch()) を app.config の providers に登録する",
          "通信は TaskService にまとめ、inject(HttpClient) で DI する",
          "CRUD は get / post / patch / delete、返り値はすべて Observable",
          "http.get<Task[]>() の型付けで補完とコンパイル時チェックが効く",
          "Observable は Cold：subscribe か async パイプで購読するまで通信は飛ばない",
          "エラーは catchError + HttpErrorResponse で処理（fetch と違い 2xx 以外は自動でエラー化）",
        ]}
      />
    </>
  );
}
