# Magento 拡張 Mirasvit Cache Warmer の PHP デシリアライズで認証不要RCE CVE-2026-45247

> トピック: 脆弱性ニュース ｜ 出典: The Hacker News / Sansec / Imperva / CISA KEV ｜ 種別: 信頼できないデータのデシリアライズ（PHP オブジェクト注入、CWE-502）

## 一行サマリー

Magento／Adobe Commerce 向け拡張「Mirasvit Full Page Cache Warmer」に、Cookie 内データを無検証で PHP の unserialize() に渡す脆弱性 CVE-2026-45247（CVSS 9.8、Critical）があり、認証不要でリモートコード実行（RCE）に至る。実環境で悪用が確認され CISA KEV にも登録。v1.11.12 への即時更新が必要。

## 🔰 初学者向け（何が・なぜ問題か）

ネットショップの多くは「Magento（Adobe Commerce）」という仕組みで作られています。今回問題が見つかったのは、その表示を速くするための追加部品（拡張機能）「Mirasvit Cache Warmer」です。

この部品は、ブラウザが送ってくる小さなメモ（Cookie＝クッキー）の中身を読み取って処理します。本来、外から来たメモは「ただの文字」として慎重に扱うべきですが、この部品はメモの中身を「PHP のオブジェクト（プログラムの部品）」として“そのまま組み立て直して”しまいます。これは、知らない人から届いた小包を、中身を確かめずにそのまま組み立てて電源を入れるようなものです。悪意のある人が「組み立てると勝手に命令を実行する」よう細工した小包（細工 Cookie）を送れば、ショップのサーバーが乗っ取られます。

しかもログイン不要（誰でも Cookie は送れる）で、深刻度は最高クラス（CVSS 9.8）。すでに実際の攻撃に使われており、攻撃者はサーバーで自由にコマンドを実行し、決済情報の窃取（Webスキミング）やサイト改ざんに悪用できます。対象の拡張を使うストアは、直ちに修正版へ更新する必要があります。

## 🧠 専門的解説（技術詳細・メカニズム・検知対応）

### 技術的詳細（種別・前提条件）

- 種別: 信頼できないデータのデシリアライズ（PHP Object Injection → RCE、CWE-502）。
- CVSS: 9.8（Critical、要確認）。攻撃元はネットワーク、認証不要・ユーザー操作不要。
- 影響: Mirasvit Full Page Cache Warmer for Magento 2 の v1.11.12 未満。Magento／Adobe Commerce 上で当該拡張を有効化しているストア。
- 修正版: v1.11.12 で修正。直ちに更新。
- 悪用状況: Imperva 等が「シリアライズ済み PHP オブジェクトを含むペイロードでの悪用試行」を観測。CISA が KEV へ登録（2026-06-03、要確認）。IoC として `CacheWarmer` Cookie 値が `CacheWarmer:(Tz|Qz|YT)` パターンに一致するものが強い悪用兆候。

### メカニズム（攻撃が成立する仕組み）

注: 概念レベルにとどめ、武器化手順・ガジェットチェーンの具体・PoC は記載しない。

1. **外部入力を信頼領域に取り込む**: 当該拡張は `CacheWarmer` Cookie の値を、攻撃者制御データであるにもかかわらず PHP の native `unserialize()` に渡す。ここで「外部入力（信頼できない）」と「内部オブジェクト生成（信頼が必要）」の境界が破られる。
2. **PHP オブジェクト注入の成立**: `unserialize()` に許可クラスの制限（allowed_classes）を掛けていないため、攻撃者は任意クラスのインスタンスを復元できる。これが PHP Object Injection（POI）プリミティブ。
3. **マジックメソッドの自動発火**: 復元されたオブジェクトはライフサイクル中に `__wakeup()` / `__destruct()` 等のマジックメソッドが自動実行される。攻撃者はこの自動実行を「最初の引き金」として利用する。
4. **ガジェットチェーンで RCE へ橋渡し**: Magento 本体やその依存ライブラリに既存する“ガジェット”（連鎖すると危険動作に到達するメソッド群）を数珠つなぎにし、POI をファイル書き込みやコマンド実行へ昇華させる。結果として認証不要の任意コード実行（RCE）に至る。
5. **一般原理**: 「外部由来データを無制限に `unserialize()` する」設計は PHP デシリアライズ攻撃の典型クラス。単体では“オブジェクトを作れるだけ”でも、豊富なフレームワーク依存があるとガジェット連鎖により RCE 化しやすい点が脅威の本質。

### 検知・暫定緩和・恒久対策

- 検知の着眼点: `CacheWarmer` Cookie に PHP シリアライズ特有のプレフィックス（`O:` `a:` 等、IoC パターン `Tz|Qz|YT`）を含むリクエスト、Web サーバプロセスからの不審な子プロセス生成（シェル起動）、新規 PHP ファイル（Webシェル）の出現、決済ページへの不審なスクリプト挿入。
- 暫定緩和: 即時更新が難しい場合は当該拡張の無効化、WAF で該当 Cookie パターンの遮断、`CacheWarmer` Cookie の検査・除去。サーバ上の改ざん（追加 PHP ファイル）有無を点検。
- 恒久対策: Mirasvit Full Page Cache Warmer を v1.11.12 以降へ更新。一般論として外部入力には `unserialize()` を使わず JSON 等の安全な形式を用い、やむを得ない場合は `allowed_classes` で厳格制限。
- 運用示唆: EC は Webスキミング（Magecart）の主要標的。RCE 痕跡の調査と併せ、決済フローの完全性監視を強化する。

## 📖 用語解説（このニュースとのつながり）

- **デシリアライズ（unserialize）**: 文字列をプログラム上のオブジェクトに復元する処理。外部入力に対して行うと危険で、本件の根本原因。
- **PHP オブジェクト注入（POI, CWE-502）**: 攻撃者が任意クラスのオブジェクトを復元させる攻撃。RCE への入口。
- **ガジェットチェーン**: 既存コード中の部品をつなげて危険動作に到達させる手法。POI を RCE に橋渡しする。
- **マジックメソッド**: `__wakeup()`/`__destruct()` 等、特定タイミングで自動実行される PHP のメソッド。攻撃の引き金。
- **Webスキミング（Magento）**: EC サイト改ざんで決済情報を盗む攻撃。RCE 後の典型的な悪用目的。

## 影響範囲 / 推奨対応

Mirasvit Full Page Cache Warmer を有効化した Magento／Adobe Commerce ストアが対象。直ちに v1.11.12 以降へ更新し、未更新の間は拡張無効化・WAF 遮断で凌ぐ。既に悪用兆候（IoC Cookie パターン、Webシェル、決済ページ改ざん）がないか侵害調査を行い、必要に応じてサーバの再構築と認証情報のローテーションを実施する。

## リンク

- https://thehackernews.com/2026/06/cisa-adds-exploited-magento-rce-flaw.html
- https://sansec.io/research/mirasvit-cache-warmer-object-injection
- https://www.imperva.com/blog/imperva-customers-protected-against-cve-2026-45247-in-mirasvit-full-page-cache-warmer-for-magento/
- https://www.cisa.gov/known-exploited-vulnerabilities-catalog

トピック: 500-セキュリティ/510-脅威情報/README ／ 区分: 500-セキュリティ/README
