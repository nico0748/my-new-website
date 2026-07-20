import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, ComparisonTable, KeyPoints, Callout, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "it-ai",
  title: "AI・機械学習・エージェント用語",
  description: "機械学習・ディープラーニング・過学習・LLM・プロンプト・トークン・埋め込み・RAG・ファインチューニング・AIエージェント・MCP/Hooks など、AI 開発の基本用語を収録。",
  domain: "it-terms",
  section: "ai",
  order: 1,
  level: "intro",
  tags: ["AI", "機械学習", "LLM"],
  updated: "2026-07-19",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        AI まわりの用語です。土台の機械学習から、いま話題の LLM・生成 AI、そして「ツールを使って自律的に動く」AI エージェントの順に整理します。
      </Lead>

      <Section>機械学習の基礎</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["機械学習", "Machine Learning", "データからパターンを学び、予測や判断を行う技術"],
          ["ディープラーニング", "Deep Learning", "多層のニューラルネットワークを使った機械学習"],
          ["ニューラルネットワーク", "Neural Network", "脳の神経を模した、層状に計算するモデル"],
          ["教師あり / なし / 強化学習", "Supervised / Unsupervised / Reinforcement", "正解付きで学ぶ / 正解なしで構造を見つける / 報酬で試行錯誤して学ぶ"],
          ["学習（訓練） / 推論", "Training / Inference", "データからモデルを作る / 学習済みモデルで予測する"],
          ["データセット / 特徴量 / ラベル", "Dataset / Feature / Label", "学習に使うデータ / 入力の手がかり / 正解の値"],
          ["分類 / 回帰", "Classification / Regression", "カテゴリを当てる / 数値を予測する"],
          ["過学習", "Overfitting", "訓練データに適合しすぎ、未知のデータに弱くなること"],
          ["汎化", "Generalization", "未知のデータにもうまく対応できる性能"],
          ["パラメータ / ハイパーパラメータ", "Parameter / Hyperparameter", "学習で調整される値 / 人が事前に決める設定"],
          ["勾配降下法", "Gradient Descent", "誤差が小さくなる方向に少しずつ値を調整する学習法"],
          ["MLOps", "MLOps", "学習〜デプロイ〜監視まで、ML の運用を回す仕組み"],
        ]}
      />

      <Section>LLM・生成 AI</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["LLM（大規模言語モデル）", "Large Language Model", "大量のテキストで学習し、文章を生成・理解するモデル"],
          ["生成 AI", "Generative AI", "文章・画像・コードなどを生成する AI の総称"],
          ["プロンプト", "Prompt", "AI への指示・入力文。工夫することをプロンプトエンジニアリングという"],
          ["トークン", "Token", "AI が扱う文字のかたまりの単位。課金や長さの基準になる"],
          ["コンテキストウィンドウ", "Context Window", "モデルが一度に扱える入力の長さの上限"],
          ["埋め込み / ベクトル", "Embedding / Vector", "文章などを意味を保った数値の並びに変換したもの"],
          ["ハルシネーション", "Hallucination", "もっともらしいが誤った内容を生成してしまう現象"],
          ["ファインチューニング", "Fine-tuning", "既存モデルを追加学習させ、用途に合わせて調整すること"],
          ["RAG（検索拡張生成）", "Retrieval-Augmented Generation", "外部の知識を検索して渡し、回答の精度・最新性を高める手法"],
          ["ベクトル DB", "Vector Database", "埋め込みを保存し、意味の近いものを高速に検索する DB"],
          ["temperature", "Temperature", "出力のランダムさ（多様さ）を調整するパラメータ"],
          ["マルチモーダル", "Multimodal", "テキストだけでなく画像・音声なども扱えること"],
        ]}
      />

      <Section>AI エージェント開発</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["AI エージェント", "AI Agent", "目標に向け、自分で考えてツールを使い、タスクを進める AI"],
          ["ツール使用 / 関数呼び出し", "Tool Use / Function Calling", "AI が外部の機能（検索・実行など）を呼び出して使うこと"],
          ["エージェンティックループ", "Agentic Loop", "収集 → 行動 → 検証 を繰り返して進める動作の流れ"],
          ["MCP", "Model Context Protocol", "AI と外部サービスをつなぐ共通規格。ツールを標準的に追加できる"],
          ["Hooks", "Hooks", "ツール実行の前後に、決めた処理を自動で挟む仕組み"],
          ["サブエージェント", "Subagent", "タスクを別コンテキストの AI に委任する仕組み"],
          ["スキル", "Skill", "再利用できる作業手順をまとめ、AI に呼び出させる仕組み"],
          ["メモリ", "Memory", "会話やタスクの状態を保持する仕組み"],
          ["プランニング", "Planning", "実行前に手順を計画させること（Plan モードなど）"],
          ["オーケストレーション", "Orchestration", "複数のモデルやツール・エージェントを組み合わせて制御すること"],
        ]}
      />

      <Callout variant="info" title="仕組みから学ぶなら">
        LLM・RAG・エージェントは「技術スタック一覧（AIエージェント / 機械学習）」で、Claude Code を使ったエージェント運用（MCP・Hooks・サブエージェント）は「Claude Code基礎」コースで扱っています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "機械学習: データで学習→推論。過学習を避け汎化させるのが目標",
          "LLM: プロンプトで指示、トークンが単位、コンテキストウィンドウが上限",
          "精度・最新性を上げる: RAG（検索して渡す）／ファインチューニング（追加学習）",
          "AIエージェント: ツールを使い自律的に動く。MCP=外部接続、Hooks=自動処理",
          "ハルシネーション（もっともらしい誤り）に注意し、出力は検証する",
        ]}
      />
    </>
  );
}
