import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider, Figure } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "game-stack",
  title: "ゲーム開発の技術スタック",
  description: "ゲームを作るためのエンジンの代表スタック。Unity・Unreal Engine・Godot の違い（言語・得意分野・ライセンス）と選び方を俯瞰する。",
  domain: "stack",
  section: "game",
  order: 1,
  level: "intro",
  tags: ["Unity", "Unreal Engine", "Godot", "ゲームエンジン"],
  updated: "2026-07-09",
  minutes: 5,
};

export default function Article() {
  return (
    <>
      <Lead>
        ゲーム開発の中心は<strong>ゲームエンジン</strong>です。物理・描画・入力・アニメーションなどを土台として提供してくれるので、開発者はゲームの中身づくりに集中できます。3つの代表を押さえましょう。
      </Lead>

      <Section>3大ゲームエンジン</Section>
      <ComparisonTable
        headers={["エンジン", "言語", "得意分野", "ライセンス"]}
        rows={[
          [<Tech id="unity">Unity</Tech>, "C#", "モバイル/インディー・VR/AR・2D も強い", "無料枠あり（規模で課金）"],
          [<Tech id="unreal">Unreal Engine</Tech>, "C++ / Blueprint", "高品質3D・AAA・映像制作", "売上に応じたロイヤリティ"],
          [<Tech id="godot">Godot</Tech>, "GDScript / C#", "軽量・2D/3D・個人開発", "完全 OSS・無料"],
        ]}
      />
      <Figure
        src="/learn/shots/stack/game-stack-01.svg"
        alt="Unity エディタの画面。シーンビュー・ヒエラルキー・インスペクターが並ぶ標準レイアウト"
        caption="ゲームエンジンは「コードを書く道具」というより、この統合開発環境そのもの"
      />
      <Callout variant="info" title="得意分野で選ぶ">
        モバイルやインディー、幅広いプラットフォームなら <Tech id="unity">Unity</Tech>、フォトリアルな高品質3Dなら <Tech id="unreal">Unreal Engine</Tech>、軽量で完全 OSS がよければ <Tech id="godot">Godot</Tech> が目安です。
      </Callout>
      <Callout variant="tip" title="Web の 3D は別系統">
        ブラウザ上の 3D 表現は、ゲームエンジンではなく <Tech id="threejs">Three.js</Tech> や <Tech id="webgl">WebGL</Tech> を使います（次章「3D / グラフィックス」参照）。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "ゲーム開発の中心はエンジン。物理・描画・入力などを土台提供",
          "Unity(C#) はモバイル/インディー・VR/AR に強く最も普及",
          "Unreal Engine(C++) は高品質3D・AAA・映像制作向き",
          "Godot は軽量・完全 OSS で個人開発向き",
          "ブラウザの 3D は Three.js/WebGL を使う（別系統）",
        ]}
      />
    </>
  );
}
