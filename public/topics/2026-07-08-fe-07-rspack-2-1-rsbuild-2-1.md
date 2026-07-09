# Rspack 2.1 / Rsbuild 2.1：Rust 実装の React Compiler で Babel の 7〜13 倍高速化

> トピック: Rspack 2.1 / Rsbuild 2.1｜出典: Rspack 公式ブログ / Rsbuild 公式ブログ｜種別: マイナーリリース（Rust 製ビルドツール群）

## 一行サマリー

2026年6月26日、Rust 製バンドラ Rspack 2.1 と、その上に載る高レベルビルドツール Rsbuild 2.1 が同時リリースされた。目玉は React Compiler の Rust 実装で、`@rsbuild/plugin-react` 経由で Babel 実装比 7〜13 倍高速。ほかに TanStack Start 対応、Tailwind CSS プラグイン、自動 externals、Babel/SVGR の並列化、CSS URL / Worker / Wasm のリソースインポート強化などを含む。

## 🔰 初学者向け（何が・なぜ重要か）

Web アプリを作ると、大量の TypeScript / JSX ファイルを「ブラウザが読める形」にまとめる工程（バンドル）が必要になる。この工程が遅いと、開発中の待ち時間が増え、ビルドのたびに手が止まる。長年 webpack が定番だったが、JavaScript 実装ゆえに大規模プロジェクトでは遅かった。

Rspack は、その webpack を「ほぼ同じ設定のまま Rust で書き直した」ドロップイン置き換えツール。Rust はネイティブコンパイル言語で高速なので、ビルドが桁違いに速くなる。Rsbuild はその Rspack を「難しい設定なしで使える」ようにラップした高レベルツールだ。

今回の 2.1 で特に効くのが「React Compiler の Rust 実装」。React Compiler は、開発者が手で書いていた最適化（`useMemo` 等）を自動でやってくれる仕組みだが、従来は Babel（JavaScript 製）で動いていて遅かった。これを Rust で書き直したことで 7〜13 倍速くなり、「自動最適化のためにビルドが遅くなる」ジレンマが緩和される。速い・楽・自動最適化つき、が同時に手に入る方向に進んでいる。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

**Rspack 2.1（2026年6月）**
- React Compiler の Rust 実装を搭載。
- 新しい出力最適化（output optimization）機能、ビルド高速化、内部改善多数。

**Rsbuild 2.1（2026年6月26日）**
- Rspack 2.1 へアップグレード。
- React Compiler の Rust 実装を `@rsbuild/plugin-react` 経由で公開（**Babel 実装比 7〜13 倍高速**）。
- TanStack Start 対応、Tailwind CSS プラグイン、自動 externals。
- Babel と SVGR の並列化。
- 新リソースインポート: CSS URL インポート、Worker クエリインポート、Wasm ソースインポート。

**Rslib（ライブラリバンドラ）**
- 実験的 `dts.isolated` オプションで宣言ファイル（.d.ts）を生成。Rspack 内蔵 SWC の `fast_dts` を用い、フル型チェックなしにビルド中へ .d.ts を直接出力（`isolatedDeclarations` ベースの高速型生成）。

### 仕組み / 背景（なぜこう設計されたか）

Rspack/Rsbuild 一貫した戦略は「ホットパスを JavaScript から Rust / SWC へ移す」ことにある。バンドルの律速はパース・変換・最適化といった CPU 集約処理で、ここを JS で回すと大規模化に伴って線形以上に遅くなる。Rust 実装＋SWC（Rust 製の JS/TS コンパイラ）は、この処理をネイティブ速度で、かつマルチコア並列で回せる。

React Compiler の Rust 化はその象徴だ。React Compiler はコンポーネントを静的解析してメモ化を自動挿入するため、ビルド時に重い解析を伴う。Babel 実装ではこの解析が JS で走り、ビルド時間を押し上げていた。Rust 実装に置き換えることで、自動最適化の「ランタイム利得」を「ビルド時のコスト増」で相殺してしまう問題を大幅に軽減する。同様に Rslib の `fast_dts` は「型チェックと型宣言生成を分離」する `isolatedDeclarations` の発想で、宣言ファイル生成から重い型チェックを切り離して高速化している。

トレードオフは、Rust 実装は webpack/Babel エコシステムの一部プラグインとの互換性で追随が必要な点（Rspack のプラグイン互換は 2026 時点で概ね 90〜95%・要確認）。また `isolatedDeclarations` は書き方の制約（明示的な型注釈が必要な箇所が増える）を伴う。

### 実務での使いどころ・移行の勘所

- webpack で遅さに悩む中〜大規模プロジェクトのドロップイン置き換え候補。設定は webpack に酷似し、移行コストが低い。
- React Compiler を導入したいがビルド時間の増加を避けたいチームは、Rsbuild 2.1 の Rust 実装が有力。
- ライブラリ配布で .d.ts 生成が遅い場合、Rslib の `fast_dts`（isolatedDeclarations）を検討。ただしソースの型注釈要件を満たす必要がある。
- 依存プラグインが webpack 固有 API に強く依存している場合は互換性を事前検証する。

## 📖 用語解説（このトピックとのつながり）

- **Rspack**: webpack ドロップイン互換の Rust 製バンドラ。2.1 で React Compiler を Rust 実装。
- **Rsbuild**: Rspack を薄くラップした高レベルビルドツール。2.1 で Rust 版 React Compiler を公開。
- **React Compiler**: React コンポーネントを解析し自動でメモ化する仕組み。Rust 実装で 7〜13 倍高速化。
- **SWC**: Rust 製の高速 JS/TS コンパイラ。Rspack の変換・fast_dts の基盤。
- **isolatedDeclarations**: 型チェックと分離して .d.ts を高速生成する TypeScript 機能。Rslib の `dts.isolated` が利用。

## 影響範囲 / 推奨アクション

- webpack プロジェクトはビルド高速化のため Rspack/Rsbuild への移行を評価（設定が近く低コスト）。
- React Compiler 導入予定チームは Rsbuild 2.1 の Rust 実装でビルド時間の悪化を回避。
- ライブラリ作者は Rslib の `fast_dts` で型宣言生成を高速化（型注釈要件に注意）。
- 移行前に依存プラグインの Rspack 互換性を確認する。

## リンク

- 一次情報（Rspack 2.1 announce）: https://rspack.rs/blog/announcing-2-1
- Rsbuild 2.1 announce: https://rsbuild.rs/blog/v2-1
