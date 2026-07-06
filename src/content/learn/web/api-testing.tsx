import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, ComparisonTable, KeyPoints, KVList, TipBox, Bridge, Steps, Step, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "api-testing",
  title: "API テスト — Postman / curl / Thunder Client",
  description: "API を叩いて検証する基本ツール。curl の使い方、Postman のコレクションと環境変数、Thunder Client、CI での自動テストまで。",
  domain: "web",
  section: "api",
  order: 10,
  level: "intro",
  tags: ["API", "テスト", "Postman"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        API を作ったら、実際に叩いて「期待どおりに動くか」を確かめます。ここでは定番の 3 ツール — コマンドラインの <strong>curl</strong>、GUI の <strong>Postman</strong>、エディタ内で使う <strong>Thunder Client</strong> — と、CI での自動テストまでを一通り押さえます。
      </Lead>

      <Section>何をテストするのか — テスト設計の考え方</Section>
      <p>
        API テストは「叩いて 200 が返れば OK」ではありません。<strong>正常系</strong>（期待どおりの入力）だけでなく、<strong>異常系</strong>（不正な入力・欠けた必須項目・権限なし）や<strong>境界</strong>（0 件・上限ちょうど・空文字）まで確かめて初めて「動く」と言えます。むやみに全パターンを試すのは非現実的なので、<em>効く入力を絞って選ぶ</em>のがテスト設計です。
      </p>

      <Bridge course="ソフトウェア工学（テスト理論）">
        API テストは、講義で学ぶ<strong>テスト設計技法</strong>がそのまま効く領域です。入力を「同じ結果になるグループ」に分けて代表値だけ試す<strong>同値分割</strong>、境目でバグが出やすいので端を狙う<strong>境界値分析</strong>を使うと、少ないケースで多くの欠陥を捕まえられます。例えば「年齢 1〜120 が有効」なら、代表値 30（有効同値）・0 と 121（無効同値）・境界の 1 と 120 を突く、という設計です。さらに、修正のたびに過去のテストを全部流し直す<strong>回帰テスト</strong>を CI で自動化する、という考え方も授業どおり。「網羅率 100% は不可能だから、リスクの高い入力を賢く選ぶ」という工学的判断が、実務の API テストの中心にあります。
      </Bridge>

      <Section>curl の基礎</Section>
      <p>
        <Cmd>curl</Cmd> はほぼどの環境にも入っているコマンドライン HTTP クライアントです。手早く 1 発叩く、スクリプトに組み込む、といった用途に向きます。まずは <Cmd>GET</Cmd> と <Cmd>POST</Cmd> を覚えれば十分です。
      </p>

      <Code lang="bash" filename="terminal">{`# GET（-i でステータス・ヘッダも表示）
curl -i https://api.example.com/users/1

# ヘッダを付ける（-H）
curl -H "Authorization: Bearer TOKEN" https://api.example.com/me

# POST で JSON を送る（-X メソッド / -d ボディ）
curl -X POST https://api.example.com/users \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Yuma", "age": 20}'`}</Code>

      <SubSection>よく使うオプション</SubSection>
      <ul>
        <li><Cmd>-i</Cmd> — レスポンスヘッダとステータスも表示。</li>
        <li><Cmd>-H</Cmd> — リクエストヘッダを追加（認証・Content-Type など）。</li>
        <li><Cmd>-X</Cmd> — HTTP メソッド指定（<Cmd>POST</Cmd> / <Cmd>PUT</Cmd> / <Cmd>DELETE</Cmd>）。</li>
        <li><Cmd>-d</Cmd> — リクエストボディ。<Cmd>-d</Cmd> を付けると自動で <Cmd>POST</Cmd> になる。</li>
        <li><Cmd>-v</Cmd> — 詳細ログ（通信の中身を見たいデバッグ時）。</li>
      </ul>

      <SubSection>1 つのエンドポイントで確認する観点</SubSection>
      <KVList
        items={[
          { key: "正常系", val: "期待どおりの入力で 200 と正しいボディが返るか" },
          { key: "異常系（入力）", val: "必須欠け・型違い・空文字で 400 が返るか" },
          { key: "認証・認可", val: "トークン無しで 401、権限なしで 403 が返るか" },
          { key: "存在しない", val: "無い ID で 404 が返るか" },
          { key: "境界値", val: "0 件・上限ちょうど・上限+1 の挙動" },
        ]}
      />
      <TipBox>
        テストは「正常系 1 本」で満足しがちですが、バグの多くは異常系と境界に潜みます。1 つの API につき「正常＋主要な異常＋境界」を最低限のセットにすると、費用対効果が高いテストになります。
      </TipBox>

      <Callout variant="tip" title="JSON を見やすく">
        レスポンスの JSON を整形したいときは <Cmd>curl ... | jq</Cmd> のように <Cmd>jq</Cmd> にパイプすると読みやすくなります。
      </Callout>

      <Section>Postman — コレクションと環境変数</Section>
      <p>
        <strong>Postman</strong> は API 開発の定番 GUI クライアントです。curl よりリクエストの管理・共有・自動化に強く、チーム開発で広く使われます。中核となる概念が 2 つあります。
      </p>
      <SubSection>コレクション</SubSection>
      <p>
        関連するリクエストをフォルダのようにまとめた単位が<strong>コレクション</strong>です。「ユーザ API」「注文 API」のように整理し、チームで共有・バージョン管理できます。順に実行して一連のシナリオをテストすることも可能です。
      </p>
      <SubSection>環境変数</SubSection>
      <p>
        ベース URL やトークンを<strong>環境変数</strong>にしておくと、開発・ステージング・本番を切り替えるだけで同じリクエストを使い回せます。URL に <Cmd>{"{{baseUrl}}"}</Cmd> と書けば、選択中の環境の値に展開されます。
      </p>

      <Callout variant="warn" title="秘密情報の共有に注意">
        API キーやトークンをコレクションに直書きして公開共有すると漏洩します。秘密値は個人環境の変数や Secret として扱い、コレクションの export に含めないようにしましょう。
      </Callout>

      <Section>Thunder Client — エディタ内で完結</Section>
      <p>
        <strong>Thunder Client</strong> は VS Code の拡張として動く軽量な API クライアントです。エディタを離れずにリクエストを送れるのが最大の利点で、コードを書きながらそのまま動作確認できます。リクエストをファイルとして保存できるため、Git でリポジトリと一緒に管理しやすい点も実務向きです。
      </p>

      <Section>ツールの使い分け</Section>
      <ComparisonTable
        headers={["ツール", "形態", "強み", "向く場面"]}
        rows={[
          ["curl", "CLI", "軽量・どこでも動く・スクリプト化", "サッと 1 発／CI や shell"],
          ["Postman", "デスクトップ GUI", "コレクション管理・共有・豊富な機能", "チームでの API 開発全般"],
          ["Thunder Client", "VS Code 拡張", "エディタ内完結・Git 管理しやすい", "実装しながらの動作確認"],
        ]}
      />

      <Section>自動テストと CI 連携</Section>
      <p>
        手動で叩くだけでなく、<strong>アサーション（期待値の検証）</strong>を書いて自動テストにできます。Postman ではリクエストごとにテストスクリプトを書け、それを CLI ランナーの <Cmd>newman</Cmd> で実行すれば CI に組み込めます。
      </p>

      <Code lang="javascript" filename="postman-test">{`// Postman のテストタブに書くアサーション例
pm.test("ステータスが 200", () => {
  pm.response.to.have.status(200);
});
pm.test("name が返る", () => {
  const json = pm.response.json();
  pm.expect(json.name).to.eql("Yuma");
});`}</Code>

      <Code lang="yaml" filename=".github/workflows/api-test.yml">{`# GitHub Actions で newman を実行
jobs:
  api-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g newman
      - run: newman run collection.json -e prod.env.json`}</Code>

      <Bridge course="ソフトウェア工学（CI / 回帰テスト）">
        アサーションを書いて CI で回す、という流れは講義の<strong>継続的インテグレーション（CI）と回帰テスト</strong>そのものです。「人間が毎回手で叩く」のは再現性がなく漏れます。テストをコード化してリポジトリに置き、push のたびに自動実行すれば、<strong>過去に直したバグが再発（デグレ）していないか</strong>を機械が毎回チェックしてくれます。テストが green なものだけをマージする、という運用は「壊れた状態を main に入れない」という工学的な品質ゲート。授業で学ぶ「テストは資産であり、書いた分だけ将来の変更が安全になる」が、実務で最も効くのがこの API テスト層です。
      </Bridge>

      <SubSection>手動から自動へ移す手順</SubSection>
      <Steps>
        <Step title="手で叩いて仕様を固める">
          curl や Postman で正常系・異常系を確かめ、期待するステータスとボディを把握する。
        </Step>
        <Step title="アサーションに落とす">
          「200 が返る」「name が一致する」を検証スクリプトとして書き、コレクションやテストファイルに保存する。
        </Step>
        <Step title="CI に組み込む">
          <Cmd>newman</Cmd> やテストランナーを GitHub Actions で実行し、push のたびに自動で回す。
        </Step>
      </Steps>

      <Callout variant="tip" title="curl だけでも自動化できる">
        大掛かりなツールを使わずとも、<Cmd>curl</Cmd> のステータスを見て失敗時に <Cmd>exit 1</Cmd> するシェルスクリプトを CI に置くだけでも、ヘルスチェックや簡易な回帰テストになります。
      </Callout>

      <Callout variant="warn" title="テスト間の依存とデータ汚染に注意">
        「作成テストが作ったデータを、取得テストが前提にする」ように順序へ依存させると、1 本壊れると連鎖して落ち、原因の切り分けが難しくなります。各テストは独立に実行でき、使ったデータは後片付け（クリーンアップ）する設計が理想です。本番 DB を汚さないよう、テスト用環境・環境変数の切り替えも徹底しましょう。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "curl は軽量な CLI。-H でヘッダ、-X でメソッド、-d でボディを送る",
          "Postman はコレクションでリクエストを整理し、環境変数で環境を切り替える",
          "Thunder Client は VS Code 内で完結し、リクエストを Git 管理しやすい",
          "アサーションを書けば自動テスト化でき、newman や curl で CI に組み込める",
        ]}
      />
    </>
  );
}
