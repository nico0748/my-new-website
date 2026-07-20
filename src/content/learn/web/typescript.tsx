import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KVList, ComparisonTable, KeyPoints, Bridge, TipBox, Figure, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "typescript",
  title: "TypeScript の特徴",
  description: "JavaScript に型を加える TypeScript。静的型付けの利点、JS との違い、主な型、tsconfig、React との相性までフロントエンド目線で。",
  domain: "web",
  section: "frontend",
  order: 6,
  level: "basic",
  tags: ["TypeScript", "型", "フロントエンド"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        TypeScript は、JavaScript の柔軟さと最新の開発体験に<strong>静的な型付け</strong>を加えた言語です。
        Microsoft が 2012 年に公開し、JavaScript（ESNext）をベースに拡張。コンパイルすると素の JavaScript になるため、
        既存の JS 資産をそのまま活かしながら段階的に導入できます。フロントエンド開発では、いまや事実上の標準です。
      </Lead>

      <Section>TypeScript の 5 つの特徴</Section>
      <ul>
        <li><strong>静的型付け</strong> — 変数や関数の型をコンパイル時にチェックし、実行前にバグを検出できる。</li>
        <li><strong>優れたツールサポート</strong> — エディタの補完・型チェック・安全なリファクタリングが効く。</li>
        <li><strong>大規模開発に強い</strong> — 型が「関数やモジュール間の契約」として機能し、変更の影響範囲が追える。</li>
        <li><strong>最新 JS 機能に対応</strong> — Optional Chaining や Nullish 合体など新しい構文もサポート。</li>
        <li><strong>柔軟性</strong> — 既存の JavaScript を流用でき、プロジェクトへ少しずつ導入できる。</li>
      </ul>

      <Code lang="ts" filename="features.ts">{`// 静的型付け — 実行前にエラーになる
let age: number = 25;
age = "25"; // ← 型エラー（number に string は代入不可）

// 最新 JS 機能（Optional Chaining ＋ Nullish 合体）
const name = user?.profile?.name ?? "Guest";`}</Code>

      <Figure src="/learn/shots/web/typescript-01.svg" alt="エディタで型エラーの赤波線とツールチップが表示されている様子" caption="実行するまでもなく、書いた瞬間にエディタが誤りを指摘してくれる" />

      <Section>JavaScript との違い</Section>
      <p>
        素の JavaScript では、型の取り違えは<strong>実行して初めて</strong>気づくことが多く、しかも本番で顕在化しがちです。
        TypeScript は変数の型・関数の引数・オブジェクトの形いずれについても<strong>コンパイル時</strong>に誤りを検出します。
        「動かす前に間違いが分かる」ことが、開発体験を大きく変えます。
      </p>
      <p>
        この違いの正体は、講義で学ぶ<strong>「静的型付け」対「動的型付け」</strong>の対比そのものです。
        動的型付け言語（JavaScript）は値に型を持たせ、実行時にその都度型を確かめます。
        静的型付け言語（TypeScript）は変数や式に型を割り当て、プログラムを走らせる<strong>前</strong>に
        「この式にこの値は入りうるか」を<strong>型検査（type checking）</strong>で数学的に検証します。
        バグの発見コストは、遅れれば遅れるほど跳ね上がる（本番で見つかると最悪）ため、
        検査を「実行前」に前倒しできること自体が大きな実務的価値になります。
      </p>

      <Bridge course="型理論 / プログラミング言語論">
        「静的型付けは実行前に型検査で誤りを弾く」という座学の主張が、そのまま
        <strong>本番障害の予防</strong>という実務の利益に直結します。型検査器は、講義で扱う
        <strong>型付け規則（typing rules）</strong>に沿って「式 <Cmd>e</Cmd> は型 <Cmd>T</Cmd> を持つ」を機械的に導出し、
        矛盾があればコンパイルを止めます。<Cmd>age = "25"</Cmd> が弾かれるのは、<Cmd>number</Cmd> の変数に
        <Cmd>string</Cmd> は代入できないという規則に反するからです。健全性（well-typed なら実行時型エラーは起きない）は
        完全ではない（<Cmd>any</Cmd> や外部境界で穴が空く）ものの、実務ではその近似で十分な効果が出ます。
      </Bridge>

      <Section>主な型</Section>
      <p>基本型に加え、配列・タプル・列挙型、そして <Cmd>any</Cmd> / <Cmd>unknown</Cmd> のような特殊な型があります。</p>
      <KVList
        items={[
          { key: "基本型", val: "string / number / boolean / null・undefined" },
          { key: "配列・タプル", val: "number[]（配列）／[string, number]（タプル）" },
          { key: "列挙・特殊", val: "enum / any / unknown / void / never" },
        ]}
      />
      <p>オブジェクトの形は <Cmd>type</Cmd>（や <Cmd>interface</Cmd>）で定義します。<Cmd>?</Cmd> を付けると省略可能なプロパティになります。</p>

      <Code lang="ts" filename="types.ts">{`type User = {
  id: number;
  name: string;
  age?: number;      // 省略可
  roles: string[];
};`}</Code>

      <SubSection>型推論 — 全部に型を書かなくてよい</SubSection>
      <p>
        TypeScript はすべての型を明示しなくても、右辺や文脈から型を<strong>自動で割り当てます</strong>。これが
        <strong>型推論（type inference）</strong>です。講義では「型注釈が無い箇所の型を、制約を集めて解く」問題として学びますが、
        実務ではこのおかげで注釈の記述量を抑えつつ、型の恩恵はしっかり受けられます。
      </p>

      <Code lang="ts" filename="inference.ts">{`const n = 42;            // n は number と推論される
const list = [1, 2, 3];  // number[] と推論
const doubled = list.map((x) => x * 2); // x: number も推論`}</Code>

      <Callout variant="tip" title="推論に任せる／注釈で固定する">
        ローカル変数は推論に任せ、<strong>関数の引数・戻り値・公開 API の境界</strong>は明示的に注釈するのが定石です。
        境界の型を固定すると「契約」がはっきりし、内部を後から変えても呼び出し側が壊れにくくなります。
      </Callout>

      <SubSection>ユニオン型と絞り込み（narrowing）</SubSection>
      <p>
        「文字列または数値」のように複数の型を許すのが<strong>ユニオン型</strong>です。
        使う直前に <Cmd>typeof</Cmd> などで分岐すると、その枝の中では型が 1 つに<strong>絞り込まれ</strong>、
        安全にメソッドを呼べます。座学の「値がどの型かで場合分けする」考え方が、そのままコードの形になります。
      </p>

      <Code lang="ts" filename="narrow.ts">{`function format(v: string | number): string {
  if (typeof v === "number") return v.toFixed(2); // ここでは number
  return v.trim();                                 // ここでは string
}`}</Code>

      <Section>コンパイルと tsconfig.json</Section>
      <p>
        <Cmd>.ts</Cmd> / <Cmd>.tsx</Cmd> は <Cmd>tsc</Cmd>（TypeScript コンパイラ）で <Cmd>.js</Cmd> に変換され、ブラウザや Node.js で実行されます。
        コンパイルの挙動は <Cmd>tsconfig.json</Cmd> で設定します。
      </p>

      <Code lang="json" filename="tsconfig.json">{`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  }
}`}</Code>

      <SubSection>「型検査」と「変換」は別の仕事</SubSection>
      <p>
        コンパイラ講義の枠組みで言うと、<Cmd>tsc</Cmd> は 2 つの仕事をしています。1 つは
        <strong>型検査</strong>（意味解析。型付け規則に反していないか）。もう 1 つは
        <strong>トランスパイル</strong>（新しい構文 → 古い構文への変換。<Cmd>target</Cmd> が変換先の言語水準を決める）です。
        重要なのは、生成後の <Cmd>.js</Cmd> には<strong>型が一切残らない</strong>点です。これを
        <strong>型消去（type erasure）</strong>と呼び、型はあくまで「コンパイル時だけの検査情報」だと分かります。
      </p>

      <Code lang="ts" filename="erasure.ts">{`const age: number = 25; // ← .js に変換すると型注釈は消える
// 出力: const age = 25;`}</Code>

      <Bridge course="コンパイラ / プログラミング言語論">
        <Cmd>tsc</Cmd> は講義で学ぶ<strong>字句解析 → 構文解析 → 意味解析（型検査）→ コード生成</strong>という
        コンパイラの標準パイプラインそのものです。TypeScript ではコード生成が「機械語」ではなく「別のより低い水準の JS」に
        なる点だけが違い、これを<strong>トランスパイラ</strong>（source-to-source compiler）と呼びます。
        型が実行時に残らない<strong>型消去</strong>は、「型は意味解析の道具であって実行時の存在ではない」という
        座学の理解を裏付けます。だからこそ、<Cmd>typeof</Cmd> で実行時に判定できるのは JS が持つ値の型だけで、
        <Cmd>interface</Cmd> を <Cmd>instanceof</Cmd> で判定することはできません（消えているため）。
      </Bridge>

      <Callout variant="warn" title="strict は最初から有効に">
        <Cmd>strict: true</Cmd> は厳格な型チェックをまとめて有効にします。後から有効化すると大量のエラーが噴出しがちなので、
        新規プロジェクトでは最初からオンにしておくのが定石です。
      </Callout>

      <Section>React・フロントエンドとの相性</Section>
      <p>
        TypeScript の真価はフロントエンドで際立ちます。React では <Cmd>.tsx</Cmd> ファイルで
        <strong>Props・State・API レスポンス</strong>に型を付けられ、渡し忘れや型の取り違えをコンパイル時に潰せます。
      </p>

      <Code lang="tsx" filename="Button.tsx">{`type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

function Button({ label, onClick, disabled }: Props) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>;
}
// <Button label="送信" /> ← onClick 未指定でコンパイルエラー`}</Code>

      <ComparisonTable
        headers={["観点", "JavaScript", "TypeScript"]}
        rows={[
          ["型チェック", "実行時に発覚", "コンパイル時に検出"],
          ["Props の渡し忘れ", "気づきにくい", "エラーで即分かる"],
          ["エディタ補完", "限定的", "型情報で強力"],
          ["大規模開発", "壊れやすい", "型が契約になり安全"],
        ]}
      />

      <SubSection>段階的な導入</SubSection>
      <p>
        既存の JS プロジェクトへは、tsconfig の <Cmd>allowJs</Cmd> を有効にしたり、JS ファイルの先頭に <Cmd>{"// @ts-check"}</Cmd> を書いたりして
        一部から少しずつ型チェックを効かせられます。「全部書き換える」必要はありません。
      </p>

      <Section>実務でハマる落とし穴</Section>
      <p>
        型システムは強力ですが、境界を越えるところ（外部 API・<Cmd>any</Cmd>・型アサーション）で健全性が崩れます。
        講義で言う「健全性（soundness）は仮定が守られて初めて保証される」の実例です。
      </p>

      <KVList
        items={[
          { key: "any の伝播", val: "any は型検査を無効化し、周囲へ静かに広がる。unknown で受けて narrowing する方が安全" },
          { key: "as による断言", val: "value as User は「私が保証する」の意。実体と食い違うと実行時に破綻する" },
          { key: "外部データの過信", val: "fetch の JSON は実行時には型が無い。境界で zod 等で検証してから型付けする" },
        ]}
      />

      <Callout variant="danger" title="as は型検査の外し方であって修正ではない">
        <Cmd>as</Cmd>（型アサーション）はコンパイラの検査を黙らせるだけで、実際の値を変えません。
        API レスポンスを <Cmd>as User</Cmd> と断言すると、フィールドが欠けていてもコンパイルは通り、
        実行時に <Cmd>undefined</Cmd> 参照でクラッシュします。境界では実行時バリデーションと組み合わせるのが鉄則です。
      </Callout>

      <TipBox>
        「型が通った＝正しく動く」ではありません。型は<strong>型の整合性</strong>を保証するだけで、ロジックの正しさや
        実行時に流れ込む外部データの妥当性までは保証しません。型検査とテストは役割が異なる、と押さえておきましょう。
      </TipBox>

      <Divider />

      <KeyPoints
        items={[
          "TypeScript は JS＋静的型付け。コンパイルすると素の JS になる",
          "静的型付けは実行前に型検査で誤りを弾く。型付け規則に沿った意味解析そのもの",
          "型推論で注釈を省け、ユニオン型＋narrowing で場合分けを型安全に書ける",
          "tsc は型検査とトランスパイルの2役。型消去で .js に型は残らない",
          "React では Props/State/API レスポンスの型安全化で真価を発揮する",
          "any / as / 外部データは健全性の穴。境界では実行時検証と併用する",
        ]}
      />
    </>
  );
}
