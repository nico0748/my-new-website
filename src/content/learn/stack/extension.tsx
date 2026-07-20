import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, Cmd, ComparisonTable, KeyPoints, Divider, Figure } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "extension-stack",
  title: "拡張機能開発の技術スタック",
  description: "ブラウザ拡張・エディタ拡張・アプリ連携など『既存アプリを拡張する』開発の代表スタック。Chrome 拡張の構成要素（Manifest V3）や VS Code 拡張などを俯瞰する。",
  domain: "stack",
  section: "extension",
  order: 1,
  level: "intro",
  tags: ["拡張機能", "Chrome拡張", "VS Code", "プラグイン"],
  updated: "2026-07-09",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        拡張機能開発は、ゼロからアプリを作るのではなく<strong>既存の大きなアプリ（ブラウザ・エディタ・チャットツール）に機能を足す</strong>開発です。土台のアプリが提供する API の上で動くため、少ないコードで実用的なものを作れるのが魅力です。
      </Lead>

      <Section>代表的な拡張のプラットフォーム</Section>
      <ComparisonTable
        headers={["対象", "言語", "配布先", "特徴"]}
        rows={[
          [<Tech id="chrome-extension">ブラウザ拡張（Chrome/Edge/Firefox）</Tech>, "HTML/CSS/JS(TS)", "各ブラウザのストア", "Web 技術で作れる。Manifest V3 が現行仕様"],
          [<Tech id="vscode-extension">VS Code 拡張</Tech>, "TypeScript", "Visual Studio Marketplace", "エディタ機能を追加。開発者向けツールの定番"],
          ["Figma プラグイン", "TypeScript + Web UI", "Figma Community", "デザイン作業の自動化"],
          ["Slack / Discord アプリ", "任意（API 経由）", "各プラットフォーム", "ボット・スラッシュコマンド・通知連携"],
          ["Raycast / Alfred", "TS / Script", "各ストア", "ランチャーにコマンドを追加（macOS）"],
        ]}
      />

      <Section>ブラウザ拡張の構成要素（Chrome の例）</Section>
      <ComparisonTable
        headers={["要素", "役割"]}
        rows={[
          [<Cmd>manifest.json</Cmd>, "拡張の設定・権限・エントリポイントを宣言（Manifest V3）"],
          ["Service Worker（background）", "バックグラウンド処理・イベント待受"],
          ["Content Script", "開いている Web ページに JS を注入して DOM を操作"],
          ["Popup / Options", "ツールバーアイコンの UI・設定画面"],
        ]}
      />
      <Figure
        src="/learn/shots/stack/extension-stack-01.svg"
        alt="Chrome の拡張機能管理画面。デベロッパーモードを ON にして、未パッケージの拡張機能を読み込んだ状態"
        caption="開発中の拡張は、この画面からフォルダを指定して読み込んで動かす"
      />
      <Callout variant="warn" title="権限は最小限に">
        拡張機能は「閲覧中のページの内容を読む」など強い権限を要求できます。ユーザーの信頼とストア審査の観点から、<Cmd>permissions</Cmd> は<strong>本当に必要なものだけ</strong>宣言するのが鉄則です。過剰な権限は審査で弾かれる原因にもなります。
      </Callout>

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>Web ページの操作・情報収集を自動化</strong> → ブラウザ拡張</li>
        <li><strong>開発体験を良くするツール</strong> → VS Code 拡張</li>
        <li><strong>チーム業務の通知・連携</strong> → Slack / Discord アプリ</li>
        <li><strong>まず Web 技術から入りたい</strong> → ブラウザ拡張がもっとも学習資料が豊富</li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "拡張機能は『既存アプリに機能を足す』開発。少コードで実用的",
          "ブラウザ拡張は Web 技術で作れ、現行は Manifest V3",
          "Chrome 拡張は manifest / Service Worker / Content Script / Popup で構成",
          "VS Code 拡張(TS)は開発者向けツールの定番",
          "権限は最小限に宣言する。過剰な権限は審査で弾かれる",
        ]}
      />
    </>
  );
}
