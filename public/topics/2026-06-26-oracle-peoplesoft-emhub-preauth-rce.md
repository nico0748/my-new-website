# Oracle PeopleSoft PeopleTools 認証不要RCE CVE-2026-35273 を ShinyHunters がゼロデイ悪用

> トピック: 脆弱性ニュース ｜ 出典: Oracle Security Alert / Rapid7 / Arctic Wolf ｜ 種別: SSRF（CWE-918）/ 認証欠落（CWE-306）→ RCE

## 一行サマリー

人事・財務などの基幹業務を担う Oracle PeopleSoft PeopleTools の Environment Management（EMHub）に、認証なしで遠隔コード実行できる致命的欠陥（CVSS 9.8）があり、攻撃グループ ShinyHunters がパッチ公開前のゼロデイとして悪用、大学・病院・政府機関を含む100以上の組織・約300のインストールを侵害した。

## 🔰 初学者向け（何が・なぜ問題か）

PeopleSoft は、大学や大企業、官公庁が「職員の人事情報・給与・学生情報・財務」をまとめて管理する基幹システムです。組織の最重要データが集まる「金庫」のような存在です。

今回の欠陥は、その金庫を管理する裏方の仕組み（環境管理ハブ＝EMHub）に、認証なしで外部から命令を送り込める入口があったことです。たとえるなら、金庫室の壁に、職員証チェックのない配管点検口がついていて、そこから手を伸ばせば金庫の中身を取り出せてしまう、という状態でした。

しかも今回は、修正パッチが世に出る前から攻撃が始まっていた「ゼロデイ」です。攻撃グループ ShinyHunters は、この穴を使って多数の組織に侵入し、データを盗み出して「公開されたくなければ金を払え」と脅す恐喝を行いました。大学や病院など、個人情報を大量に扱う組織が標的になっている点が特に深刻です。

## 🧠 専門的解説（技術詳細・メカニズム・検知対応）

### 技術的詳細（種別・前提条件）

- 種別: サーバーサイドリクエストフォージェリ（CWE-918）と評価する報告と、認証チェック欠落（CWE-306）を指す報告がある（要確認）。結果として認証不要の RCE に至る。
- 対象コンポーネント: PeopleTools の Updates Environment Management（EMHub / PSEMHUB）。
- CVSS: 9.8（Critical）。遠隔・認証不要・ユーザー操作不要、HTTP 到達のみで成立。
- 影響バージョン: PeopleTools 8.61 および 8.62（要確認）。
- 修正: Oracle が advisory と同日に緊急（out-of-band）パッチを公開。
- 悪用状況: ゼロデイ。2026年5月27日〜6月9日に実環境での悪用を観測し、Oracle の公表に約2週間先行。ShinyHunters による恐喝キャンペーンに利用。

### メカニズム（攻撃が成立する仕組み）

注: 概念レベルにとどめ、武器化手順・PoC は記載しない。

1. **露出した管理コンポーネント**: EMHub（環境管理ハブ）は本来、PeopleSoft の構成・更新を内部で取りまとめる裏方サービスだが、その HTTP エンドポイント（/PSEMHUB/* 等）が外部から到達可能だった。
2. **認証境界の不備**: そのエンドポイントが認証なし、もしくは不十分なアクセス制御で要求を受け付けたため、攻撃者は正規利用者を装わずに処理を起動できた（CWE-306 の型）。
3. **SSRF プリミティブ（CWE-918 の型）**: さらにサーバー側に「攻撃者が指定した宛先へサーバー自身がリクエストを送る」挙動があれば、内部限定のサービスやメタデータへ間接アクセスでき、攻撃者は内部到達性という強力なプリミティブを得る。
4. **RCE への橋渡し**: 認証回避と内部到達性を組み合わせ、内部処理の連鎖を通じてコード実行へ到達。サーバーを掌握後、データ窃取・横展開・恐喝へ進む。
5. **一般原理**: 「内部前提の管理ハブを境界外に露出」「サーバーが信頼して外部指定先へ通信する」設計は、認証欠落＋SSRF の典型的な複合クラス。

### 検知・暫定緩和・恒久対策

- 検知の着眼点: /PSEMHUB/* や /PSIGW/HttpListeningConnector への外部からの想定外アクセス、サーバー発の不審な内部向けリクエスト、Web/アプリサーバーでの予期しない子プロセス起動、新規 Web シェルの痕跡。
- 暫定緩和: マルチサーバ構成では EMHub サービスを無効化、単一サーバ構成では PSEMHUB アプリを削除。境界・FW で /PSEMHUB/* と /PSIGW/HttpListeningConnector への外部アクセスを遮断。
- 恒久対策: Oracle の緊急パッチを適用。基幹システムをインターネットへ直接公開しない構成へ。
- 運用示唆: ゼロデイ前提で、すでに侵害された可能性を含めた IR（侵害調査）を実施。基幹データの持ち出し検知を強化。

## 📖 用語解説（このニュースとのつながり）

- **PeopleSoft / PeopleTools**: Oracle の ERP・人事・学務基盤と、その開発/管理基盤。組織の最重要データが集まるため標的価値が高い。
- **EMHub（Environment Management Hub）**: PeopleSoft の環境構成・更新を仲介する内部サービス。本件の侵入口。
- **SSRF（CWE-918）**: サーバーを騙して攻撃者の狙う宛先へリクエストさせる欠陥。内部資産への踏み台になる。
- **認証欠落（CWE-306）**: 認証チェックの実装漏れ。今回の根本原因候補の一つ。
- **ゼロデイ**: 修正が存在しない時点で悪用される脆弱性。防御側が後手に回る。
- **ShinyHunters**: データ窃取・恐喝で知られる攻撃グループ。本件で100以上の組織を侵害。

## 影響範囲 / 推奨対応

PeopleTools 8.61 / 8.62 を運用する組織（特に大学・病院・官公庁など個人情報を多く扱う組織）が対象。Oracle の緊急パッチを即時適用し、EMHub の無効化/削除と /PSEMHUB・/PSIGW への外部アクセス遮断を行う。ゼロデイ悪用のため、既に侵害された前提で侵害調査とデータ持ち出し確認を実施する。

## リンク

- https://www.oracle.com/security-alerts/alert-cve-2026-35273.html
- https://www.rapid7.com/blog/post/etr-active-exploitation-of-oracle-peoplesoft-zero-day-cve-2026-35273/
- https://arcticwolf.com/resources/blog/critical-oracle-peoplesoft-vulnerability-actively-exploited-in-shinyhunters-campaign/
- https://thehackernews.com/2026/06/shinyhunters-exploits-oracle-peoplesoft.html
- https://socradar.io/blog/cve-2026-35273-oracle-peoplesoft-peopletools/

トピック: 500-セキュリティ/510-脅威情報/README ／ 区分: 500-セキュリティ/README
