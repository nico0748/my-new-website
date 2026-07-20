import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Code, Cmd, ComparisonTable, KeyPoints, Bridge, Quiz, Divider, Figure } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "reactive-forms",
  title: "リアクティブフォームで入力を扱う",
  description: "テンプレート駆動フォームとリアクティブフォームを対比し、FormGroup / FormControl（FormBuilder）で新規タスク作成フォームを構築。Validators でのバリデーション、エラー表示、valueChanges（Observable）まで。React の制御コンポーネントと対比する。",
  domain: "angular-practice",
  section: "forms-http",
  order: 2,
  level: "practice",
  tags: ["Angular", "フォーム", "バリデーション"],
  updated: "2026-07-07",
  minutes: 13,
};

export default function Article() {
  return (
    <>
      <Lead>
        TaskFlow の新規作成画面は「入力を受け取り、検証し、送信する」フォームです。Angular には 2 つのフォーム流儀があり、
        実務で主流なのは<strong>リアクティブフォーム（モデル駆動）</strong>。フォームの状態を TypeScript 側の<strong>オブジェクトとして持つ</strong>ため、
        バリデーションや入力監視をコードで明示的に扱えます。<Cmd>NewTaskComponent</Cmd> を組み立てながら見ていきます。
      </Lead>

      <Section>2 つのフォーム — テンプレート駆動 vs リアクティブ</Section>
      <p>
        Angular のフォームには<strong>テンプレート駆動</strong>と<strong>リアクティブ</strong>があります。前者は HTML 側の
        <Cmd>ngModel</Cmd> に状態を委ね、後者はコンポーネント側に <Cmd>FormGroup</Cmd> という<strong>モデル</strong>を定義して制御します。
      </p>
      <ComparisonTable
        headers={["観点", "テンプレート駆動", "リアクティブ（推奨）"]}
        rows={[
          ["状態の置き場所", "テンプレート（ngModel）", "コンポーネント（FormGroup）"],
          ["import", <Cmd>FormsModule</Cmd>, <Cmd>ReactiveFormsModule</Cmd>],
          ["書き方", "宣言的・少コードで簡単", "明示的・コードで完全に制御"],
          ["バリデーション", "テンプレートに属性で書く", "Validators を TS 側で組む"],
          ["入力監視・複雑な検証", "苦手", <>得意（<Cmd>valueChanges</Cmd> 等）</>],
          ["向く規模", "小さな単純フォーム", "中〜大・動的・テスト重視"],
        ]}
      />
      <Callout variant="tip" title="実務ではリアクティブが基本">
        小さなフォームならテンプレート駆動でも十分ですが、<strong>入力監視・条件付きバリデーション・動的な項目追加・テスト</strong>が絡む
        実アプリではリアクティブが扱いやすく、Angular の公式ドキュメントでも大規模向けに推奨されています。TaskFlow もリアクティブで作ります。
      </Callout>

      <Section>ReactiveFormsModule を imports する</Section>
      <p>
        standalone コンポーネントでは、フォーム用のディレクティブを使うために <Cmd>ReactiveFormsModule</Cmd> を
        コンポーネントの <Cmd>imports</Cmd> に加えます（NgModule ではなくコンポーネント直下に書くのが 2025 標準）。
      </p>
      <Code lang="ts" filename="new-task.component.ts（imports）">{`import { Component } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-new-task",
  standalone: true,
  imports: [ReactiveFormsModule],   // これで formGroup / formControlName が使える
  templateUrl: "./new-task.component.html",
})
export class NewTaskComponent { /* ... */ }`}</Code>

      <Section>FormGroup / FormControl でモデルを定義する</Section>
      <p>
        フォーム全体を <Cmd>FormGroup</Cmd>、各入力欄を <Cmd>FormControl</Cmd> で表します。第 2 引数に <Cmd>Validators</Cmd> を渡して
        検証ルールを付けます。ここでは <Cmd>required</Cmd>（必須）と <Cmd>minLength</Cmd>（最小文字数）を使います。
      </p>
      <Code lang="ts" filename="FormControl を直接組む">{`import { FormGroup, FormControl, Validators } from "@angular/forms";

form = new FormGroup({
  title: new FormControl("", [Validators.required, Validators.minLength(3)]),
  done: new FormControl(false),
});`}</Code>
      <p>
        項目が増えると冗長なので、実務では <Cmd>FormBuilder</Cmd> を <Cmd>inject()</Cmd> して簡潔に書くのが一般的です。
      </p>
      <Code lang="ts" filename="FormBuilder で簡潔に">{`import { inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

private fb = inject(FormBuilder);

form = this.fb.group({
  title: ["", [Validators.required, Validators.minLength(3)]],
  done: [false],
});`}</Code>

      <Section>テンプレートとつなぐ</Section>
      <p>
        テンプレート側では、フォーム要素に <Cmd>[formGroup]="form"</Cmd> を、各入力欄に <Cmd>formControlName="title"</Cmd> を付けて
        モデルと結びつけます。<Cmd>[(ngModel)]</Cmd> は使いません——状態はあくまで <Cmd>form</Cmd>（モデル）が持ちます。
      </p>
      <Code lang="html" filename="new-task.component.html">{`<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <label for="title">タイトル</label>
  <input id="title" type="text" formControlName="title" />

  <!-- エラー表示：無効 かつ 一度触れた（touched）ときだけ出す -->
  @if (form.get('title')?.invalid && form.get('title')?.touched) {
    <p class="error">
      @if (form.get('title')?.errors?.['required']) {
        タイトルは必須です。
      }
      @if (form.get('title')?.errors?.['minlength']) {
        3 文字以上で入力してください。
      }
    </p>
  }

  <!-- 無効なら送信ボタンを無効化 -->
  <button type="submit" [disabled]="form.invalid">追加</button>
</form>`}</Code>
      <Figure
        src="/learn/shots/angular-practice/reactive-forms-01.svg"
        alt="タイトル欄を空のまま離れたフォーム画面。タイトルは必須ですのエラーが赤字で表示され、追加ボタンが無効になっている"
        caption="入力欄に触れて離れると（touched）エラーが出て、無効な間は追加ボタンが押せない"
      />
      <Callout variant="warn" title="touched を条件に入れる理由">
        <Cmd>form.get('title')?.invalid</Cmd> だけを条件にすると、<strong>初期表示の時点でエラーが出っぱなし</strong>になります。
        <Cmd>touched</Cmd>（ユーザーが一度その欄にフォーカスして離れた）を組み合わせることで、<strong>操作した後にだけ</strong>エラーを見せられます。
      </Callout>

      <Section>送信 — form.value と form.valid</Section>
      <p>
        送信時は、まず <Cmd>form.valid</Cmd> で全体の妥当性を確認し、有効なら <Cmd>form.value</Cmd>（現在の入力値オブジェクト）を
        サービスに渡します。無効なら <Cmd>markAllAsTouched()</Cmd> で全エラーを表示させます。
      </p>
      <Code lang="ts" filename="onSubmit()">{`onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();   // 未操作の欄もエラー表示させる
    return;
  }
  const value = this.form.value;    // { title: "...", done: false }
  this.taskService.createTask(value.title!).subscribe(() => {
    this.form.reset();              // 送信後は初期状態へ戻す
  });
}`}</Code>

      <Section>入力の一巡 — 状態機械として</Section>
      <p>
        リアクティブフォームは、各コントロールが <Cmd>pristine/dirty</Cmd>・<Cmd>untouched/touched</Cmd>・<Cmd>valid/invalid</Cmd> といった
        <strong>状態</strong>を持つ小さな状態機械です。ユーザー操作でこれらが遷移し、UI がそれに反応します。
      </p>
      <FlowChain
        nodes={[
          { label: "入力", sub: "formControlName", variant: "alt" },
          { label: "モデル更新", sub: "form.value" },
          { label: "検証", sub: "Validators" },
          { label: "送信", sub: "valid なら POST", variant: "cta" },
        ]}
        caption="入力 → モデルへ反映 → Validators で検証 → valid なら送信、の一巡"
      />

      <Section>valueChanges は Observable</Section>
      <p>
        フォーム（や個々のコントロール）の <Cmd>valueChanges</Cmd> は、値が変わるたびに新しい値を流す <strong>Observable</strong> です。
        入力監視・自動保存・入力に応じた候補取得などを、HttpClient と同じ RxJS の作法で書けます。
      </p>
      <Code lang="ts" filename="入力を監視する">{`import { debounceTime } from "rxjs";

ngOnInit() {
  this.form.get("title")!.valueChanges
    .pipe(debounceTime(300))   // 入力が落ち着いてから
    .subscribe((title) => {
      console.log("入力中:", title);   // 例: 下書き保存・候補検索など
    });
}`}</Code>
      <Figure
        src="/learn/shots/angular-practice/reactive-forms-02.svg"
        alt="DevTools の Console タブ。debounceTime により入力が落ち着いたタイミングだけログが出力されている"
        caption="Console で見ると、1 文字ごとではなく入力が止まってからログが出るのが分かる"
      />
      <Callout variant="info" title="フォームと HTTP が同じ流儀でつながる">
        <Cmd>valueChanges</Cmd> が Observable なので、前章の HttpClient とシームレスにつながります。たとえば
        <Cmd>valueChanges.pipe(debounceTime(300), switchMap(q =&gt; api.search(q)))</Cmd> と書けば「入力するたびに検索 API を叩き、
        古い結果は自動でキャンセルする」インクリメンタルサーチが数行で書けます。フォームと通信が<strong>同じ RxJS の語彙</strong>で統一されるのが Angular の強みです。
      </Callout>

      <Section>NewTaskComponent 全体</Section>
      <p>ここまでを 1 つにまとめた、新規タスク作成コンポーネントの実例です。</p>
      <Code lang="ts" filename="src/app/new-task.component.ts">{`import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TaskService } from "./task.service";

@Component({
  selector: "app-new-task",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./new-task.component.html",
})
export class NewTaskComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private router = inject(Router);

  form = this.fb.group({
    title: ["", [Validators.required, Validators.minLength(3)]],
    done: [false],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.taskService.createTask(this.form.value.title!).subscribe(() => {
      this.form.reset();
      this.router.navigate(["/tasks"]);   // 一覧へ戻る
    });
  }
}`}</Code>

      <Bridge course="ソフトウェア工学／オートマトン（宣言的フォーム・状態機械）">
        リアクティブフォームは、各コントロールを <strong>状態機械（オートマトン）</strong>として捉える設計です。
        <Cmd>pristine→dirty</Cmd>・<Cmd>untouched→touched</Cmd>・<Cmd>valid⇄invalid</Cmd> という状態遷移を、UI とは独立した
        <strong>モデル</strong>として持つことで、「表示（テンプレート）」と「状態・検証（TypeScript）」の<strong>関心を分離</strong>できます。
        <Cmd>Validators</Cmd> は入力に対する<strong>述語（真偽を返す制約）</strong>で、フォームの妥当性は各制約の論理積として定義されます。
        <Cmd>valueChanges</Cmd> を Observable にすることで、入力を<strong>イベントストリーム</strong>として宣言的に合成でき、
        命令的な onChange 処理の積み重ねを避けられます。
      </Bridge>

      <Section>React（制御コンポーネント）との対比</Section>
      <ComparisonTable
        headers={["観点", "React（制御コンポーネント）", "Angular（リアクティブフォーム）"]}
        rows={[
          ["状態", "useState で1項目ずつ持つ", "FormGroup が全体を1つのモデルで保持"],
          ["値の反映", <Cmd>value + onChange</Cmd>, <><Cmd>formControlName</Cmd> が双方向に橋渡し</>],
          ["検証", "自前 or zod/RHF 等のライブラリ", <><Cmd>Validators</Cmd> が標準で付属</>],
          ["エラー状態", "自分で touched 等を管理", "control が touched/dirty を自動保持"],
          ["入力監視", "onChange / useEffect", <><Cmd>valueChanges</Cmd>（Observable）</>],
        ]}
      />
      <Callout variant="tip" title="標準で完結するのが Angular 流">
        React では制御コンポーネント＋React Hook Form / zod などを組み合わせるのが定番ですが、Angular は
        <strong>フォーム状態・検証・入力監視が標準機能</strong>としてフレームワークに組み込まれています。追加ライブラリなしで
        「モデル・検証・エラー表示・監視」が一式そろうのが特徴です。
      </Callout>

      <Quiz
        question="タイトル欄が空のまま送信ボタンを押したのに、エラーメッセージが表示されません。テンプレートの条件は「invalid && touched」です。最も適切な修正は？"
        options={[
          <>onSubmit で form.markAllAsTouched() を呼んでから return する</>,
          <>Validators.required を外す</>,
          <>formControlName を ngModel に変える</>,
          <>[formGroup] を削除する</>,
        ]}
        answer={0}
        explanation={<>未操作の欄は <Cmd>touched</Cmd> が false のままなので、「invalid かつ touched」の条件に引っかからずエラーが出ません。送信時に <Cmd>markAllAsTouched()</Cmd> で全コントロールを touched 扱いにすれば、未入力欄のエラーもまとめて表示されます。ほかの選択肢は検証やモデル結合を壊してしまいます。</>}
      />

      <Divider />

      <KeyPoints
        items={[
          "リアクティブフォームは状態をコンポーネント側の FormGroup（モデル）で持つ（テンプレート駆動との違い）",
          "ReactiveFormsModule を imports し、[formGroup] と formControlName でモデルと結ぶ",
          "FormBuilder.group() で簡潔に定義、Validators.required / minLength で検証",
          "エラー表示は invalid && touched を条件に。送信時は markAllAsTouched() で漏れなく表示",
          "送信は form.valid を確認し form.value を使う。送信後は form.reset()",
          "valueChanges は Observable。debounceTime / switchMap で HttpClient とつなぎ入力監視できる",
        ]}
      />
    </>
  );
}
