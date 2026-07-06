import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KeyPoints, ComparisonTable, KVList, TipBox, Bridge, Divider } from "../../../components/learn/kit";
import { FlowChain, SequenceDiagram } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "angular-02",
  title: "Angular 入門② — DI・サービス・RxJS・ルーティング",
  description: "依存性注入(DI)、サービス、HttpClient と RxJS、signals、ルーティング、Reactive Forms を、Angular の設計思想とともに実践的に。",
  domain: "web",
  section: "frontend",
  order: 16,
  level: "practice",
  tags: ["Angular", "DI", "RxJS"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        入門①でコンポーネントとテンプレートを押さえました。この記事では Angular の設計思想の核心である<strong>依存性注入（DI）</strong>を出発点に、ロジックの置き場である<strong>サービス</strong>、非同期を扱う <strong>HttpClient と RxJS</strong>、新しいリアクティビティの <strong>signals</strong>、そして<strong>ルーティング</strong>と <strong>Reactive Forms</strong> までを実践的に見ていきます。
      </Lead>

      <Section>依存性注入（DI）の仕組み</Section>
      <p>
        <strong>依存性注入（Dependency Injection）</strong>とは、「あるクラスが必要とする別のオブジェクト（依存）を、自分で <Cmd>new</Cmd> せず、外から渡してもらう」設計です。Angular ではこれがフレームワークの中心にあり、コンポーネントは「欲しいものをコンストラクタで宣言するだけ」で受け取れます。
      </p>
      <Code lang="typescript" filename="悪い例 vs DI">{`// ✗ 自前で生成: 差し替え・テストが難しい
class UserComponent {
  private api = new UserApi();   // 実装に固く結合
}

// ✓ DI: 欲しい型を宣言するだけ。生成は Angular に任せる
class UserComponent {
  constructor(private api: UserApi) {}
}`}</Code>
      <p>
        Angular は<strong>インジェクタ（Injector）</strong>という仕組みを内部に持ちます。コンストラクタの引数の<strong>型</strong>を見て「その型のインスタンスを探し、無ければ生成し、あれば使い回す」ことを自動で行います。開発者は「どう作るか」ではなく「何が欲しいか」だけを書けばよい、というのが DI の恩恵です。
      </p>
      <KVList
        items={[
          { key: "疎結合", val: "利用側は実装ではなく型（インターフェース）に依存する" },
          { key: "テスト容易", val: "テスト時にモックを注入して差し替えられる" },
          { key: "単一インスタンス", val: "同じ提供範囲では同一インスタンスが共有される（シングルトン）" },
        ]}
      />
      <TipBox>
        近年は <Cmd>inject()</Cmd> 関数でも依存を取得できます。<Cmd>const api = inject(UserApi);</Cmd> のようにフィールド初期化子で書け、コンストラクタ引数より柔軟です。仕組み（インジェクタが型で解決する）は同じです。
      </TipBox>

      <Bridge course="デザインパターン（制御の反転 IoC / 依存性逆転の原則）">
        DI は<strong>「制御の反転（Inversion of Control, IoC）」</strong>という設計原則の代表的な実装です。
        通常はあなたのコードがライブラリを<strong>呼ぶ</strong>（制御はあなたにある）。IoC ではそれが逆転し、
        フレームワークがあなたのクラスを<strong>生成し・依存を渡して・呼ぶ</strong>（制御はフレームワークにある＝「ハリウッドの原則：
        こちらから呼ぶな、こちらが呼ぶ」）。座学の <strong>SOLID の D＝依存性逆転の原則（DIP）</strong>—「上位モジュールも下位モジュールも
        <strong>抽象に依存すべき</strong>」—が、まさに <Cmd>new UserApi()</Cmd>（具象に依存）を「型で宣言して注入」（抽象に依存）へ
        置き換える動機です。DI コンテナ（Angular のインジェクタ）は、依存グラフを解決する<strong>サービスロケータ</strong>の一種でもあります。
      </Bridge>

      <SequenceDiagram
        actors={["Component", "Injector", "サービス"]}
        messages={[
          { from: 0, to: 1, label: "この型が欲しい" },
          { from: 1, to: 2, label: "無ければ生成", cta: true },
          { from: 2, to: 1, label: "インスタンス" },
          { from: 1, to: 0, label: "注入して渡す" },
        ]}
        caption="コンポーネントは「欲しい型」を言うだけ。生成・キャッシュ・共有はインジェクタが担う"
      />

      <Section>サービス — @Injectable と providedIn</Section>
      <p>
        コンポーネントは「表示」に集中させ、<strong>データ取得やビジネスロジックはサービス</strong>に切り出すのが Angular の作法です。サービスはただのクラスですが、<Cmd>@Injectable</Cmd> デコレータを付けると DI で注入できるようになります。
      </p>
      <Code lang="typescript" filename="user.service.ts">{`import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',   // アプリ全体で1つ（ルートに登録）
})
export class UserService {
  private users = ['Aki', 'Yuki'];

  getUsers(): string[] {
    return this.users;
  }
}`}</Code>
      <p>
        <Cmd>providedIn: 'root'</Cmd> は「このサービスをアプリのルートインジェクタに登録し、全体で 1 インスタンス（シングルトン）として共有する」指定です。どのコンポーネントから注入しても同じ状態を参照できます。使う側は型を宣言するだけです。
      </p>
      <Code lang="typescript" filename="user-list.component.ts">{`import { Component, OnInit, inject } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  template: \`
    @for (u of users; track u) { <li>{{ u }}</li> }
  \`,
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);   // DI で受け取る
  users: string[] = [];

  ngOnInit() {
    this.users = this.userService.getUsers();
  }
}`}</Code>
      <Callout variant="info" title="providedIn の選択肢">
        <Cmd>'root'</Cmd> 以外に、特定のコンポーネントの <Cmd>providers</Cmd> に登録して「そのコンポーネントツリー限定のインスタンス」にすることもできます。共有範囲を意識的に決められるのが DI の設計力です。
      </Callout>

      <Section>HttpClient と RxJS の Observable</Section>
      <p>
        サーバ通信は <Cmd>HttpClient</Cmd> で行います。特徴は、結果を Promise ではなく <strong>RxJS の Observable（観測可能な値のストリーム）</strong>で返すことです。まずアプリ起動時に <Cmd>HttpClient</Cmd> を有効化します。
      </p>
      <Code lang="typescript" filename="main.ts">{`import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient()],   // HttpClient を注入可能にする
});`}</Code>
      <Code lang="typescript" filename="post.service.ts">{`import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Post { id: number; title: string; }

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);

  getPosts(): Observable<Post[]> {
    // GET しても即座には通信せず、Observable を返すだけ
    return this.http.get<Post[]>('/api/posts');
  }
}`}</Code>

      <Bridge course="非同期・ストリーム処理（リアクティブプログラミング / データフロー）">
        RxJS の <Cmd>Observable</Cmd> は<strong>「時間軸上に並んだ値の列（stream）」</strong>を第一級のデータとして扱う考え方です。
        配列が「空間に並んだ値」なら、Observable は「時間に並んだ値」。だから配列と同じく <Cmd>map</Cmd> /
        <Cmd>filter</Cmd> で加工でき、この対称性がリアクティブプログラミングの美しさです。
        座学の観点では、これは<strong>データフロープログラミング</strong>—「値が節点を通って流れ、各節点が変換を施す」
        パイプライン計算モデル—の実装です。また Observable は本質的に <strong>Observer パターン</strong>（Subject が Observer に push で通知）を、
        <strong>関数型の合成可能なオペレータ</strong>で拡張したもの。「push 型・宣言的・合成可能」な非同期の扱いは、
        コールバック地獄（命令的・入れ子）に対する構造的な解答になっています。
      </Bridge>

      <SubSection>Observable は subscribe で初めて動く</SubSection>
      <p>
        Observable は「まだ発火していない、値が流れてくる約束」です。<Cmd>subscribe()</Cmd> して初めて通信が実行され、値が届くたびにコールバックが呼ばれます（Promise と違い複数回流れうる点も特徴）。
      </p>
      <p>
        「<strong>いつ・何回・どう流れるか</strong>」の違いが Promise との決定的な差です。ボタン連打・WebSocket・
        入力欄のキーストロークのように<strong>値が繰り返し到来する非同期</strong>を、Promise は表現できません（1 回で確定するため）。
        Observable はこれを自然に扱えます。
      </p>
      <ComparisonTable
        headers={["観点", "Promise", "Observable"]}
        rows={[
          ["流れる値の数", "1 回だけ", "0 回〜無限回"],
          ["実行の開始", "生成時に即実行（eager）", "subscribe で初めて実行（lazy）"],
          ["キャンセル", "不可", "unsubscribe で可能"],
          ["合成", "then の連鎖", "pipe + オペレータ（豊富）"],
        ]}
      />
      <Code lang="typescript" filename="post-list.component.ts">{`export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  posts: Post[] = [];

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (data) => (this.posts = data),   // 値が来たとき
      error: (err) => console.error(err),    // エラー時
      complete: () => console.log('done'),   // 完了時
    });
  }
}`}</Code>

      <SubSection>pipe と オペレータ（map など）で加工する</SubSection>
      <p>
        流れてくる値は <Cmd>pipe()</Cmd> に<strong>オペレータ</strong>を並べて変換します。<Cmd>map</Cmd>（各値を変換）、<Cmd>filter</Cmd>（条件で間引く）、<Cmd>catchError</Cmd>（エラー処理）などが代表です。
      </p>
      <Code lang="typescript" filename="rxjs-pipe">{`import { map, filter, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

getPublishedTitles(): Observable<string[]> {
  return this.http.get<Post[]>('/api/posts').pipe(
    map((posts) => posts.map((p) => p.title)),   // Post[] -> string[]
    catchError(() => of([])),                    // 失敗時は空配列で継続
  );
}`}</Code>
      <Callout variant="tip" title="テンプレートで購読するなら async パイプ">
        手動 <Cmd>subscribe</Cmd> は購読解除（メモリリーク対策）が要ります。テンプレートで <Cmd>{"{{ posts$ | async }}"}</Cmd> のように <Cmd>async</Cmd> パイプを使うと、購読と解除を Angular が自動で面倒みてくれます。
      </Callout>

      <SubSection>実務例 — 入力に応じた検索（オペレータの真価）</SubSection>
      <p>
        オペレータの威力が最も分かるのが「入力するたびに検索」です。素朴に書くと、キーを打つたびに API を叩き、
        古いリクエストの遅い応答が新しい応答を上書きする<strong>競合状態（レースコンディション）</strong>が起きます。
        RxJS はこれを数行で解決します。
      </p>
      <FlowChain
        nodes={[
          { label: "keystrokes", sub: "入力の連続" },
          { label: "debounceTime", sub: "打ち終わり待ち" },
          { label: "switchMap", sub: "古い通信を破棄" },
          { label: "結果", sub: "最新だけ描画", variant: "cta" },
        ]}
        caption="ストリームを段階的に加工する。各オペレータは「時間軸上のデータフロー」の 1 変換"
      />
      <Code lang="typescript" filename="search.component.ts">{`import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';

private terms = new Subject<string>();

results$ = this.terms.pipe(
  debounceTime(300),            // 打ち終わって 300ms 待つ（無駄打ちを間引く）
  distinctUntilChanged(),       // 同じ語なら再検索しない
  switchMap((q) => this.api.search(q)),  // 新入力で古い通信をキャンセル
);

onInput(q: string) {
  this.terms.next(q);           // ストリームへ値を流し込む
}`}</Code>
      <TipBox>
        <Cmd>switchMap</Cmd> は「新しい値が来たら前の内部 Observable を捨てて乗り換える」オペレータ。
        これ 1 つで<strong>レースコンディションが構造的に消えます</strong>。命令的に書けばフラグやカウンタで
        古い応答を弾く面倒なコードになるところを、ストリームの合成として宣言的に表現できるのが RxJS の強みです。
      </TipBox>

      <Callout variant="danger" title="購読解除を忘れるとメモリリーク">
        手動 <Cmd>subscribe</Cmd> した Observable は、コンポーネント破棄時に <Cmd>unsubscribe</Cmd> しないと
        購読が残り続けます（＝リスナが GC されず<strong>メモリリーク</strong>）。<Cmd>async</Cmd> パイプか
        <Cmd>takeUntilDestroyed()</Cmd> で自動解除するのが実務の定石。「流れ続けるもの＝終わらせる責任がある」と覚えます。
      </Callout>

      <Section>signals — 新しいリアクティビティ</Section>
      <p>
        Angular 16 で導入された <strong>signals</strong> は、値の変化をきめ細かく追跡する新しい状態管理の仕組みです。値を「読むと依存が記録され、書くと依存先だけが更新される」ため、変更検知が効率的で、コードもシンプルになります。
      </p>
      <Code lang="typescript" filename="counter.component.ts">{`import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <p>count: {{ count() }} / double: {{ double() }}</p>
    <button (click)="inc()">+1</button>
  \`,
})
export class CounterComponent {
  count = signal(0);                       // 書き換え可能な signal
  double = computed(() => this.count() * 2); // count に依存する派生値

  inc() {
    this.count.update((n) => n + 1);       // set / update で書き換え
  }
}`}</Code>
      <ComparisonTable
        headers={["操作", "書き方", "説明"]}
        rows={[
          ["読む", <Cmd key="a">count()</Cmd>, "関数として呼ぶと現在値。依存が自動記録される"],
          ["置換", <Cmd key="b">count.set(5)</Cmd>, "新しい値をセット"],
          ["更新", <Cmd key="c">count.update(n =&gt; n+1)</Cmd>, "現在値から計算して更新"],
          ["派生", <Cmd key="d">computed(...)</Cmd>, "他の signal から自動計算される読み取り専用値"],
        ]}
      />
      <Callout variant="info" title="変更検知との関係">
        従来 Angular は「イベントのたびにツリー全体を検査する（Zone.js ベース）」変更検知でした。signals は「変わった signal に依存する箇所だけ」を更新できるため、将来的に zoneless（Zone.js 非依存）で高速な変更検知の土台になります。
      </Callout>

      <TipBox>
        <strong>signals と RxJS の使い分け</strong>: signals は「今の値（同期的な状態）」を、RxJS は「時間軸のイベント列（非同期ストリーム）」を得意とします。
        コンポーネントのローカル状態は signals、HTTP・入力デバウンス・WebSocket など<strong>流れ続けるもの</strong>は RxJS、と役割で分けると迷いません。両者は <Cmd>toSignal()</Cmd> / <Cmd>toObservable()</Cmd> で相互変換できます。
      </TipBox>

      <Section>ルーティング — Routes / router-outlet / routerLink</Section>
      <p>
        SPA のページ遷移は Angular Router が担います。<Cmd>Routes</Cmd> で URL とコンポーネントの対応を定義し、<Cmd>router-outlet</Cmd> にマッチしたコンポーネントが描画され、<Cmd>routerLink</Cmd> でリンクを張ります。
      </p>
      <Steps>
        <Step title="ルート定義">
          <Code lang="typescript" filename="app.routes.ts">{`import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { PostDetailComponent } from './post-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'posts/:id', component: PostDetailComponent },  // :id は動的パラメータ
  { path: '**', redirectTo: '' },                         // 該当なしはトップへ
];`}</Code>
        </Step>
        <Step title="ルーターを有効化（main.ts）">
          <Code lang="typescript" filename="main.ts">{`import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)],
});`}</Code>
        </Step>
        <Step title="テンプレートで表示 + リンク">
          <Code lang="typescript" filename="app.component.ts">{`import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: \`
    <nav>
      <a routerLink="/">ホーム</a>
      <a [routerLink]="['/posts', 42]">記事42</a>
    </nav>
    <router-outlet></router-outlet>  <!-- ここに現在のページが入る -->
  \`,
})
export class AppComponent {}`}</Code>
        </Step>
      </Steps>
      <SubSection>ルートパラメータを受け取る</SubSection>
      <Code lang="typescript" filename="post-detail.component.ts">{`import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  id = '';

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
  }
}`}</Code>
      <TipBox>
        大規模化に備え、<Cmd>loadComponent</Cmd> を使えばルート単位で遅延読み込み（コード分割）ができます。初期バンドルを小さく保てます。
      </TipBox>

      <Section>Reactive Forms — 型付きでフォームを組む</Section>
      <p>
        Angular のフォームは、テンプレート主導（<Cmd>ngModel</Cmd>）とコード主導の <strong>Reactive Forms</strong> の 2 方式があります。Reactive Forms はフォームの構造を TypeScript 側で組み立てるため、型・バリデーション・テストがしやすく、実務で好まれます。
      </p>
      <Code lang="typescript" filename="login.component.ts">{`import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);   // { email, password }
    }
  }
}`}</Code>
      <Code lang="html" filename="login.component.html">{`<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="email" placeholder="メール">
  @if (form.controls.email.invalid && form.controls.email.touched) {
    <small>正しいメールアドレスを入力してください</small>
  }
  <input type="password" formControlName="password">
  <button [disabled]="form.invalid">ログイン</button>
</form>`}</Code>
      <Callout variant="warn" title="ReactiveFormsModule の import を忘れない">
        Reactive Forms を使うコンポーネントは <Cmd>imports</Cmd> に <Cmd>ReactiveFormsModule</Cmd> を追加します。<Cmd>[formGroup]</Cmd> や <Cmd>formControlName</Cmd> はこのモジュールが提供するディレクティブです。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "DI は「欲しい型を宣言するだけで外から渡してもらう」設計。インジェクタが型を見て解決・共有する",
          "ロジックはサービス（@Injectable + providedIn:'root'）に切り出し、コンポーネントは表示に集中",
          "HttpClient は Observable を返す。subscribe で発火し、pipe + map などのオペレータで加工する",
          "signals（signal / computed）は値変化をきめ細かく追跡し、効率的な変更検知の土台になる",
          "ルーティングは Routes / router-outlet / routerLink。Reactive Forms は型付きでフォームを構築する",
        ]}
      />
    </>
  );
}
