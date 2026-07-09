# OpenAI AgentKit と Secure MCP Tunnel — Responses API を軸にした企業向けエージェント基盤

> トピック: OpenAI AgentKit / Responses API 強化 / Secure MCP Tunnel｜出典: OpenAI 公式 / VentureBeat / InfoQ｜種別: AI エージェント基盤（製品拡充・一部整理）

## 一行サマリー

OpenAI は Responses API を軸にエージェント構築ツール群 AgentKit を拡充し、企業が社内/オンプレの MCP サーバーへ安全に接続できる「Secure MCP Tunnel」や、エージェントスキル・ターミナルシェル対応を追加した。一方で Agent Builder と Evals 製品は2026年11月30日で提供終了予定と整理も進む。ChatKit と新 Evals 機能は全開発者に一般提供。

## 🔰 初学者向け（何が・なぜ重要か）

OpenAI は、AI エージェントを作るための道具一式を「AgentKit」としてまとめています。その土台が「Responses API」で、モデルに道具を使わせながら複数ステップの仕事をさせるための新しい窓口です。

今回の目玉の一つが「Secure MCP Tunnel（安全なトンネル）」。企業には、外部に出せない社内システムやオンプレのデータベースがあります。これらに AI を繋ぎたいけれど、セキュリティ上インターネット越しには開けたくない——その悩みに、**安全な専用通路を作って社内のツール（MCP サーバー）に繋ぐ**仕組みで応えます。たとえるなら、建物の外に出さずに社内配管だけで水を通すようなイメージ。

同時に、機能が重複していた一部の製品（Agent Builder など）は畳む方向で整理されます。道具箱を広げつつ、散らかった部分は片付ける、というのが全体像です。

## 🧠 専門的解説（技術詳細・設計・使いどころ）

### 技術的詳細（何が変わったか）

- **Responses API**: OpenAI 組み込みツールを使ってエージェントを作るための API プリミティブ。Chat Completions の手軽さと Assistants のツール活用を統合した後継的位置づけ。エージェントスキル、完全なターミナルシェル対応などを追加。
- **AgentKit**: Responses API 上に構築されたエージェント開発・デプロイ・最適化の一式。
- **Secure MCP Tunnel（企業向け）**: ChatGPT web / Codex / Responses API / AgentKit などから、プライベート/オンプレの MCP サーバーへ安全に接続する仕組み。
- **モデレーション統合**: Responses API / Chat Completions に moderation スコアを追加し、入力・出力双方の判定を取得可能に。
- **一般提供と整理**: ChatKit と新 Evals は全開発者に GA。Connector Registry はベータ展開開始。一方で Agent Builder と Evals（旧）製品は2026年11月30日以降は提供されない。

### 仕組み / 背景（なぜこう設計されたか）

エージェント API の設計は「Chat Completions（軽量・自由）」と「Assistants（ツール/状態を抱える）」の間で揺れてきた。Responses API はこの二者を統合し、ツール利用を前提にしつつ軽量に使える単一プリミティブを目指す。エージェント時代には「モデル呼び出し」より「ツールを使った多段実行」が主役になるため、API 自体がツール実行・状態・スキルを一級で扱う形へ寄せている。

Secure MCP Tunnel の要点は、MCP という標準でツールを繋ぐ利便性と、企業のネットワーク境界・データ主権という制約の両立にある。MCP サーバーを公開せずに、認証されたトンネル経由でのみアクセスを許すことで、社内データを外部に露出せずエージェントから使える。トレードオフは、トンネル・認証・監査といった運用要素が増える点と、ベンダー（OpenAI）基盤への結合度が上がる点。Agent Builder 等の終息は、重複機能を Responses API/AgentKit へ集約し、プラットフォームの一貫性を優先する判断と読める。移行を迫られる利用者には期限（2026年11月30日）が明示されている。

### 実務での使いどころ・移行の勘所

社内システムやオンプレ DB に AI エージェントを繋ぎたい企業に Secure MCP Tunnel は直接刺さる（データを外に出さずに MCP で接続できる）。新規実装は Responses API/AgentKit を軸に設計すると、OpenAI の方向性に沿える。ただし Agent Builder / 旧 Evals に依存している場合は、2026年11月30日の終了に向けた移行計画が必要。ベンダーロックインを避けたい場合は、MCP を標準面として保ちつつ、モデル/基盤を差し替え可能に保つ設計（他社の A2A/MCP 対応フレームワークとの併用）を検討する。

## 📖 用語解説（このトピックとのつながり）

- **AgentKit**: OpenAI のエージェント開発ツール一式。本トピックの主役。
- **Responses API**: ツール利用前提のエージェント構築 API プリミティブ。AgentKit の土台。
- **MCP（Model Context Protocol）**: モデルにツール/データを繋ぐ標準。Tunnel はこれを安全に社内接続する。
- **Secure MCP Tunnel**: プライベート/オンプレ MCP サーバーへ安全接続する企業向け機能。
- **Connector Registry**: 連携先を管理する仕組み。ベータ展開中。

## 影響範囲 / 推奨アクション

社内/オンプレ資産に AI を繋ぎたい企業は Secure MCP Tunnel が有力。新規は Responses API/AgentKit 中心に設計。Agent Builder / 旧 Evals 利用者は2026年11月30日終了に向け移行計画を。ロックイン回避には MCP を標準面に保ち基盤差し替え可能な設計を検討。

## リンク

- OpenAI「Introducing AgentKit」: https://openai.com/index/introducing-agentkit/
- OpenAI API Changelog: https://developers.openai.com/api/docs/changelog
- InfoQ「OpenAI Extends the Responses API for Autonomous Agents」: https://www.infoq.com/news/2026/03/openai-responses-api-agents/
