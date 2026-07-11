import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "ai-agent-stack",
  title: "AIエージェント開発の技術スタック",
  description: "LLM に『ツールを使わせて自律的にタスクをこなさせる』エージェント開発の代表スタック。モデル・オーケストレーションフレームワーク・ツール連携(RAG/MCP)・記憶・評価/監視までを俯瞰する。",
  domain: "stack",
  section: "ai-agent",
  order: 1,
  level: "basic",
  tags: ["AIエージェント", "LLM", "LangChain", "RAG"],
  updated: "2026-07-09",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        AIエージェントは、LLM に<strong>「考えて、道具（ツール）を使って、結果を見てまた考える」</strong>ループを回させ、タスクを自律的にこなさせる仕組みです。中心は LLM ですが、実際のスタックは「モデル」「束ねるフレームワーク」「ツール連携」「記憶」「評価・監視」の層で組み立てます。
      </Lead>

      <Section>基盤モデル（LLM）</Section>
      <ComparisonTable
        headers={["提供形態", "代表", "特徴"]}
        rows={[
          ["API（クローズド）", "OpenAI (GPT)・Anthropic (Claude)・Google (Gemini)", "最高性能・すぐ使える。データは外部送信"],
          ["オープンウェイト", "Llama・Mistral・Qwen・Gemma", "自前ホスト可・カスタマイズしやすい"],
          ["ローカル実行", <><Tech id="ollama">Ollama</Tech>・LM Studio・<Tech id="vllm">vLLM</Tech></>, "手元/自社サーバーで動かす。機密データ向き"],
        ]}
      />
      <Callout variant="info" title="まず API で作り、必要ならローカルへ">
        学習・試作は API（Claude / GPT / Gemini）が手軽で高性能です。機密データやコスト・レイテンシの都合が出てきたら、<strong>Ollama / vLLM でオープンモデルを自前ホスト</strong>する、という順序が現実的です。
      </Callout>

      <Section>オーケストレーション・フレームワーク</Section>
      <ComparisonTable
        headers={["フレームワーク", "特徴"]}
        rows={[
          [<Tech id="langchain">LangChain</Tech>, "最も普及。ツール・プロンプト・チェーンの部品が豊富"],
          [<Tech id="langgraph">LangGraph</Tech>, "エージェントを『グラフ（状態遷移）』で設計。分岐・ループ・人手介入に強い"],
          [<Tech id="llamaindex">LlamaIndex</Tech>, "RAG（検索連携）に強み。データ取り込み〜検索が得意"],
          ["OpenAI Agents SDK / Assistants", "OpenAI 純正のエージェント構築"],
          ["CrewAI・AutoGen", "複数エージェントの協調（マルチエージェント）"],
        ]}
      />

      <Section>ツール連携・データ接続</Section>
      <ComparisonTable
        headers={["要素", "代表", "役割"]}
        rows={[
          [<Tech id="rag">RAG（検索拡張生成）</Tech>, <>ベクトルDB(<Tech id="pgvector">pgvector</Tech>/Pinecone/Qdrant)＋埋め込み</>, "自社ドキュメントを根拠に回答させる"],
          ["ツール / 関数呼び出し", "Function calling・各種 API", "検索・計算・DB 操作などを実行させる"],
          [<Tech id="mcp">MCP（Model Context Protocol）</Tech>, "MCP サーバー", "ツールやデータ源を標準化された形で接続"],
          ["ブラウザ / コード実行", "Playwright・サンドボックス", "Web 操作やコード実行をエージェントに委ねる"],
        ]}
      />
      <Callout variant="tip" title="エージェントの賢さ＝『使える道具』の質">
        LLM 単体は「考える」だけです。<strong>検索(RAG)・API・コード実行といったツール</strong>を与えて初めて、実務のタスクをこなせます。エージェント開発の勘所は、モデル選びよりも<strong>ツールと文脈（コンテキスト）の設計</strong>にあります。
      </Callout>

      <Section>記憶・評価・監視</Section>
      <ComparisonTable
        headers={["層", "代表", "役割"]}
        rows={[
          ["短期/長期メモリ", "会話履歴・ベクトルメモリ", "過去のやりとりや知識を保持する"],
          ["評価（Eval）", "LangSmith・Ragas・独自テスト", "回答の正しさ・幻覚(hallucination)を測る"],
          ["可観測性/トレース", <><Tech id="langsmith">LangSmith・Langfuse</Tech>・OpenTelemetry</>, "各ステップの入出力・コスト・遅延を追跡"],
          ["ガードレール", "入出力フィルタ・スキーマ検証", "危険な出力や逸脱を抑える"],
        ]}
      />

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>まず動かす</strong> → API モデル（Claude / GPT / Gemini）＋ LangChain</li>
        <li><strong>複雑な分岐・人手介入・長い手順</strong> → LangGraph</li>
        <li><strong>社内文書に基づく回答</strong> → RAG（LlamaIndex＋ベクトルDB）</li>
        <li><strong>機密データ・コスト重視</strong> → オープンモデルを Ollama / vLLM で自前ホスト</li>
        <li><strong>本番運用</strong> → 評価(Eval)と可観測性(トレース)を最初から組み込む</li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "エージェントは LLM に『思考→ツール使用→観察』のループを回させる仕組み",
          "モデルは API(Claude/GPT/Gemini)かオープン(Llama/Mistral＋Ollama/vLLM)",
          "フレームワークは LangChain、複雑な制御は LangGraph、RAG は LlamaIndex",
          "賢さの鍵はツール(RAG/関数/MCP)と文脈設計。モデル選び以上に重要",
          "本番は評価(Eval)・トレース(LangSmith/Langfuse)・ガードレールを組み込む",
        ]}
      />
    </>
  );
}
