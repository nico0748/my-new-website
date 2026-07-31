import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, ComparisonTable, KeyPoints, Callout, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "it-frontend",
  title: "フロントエンド・UI用語",
  description: "DOM・仮想DOM・Fiber・コンポーネント・props/state・Hooks・宣言的UI・SPA/SSR/CSR/SSG/ISR・ハイドレーション・バンドラなど、React/Vue/Angular で出てくる画面まわりの用語を収録。",
  domain: "it-terms",
  section: "frontend",
  order: 1,
  level: "intro",
  tags: ["フロントエンド", "React", "UI"],
  updated: "2026-07-19",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        画面（UI）を作る側で出てくる用語です。ブラウザの土台（DOM）から、React/Vue/Angular が共通して使う考え方、レンダリング方式、ビルドまわりの順に整理します。
      </Lead>

      <Section>ブラウザとレンダリングの土台</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["HTML", "HyperText Markup Language", "Web ページの構造を作るマークアップ言語。DOM のもとになる"],
          ["CSS", "Cascading Style Sheets", "HTML の見た目（色・レイアウト等）を指定するスタイル言語"],
          ["DOM", "Document Object Model", "HTML をツリー構造で表したもの。JS から操作できる"],
          ["仮想 DOM", "Virtual DOM", "DOM のコピーをメモリ上に持ち、差分だけを実 DOM に反映して高速化する仕組み"],
          ["差分検出 / 差分調整", "Reconciliation", "変更前後の仮想 DOM を比べ、実際に変わった箇所だけを割り出す処理"],
          ["Fiber", "Fiber", "React 内部で仮想 DOM を表すノード。中断・再開できるレンダリングを実現する"],
          ["レンダーフェーズ / コミットフェーズ", "Render / Commit", "差分を計算する段階 / それを実 DOM に反映する段階"],
          ["再レンダリング", "Re-render", "state や props の変化に応じて UI を描き直すこと"],
          ["リフロー / リペイント", "Reflow / Repaint", "レイアウトの再計算 / 見た目の再描画。多いと重くなる"],
          ["レスポンシブデザイン", "Responsive Design", "画面サイズに応じてレイアウトを変える設計手法（PC/スマホ対応）"],
        ]}
      />

      <Section>コンポーネントと状態</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["宣言的 UI / 命令的 UI", "Declarative / Imperative", "「あるべき状態」を書く / 「手順」を書く。モダンな UI は宣言的"],
          ["コンポーネント", "Component", "UI を再利用できる部品に分けた単位"],
          ["props", "Properties", "親コンポーネントから子へ渡すデータ"],
          ["state", "State", "コンポーネントが内部に持つ状態。変わると再描画される"],
          ["Hooks", "Hooks", "関数コンポーネントで状態や副作用を扱う仕組み（useState / useEffect など）"],
          ["単方向データフロー", "One-way Data Flow", "データは親から子へ一方向に流れる（React の基本）"],
          ["双方向バインディング", "Two-way Binding", "入力欄とデータを相互に同期させる（Vue / Angular で多用）"],
          ["リアクティビティ", "Reactivity", "状態が変わると UI が自動で追従して更新される性質"],
          ["リフトアップ", "Lifting State Up", "複数コンポーネントで共有する状態を、共通の親に持ち上げること"],
          ["プロップドリリング（バケツリレー）", "Props Drilling", "props を何段も下の子へ中継して渡していくこと（肥大化しやすい）"],
          ["状態管理", "State Management", "アプリ全体の状態を一元管理する仕組み（Redux / Pinia / Context など）"],
          ["副作用", "Side Effect", "描画以外の処理（通信・購読など）。useEffect で扱う"],
        ]}
      />

      <Section>フレームワークの言葉</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["JSX", "JSX", "JavaScript の中に HTML のように UI を書く記法（React）"],
          ["テンプレート / ディレクティブ", "Template / Directive", "HTML に構文を足して描画を制御する仕組み（v-if など）"],
          ["Composition API", "Composition API", "ロジックを関数として組み立てる Vue の書き方"],
          ["DI（依存性注入）", "Dependency Injection", "必要な部品を外から渡す仕組み（Angular のサービスなど）"],
          ["Observable / RxJS", "Observable", "時間とともに流れる値を購読して扱う仕組み（Angular）"],
          ["SFC", "Single File Component", "テンプレート・スクリプト・スタイルを1ファイルにまとめた形式（Vue）"],
          ["スロット", "Slot", "コンポーネントの一部を呼び出し側から差し込めるようにする仕組み（Vue）"],
          ["メタフレームワーク", "Meta-framework", "フレームワークの上に乗る枠組み。Next.js / Nuxt など"],
          ["ルーティング", "Routing", "URL に応じて表示する画面を切り替えること（React Router 等）"],
          ["History API", "History API", "ページを再読み込みせず URL を書き換えるブラウザの API"],
        ]}
      />

      <Section>レンダリング方式・ビルド</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["SPA", "Single Page Application", "1枚のページ内で画面を切り替えるアプリ"],
          ["CSR / SSR", "Client / Server Side Rendering", "ブラウザ側で描画 / サーバー側で HTML を生成して返す"],
          ["SSG / ISR", "Static Generation / Incremental", "事前に静的生成 / 一部を随時再生成する方式"],
          ["ハイドレーション", "Hydration", "SSR で送った HTML に、後から JS を結び付けて操作可能にすること"],
          ["バンドラ", "Bundler", "多数のモジュールを1つ（数個）にまとめるツール。Vite / webpack"],
          ["トランスパイル", "Transpile", "新しい構文や TS を、ブラウザが解釈できる JS へ変換すること"],
          ["ミニファイ / ツリーシェイキング", "Minify / Tree Shaking", "コードを圧縮 / 使われていないコードを除去して軽くする"],
          ["HMR（ホットリロード）", "Hot Module Replacement", "保存した瞬間に変更箇所だけを画面へ反映する開発機能"],
          ["ユーティリティファースト", "Utility-first CSS", "細かい用途別クラスを組み合わせてスタイルする手法（Tailwind）"],
          ["a11y（アクセシビリティ）", "Accessibility", "誰もが使えるようにする配慮。読み上げ・キーボード操作など"],
          ["PWA", "Progressive Web App", "Web をアプリのように使えるようにする技術（オフライン・インストール）"],
        ]}
      />

      <Callout variant="info" title="仕組みから学ぶなら">
        仮想 DOM・Fiber・Hooks・SSR/CSR は「Web基礎」コースで、実際に手を動かすなら「React 実践」「Angular 実践」コースで扱っています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "DOM=画面のツリー、仮想DOM=その差分だけ反映する高速化の仕組み（React は Fiber で管理）",
          "部品化: コンポーネント＋props（渡す）＋state（持つ）＋Hooks（状態・副作用）",
          "宣言的UI＝あるべき状態を書く。データは基本、親→子の単方向に流れる",
          "描画方式: CSR/SSR/SSG/ISR。SSR には後付けの JS 結合（ハイドレーション）が要る",
          "ビルド: バンドラ＋トランスパイルで、モジュールを圧縮して1つにまとめる",
        ]}
      />
    </>
  );
}

