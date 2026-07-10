import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "machine-learning-stack",
  title: "機械学習のための技術スタック",
  description: "データからモデルを学習させ、本番で使うまでの代表スタック。言語・ライブラリ、古典ML と深層学習フレームワーク、データ処理、実験管理、そして MLOps（学習〜デプロイ〜監視）までを俯瞰する。",
  domain: "stack",
  section: "machine-learning",
  order: 1,
  level: "basic",
  tags: ["機械学習", "PyTorch", "MLOps", "データ"],
  updated: "2026-07-09",
  minutes: 9,
};

export default function Article() {
  return (
    <>
      <Lead>
        機械学習は<strong>データからパターンを学習させ、予測に使う</strong>技術です。スタックは「言語・基盤ライブラリ」「モデルを作るフレームワーク」「データ処理」「実験管理」「本番運用(MLOps)」の層で捉えると、全体像が掴めます。
      </Lead>

      <Section>言語と基盤ライブラリ</Section>
      <ComparisonTable
        headers={["役割", "代表", "何をするか"]}
        rows={[
          ["言語", "Python（R・Julia）", "ML のデファクト。ライブラリが最も充実"],
          ["数値計算", "NumPy", "多次元配列と高速な数値演算の土台"],
          ["表形式データ", "pandas・Polars", "データの読み込み・整形・集計"],
          ["可視化", "Matplotlib・seaborn・Plotly", "データとモデル結果の可視化"],
        ]}
      />

      <Section>モデルを作るフレームワーク</Section>
      <ComparisonTable
        headers={["種類", "代表", "向いている場面"]}
        rows={[
          ["古典的 ML", "scikit-learn", "回帰・分類・クラスタリングの基本。まずここから"],
          ["勾配ブースティング", "XGBoost・LightGBM・CatBoost", "表形式データで非常に強い。実務の定番"],
          ["深層学習", "PyTorch・TensorFlow/Keras・JAX", "画像・音声・言語などの複雑なデータ"],
          ["事前学習モデル", "Hugging Face Transformers", "既存モデルを使う・微調整(ファインチューニング)"],
        ]}
      />
      <Callout variant="info" title="表データは勾配ブースティング、非構造データは深層学習">
        画像・テキストのような非構造データは深層学習(PyTorch 等)が強い一方、<strong>表形式データでは XGBoost / LightGBM が今も非常に強力</strong>です。「何でも深層学習」ではなく、データの種類で選ぶのが実務の勘所です。研究・新モデルは PyTorch が主流です。
      </Callout>

      <Section>データ処理・特徴量</Section>
      <ComparisonTable
        headers={["役割", "代表", "役割の説明"]}
        rows={[
          ["大規模データ処理", "Spark・Dask", "1台に載らない大きなデータの分散処理"],
          ["特徴量ストア", "Feast 等", "学習と推論で同じ特徴量を再利用する"],
          ["データ版管理", "DVC・LakeFS", "データセットとモデルをコードのように管理"],
          ["アノテーション", "Label Studio 等", "教師データのラベル付け"],
        ]}
      />

      <Section>実験管理と MLOps</Section>
      <ComparisonTable
        headers={["フェーズ", "代表", "役割"]}
        rows={[
          ["実験管理", "MLflow・Weights & Biases", "パラメータ・精度・成果物を記録して比較"],
          ["パイプライン", "Kubeflow・Airflow・Metaflow", "前処理→学習→評価を自動化・再現"],
          ["モデル配信", "FastAPI・BentoML・TorchServe・Triton", "学習済みモデルを API として提供"],
          ["監視", "Evidently 等", "本番の精度劣化・データドリフトを検知"],
          ["基盤", "Docker・クラウド(SageMaker/Vertex AI)・GPU", "学習・推論の実行環境"],
        ]}
      />
      <Callout variant="tip" title="モデル作りは全体の一部">
        「精度の高いモデルを作る」のは工程の一部にすぎません。実務では<strong>データ整備・再現性・デプロイ・監視</strong>までを含めた MLOps が成否を分けます。コンテナ(Docker)やクラウドといったインフラの知識がそのまま効いてきます。
      </Callout>

      <Section>選び方の指針</Section>
      <ul>
        <li><strong>まず基本を学ぶ</strong> → Python＋NumPy/pandas＋scikit-learn</li>
        <li><strong>表形式データで高精度</strong> → XGBoost / LightGBM</li>
        <li><strong>画像・音声・言語</strong> → PyTorch（＋ Hugging Face）</li>
        <li><strong>実験を整理・比較</strong> → MLflow / W&B</li>
        <li><strong>本番運用</strong> → API 配信(FastAPI/BentoML)＋監視＋クラウド GPU</li>
      </ul>

      <Divider />

      <KeyPoints
        items={[
          "土台は Python＋NumPy/pandas。古典 ML は scikit-learn から",
          "表データは XGBoost/LightGBM、非構造データは PyTorch が主流",
          "既存モデルの活用・微調整は Hugging Face Transformers",
          "実験管理(MLflow/W&B)で再現性を確保し、比較できるようにする",
          "MLOps（データ整備・デプロイ・監視）まで含めて初めて実務で使える",
        ]}
      />
    </>
  );
}
