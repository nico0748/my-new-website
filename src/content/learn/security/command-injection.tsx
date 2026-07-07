import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Bridge, Code, Cmd, ComparisonTable, KVList, KeyPoints, Quiz, Divider } from "../../../components/learn/kit";
import { FlowChain } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "command-injection",
  title: "OS コマンドインジェクション",
  description: "アプリが組み立てる OS コマンドに入力を混ぜることで任意コマンドを実行される脆弱性。シェルメタ文字、配列分離（shell=False）、引数インジェクション（CWE-88）を危険な例と安全な例で理解する。",
  domain: "security",
  section: "web-sec",
  order: 6,
  level: "basic",
  tags: ["コマンドインジェクション", "RCE", "シェル", "Webセキュリティ"],
  updated: "2026-07-07",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        <strong>OS コマンドインジェクション</strong>は、アプリが OS のシェルやコマンドを呼び出す際、信頼できない入力を<strong>コマンド文字列にそのまま連結</strong>してしまうことで、攻撃者がシェルのメタ文字を使って任意の OS コマンドをアプリの権限で実行できてしまう脆弱性です。多くの場合、直接 RCE（リモートコード実行）に至るため、危険度は極めて高いカテゴリです。
      </Lead>

      <Callout variant="info" title="この記事の位置づけ">
        原理と防御の考え方を扱います。動作するコマンド連結ペイロードは掲載しません。検証は自分が管理する環境・許可された対象に限ってください。
      </Callout>

      <Section>なぜ起きるのか — シェルがメタ文字を解釈する</Section>
      <p>
        <Cmd>ping</Cmd> の実行、画像変換、アーカイブ展開など、外部コマンドを呼ぶ機能で、入力をコマンド行に文字列連結すると問題が起きます。シェルは <Cmd>;</Cmd> <Cmd>|</Cmd> <Cmd>&&</Cmd> <Cmd>`…`</Cmd> <Cmd>$(…)</Cmd> といった文字を、単なる文字ではなく<strong>コマンドの区切りやコマンド置換</strong>として解釈するからです。攻撃者がこれらを入力に含めると、本来のコマンドに続けて別のコマンドが連結・実行されてしまいます。
      </p>
      <p>
        構図は SQL インジェクションと同じ「<strong>コードとデータの混同</strong>」が、今度はシェルの文脈で起きたものです。SQLi ではシングルクォートがクエリ構造を壊しましたが、ここではシェルメタ文字がコマンド構造を壊します。
      </p>
      <FlowChain
        nodes={[
          { label: "入力", sub: "メタ文字を含む" },
          { label: "アプリ", sub: "コマンド行へ連結", variant: "alt" },
          { label: "シェル", sub: "区切りとして解釈" },
          { label: "任意コマンド実行", sub: "RCE", variant: "cta" },
        ]}
        caption="入力中のシェルメタ文字がコマンド区切りとして解釈され、任意コマンドが実行される"
      />

      <Section>種類</Section>
      <ComparisonTable
        headers={["種類", "特徴", "実行の確認"]}
        rows={[
          ["直接 (In-band)", "コマンド出力が応答に返る", "結果を応答で直接読める"],
          ["ブラインド (Blind)", "出力が返らない", "時間遅延や DNS/HTTP コールバックで実行を確認"],
          ["引数インジェクション (CWE-88)", "コマンド自体は固定だが、入力が追加の引数/オプションとして注入される", "危険なオプションを誘発し挙動を歪める近縁脆弱性"],
        ]}
      />
      <Callout variant="warn" title="配列分離でも引数インジェクションは残り得る">
        後述する「配列でコマンドと引数を分離」しても、<strong>入力がそのまま引数として渡る</strong>場合、攻撃者が入力の先頭に <Cmd>--</Cmd> で始まるオプションを紛れ込ませて挙動を変えられることがあります（CWE-88）。値がオプションと解釈されないよう、<Cmd>--</Cmd>（オプション終端）で区切る、値の形式を厳格に検証する、といった配慮が要ります。
      </Callout>

      <Section>影響</Section>
      <KVList
        items={[
          { key: "完全な RCE", val: "サーバ上で任意のコマンドを実行される" },
          { key: "データの窃取・破壊", val: "情報漏えい、改ざん、サービス停止" },
          { key: "横展開・永続化", val: "内部ネットワークへの侵入拡大や足場の固定化" },
        ]}
      />

      <Section>防御 — そもそもシェルを介さない</Section>
      <SubSection>1. 外部コマンド呼び出し自体を避ける（最優先）</SubSection>
      <p>
        最も確実なのは、OS コマンドを呼ばずに<strong>言語ネイティブの API/ライブラリ</strong>で処理することです。画像変換ならライブラリ関数、ファイル操作なら標準ライブラリ——シェルを経由しなければ、メタ文字を解釈する主体そのものが存在しません。
      </p>
      <SubSection>2. やむを得ないときは配列で分離（shell を介さない）</SubSection>
      <p>
        どうしても外部コマンドが必要なら、<strong>シェルを介さず</strong>、コマンド名と各引数を<strong>配列として分けて</strong>渡します。こうするとメタ文字はシェルに解釈されず、単なる引数の一文字として扱われます。要は「コマンドとデータを最初から分離する」——SQLi のプリペアドステートメントと同じ発想です。
      </p>
      <Code lang="python" filename="危険な書き方（shell=True で連結）">{`# 入力がシェルに解釈され、メタ文字でコマンドが化ける
import subprocess
subprocess.run("ping -c 1 " + host, shell=True)`}</Code>
      <Code lang="python" filename="安全な書き方（配列分離・shell を介さない）">{`# シェルを介さず、コマンドと引数を配列で分離
import subprocess
subprocess.run(["ping", "-c", "1", host])  # shell=False（既定）`}</Code>
      <SubSection>3. 入力検証と隔離を重ねる</SubSection>
      <ul>
        <li><strong>許可リストで厳格に検証</strong> — 数値や列挙値のみを受け付ける。ホスト名なら形式を厳密にチェックする。</li>
        <li><strong>最小権限で実行</strong> — サンドボックスやコンテナで隔離し、万一実行されても被害を封じ込める。</li>
        <li><strong>メタ文字のエスケープは補助</strong> — 本筋は配列分離。エスケープ頼みは抜けが出やすい。</li>
      </ul>

      <Bridge course="オペレーティングシステム / プロセス生成">
        この脆弱性は、OS の授業で習う<strong>プロセス生成</strong>の仕組みを理解すると腑に落ちます。<Cmd>shell=True</Cmd>（あるいは <Cmd>system()</Cmd>）は、いったん<strong>シェルというプログラムを起動</strong>し、そのシェルに文字列を解釈させてから目的のコマンドを起動します。シェルは <Cmd>;</Cmd> や <Cmd>|</Cmd> を「複数プロセスを繋ぐ制御構文」として読むので、そこに攻撃の余地が生まれます。一方、配列でプログラムと引数を直接渡す方式（<Cmd>execve</Cmd> 系）は<strong>シェルを経由しない</strong>ため、引数は解釈されずそのまま新プロセスへ渡ります。「シェルを挟むか否か」というプロセス生成の設計選択が、そのままセキュリティ境界になっているのです。
      </Bridge>

      <Divider />

      <KeyPoints
        items={[
          "根本原因はコードとデータの混同。シェルメタ文字がコマンド構造を壊す",
          "多くが直接 RCE に至るため危険度が極めて高い",
          "最優先はそもそも OS コマンドを避け、ネイティブ API を使うこと",
          "必要なら shell を介さず、コマンドと引数を配列で分離して渡す",
          "引数インジェクション（CWE-88）にも注意し、値の形式を厳格に検証する",
        ]}
      />

      <Quiz
        question="OS コマンドインジェクションを避けるために、外部コマンド実行が避けられない場合に取るべき方法はどれ？"
        options={[
          "入力からセミコロンだけを削除する",
          "シェルを介さず、コマンドと引数を配列で分離して渡す",
          "コマンド全体を一つの文字列に連結して shell=True で渡す",
          "コマンド実行をログに記録する",
        ]}
        answer={1}
        explanation="コマンドと引数を配列で分離し、シェルを介さずに渡せば、メタ文字は解釈されず単なる引数として扱われます。文字削除は抜けが出やすく、shell=True は危険です。"
      />
    </>
  );
}
