# Temporal API がランタイム横断で安定化 — JavaScript の日時処理がついに刷新

> トピック: Temporal API がブラウザ／ランタイムで安定化（Chrome 144 が2026年1月に出荷、Deno 2.7 が2月に flag 不要化）｜出典: Deno 公式ブログ v2.7｜種別: Web 標準／言語 API

## 一行サマリー

長年 JavaScript の弱点だった日時処理を刷新する新標準「Temporal API」が、Chrome 144（2026年1月）と Deno 2.7（2026年2月、`--unstable-temporal` 不要化）で安定利用できるようになった。壊れやすい `Date` に代わり、タイムゾーンや暦を正確に扱える不変オブジェクト群が標準搭載されつつある。

## 🔰 初学者向け（何が・なぜ重要か）

JavaScript で日付や時刻を扱う `Date` は、昔から「使いにくい」「バグの温床」と言われてきました。月が 0 から始まる、タイムゾーンの扱いが曖昧、値を変えると元のオブジェクトも書き換わる（可変）など、落とし穴だらけです。そのため多くの開発者は Moment.js や date-fns といった外部ライブラリに頼ってきました。

Temporal API は、この日時処理を根本から作り直した新しい標準です。たとえるなら、ガタつく古い道具箱を、用途ごとにきれいに整理された新品の道具箱に置き換えるようなもの。「日付だけ」「時刻だけ」「タイムゾーン付きの瞬間」などを別々の専用オブジェクトで表し、しかも一度作った値は書き換わらない（不変）ので、予期せぬ副作用が起きにくくなります。

Chrome や Deno が正式対応したことで、外部ライブラリなしでも安全に日時を扱える時代が近づきました。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

Temporal は TC39（JavaScript の言語仕様策定団体）で長く育てられてきた提案で、`Temporal.PlainDate`（暦日）、`Temporal.PlainTime`（時刻）、`Temporal.PlainDateTime`、`Temporal.ZonedDateTime`（タイムゾーン付き瞬間）、`Temporal.Instant`、`Temporal.Duration` などの型を提供する。

- **Chrome 144**（2026年1月）が Temporal を出荷。
- **Deno 2.7**（2026年2月25日）は V8 14.5 への更新に伴い Temporal を安定化し、`--unstable-temporal` フラグが不要になった。

これにより、ブラウザ・サーバ双方で外部依存なしに Temporal を使える環境が整いつつある。他エンジン（Firefox / Safari）の出荷状況と Baseline 判定は要確認。

### 仕組み / 背景（なぜこう設計されたか）

`Date` の根本問題は3つ。(1) 可変（mutable）で、メソッドがオブジェクト自身を書き換える。(2) 「壁時計時刻」「絶対時刻」「タイムゾーン」の概念が1つの型に混在し、曖昧。(3) 暦・タイムゾーン演算が貧弱。Temporal はこれらを型の分割で解く。「タイムゾーンを持たない壁時計（Plain*）」と「特定タイムゾーンの瞬間（ZonedDateTime）」「タイムゾーン非依存の絶対時刻（Instant）」を別型にし、変換を明示的にする。すべて**不変（immutable）**で、演算は新しいオブジェクトを返すため、共有状態の破壊が起きない。

これは「日時は本質的に異なる複数の概念であり、それらを別の型で表すべき」という設計哲学の結晶だ。トレードオフは学習コスト（`Date` の1型に慣れた開発者は概念の分割を理解する必要がある）と、当面は `Date` との相互変換や polyfill が必要な移行期がある点。IANA タイムゾーン DB を前提とする分、エンジンのデータ更新にも依存する。

### 実務での使いどころ・移行の勘所

タイムゾーンをまたぐ予約・スケジューリング、金融・勤怠のような日時精度が重要なドメインで恩恵が大きい。新規コードは Temporal を前提にでき、既存コードは境界（入出力）で `Date` ⇄ Temporal を変換して段階移行する。全ブラウザ Baseline に達するまでは公式 polyfill（`@js-temporal/polyfill` など）でギャップを埋めるのが現実的。date-fns / Luxon 等からの移行は、まず日時ロジックを純粋関数に隔離しておくと差し替えやすい。

## 📖 用語解説（このトピックとのつながり）

- **Temporal API**: JavaScript の新しい日時標準。複数の不変型で日時概念を分割表現する。本トピックの主役。
- **ZonedDateTime / Instant / PlainDate**: それぞれ「タイムゾーン付き瞬間」「絶対時刻」「暦日」を表す Temporal 型。
- **不変（immutable）**: 生成後に値が変わらない性質。副作用バグを防ぐ。
- **TC39**: JavaScript 言語仕様を策定する委員会。Temporal を Stage 進行させてきた。
- **polyfill**: 未対応環境で新 API を再現する補完実装。移行期のギャップを埋める。

## 影響範囲 / 推奨アクション

日時精度が重要なアプリは Temporal 採用で堅牢化できる。全ブラウザ対応が揃うまでは polyfill を併用し、入出力境界で `Date` と変換する段階移行を推奨。他エンジンの出荷状況は要確認。

## リンク

- Deno 2.7 リリース記事: https://deno.com/blog/v2.7
- TC39 Temporal 提案: https://tc39.es/proposal-temporal/docs/
- MDN Temporal: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal
