# Cilium 1.20 プレリリース — eBPFデータパスとGateway APIでサービスメッシュ収斂が進む

> トピック: Cilium 1.20 / Kubernetes Gateway API｜出典: cilium/cilium GitHub / Gateway API SIG｜種別: プレリリース・エコシステム動向

## 一行サマリー

eBPF ベースのネットワーク/セキュリティ/可観測性基盤 Cilium が 1.20.0-pre.4（2026-07-03）を公開。L4 は eBPF データパスで、L7 は Envoy 設定へ変換する Gateway API 実装を軸に、サイドカーレスなサービスメッシュ収斂（GAMMA）が2026年の主流になりつつある。`hubble.preferIpv6` の廃止など非互換整理も進む。

## 🔰 初学者向け（何が・なぜ重要か）

Kubernetes（K8s）でたくさんのコンテナを動かすと、「どのサービスにどう通信を振り分けるか」というネットワークの交通整理が必要になります。Cilium はこれを **eBPF** という Linux カーネルの新しい仕組みで高速に行うツールです。

eBPF は、カーネル（OS の中核）に安全に小さなプログラムを差し込み、パケット処理などをカーネル内で直接こなす技術です。従来は `iptables` という古い方式でルールを積み上げていましたが、サービスが増えるとルールを1つずつ辿るため遅くなりました（O(n)）。Cilium は eBPF のハッシュテーブルを使い、サービス数によらず一定時間（O(1)）で振り分けます。渋滞する一般道を、行き先ごとに即座に分岐する高速道路に置き換えるイメージです。

もう一つのキーワード「Gateway API」は、K8s への入口（Ingress）設定を標準化した新しい仕様です。以前は製品ごとにバラバラの「アノテーション（注釈）」で設定していたのを、共通の API に統一しました。Cilium はこの Gateway API に対応し、L4（低レイヤ）は eBPF で、L7（HTTP など高レイヤ）は Envoy というプロキシの設定に変換して処理します。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- **プレリリース**: Cilium 1.20.0-pre.4 = 2026-07-03（正式版は今後。詳細機能は最終リリースノートで要確認）。
- **Gateway API 実装**: Gateway 作成時に **L4 ルーティングは eBPF マップ**へ、**L7 は Envoy 設定**へ変換する二層構造。
- **非互換整理**: `hubble.preferIpv6` Helm 値と `--hubble-prefer-ipv6` フラグを**非推奨化**し、トップレベルの `preferIpv6` に移行（旧値は 1.20 で削除予定）。
- Envoy の `clusterMaxPendingRequests` 既定値を Helm 値 `envoy.clusterMaxPendingRequests` / `--proxy-cluster-max-connections` で設定可能に。ネイティブルーティング時の strict ingress 暗号化サポートなども追加。
- **エコシステム動向**: Istio Ambient モードが GA となり推奨デプロイモデルに。GAMMA イニシアチブによる「サービスメッシュ収斂」が進行。

### 仕組み / 背景（なぜこう設計されたか）

Cilium の設計原則は「**カーネルデータパスで速く、制御は宣言的に**」です。K8s の Service ロードバランシングを、iptables の DNAT ルール群ではなく eBPF マップ（カーネルメモリ上のハッシュ表）で実装することで、ルックアップをクラスタ規模に依存しない O(1) にします。これは大規模クラスタでの性能とスケーラビリティの核心です。

Gateway API 対応で L4/L7 を分離するのは、それぞれ得意な道具に任せる設計です。**L4（TCP/UDP のルーティング）は eBPF が圧倒的に速く**、カーネルオーバーヘッドを避けて NIC のハード限界近くまで出せます。一方 **L7（HTTP ヘッダ・パス基準のルーティング、リトライ、認可など）は Envoy** に委ね、豊富な機能と成熟度を活用します。Cilium は Gateway リソースを両者の設定へ「翻訳」するコントロールプレーンとして働きます。

2026 年の大きな潮流が **GAMMA（Gateway API for Service Mesh）による収斂**です。かつて乱立した Ingress アノテーションを Gateway API が統一し、さらにメッシュ内部（サービス間通信）にも同じ意味論を広げます。**Istio Ambient**（サイドカーを各 Pod に挿さない軽量メッシュ）が GA になったことで、「サイドカーレス + eBPF/Envoy」という方向が実運用の主軸になりつつあります。トレードオフとして、実装ごと（Cilium / Istio / Envoy Gateway / Kong）に性能・機能・運用挙動の差が大きく、Gateway API という共通の皮の下で実体は大きく分かれる点に注意が必要です。

### 実務での使いどころ・移行の勘所

- **大規模 K8s の L4 ロードバランシング**では eBPF データパスの O(1) 性能が効く。kube-proxy 置き換え用途は Cilium の得意分野。
- Gateway API へ移行するなら、Ingress アノテーション依存の設定を Gateway/HTTPRoute リソースへ書き換える計画を。実装差（Cilium / Istio Ambient / Envoy Gateway）で性能特性が違うため PoC 比較を推奨。
- 1.20 では `hubble.preferIpv6` 等が削除されるため、**Helm values の更新が必須**。旧フラグを使っていると壊れる。
- サービスメッシュを検討するなら、サイドカー型より **Istio Ambient / Cilium の eBPF ベース**が運用負荷とリソース面で有利になりつつある。
- プレリリース（pre.4）は本番非推奨。正式版のリリースノートで最終仕様を確認してから採用を。

## 📖 用語解説（このトピックとのつながり）

- **eBPF**: カーネルに安全なプログラムを注入する技術。Cilium のデータパスの中核。
- **Gateway API**: K8s の入口/ルーティングを標準化した後継仕様。Ingress アノテーションを置換。
- **GAMMA**: Gateway API をサービスメッシュ（サービス間通信）へ拡張するイニシアチブ。収斂の推進役。
- **Envoy**: 高機能な L7 プロキシ。Cilium は L7 処理を Envoy 設定へ変換して委譲。
- **Istio Ambient**: サイドカーを Pod に挿さない軽量メッシュ構成。2026 に GA・推奨化。
- **kube-proxy 置き換え**: iptables ベースの Service 実装を eBPF で代替する Cilium の機能。

## 影響範囲 / 推奨アクション

- 大規模クラスタの L4 負荷分散は、eBPF データパスによる O(1) 化の恩恵を評価。
- 1.20 へ上げる前に `hubble.preferIpv6` → `preferIpv6` など**削除予定 Helm 値の移行**を実施。
- Ingress から Gateway API への移行計画を立て、実装ごとの性能を PoC で比較。
- サービスメッシュ新規採用は、サイドカーレス（Istio Ambient / Cilium）を第一候補に検討。
- プレリリースは検証環境に留め、正式版リリースノートで最終仕様を確認。

## リンク

- 一次情報: https://github.com/cilium/cilium/releases
- Gateway API 実装状況: https://gateway-api.sigs.k8s.io/implementations/
- Cilium Gateway API ドキュメント: https://docs.cilium.io/en/latest/network/servicemesh/gateway-api/gateway-api/
