import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, Steps, Step, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "typescript-backend",
  title: "TypeScript（サーバーサイド）",
  description: "Node.js/Nest/Express などサーバーサイドで TypeScript を使う利点。型安全な API 実装、tsconfig、JS からの移行を扱う。",
  domain: "web",
  section: "backend",
  order: 1,
  level: "basic",
  tags: ["TypeScript", "Node.js", "型"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        TypeScript は <strong>JavaScript の柔軟さ</strong>に<strong>静的型付け</strong>を足した言語です。フロントエンドで有名ですが、Node.js の普及により <strong>サーバーサイド</strong>でも主役になりました。API のリクエスト/レスポンス、DB のレコード、環境変数 — 「サーバーで扱うデータの形」を型で固定できることが、堅牢なバックエンド開発の土台になります。
      </Lead>

      <Section>なぜサーバーサイドで型が効くのか</Section>
      <p>
        サーバーは複数のクライアントから来る入力を捌き、DB や外部 API とやり取りする「データの交差点」です。ここで型がないと、<Cmd>req.body</Cmd> が <Cmd>any</Cmd> のまま流れ、undefined が本番で初めて露見します。TypeScript はコンパイル時に「この関数はこの形の引数しか受け取らない」という<strong>契約</strong>を強制するため、境界のバグを事前に潰せます。
      </p>
      <ul>
        <li>API の入出力・DB レコード・設定値をすべて型で表現できる</li>
        <li>エディタ補完とリファクタが効き、大規模なコードベースでも安全に変更できる</li>
        <li>最新の ECMAScript 機能（Optional Chaining <Cmd>user?.profile?.name ?? "Guest"</Cmd> 等）がそのまま使える</li>
      </ul>

      <SubSection>「型」とは何を保証するものか</SubSection>
      <p>
        型は「その変数が取りうる値の集合」を表します。<Cmd>number</Cmd> は数値全体の集合、<Cmd>"admin" | "user"</Cmd> は 2 つの文字列だけからなる集合です。関数 <Cmd>(x: A) =&gt; B</Cmd> は「集合 A の任意の値を受け取り、必ず集合 B の値を返す」という<strong>約束</strong>にほかなりません。この約束を型検査器（コンパイラ）が全呼び出し箇所について機械的に確かめてくれるので、人間はテストで拾いきれない組み合わせのバグをコンパイル時に潰せます。
      </p>

      <Bridge course="型理論 / プログラミング言語論">
        「型は値の集合、関数は集合から集合への写像」という見方は、講義で扱う<strong>型システム</strong>や<strong>ラムダ計算</strong>の話そのものです。<Cmd>"admin" | "user"</Cmd> のようなユニオン型は集合の <strong>和</strong>、<Cmd>A &amp; B</Cmd> の交差型は集合の <strong>積</strong>に対応します。座学で「型は健全性（well-typed なプログラムは stuck しない）を保証する」と習った定理が、実務では「型が通ればこの種の実行時エラーは起きない」という日々の安心感として効いてきます。
      </Bridge>

      <Section>Express での型安全な API 実装</Section>
      <p>
        素の Express でも、ハンドラの引数やレスポンスの形に型を付けるだけで安全性が跳ね上がります。ドメインの型（<Cmd>User</Cmd> 等）を 1 か所に定義し、それを層をまたいで使い回すのが基本です。
      </p>

      <Code lang="typescript" filename="src/routes/users.ts">{`import { Router, Request, Response } from "express";

// ドメイン型（DB・API で共有する「契約」）
type User = { id: number; name: string; email: string };
type CreateUserBody = { name: string; email: string };

const router = Router();

router.post(
  "/users",
  (req: Request<{}, User, CreateUserBody>, res: Response<User>) => {
    const { name, email } = req.body; // ← 型付きなので補完が効く
    const user: User = { id: Date.now(), name, email };
    res.status(201).json(user);
  }
);

export default router;`}</Code>

      <Callout variant="tip" title="境界では zod などで実行時検証を">
        型はコンパイル時だけの保証です。外部から来る <Cmd>req.body</Cmd> は実行時に <Cmd>zod</Cmd> 等でパースし、「型 = 検証結果」にすると、コンパイル時と実行時の両方で安全になります。
      </Callout>

      <SubSection>境界で「検証する」と「型が付く」を一致させる</SubSection>
      <p>
        ネットワーク越しに来る JSON は、TypeScript から見れば実行時には <Cmd>any</Cmd> です。型注釈だけ書いても、実際に <Cmd>age</Cmd> が文字列で届いても誰も止めてくれません。そこで<strong>境界（システムの外との接点）で 1 度だけ検証</strong>し、検証を通った後は静的型として信頼する、という設計にします。<Cmd>zod</Cmd> はスキーマから型を自動導出できるので、「検証ルール」と「型」が二重管理になりません。
      </p>

      <Code lang="typescript" filename="src/schemas/user.ts">{`import { z } from "zod";

// 検証ルール（実行時）と型（コンパイル時）を 1 つのスキーマから
export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// スキーマから型を導出（手書きの type と二重管理にならない）
export type CreateUserBody = z.infer<typeof CreateUserSchema>;`}</Code>

      <Code lang="typescript" filename="src/routes/users.ts">{`import { CreateUserSchema } from "../schemas/user";

router.post("/users", (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  // ここから先 parsed.data は CreateUserBody 型として信頼できる
  const { name, email } = parsed.data;
  res.status(201).json({ id: Date.now(), name, email });
});`}</Code>

      <Bridge course="ソフトウェア工学 / 契約による設計">
        API のリクエスト/レスポンス型は、講義で習う<strong>契約による設計（Design by Contract）</strong>の事前条件・事後条件そのものです。「呼び出し側はこの形の入力を保証し、実装側はこの形の出力を保証する」という契約を型で明文化すると、モジュール間の責任境界がはっきりします。境界での検証は、外部入力という<strong>信頼できない値</strong>を、内部で信頼できる不変条件（invariant）へ変換する関所だと考えると設計しやすくなります。
      </Bridge>

      <Section>フレームワークの選択肢</Section>
      <SubSection>Express と Nest の違い</SubSection>
      <p>
        小さく始めるなら Express、チームで規約を揃えて大規模に組むなら Nest というのが典型です。Nest は Angular 風の DI・デコレータ設計を最初から TypeScript 前提で提供します。
      </p>

      <ComparisonTable
        headers={["観点", "Express", "NestJS"]}
        rows={[
          ["設計思想", "ミニマル・自由", "規約重視・フルスタック"],
          ["TypeScript", "型定義を後付け", "TS ファースト（標準）"],
          ["DI / 構造", "自前で用意", "DI コンテナ・モジュール内蔵"],
          ["向き", "小規模・プロトタイプ", "中〜大規模・チーム開発"],
        ]}
      />

      <Section>tsconfig と JS からの移行</Section>
      <p>
        コンパイル設定は <Cmd>tsconfig.json</Cmd> に集約します。サーバーでは <Cmd>strict: true</Cmd> を必ず有効にし、Node の実行対象に合わせて <Cmd>target</Cmd> / <Cmd>module</Cmd> を選びます。
      </p>

      <Code lang="json" filename="tsconfig.json">{`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "allowJs": true
  }
}`}</Code>

      <KVList
        items={[
          { key: "strict", val: "null 安全など厳格チェックの束。サーバーでは必ず true" },
          { key: "target", val: "出力する JS の構文レベル。Node のバージョンに合わせる" },
          { key: "module", val: "モジュール方式（NodeNext / ESNext 等）" },
          { key: "esModuleInterop", val: "CommonJS と ES Modules の相互 import を滑らかに" },
          { key: "outDir", val: "コンパイル済み JS の出力先" },
        ]}
      />

      <p>
        既存の JavaScript プロジェクトからは、<Cmd>allowJs: true</Cmd> で <Cmd>.js</Cmd> と <Cmd>.ts</Cmd> を共存させ、ファイル単位で少しずつ移行できます。ホットなモジュールから型を付けていくのが定石です。
      </p>

      <Section>コンパイラは何をしているのか</Section>
      <p>
        <Cmd>tsc</Cmd> は大きく 3 段階の仕事をします。ソースを<strong>字句解析・構文解析</strong>して抽象構文木（AST）を作り、AST を歩いて<strong>型検査</strong>を行い、最後に型注釈を<strong>剥がして</strong> JavaScript を出力します。ここで重要なのは、TypeScript の型は実行時には一切残らない（type erasure）という点です。実行されるのは素の JavaScript なので、型は「開発時の道具」であって実行時の防御ではありません。だからこそ前述の境界検証が要るわけです。
      </p>

      <Steps>
        <Step title="字句解析・構文解析">
          文字列のソースをトークンに分け、文法規則に沿って AST を組み立てます。ここで文法エラーが検出されます。
        </Step>
        <Step title="型検査">
          AST の各ノードに型を推論・付与し、代入や呼び出しが型の集合として矛盾しないかを確かめます。エディタの赤波線はこの段階の結果です。
        </Step>
        <Step title="出力（emit）">
          型注釈を除去し、<Cmd>target</Cmd> に合わせて構文を変換した JavaScript を <Cmd>dist/</Cmd> に書き出します。
        </Step>
      </Steps>

      <Bridge course="コンパイラ / 言語処理系">
        字句解析 → 構文解析 → AST → 意味解析（型検査）→ コード生成、という流れは<strong>コンパイラの講義</strong>で習うフロントエンド／バックエンドの構成そのものです。TypeScript の型検査は意味解析フェーズにあたり、型注釈を落として JS を吐く emit はコード生成にあたります。「なぜエディタで即座にエラーが出るのか」「なぜ型は実行時に消えるのか」は、コンパイラの各フェーズがどこで何をするかを知っていると腑に落ちます。
      </Bridge>

      <Callout variant="warn" title="よくある落とし穴">
        <ul>
          <li><Cmd>any</Cmd> を安易に使うと型の恩恵が丸ごと消える。分からないときは <Cmd>unknown</Cmd> を使い、絞り込んでから触る</li>
          <li>型（コンパイル時）と実行時の値は別物。<Cmd>as User</Cmd> のキャストは検証ではなく「コンパイラを黙らせる」だけなので過信しない</li>
          <li><Cmd>strict: false</Cmd> のまま進めると <Cmd>null</Cmd> / <Cmd>undefined</Cmd> のチェックが緩み、本番で <Cmd>Cannot read properties of undefined</Cmd> を踏む</li>
        </ul>
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "型は「値の集合」、関数は「集合から集合への写像」。型検査は座学の型システムそのもの",
          "サーバーは「データの交差点」。型で入出力の契約を固定するとバグを事前に潰せる",
          "型は実行時に消える（type erasure）。境界では zod 等で実行時検証し、二重の防御にする",
          "tsc は 字句解析 → 型検査 → emit。コンパイラの各フェーズを知ると挙動が腑に落ちる",
          "Express は型を後付け、NestJS は TS ファースト。tsconfig は strict: true が必須",
        ]}
      />
    </>
  );
}