/** 関連語マップ（検索パレットの関連語チップ用。本文には表示されない）。
 *  キー: この記事に載っている見出し語（表の1列目と完全一致させること）
 *  値: 関連語。意味的に近い語・対義語・比較される語を 2〜5 語。 */
export const RELATED: Record<string, string[]> = {
  "HTML": ["DOM", "JSX", "テンプレート / ディレクティブ"],
  "CSS": ["リフロー / リペイント", "ユーティリティファースト", "a11y（アクセシビリティ）"],
  "DOM": ["仮想 DOM", "Fiber", "再レンダリング"],
  "仮想 DOM": ["DOM", "差分検出 / 差分調整", "Fiber"],
  "差分検出 / 差分調整": ["仮想 DOM", "Fiber", "再レンダリング"],
  "Fiber": ["仮想 DOM", "レンダーフェーズ / コミットフェーズ", "差分検出 / 差分調整"],
  "レンダーフェーズ / コミットフェーズ": ["Fiber", "再レンダリング", "差分検出 / 差分調整"],
  "再レンダリング": ["state", "props", "レンダーフェーズ / コミットフェーズ"],
  "リフロー / リペイント": ["DOM", "再レンダリング", "仮想 DOM"],
  "レスポンシブデザイン": ["a11y（アクセシビリティ）", "ユーティリティファースト", "PWA"],
  "宣言的 UI / 命令的 UI": ["コンポーネント", "単方向データフロー", "リアクティビティ"],
  "コンポーネント": ["props", "state", "SFC"],
  "props": ["state", "コンポーネント", "単方向データフロー"],
  "state": ["props", "状態管理", "再レンダリング"],
  "Hooks": ["state", "副作用", "Composition API"],
  "単方向データフロー": ["双方向バインディング", "props", "リフトアップ"],
  "双方向バインディング": ["単方向データフロー", "リアクティビティ", "テンプレート / ディレクティブ"],
  "リアクティビティ": ["双方向バインディング", "state", "Observable / RxJS"],
  "リフトアップ": ["単方向データフロー", "状態管理", "コンポーネント"],
  "プロップドリリング（バケツリレー）": ["リフトアップ", "props", "状態管理"],
  "状態管理": ["state", "リフトアップ", "Composition API"],
  "副作用": ["Hooks", "state", "同期 / 非同期"],
  "JSX": ["コンポーネント", "テンプレート / ディレクティブ", "宣言的 UI / 命令的 UI"],
  "テンプレート / ディレクティブ": ["JSX", "双方向バインディング", "SFC"],
  "Composition API": ["Hooks", "状態管理", "SFC"],
  "DI（依存性注入）": ["依存性注入（DI）", "デザインパターン", "Composition API"],
  "Observable / RxJS": ["リアクティビティ", "同期 / 非同期", "コールバック / Promise"],
  "SFC": ["コンポーネント", "テンプレート / ディレクティブ", "Composition API"],
  "スロット": ["SFC", "テンプレート / ディレクティブ", "コンポーネント"],
  "メタフレームワーク": ["フレームワーク", "CSR / SSR", "ルーティング"],
  "ルーティング": ["History API", "SPA", "メタフレームワーク"],
  "History API": ["ルーティング", "SPA", "URL"],
  "SPA": ["ルーティング", "CSR / SSR", "History API"],
  "CSR / SSR": ["SPA", "SSG / ISR", "ハイドレーション"],
  "SSG / ISR": ["CSR / SSR", "ハイドレーション", "CDN"],
  "ハイドレーション": ["CSR / SSR", "SSG / ISR", "バンドラ"],
  "バンドラ": ["トランスパイル", "ミニファイ / ツリーシェイキング", "HMR（ホットリロード）"],
  "トランスパイル": ["バンドラ", "コンパイラ / インタプリタ", "JSX"],
  "ミニファイ / ツリーシェイキング": ["バンドラ", "トランスパイル", "HMR（ホットリロード）"],
  "HMR（ホットリロード）": ["バンドラ", "ミニファイ / ツリーシェイキング", "トランスパイル"],
  "ユーティリティファースト": ["CSS", "コンポーネント", "レスポンシブデザイン"],
  "a11y（アクセシビリティ）": ["ユーティリティファースト", "PWA", "SPA"],
  "PWA": ["a11y（アクセシビリティ）", "SPA", "SSG / ISR"],
};
