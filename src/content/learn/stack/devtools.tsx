import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider, Figure } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "devtools-stack",
  title: "開発ツール / バージョン管理の技術スタック",
  description: "どの開発でも必ず触る土台。Git とホスティング(GitHub/GitLab)、エディタ/IDE、Lint・フォーマッタ、パッケージマネージャ、モノレポまでを俯瞰する。",
  domain: "stack",
  section: "devtools",
  order: 1,
  level: "intro",
  tags: ["Git", "GitHub", "VS Code", "パッケージマネージャ"],
  updated: "2026-07-09",
  minutes: 7,
};

export default function Article() {
  return (
    <>
      <Lead>
        言語やフレームワークの前に、<strong>どの開発でも必ず触る土台</strong>があります。変更を記録する Git、コードを書くエディタ、品質を保つ Lint、依存を入れるパッケージマネージャ。ここを押さえると開発全体が一段スムーズになります。
      </Lead>

      <Section>バージョン管理とホスティング</Section>
      <ComparisonTable
        headers={["ツール", "役割", "特徴"]}
        rows={[
          [<Tech id="git">Git</Tech>, "変更履歴の管理", "分散型 VCS の事実上の標準。ブランチで並行開発"],
          [<Tech id="github">GitHub</Tech>, "ホスティング＋協業", "OSS の中心地。PR・Issue・Actions を統合"],
          [<Tech id="gitlab">GitLab</Tech>, "DevOps プラットフォーム", "自己ホスト・CI 統合に強い"],
        ]}
      />
      <Figure
        src="/learn/shots/stack/devtools-stack-01.svg"
        alt="GitHub のプルリクエスト画面。変更差分とレビューコメント、CI のチェック結果が並んでいる"
        caption="協業の中心はこの画面。差分・レビュー・自動テストが1か所に集まる"
      />

      <Section>エディタ / IDE</Section>
      <ComparisonTable
        headers={["ツール", "特徴"]}
        rows={[
          [<Tech id="vscode">VS Code</Tech>, "軽量・拡張豊富で最も普及。多言語・多用途に対応"],
          [<Tech id="jetbrains">JetBrains</Tech>, "言語特化の高機能 IDE 群（IntelliJ・PyCharm 等）"],
        ]}
      />
      <Figure
        src="/learn/shots/stack/devtools-stack-02.svg"
        alt="VS Code のエディタ画面。拡張機能パネルと、コードに表示された Lint の警告"
        caption="エディタと拡張機能が組み合わさると、書いている最中に問題が指摘される"
      />

      <Section>Lint / フォーマッタ</Section>
      <ComparisonTable
        headers={["ツール", "役割"]}
        rows={[
          [<Tech id="eslint">ESLint</Tech>, "コードの問題を検出（Lint）"],
          [<Tech id="prettier">Prettier</Tech>, "コードを自動整形（フォーマット）"],
          [<Tech id="biome">Biome</Tech>, "Lint と整形を1つで高速に（Rust 製）"],
        ]}
      />
      <Callout variant="info" title="役割分担で覚える">
        <strong>ESLint=問題検出</strong>、<strong>Prettier=整形</strong>と役割が分かれ、両方併用が定番でした。近年は <Tech id="biome">Biome</Tech> がこの2つを1つに統合し高速化しています。
      </Callout>

      <Section>パッケージマネージャ</Section>
      <ComparisonTable
        headers={["言語圏", "代表", "備考"]}
        rows={[
          ["JavaScript", <><Tech id="npm">npm</Tech> / <Tech id="pnpm">pnpm</Tech> / <Tech id="yarn">Yarn</Tech></>, "pnpm は高速・省ディスク"],
          ["Python", <><Tech id="pip">pip</Tech> / <Tech id="poetry">Poetry</Tech> / uv</>, "uv は Rust 製で非常に高速"],
          ["Rust", <Tech id="cargo">Cargo</Tech>, "ビルドと依存管理が一体"],
        ]}
      />

      <Section>モノレポ</Section>
      <p>
        複数のアプリ/ライブラリを1つのリポジトリで扱う「モノレポ」では、<Tech id="turborepo">Turborepo</Tech> や Nx がビルドをキャッシュ・並列化して CI を短縮します。
      </p>

      <Divider />

      <KeyPoints
        items={[
          "Git がバージョン管理の土台。ホスティングは GitHub / GitLab",
          "エディタは VS Code が最普及、言語特化なら JetBrains",
          "ESLint=問題検出・Prettier=整形。Biome は両者を統合",
          "パッケージ管理は npm/pnpm/yarn・pip/poetry/uv・cargo",
          "複数アプリはモノレポ(Turborepo/Nx)でビルドを効率化",
        ]}
      />
    </>
  );
}
