# Microsoft Agent Framework が Build 2026 で本番運用へ：Agent Harness・CodeAct・Hosted Agents

> トピック: Microsoft Agent Framework｜出典: Microsoft Agent Framework Blog / Build 2026｜種別: フレームワーク更新

## 一行サマリー

2026年4月に AutoGen と Semantic Kernel を統合して 1.0 GA となった Microsoft Agent Framework (MAF) が、Build 2026 で「Agent Harness」「CodeAct」「Foundry Hosted Agents」を発表し、実験段階のエージェント作りから本番運用可能なプラットフォームへと踏み込んだ。

## 🔰 初学者向け（何が・なぜ重要か）

「AI エージェント」とは、LLM に道具（ツール）を持たせて「考える→道具を使う→結果を見てまた考える」というループを回させる仕組みのこと。デモを作るのは簡単だが、これを実運用に載せようとすると「途中でクラッシュしたらどうする」「会話が長くなってコンテキストが溢れたら」「人間の承認をどこで挟む」といった泥臭い問題が山ほど出てくる。

Microsoft Agent Framework は、これまで別々だった Microsoft の2つのエージェントライブラリ（研究寄りの AutoGen と業務寄りの Semantic Kernel）を1本に束ねたもの。今回の Build 2026 の発表は、その1本のフレームワークに「本番運用で必要になる泥臭い部分」を標準部品として組み込んだ、という点が肝になる。

料理に例えると、これまでは「レシピ（LLM の推論）」と「食材（ツール）」は揃っていたが、コンロや換気扇や食洗機（＝本番インフラ）は自分で調達する必要があった。今回はその厨房設備一式（Harness と Hosted Agents）を用意した、というイメージだ。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

MAF は 2026年4月2日に 1.0 GA に到達し、.NET と Python で同一の概念・API を提供する。Build 2026（2026年6月）では次の3つが目玉として発表された。

- **Agent Harness**: モデルの推論と実際の実行をつなぐ層。シェル/ファイルシステムアクセス、human-in-the-loop 承認フロー、長時間セッションでのコンテキスト管理を一級市民として扱う。具体的には「コンテキストの圧縮（compaction）」「指示のマージ」「TODO トラッキング」「差し替え可能なプロバイダ」を標準機能として提供する。
- **CodeAct**: ツールを1つずつ選んで待って次を選ぶ従来型ではなく、モデルが `call_tool(…)` を呼ぶ短い Python プログラムを1本書き、サンドボックスで一度実行して結果をまとめて返す方式。新パッケージ `agent-framework-hyperlight`（alpha）で提供され、モデル生成コードを呼び出しごとに新しい Hyperlight マイクロ VM で隔離実行する。
- **Foundry Hosted Agents**: 自作コードをコンテナ化して Foundry 管理インフラ上にデプロイする最も簡単な経路。ID 管理・自動スケーリング・セッション状態管理・可観測性・バージョニングが内蔵される。early July 2026 に GA 到達見込み（要確認）。

### 仕組み / 背景（なぜこう設計されたか）

CodeAct が興味深いのは、エージェントのループ設計に対する一種のアンチテーゼだからだ。従来の「ReAct 型」ループは、1回のモデル呼び出しで1つのツールを選び、その結果を再びモデルに戻す。ツールを N 回使うと N 往復のモデル呼び出しが要り、レイテンシもトークンも積み上がる。CodeAct は「複数ツール呼び出しを含む短いコードを1本書かせ、それを1回実行する」ことで、往復回数を劇的に減らす。ループの制御構造（if/for）をモデルの生成物としてコードに埋め込めるのも強い。

このコード実行にはセキュリティリスクが伴う（モデルが任意コードを書く）。そこで Hyperlight マイクロ VM を使い、ツール呼び出し1回の粒度で軽量な VM 隔離をほぼ無償で得られる設計にした。VM 起動が重ければ「呼び出しごとに新 VM」は非現実的だが、Hyperlight は極小フットプリントのため成立する。

Agent Harness の思想は「エージェント本体（推論とツール選択）」と「運用機構（コンテキスト管理・承認・永続化）」を分離することにある。これは Pydantic AI V2 の Harness や Claude Agent SDK のサブエージェント設計とも共通する 2026年のトレンドで、「コアは小さく安定させ、運用機構は差し替え可能に」という方向に業界が収束しつつある。

### 実務での使いどころ・移行の勘所

既存の Semantic Kernel / AutoGen 資産を持つチームは、MAF が正式な統合先なので移行を検討する価値がある。逆に LangGraph や CrewAI を採用済みのチームが乗り換える動機は薄い。MAF の強みは .NET と Python の両対応と Azure/Foundry との統合であり、Microsoft エコシステム（Entra ID・Azure）に寄っている組織に最も刺さる。CodeAct は多ツール連携が多いワークフローでレイテンシ削減が期待できるが alpha なので本番投入は慎重に。

## 📖 用語解説（このトピックとのつながり）

- **Agent Harness**: エージェントの「運用機構」を担う層。コンテキスト圧縮・承認・永続化などを標準化し、推論本体と分離する。
- **CodeAct**: ツールを個別選択する代わりにコードを1本書かせて一括実行するエージェント動作パターン。往復回数削減が狙い。
- **Hyperlight**: Microsoft のマイクロ VM 技術。極小オーバーヘッドで強いコード隔離を提供し、CodeAct のサンドボックス実行を支える。
- **Foundry (Microsoft Foundry)**: エージェント/モデルのビルド・デプロイを担う Azure のプラットフォーム。Hosted Agents の実行基盤。
- **human-in-the-loop**: エージェントの重要操作前に人間の承認を挟む設計。Harness が一級市民として扱う。

## 影響範囲 / 推奨アクション

- Semantic Kernel / AutoGen 利用チームは MAF への移行パスを確認する。両者は MAF に統合済み。
- 多ツール連携のレイテンシに悩むなら CodeAct を PoC で評価（alpha 前提）。
- Azure/Entra ID 中心の組織は Foundry Hosted Agents の GA 時期（early July 2026 見込み・要確認）を追う。
- LangGraph/CrewAI を採用済みなら急いで乗り換える必要はない。比較検討にとどめる。

## リンク

- 一次情報: https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-at-build-2026-announce/
- Build 2026 recap: https://developer.microsoft.com/blog/build-recap
