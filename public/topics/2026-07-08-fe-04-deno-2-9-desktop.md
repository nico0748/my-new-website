# Deno 2.9 Desktop：Electron なしで Web 技術からネイティブアプリを作る（17ms コールドスタート）

> トピック: Deno 2.9 Desktop｜出典: Deno 公式ブログ / Deno Docs / InfoWorld｜種別: メジャーランタイム機能追加

## 一行サマリー

Deno 2.9（2026年6月25日）が `deno desktop` を搭載し、単一の TypeScript ファイルから Next.js アプリまでを、コード・Deno ランタイム・レンダリングエンジンをまとめた「自己完結型ネイティブバイナリ」に変換できるようになった。UI はシステム WebView（既定）または CEF 経由の Chromium で描画され、ロジックは Deno が実行する。コールドスタートは 34ms → 17ms へ約2倍改善した。

## 🔰 初学者向け（何が・なぜ重要か）

「Web の技術（HTML/CSS/TypeScript）でデスクトップアプリを作る」といえば長らく Electron が定番だった。ただ Electron は Chromium を丸ごと同梱するので、アプリが数百 MB に膨らみ、起動も重くなりがちだった。

Deno 2.9 の `deno desktop` は、この課題に別のアプローチで挑む。既定では OS に元から入っている WebView（macOS/Linux は WebKit、Windows は WebView2）を使うので、巨大な Chromium を同梱しなくて済む。開発者は普段どおり Web アプリを書き、`deno desktop` にそのプロジェクトを渡すだけで、配布できる1個のネイティブバイナリになる。中身は「UI = WebView」「ロジック = Deno（TypeScript 実行）」という分担だ。

たとえるなら、Electron が「毎回ブラウザを引っ越し先に持っていく」なら、Deno Desktop は「引っ越し先にすでにあるブラウザ機能を借りる」イメージ。これで配布サイズが小さくなり、起動も速くなる（コールドスタート 17ms）。もちろん、どうしても Chromium が必要なら CEF 経由で同梱する選択肢も残されている。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- Deno 2.9 で `deno desktop` サブコマンドを導入（2026年6月25日発表）。
- スクリプトまたは Web フレームワークプロジェクト（単一 TS ファイル〜フル Next.js アプリ）を、自己完結型ネイティブバイナリへ変換。
- レンダリングバックエンドを選択可能: 既定は**システム WebView**（macOS/Linux=WebKit、Windows=WebView2）、または CEF 経由の**バンドル Chromium**。
- 性能改善: コールドスタート 34ms → 17ms（約2倍）、ピーク RSS が実ワークロードで 2.2倍、1MB ボディペイロードで 3.1倍削減。
- 現状のドキュメント・成果物は **Deno 2.9.0 canary / pre-stable** に紐づく（本番採用は安定版の情報を待つのが妥当）。

### 仕組み / 背景（なぜこう設計されたか）

設計の核心は「レンダリングエンジンを同梱しない」という選択にある。Electron 型の課題は、各アプリが独自の Chromium を抱えることによる配布サイズ肥大とメモリ消費だ。Deno Desktop は既定で OS 提供の WebView に委譲することで、この二重持ちを避ける。トレードオフは明確で、OS ごとにレンダリングエンジン（WebKit / WebView2）が異なるため、ブラウザ差異と同種の互換性問題が再来する。「一貫した描画」を最優先するなら CEF で Chromium を同梱する道が用意されているのはそのためだ。

もう一つの柱は Deno のランタイム特性だ。Deno は標準 Web プラットフォーム API（fetch、WebSocket 等）を第一級に扱い、TypeScript をビルド不要で実行できる。デスクトップ側でも「Web で書いたコードがそのまま動く」体験を提供しやすい。2.9 では起動時間・メモリ・HTTP スループットも底上げされ、常駐アプリのコールドスタートやリソース効率に効く。

### 実務での使いどころ・移行の勘所

- 社内ツール、開発者向けユーティリティ、軽量なコンパニオンアプリなど「配布サイズと起動速度を重視する」用途に向く。
- 既存の Web/Next.js プロジェクトを最小改変でデスクトップ配布したいケースで試作価値が高い。
- ただし現状は canary / pre-stable。ミッションクリティカルなアプリは、安定版のリリースノート・移行ガイド・実運用のパッケージング実績を待つべき（要確認）。
- クロス OS で描画一貫性が必要なら CEF（Chromium 同梱）を選び、サイズと引き換えに差異を消す判断も。

## 📖 用語解説（このトピックとのつながり）

- **WebView**: OS が提供する組み込みブラウザ描画コンポーネント。macOS/Linux は WebKit、Windows は WebView2。Deno Desktop の既定バックエンド。
- **CEF（Chromium Embedded Framework）**: Chromium をアプリに組み込むフレームワーク。描画一貫性が必要なとき Deno Desktop が使う代替バックエンド。
- **Electron**: Web 技術でデスクトップアプリを作る定番。Chromium 同梱による肥大が課題で、Deno Desktop が対抗する。
- **コールドスタート**: プロセスをゼロから起動して応答可能になるまでの時間。Deno 2.9 で 34ms→17ms に短縮。
- **RSS（Resident Set Size）**: プロセスが実際に使う物理メモリ量。2.9 で大幅削減。

## 影響範囲 / 推奨アクション

- Web スキルでデスクトップ配布したいチームは `deno desktop` を試作評価する。
- 配布サイズ・起動速度が重要なら WebView 既定、描画一貫性が重要なら CEF を選ぶ。
- 本番投入は安定版（pre-stable からの昇格）を待ち、パッケージング・署名・自動更新の実績を確認する。
- 既存 Electron アプリの置き換え検討時は、OS 別 WebView の互換性差を先に検証する。

## リンク

- 一次情報（Deno Docs Desktop）: https://docs.deno.com/runtime/desktop/
- 解説記事（InfoWorld）: https://www.infoworld.com/article/4190648/deno-update-streamlines-creation-of-desktop-apps.html
