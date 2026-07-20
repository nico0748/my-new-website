import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KeyPoints, ComparisonTable, KVList, TipBox, Bridge, Figure, Divider } from "../../../components/learn/kit";
import { LayerStack } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "angular-01",
  title: "Angular 入門① — コンポーネントとテンプレート",
  description: "TypeScript 前提のフルスタック FW Angular。CLI、standalone コンポーネント、テンプレート構文とデータバインディング、コンポーネント間通信を学ぶ。",
  domain: "web",
  section: "frontend",
  order: 15,
  level: "basic",
  tags: ["Angular", "TypeScript", "コンポーネント"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>Angular</strong> は Google が開発する、TypeScript を前提とした<strong>フルスタックのフロントエンドフレームワーク</strong>です。React が「ライブラリ + 周辺を自分で選ぶ」方針なのに対し、Angular はルーティング・HTTP 通信・フォーム・DI（依存性注入）まで公式に揃った「全部入り」。この記事では Angular 17 以降の標準である <strong>standalone コンポーネント</strong>と<strong>新しい制御フロー構文</strong>を軸に、コンポーネントとテンプレートの基礎を押さえます。
      </Lead>

      <Section>Angular とは何か</Section>
      <p>
        Angular の設計思想は「大規模でも破綻しない構造」です。TypeScript の型・デコレータ・クラスを全面的に使い、規約とツールで開発者を導きます。個人の小さな SPA から企業の業務システムまで、同じ作法でスケールできるのが強みです。
      </p>
      <ComparisonTable
        headers={["観点", "Angular", "React"]}
        rows={[
          ["言語", "TypeScript 前提", "JS / TS 任意"],
          ["範囲", "フルスタック（全部入り）", "UI ライブラリ + 選択"],
          ["構造化の単位", "コンポーネント + サービス + モジュール/standalone", "コンポーネント + フック"],
          ["提供元", "Google", "Meta"],
        ]}
      />
      <Callout variant="info" title="バージョンの前提">
        本記事は <strong>Angular 17 以降</strong>を前提とします。17 で standalone コンポーネントと新制御フロー（<Cmd>@if</Cmd> / <Cmd>@for</Cmd>）が安定し、従来必須だった <Cmd>NgModule</Cmd> なしで書けるようになりました。
      </Callout>

      <SubSection>設計思想 — 「規約とツールで大規模を支える」</SubSection>
      <p>
        Angular が「全部入り」「規約重視」なのには理由があります。チーム開発では、10 人が 10 通りの
        フォルダ構成・状態管理・HTTP ラッパを持ち込むと、それだけでコードベースが読めなくなります。
        Angular は<strong>「決められた作法」を公式に固定する</strong>ことで、誰が書いても同じ形になるよう仕向けます。
        自由度を意図的に下げる代わりに、<strong>大規模・長期・多人数でも構造が破綻しにくい</strong>という工学的な利得を取る設計です。
      </p>

      <Bridge course="ソフトウェア工学（コンポーネント指向 / モジュール性）">
        Angular のコンポーネントは、ソフトウェア工学でいう<strong>「モジュール」</strong>の教科書的な体現です。
        座学で学ぶ良いモジュールの条件—<strong>高凝集</strong>（テンプレート・ロジック・スタイルが 1 単位にまとまる）、
        <strong>低結合</strong>（<Cmd>@Input</Cmd>/<Cmd>@Output</Cmd> という明示的なインターフェースだけで外部とやり取り）、
        <strong>情報隠蔽</strong>（クラス内部の実装は外から見えない）—をすべて満たします。
        <Cmd>selector</Cmd> は「公開名」、<Cmd>@Input</Cmd>/<Cmd>@Output</Cmd> は「公開インターフェース」、クラス本体は「実装」。
        UI を<strong>差し替え可能な部品の合成</strong>として組む、というコンポーネント指向設計そのものです。
      </Bridge>

      <Section>Angular CLI でプロジェクトを作る</Section>
      <p>
        Angular の開発は公式 CLI（<Cmd>ng</Cmd> コマンド）が中心です。プロジェクト生成・コンポーネント生成・ビルド・テストまで一括で面倒を見てくれます。
      </p>
      <Steps>
        <Step title="CLI をインストール">
          <Code lang="bash">{`npm install -g @angular/cli`}</Code>
        </Step>
        <Step title="新規プロジェクトを作成">
          <Code lang="bash">{`ng new my-app
cd my-app
ng serve   # http://localhost:4200 で開発サーバ起動`}</Code>
        </Step>
        <Step title="コンポーネントやサービスを生成">
          <Code lang="bash">{`ng generate component user-card   # 短縮形: ng g c user-card
ng g service user                 # サービスを生成`}</Code>
        </Step>
      </Steps>
      <Figure
        src="/learn/shots/web/angular-01-01.svg"
        alt="ng serve で起動した開発サーバに localhost:4200 でアクセスした Angular の初期画面"
        caption="ng serve が通れば localhost:4200 にこの初期画面が出る。ここが Angular 開発のスタート地点。"
      />
      <TipBox>
        <Cmd>ng generate</Cmd> はファイルを作るだけでなく、テストの雛形や周辺ファイルも一緒に生成し、命名規約（ケバブケースのファイル名・PascalCase のクラス名）を自動で守らせます。手作業のブレを減らせるのが CLI の狙いです。
      </TipBox>

      <Section>standalone コンポーネントと @Component</Section>
      <p>
        Angular の画面は<strong>コンポーネント</strong>の木構造で作ります。コンポーネントは「TypeScript クラス」＋「<Cmd>@Component</Cmd> デコレータ」の組で、デコレータがテンプレート（HTML）やスタイルをそのクラスに結び付けます。
      </p>
      <Code lang="typescript" filename="hello.component.ts">{`import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',      // <app-hello></app-hello> として使う
  standalone: true,           // NgModule 不要（Angular 17+ の既定）
  template: \`<h1>こんにちは、{{ name }} さん</h1>\`,
  styles: [\`h1 { color: teal; }\`],
})
export class HelloComponent {
  name = 'Angular';           // クラスのプロパティがテンプレートから見える
}`}</Code>
      <p>
        <Cmd>selector</Cmd> はこのコンポーネントを HTML 上で呼び出すためのタグ名、<Cmd>template</Cmd> は表示内容、<Cmd>standalone: true</Cmd> は「このコンポーネント単体で完結し、モジュール登録が不要」であることを示します。クラス内で宣言した <Cmd>name</Cmd> のようなプロパティは、そのままテンプレートから参照できます。
      </p>

      <SubSection>テンプレートは別ファイルにもできる</SubSection>
      <Code lang="typescript" filename="hello.component.ts">{`@Component({
  selector: 'app-hello',
  standalone: true,
  templateUrl: './hello.component.html',   // HTML を分離
  styleUrls: ['./hello.component.css'],
})
export class HelloComponent {}`}</Code>
      <Callout variant="tip" title="standalone の依存の持ち方">
        standalone コンポーネントで他のコンポーネントやディレクティブを使うときは、デコレータの <Cmd>imports</Cmd> 配列にそれを列挙します。「使うものをそのファイルで明示する」ので依存が読みやすくなります。
      </Callout>
      <Code lang="typescript" filename="page.component.ts">{`import { Component } from '@angular/core';
import { HelloComponent } from './hello.component';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [HelloComponent],       // このテンプレートで使う部品を宣言
  template: \`<app-hello></app-hello>\`,
})
export class PageComponent {}`}</Code>

      <Section>テンプレート構文とデータバインディング</Section>
      <p>
        Angular のテンプレートは、クラスの状態と DOM を結ぶ<strong>バインディング</strong>が中心です。記号の向きで役割が変わるので、4 種類を分けて覚えます。
      </p>

      <SubSection>① 補間（interpolation）— 値を文字として表示</SubSection>
      <Code lang="html" filename="template">{`<p>合計: {{ price * quantity }} 円</p>
<p>ユーザー名: {{ user.name }}</p>`}</Code>
      <p>二重波括弧 <Cmd>{"{{ }}"}</Cmd> の中に式を書くと、その評価結果がテキストとして描画されます。</p>

      <SubSection>② プロパティバインディング [ ] — 要素の属性へ値を流す</SubSection>
      <Code lang="html" filename="template">{`<img [src]="avatarUrl" [alt]="user.name">
<button [disabled]="isLoading">送信</button>`}</Code>
      <p>
        角括弧 <Cmd>[プロパティ]</Cmd> は「クラスの値 → DOM プロパティ」の一方向の流れです。文字列連結ではなく式として評価される点が補間との違いです。
      </p>

      <SubSection>③ イベントバインディング ( ) — DOM イベントを受け取る</SubSection>
      <Code lang="html" filename="template">{`<button (click)="onSave()">保存</button>
<input (input)="onInput($event)">`}</Code>
      <p>
        丸括弧 <Cmd>(イベント名)</Cmd> は「DOM イベント → クラスのメソッド」の流れです。<Cmd>$event</Cmd> でイベントオブジェクトを受け取れます。② が入力、③ が出力、と向きで覚えると混乱しません。
      </p>

      <SubSection>④ 双方向バインディング [( )] — 入力と表示を同期</SubSection>
      <Code lang="typescript" filename="form.component.ts">{`import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule],          // ngModel を使うのに必要
  template: \`
    <input [(ngModel)]="keyword">
    <p>入力中: {{ keyword }}</p>
  \`,
})
export class FormComponent {
  keyword = '';
}`}</Code>
      <p>
        <Cmd>[(ngModel)]</Cmd>（通称「バナナ・イン・ザ・ボックス」）は ② と ③ を合成したもので、入力値とクラスのプロパティを双方向に同期します。実体は「<Cmd>[ngModel]</Cmd> による表示」と「<Cmd>(ngModelChange)</Cmd> による更新」の糖衣構文です。
      </p>
      <Callout variant="warn" title="ngModel には FormsModule が必要">
        <Cmd>[(ngModel)]</Cmd> を使うコンポーネントは、必ず <Cmd>imports</Cmd> に <Cmd>FormsModule</Cmd> を追加してください。忘れるとテンプレートエラーになります。
      </Callout>

      <Section>テンプレートはどう動くのか — コンパイルの話</Section>
      <p>
        Angular のテンプレートは、ブラウザにそのまま渡されるわけではありません。
        <Cmd>{"{{ }}"}</Cmd> や <Cmd>[src]</Cmd>、<Cmd>@if</Cmd> は HTML の標準構文ではなく、<strong>Angular 独自の言語</strong>です。
        これらは Angular コンパイラ（<Cmd>ngc</Cmd> / ビルド時）によって<strong>効率的な JavaScript のレンダリング命令に変換</strong>されてから実行されます。
      </p>
      <LayerStack
        layers={[
          { label: "テンプレート（あなたが書く）", sub: "{{ }} / [src] / @if など独自構文" },
          { label: "字句・構文解析", sub: "トークン化 → AST を構築" },
          { label: "コード生成（AOT）", sub: "描画/更新命令の JS を出力" },
          { label: "ブラウザで実行", sub: "最適化済みの DOM 操作" },
        ]}
        caption="テンプレートは「ソース言語」。コンパイラが解析して実行可能な命令へ翻訳する"
      />
      <p>
        Angular の既定は <strong>AOT（Ahead-Of-Time）コンパイル</strong>です。ビルド時にテンプレートを解析・翻訳し切るので、
        実行時にコンパイラを積む必要がなく、バンドルが小さく起動も速い。テンプレートの型エラーやバインディングの綴り間違いも
        <strong>ビルド時に検出</strong>できます（JIT＝実行時コンパイルもあるが本番では使わない）。
      </p>
      <Bridge course="コンパイラ / 言語処理系">
        Angular のテンプレート処理は、コンパイラ論の縮図です。座学で学ぶ古典的なパイプライン—
        <strong>字句解析（lexing）→ 構文解析（parsing）→ 抽象構文木（AST）→ コード生成</strong>—が、
        テンプレート文字列に対してそのまま走ります。<Cmd>{"{{ price * quantity }}"}</Cmd> は「式」として構文解析され AST になり、
        「この式を評価して DOM テキストに書き込む JS」へとコード生成されます。<strong>AOT vs JIT</strong> の対比も、
        「事前コンパイルで実行時コストを消す（＋静的に型検査できる）」か「実行時に翻訳して柔軟性を取る」かという、
        言語処理系で学ぶ古典的トレードオフそのもの。フレームワークが<strong>DSL（ドメイン特化言語）を定義し、それを汎用言語へ
        トランスパイルしている</strong>と捉えると、テンプレートの正体がクリアに見えます。
      </Bridge>

      <Section>制御フロー — @if / @for（と旧構文）</Section>
      <p>
        条件分岐・繰り返しは Angular 17 で導入された<strong>組み込み制御フロー</strong>で書きます。テンプレート内に直接 <Cmd>@if</Cmd> / <Cmd>@for</Cmd> と書け、従来の <Cmd>*ngIf</Cmd> / <Cmd>*ngFor</Cmd> より読みやすく高速です。
      </p>
      <Code lang="html" filename="template">{`@if (user) {
  <p>ようこそ、{{ user.name }} さん</p>
} @else {
  <p>ログインしてください</p>
}

@for (item of items; track item.id) {
  <li>{{ item.label }}</li>
} @empty {
  <li>データがありません</li>
}`}</Code>
      <Callout variant="info" title="track は必須（@for）">
        <Cmd>@for</Cmd> では各要素を識別する <Cmd>track</Cmd> の指定が必須です。これにより Angular はリスト更新時、変わった項目だけを DOM に反映でき、再描画を最小化できます。
      </Callout>
      <SubSection>旧構文（*ngIf / *ngFor）との対応</SubSection>
      <p>既存コードでは構造ディレクティブ形式も広く使われています。読めるようにしておきましょう。</p>
      <Code lang="html" filename="旧構文">{`<!-- 旧: 構造ディレクティブ（* が付く） -->
<p *ngIf="user; else guest">ようこそ {{ user.name }}</p>
<ng-template #guest><p>ログインしてください</p></ng-template>

<li *ngFor="let item of items; trackBy: trackById">{{ item.label }}</li>`}</Code>
      <ComparisonTable
        headers={["処理", "新構文（17+）", "旧構文"]}
        rows={[
          ["条件", <Cmd key="a">@if</Cmd>, <Cmd key="b">*ngIf</Cmd>],
          ["繰り返し", <Cmd key="c">@for</Cmd>, <Cmd key="d">*ngFor</Cmd>],
          ["import", "不要（組み込み）", <span key="e"><Cmd>CommonModule</Cmd> が必要</span>],
        ]}
      />

      <Section>@Input / @Output でコンポーネント間通信</Section>
      <p>
        コンポーネントは親子でデータをやり取りします。<strong>親 → 子</strong>は <Cmd>@Input</Cmd>（プロパティを外から渡す）、<strong>子 → 親</strong>は <Cmd>@Output</Cmd>（イベントを親へ発火）で行います。
      </p>
      <Code lang="typescript" filename="user-card.component.ts">{`import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: \`
    <div class="card">
      <h3>{{ name }}</h3>
      <button (click)="remove.emit(name)">削除</button>
    </div>
  \`,
})
export class UserCardComponent {
  @Input() name = '';                        // 親から受け取る
  @Output() remove = new EventEmitter<string>(); // 親へ通知する
}`}</Code>
      <p>親側では、プロパティバインディングで値を渡し、イベントバインディングで通知を受けます。</p>
      <Code lang="html" filename="親テンプレート">{`<app-user-card
  [name]="user.name"
  (remove)="onRemove($event)">
</app-user-card>`}</Code>
      <Callout variant="tip" title="データは下へ、イベントは上へ">
        <Cmd>@Input</Cmd>（データは親から子へ下る）と <Cmd>@Output</Cmd>（イベントは子から親へ上る）という一方向データフローが Angular の基本設計です。状態の出所を 1 か所に保ちやすく、追跡が容易になります。
      </Callout>

      <Divider />

      <Section>実務での勘所と初学者のつまずき</Section>
      <p>
        Angular は「明示的に宣言する」ことを好むフレームワークです。React や Vue の感覚で書くと
        「なぜ動かない」に遭遇しがちですが、その多くは<strong>宣言し忘れ</strong>が原因です。
      </p>
      <KVList
        items={[
          { key: "imports の宣言漏れ", val: "ngModel なら FormsModule、他コンポーネントを使うならそれ自身。standalone は「使うものを自分で imports に書く」のが原則" },
          { key: "@for の track 忘れ", val: "17+ では track が必須。付けないとビルドエラー。差分更新の識別子なので一意なキーを選ぶ" },
          { key: "テンプレートの型エラー", val: "AOT は綴り間違いや型不一致をビルド時に弾く。エラーは実行前に潰せる利点として捉える" },
          { key: "バインディング記号の混同", val: "[ ]（入力: クラス→DOM）と( )（出力: DOM→クラス）を取り違えやすい。向きで覚える" },
        ]}
      />
      <Callout variant="tip" title="宣言的テンプレートを味方につける">
        Angular のテンプレートは「静的に解析できる」ように設計されています。だからこそ IDE 補完・型チェック・
        未使用検出が強く効きます。「明示的に書かされる」煩わしさは、裏を返せば<strong>ツールが間違いを先回りで教えてくれる</strong>
        という恩恵。大規模でリファクタするときにこの安全網が効いてきます。
      </Callout>

      <KeyPoints
        items={[
          "Angular は TypeScript 前提・Google 製のフルスタック FW。CLI（ng）が開発の中心",
          "コンポーネント = クラス + @Component デコレータ。17+ は standalone が既定で NgModule 不要",
          "バインディングは記号の向きで4種: 補間 {{ }} / プロパティ [ ] / イベント ( ) / 双方向 [(ngModel)]",
          "制御フローは @if / @for（旧: *ngIf / *ngFor）。@for は track 必須で再描画を最小化",
          "コンポーネント間は @Input（親→子）と @Output（子→親）で通信。データは下、イベントは上",
        ]}
      />
    </>
  );
}
