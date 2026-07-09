# WebGPU が全主要ブラウザで Baseline 入り — ブラウザから GPU を本格活用

> トピック: WebGPU が Chrome / Firefox / Safari / Edge で既定有効・Baseline 到達｜出典: web.dev / W3C GPU for the Web WG｜種別: Web 標準（Baseline）

## 一行サマリー

2025年11月に Chrome・Firefox・Safari・Edge の全主要ブラウザで既定有効となった WebGPU が、2026年に入って Baseline に到達し、ブラウザから最新の GPU API（描画と汎用計算）を安定して使える段階になった。WebGL 比で計算重視ワークロードは大幅な高速化が報告され、Three.js などが既定のレンダラとして採用を進めている。

## 🔰 初学者向け（何が・なぜ重要か）

ブラウザで 3D グラフィックスや重い計算（AI 推論、画像処理など）を動かすとき、これまでの標準は WebGL という古い仕組みでした。WebGL はもともとスマホやゲーム機より前の時代の GPU の使い方が下敷きで、最新の GPU が持つ「計算専用の使い方（GPGPU）」を活かしきれませんでした。

WebGPU は、その後継となる新しい標準です。たとえるなら、これまで「絵を描く用の入口」しか使えなかったのが、「絵を描く入口」と「大量計算をさせる入口」の両方を正式に使えるようになったイメージ。ゲームのようなリッチな描画だけでなく、ブラウザ内での機械学習やシミュレーションが、GPU の本来の力で速く動くようになります。

今回の節目は、この WebGPU が **Chrome・Firefox・Safari・Edge のすべてで最初から有効**になり、「特定のブラウザでしか動かない」を気にせず本番投入できる段階（Baseline）に到達したこと。つまり、Web アプリで GPU を前提にした機能を安心して設計できるようになりました。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

WebGPU は Vulkan / Metal / Direct3D 12 といったモダンなネイティブ GPU API を抽象化した Web 標準で、明示的なパイプライン・バインドグループ・コマンドエンコーダ方式を採る。シェーダ言語は WGSL。

ブラウザ対応の推移（各種発表ベース）:
- Chrome: 2023年の 113 で先行搭載。
- Firefox: 2025年7月の 141 で Windows、以降 macOS（Apple Silicon）へ拡大。
- Safari: 2025年9月の 26.0 で macOS Tahoe 26 / iOS 26 等に搭載。26.2 で WebGPU Canvas の HDR や visionOS の WebXR 連携を追加。
- 2025年11月に主要4ブラウザで既定有効となり、2026年に Baseline 到達（グローバル利用者の大多数で利用可能）。

計算重視ワークロードでは WebGL 比で大幅な高速化（十数倍規模）が報告され、Three.js は WebGPU レンダラの採用を進めている。

### 仕組み / 背景（なぜこう設計されたか）

WebGL は OpenGL ES 由来のステートマシン型 API で、暗黙的な状態遷移が多く、ドライバ側の解釈に依存する部分が大きかった。結果として最適化が難しく、汎用計算（コンピュートシェーダ）も後付けで限定的だった。WebGPU は「明示的で予測可能な」モダン API 設計を踏襲し、パイプラインや資源バインドを事前に確定させることでドライバのオーバーヘッドを削減し、マルチスレッドでのコマンド生成にも向く。

コンピュートシェーダを一級市民として扱う点が最大の設計上の前進で、ブラウザ内 ML（推論）、物理シミュレーション、画像/音声処理を GPU 並列で回せる。トレードオフは学習曲線と冗長性で、明示的なぶん初期コードは WebGL より長い。多くの開発者は Three.js / Babylon.js などの抽象層を介して恩恵を受ける形になる。

### 実務での使いどころ・移行の勘所

大規模な 3D 可視化、地図・BIM・CAD ビューア、ブラウザ内 AI 推論、データ可視化の GPU アクセラレーションで効果が大きい。既存の WebGL 資産は当面併存させ、レンダラ差し替えに対応したライブラリ（Three.js の WebGPURenderer 等）経由で段階移行するのが安全。フォールバック（WebGPU 非対応/無効環境で WebGL に落とす）を組み込み、`navigator.gpu` の有無で分岐する。モバイルや古い GPU では機能制限・性能差があるため、能力検出とプロファイリングを前提にする。

## 📖 用語解説（このトピックとのつながり）

- **WebGPU**: モダンなネイティブ GPU API を抽象化した Web 標準。本トピックの主役。
- **WGSL**: WebGPU のシェーダ言語（WebGPU Shading Language）。
- **コンピュートシェーダ / GPGPU**: 描画以外の汎用並列計算に GPU を使う仕組み。WebGPU が正式サポート。
- **WebGL**: 従来の Web 3D 標準。WebGPU の前世代。
- **Baseline**: 主要ブラウザでの利用可否を示す指標。WebGPU はここに到達。

## 影響範囲 / 推奨アクション

3D・可視化・ブラウザ内 ML を扱うプロダクトは WebGPU 前提の設計が現実的になった。既存 WebGL は当面フォールバックとして残し、抽象ライブラリ経由で段階移行を推奨。能力検出とデバイス別プロファイリングを設計に組み込むこと。

## リンク

- web.dev「WebGPU is now supported in major browsers」: https://web.dev/blog/webgpu-supported-major-browsers
- Chrome for Developers「Overview of WebGPU」: https://developer.chrome.com/docs/web-platform/webgpu/overview
- MDN WebGPU API: https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API
- 実装状況（gpuweb wiki）: https://github.com/gpuweb/gpuweb/wiki/Implementation-Status
