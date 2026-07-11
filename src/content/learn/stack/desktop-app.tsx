import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "desktop-app-stack",
  title: "デスクトップアプリ開発の技術スタック",
  description: "Windows / macOS / Linux で動くデスクトップアプリの代表スタック。Web 技術で作る Electron / Tauri と、ネイティブ・クロスプラットフォーム GUI の違いと選び方を俯瞰する。",
  domain: "stack",
  section: "desktop-app",
  order: 1,
  level: "intro",
  tags: ["デスクトップ", "Electron", "Tauri", "GUI"],
  updated: "2026-07-09",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        デスクトップアプリは「Web 技術（HTML/CSS/JS）で作る」か「各 OS のネイティブ GUI で作る」かで大きく分かれます。前者は Web 開発の知識をそのまま活かせるため、近年の主流になっています。
      </Lead>

      <Section>Web 技術で作る</Section>
      <ComparisonTable
        headers={["フレームワーク", "言語", "実行の仕組み", "特徴"]}
        rows={[
          [<Tech id="electron">Electron</Tech>, "JavaScript / TypeScript", "Chromium + Node.js を同梱", "VS Code・Slack 等の実績多数。配布サイズは大きめ"],
          [<Tech id="tauri">Tauri</Tech>, "Rust + Web フロント", "OS 標準の WebView を使う", "軽量・省メモリ。バイナリが小さくセキュア"],
        ]}
      />
      <Callout variant="info" title="Electron と Tauri の分かれ目">
        Electron は Chromium を丸ごと同梱するため<strong>どの OS でも表示が均一</strong>ですが、その分アプリが重くなります。Tauri は OS 標準の WebView を使うので<strong>軽い</strong>反面、OS 間の表示差に注意が必要です。「実績・均一性」なら Electron、「軽さ・省リソース」なら Tauri が目安です。
      </Callout>

      <Section>ネイティブ / クロスプラットフォーム GUI</Section>
      <ComparisonTable
        headers={["技術", "言語", "対象", "特徴"]}
        rows={[
          [".NET (WPF / WinUI)", "C#", "Windows 中心", "Windows 業務アプリの定番"],
          [<Tech id="qt">Qt</Tech>, "C++（Python も可）", "Win/mac/Linux", "高性能・組込みでも使われる老舗 GUI"],
          ["SwiftUI (macOS)", <Tech id="swift">Swift</Tech>, "macOS", "Apple 純正。macOS らしい UI を作れる"],
          [<><Tech id="flutter">Flutter</Tech> Desktop</>, "Dart", "Win/mac/Linux", "モバイルと同じコードでデスクトップも"],
        ]}
      />

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>Web の知識を活かして素早く作る</strong> → Electron / Tauri</li>
        <li><strong>軽さ・セキュリティ・小さい配布物</strong> → Tauri</li>
        <li><strong>Windows 中心の業務アプリ</strong> → .NET（WPF / WinUI）</li>
        <li><strong>高い描画性能や既存 C++ 資産</strong> → Qt</li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "近年は Web 技術（Electron / Tauri）で作るのが主流",
          "Electron は表示が均一だが重い、Tauri は軽いが OS 差に注意",
          "Windows 業務は .NET(WPF/WinUI)、高性能・C++ 資産は Qt",
          "Flutter はモバイルと同じコードでデスクトップにも展開できる",
          "『Web 知識の再利用 or ネイティブ品質』の軸で選ぶ",
        ]}
      />
    </>
  );
}
