# Microsoft Exchange のSSRF（CVE-2026-45504）— WOPIのURLスキーム未検証で低権限ユーザーが任意ファイル読み取り、PoC公開

> トピック: 脆弱性ニュース ｜ 出典: Cyber Security News / HawkTrace / Microsoft ｜ 種別: SSRF→任意ファイル読み取り（権限昇格・PoC公開）

## 一行サマリー

オンプレミス版Microsoft ExchangeのOneDrive/WOPI連携に、外部URLのスキームを検証しない欠陥（CVE-2026-45504, CVSS 8.8）があり、認証済みの低権限ユーザーがサーバー上の任意ファイル（設定・資格情報等）を読み取れる。研究者が技術詳細と動作するPoCを公開済み。Exchange 2016/2019/Subscription Editionが対象で、2026年6月9日の更新で修正されている。

## 🔰 初学者向け（何が・なぜ問題か）

Exchangeは、会社のメールやスケジュールを預かる“社内郵便局”のようなサーバーです。多くの機密がここに集まります。

Exchangeには、添付ファイルをブラウザ上でプレビュー表示するために、外部のドキュメント表示サービス（OneDrive/WOPIという仕組み）と連携する機能があります。今回の問題は、この連携で**「表示しに行く先のURL（住所）」を十分に確認していなかった**ことです。

たとえるなら、郵便局員が「この住所に取りに行って」と書かれたメモを、差出人が誰でも、住所が“建物の外”でも“金庫の中”でも疑わずにそのまま従ってしまう状態です。攻撃者は、正規のWeb住所（http://…）ではなく、**サーバー自身のファイルを指す特殊な住所（file://…）**を巧妙に混ぜ込みます。するとExchangeは、外部に取りに行くつもりで**自分のサーバー内部のファイルを開いて中身を返して**しまいます。

この“使い走り”を悪用する攻撃を**SSRF（サーバー側リクエスト偽造）**と呼びます。結果として、ごく普通の権限しか持たない利用者でも、サーバー内の設定ファイルやパスワードなどの秘密情報を盗み見でき、そこから更なる侵入・権限奪取に発展します。攻撃コード（PoC）が公開済みのため、悪用の敷居は下がっています。

## 🧠 専門的解説（技術詳細・メカニズム・検知対応）

### 技術的詳細（種別・前提条件）

- **CVE**: CVE-2026-45504
- **CVSS**: 8.8（`AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`）。MicrosoftはEoP（権限昇格）、研究者はSSRF→任意ファイル読み取りとして解説。
- **影響製品**: オンプレミスの Exchange Server 2016 / 2019 / Subscription Edition。OneDrive/WOPI連携（`OneDriveProUtilities.GetWacUrl` と補助関数）に起因。
- **前提条件**: **認証済みの低権限ユーザー**であること（PR:L）。ネットワーク経由・ユーザー操作不要。
- **悪用状況**: HawkTraceのBatuhan Er氏が技術詳細とPoCをGitHubで公開。実悪用の広範な報告は現時点で限定的だが、PoC公開により悪用容易性が上昇。
- **修正**: 2026年6月9日のセキュリティ更新（KB5094139/40/42/44 等、CU23 / 2019 CU14・CU15 / SE RTM）で対応。恒久修正はWebApplicationUrlのスキーム厳格検証。

### メカニズム（攻撃が成立する仕組み）

本件は「外部から返されたURLを、スキーム検証せずに内部リクエストへ流用した」SSRFで、`file://`スキームの受理により任意ファイル読み取りへ昇格する。概念レベルで整理する（武器化手順・完全なPoCは記載しない）。

1. **信頼境界と役割**: ExchangeはWOPIプロバイダから返る `WebApplicationUrl` を信頼し、それを使ってドキュメントプレビュー用のWAC URLを組み立てる。ここで「返ってくるのは正当なHTTP(S) URLだ」という暗黙の前提を置いている。
2. **検証の欠落**: Exchangeは `WebApplicationUrl` の**URLスキームを検証しない**ため、`http(s)` 以外（例: `file://`）でも受理してしまう。信頼できない外部応答が、そのまま内部処理の入力になる（信頼境界の破れ）。
3. **プリミティブの獲得（SSRF）**: 攻撃者は、EWSの ReferenceAttachment に細工した `ProviderEndpointUrl` を仕込み、Exchangeを**攻撃者制御サーバーへSSRF**させる。攻撃者サーバーは応答として `file:///C:/path/to/file#` のようなURLを返す。`#`（フラグメント）以降にOAuthパラメータを追いやることで、URIパーサに末尾を無視させ、パスだけを有効化する“フラグメントトリック”を用いる。
4. **任意ファイル読み取りへの橋渡し**: Exchangeは受理した `file://` URLを `FileWebRequest`／`WebClient.OpenRead()` で開き、**サーバーローカルの対象ファイルを読み出して返す**。SSRFプリミティブが任意ファイル読み取りに昇格し、設定・資格情報の窃取に至る。得た秘密情報は更なる権限昇格・横展開の起点になる。

一般原理として、これは**入力（外部由来URL）のスキーム・宛先を検証せずに特権的なフェッチ処理へ渡す**SSRFの典型で、`file://`等の危険スキームを許すと情報漏えい／内部到達に直結する。

### 検知・暫定緩和・恒久対策

- **検知の着眼点**: ExchangeからのアウトバウンドSSRF様リクエスト（外部の未知ホストへの発信）、`file://`スキームを含む処理ログ、EWS ReferenceAttachment作成→プレビュー要求の連鎖、機密ファイルへの想定外アクセス。
- **暫定緩和**: Exchangeサーバーからの不要なアウトバウンド通信を制限（egressフィルタ）。OneDrive/WOPI連携が不要なら無効化・制限。管理面・EWSの露出を最小化。
- **恒久対策**: 2026年6月9日更新（該当CU/KB）を適用。パッチはWebApplicationUrlに対し `file://` 等の非HTTP(S)スキームを明示的にブロックする。適用後は資格情報のローテーションと漏えい調査を実施。

## 📖 用語解説（このニュースとのつながり）

- **SSRF（Server-Side Request Forgery）**: サーバーを騙して、攻撃者の意図する宛先へリクエストさせる攻撃。今回はExchange自身にローカルファイルを読ませる形で悪用される。
- **WOPI（Web Application Open Platform Interface）**: Office系ドキュメントをWebで表示・編集するための連携プロトコル。返却URLの検証を怠ると悪用の入口になる。
- **URLスキーム検証**: `http/https` など許可されたスキームだけを受理する防御。`file://`等を弾かないと任意ファイル読み取りに繋がる。
- **フラグメント（#）トリック**: URLの`#`以降をパーサに無視させ、意図した部分だけを有効化する回避手法。今回はOAuthパラメータを`#`以降へ押しやって悪用する。

## 影響範囲 / 推奨対応

OneDrive/WOPI連携を持つオンプレミスExchange 2016/2019/SEが対象。低権限アカウントさえあれば機密ファイルを窃取でき、PoC公開で悪用容易性が高い。2026年6月9日更新の即時適用、egress制限、露出環境での漏えい調査と資格情報ローテーションを推奨。オンプレExchangeは攻撃者の常襲標的であり優先対応を。

## リンク

- Cyber Security News: https://cybersecuritynews.com/exchange-ssrf-poc-exploit-released/
- HawkTrace 解説: https://hawktrace.com/blog/CVE-2026-45504/
- GBHackers: https://gbhackers.com/microsoft-exchange-ssrf-vulnerability/
- Petri（EoP/パッチ）: https://petri.com/microsoft-patches-exchange-privilege-elevation-vulnerability/
