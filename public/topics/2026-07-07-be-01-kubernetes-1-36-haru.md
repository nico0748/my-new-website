# Kubernetes v1.36「Haru」— User Namespaces GA・CEL ミューテーション・Ingress-NGINX 引退という地殻変動

> トピック: Kubernetes v1.36 の安定化機能と周辺の大変化｜出典: Kubernetes 公式リリースページ｜種別: メジャー定期リリース（2026年第1弾）

## 一行サマリー

Kubernetes v1.36（コードネーム Haru、2026年4月22日リリース）は70件の機能強化のうち User Namespaces・Mutating Admission Policies・Fine-Grained Kubelet API 認可の3本柱を GA に昇格させ、kube-proxy の IPVS モード削除と Ingress-NGINX プロジェクト引退という運用面の大きな転換点を伴う、セキュリティ強化と AI ワークロード対応が主題のリリースである。

## 🔰 初学者向け（何が・なぜ重要か）

Kubernetes は「たくさんのサーバーの上でアプリの容れ物（コンテナ）を自動配置・自動復旧してくれる管制塔」です。世界中のクラウドサービスの裏側で動いており、年に3回ほど新版が出ます。

v1.36 の目玉は「User Namespaces の正式化」です。これまでコンテナの中で「管理者（root）」として動くプログラムは、万一コンテナの壁を破られると、その外側のサーバー本体でも強い権限を持ってしまう危険がありました。User Namespaces は「コンテナの中では王様に見えるが、外の世界では一般人」という変装の仕組みです。マンションの部屋の中では自由でも、建物全体の鍵は持っていない状態にできるので、侵入されたときの被害が劇的に小さくなります。約4年の開発を経てようやく「全員が使っていい」正式機能になりました。

もう一つの大ニュースは、長年定番だった入口係のソフト「Ingress-NGINX」が開発終了になったこと。今後は後継の Gateway API 系への引っ越しが必要です。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- 機能強化70件: Stable 18 / Beta 25 / Alpha 25。
- **User Namespaces が GA**（v1.25 alpha から約4年）: Pod ごとに独立した UID 名前空間を付与。コンテナ内 UID 0 はホスト上の非特権 UID にマップされる。
- **Mutating Admission Policies が GA**: CEL（Common Expression Language)でミューテーションロジックをネイティブの Kubernetes オブジェクトとして定義。Webhook 方式に比べレイテンシと運用複雑性を削減。
- **Fine-Grained Kubelet API Authorization が GA**: kubelet API の細粒度認可。
- **IPVS モード削除**: v1.35 で非推奨→v1.36 で削除。iptables モードまたは eBPF ベース CNI が公式推奨に。
- **Ingress-NGINX 引退**: 2026年3月24日で開発終了。今後リリース・バグ修正・セキュリティパッチなし。
- その他: HPA scale-to-zero、in-place Pod リソースリサイズ、gang scheduling（AI/バッチ向けの一括スケジューリング）、GPU 向け DRA 改善など（各機能の成熟段階は要確認）。

### 仕組み / 背景（なぜこう設計されたか）

**User Namespaces** の遅さは、Linux カーネル機能（userns）自体は古くからあるのに、コンテナランタイム・ボリュームの UID マッピング（idmapped mounts）・イメージレイヤの所有権処理まで一気通貫で整合させる必要があったため。GA の意味は「エコシステム全体の足並みが揃った」ことにある。原理的には、権限昇格型のコンテナエスケープ（カーネル脆弱性経由を含む）に対する被害半径を「ホスト root」から「無権限 UID」へ縮める多層防御で、Pod Security Standards と補完関係にある。

**Mutating Admission Policies** は「クラスタへの入場審査で書類を書き換える」処理を、外部 Webhook サーバー（可用性・レイテンシ・証明書運用の三重苦）から、API サーバー内で評価される宣言的 CEL 式へ移すもの。Validating Admission Policies（先に GA）と対になり、「ポリシーはコードでなくデータ」という方向を完成させる。トレードオフは表現力で、CEL で書けない複雑な変換（外部参照が要るもの）は引き続き Webhook が必要。

**IPVS 削除と Ingress-NGINX 引退**は同じ物語の別章で、「カーネルの汎用機構＋雑多なアドオン」から「eBPF と Gateway API という次世代標準」への新陳代謝。特に Ingress-NGINX は CVE 対応の負荷（2025年の IngressNightmare 系脆弱性の記憶も新しい）を考えると、メンテ停止は事実上の移行強制である。

### 実務での使いどころ・移行の勘所

- **Ingress-NGINX 利用クラスタは移行が最優先課題**。候補は Gateway API 実装（Envoy Gateway、Cilium、クラウド各社のマネージド Gateway）や nginx 系後継（InGate の成熟度は要確認）。「パッチが出ない入口」を放置するリスクは大きい。
- kube-proxy を IPVS モードで運用しているクラスタは v1.36 に上げる前に iptables / eBPF CNI（Cilium 等）への切り替えが必須。
- User Namespaces はマルチテナントや信頼度の低いワークロードを動かす環境から順次有効化。古いカーネル・特定のボリュームプラグインとの互換に注意。
- ミューテーション Webhook の棚卸しをして、単純なラベル付与・サイドカー注入系は CEL ポリシーへ置換すると障害点が減る。

## 📖 用語解説（このトピックとのつながり）

- **User Namespace**: コンテナ内 UID をホストの別 UID にマップする Linux 機構。コンテナエスケープ時の権限を最小化する。
- **CEL**: Kubernetes がポリシー記述に採用する式言語。Webhook を書かずに入場審査ロジックを宣言できる。
- **IPVS / iptables / eBPF**: Service の負荷分散を実現するカーネル側の3世代の技術。v1.36 で IPVS が退場し eBPF が本命に。
- **Gateway API**: Ingress の後継となるルーティング標準。Ingress-NGINX 引退で移行が現実の締切を持った。
- **DRA（Dynamic Resource Allocation）**: GPU 等の動的デバイス割り当ての枠組み。AI ワークロード対応の中核。

## 影響範囲 / 推奨アクション

- 全クラスタ管理者: Ingress-NGINX 依存の有無を即時確認し、移行計画を策定（これが v1.36 世代最大の宿題）。
- セキュリティ要件の高い環境: User Namespaces の段階的有効化を計画。
- v1.33 以前のクラスタはサポート窓（直近3マイナー）から外れるため、まず追い付きを。

## リンク

- 公式リリースページ: https://kubernetes.io/releases/1.36/
- InfoQ 解説: https://www.infoq.com/news/2026/05/kubernetes-1-36-released/
