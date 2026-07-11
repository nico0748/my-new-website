import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";
import { Tech } from "../../../components/learn/TechStackPanel";

export const meta: LearnMeta = {
  id: "graphics-stack",
  title: "3D / グラフィックスの技術スタック",
  description: "ブラウザで3Dや高度なグラフィックスを描くための代表スタック。低レベル API(WebGL/WebGPU)と、扱いやすくするライブラリ(Three.js)の関係を俯瞰する。",
  domain: "stack",
  section: "graphics",
  order: 1,
  level: "basic",
  tags: ["Three.js", "WebGL", "WebGPU", "3D"],
  updated: "2026-07-09",
  minutes: 5,
};

export default function Article() {
  return (
    <>
      <Lead>
        Web 上で 3D やインタラクティブなビジュアルを描くには、GPU を扱う<strong>低レベル API</strong>と、それを扱いやすくする<strong>ライブラリ</strong>があります。両者の関係を掴むと選びやすくなります。
      </Lead>

      <Section>低レベル API とライブラリ</Section>
      <ComparisonTable
        headers={["技術", "レイヤー", "特徴"]}
        rows={[
          [<Tech id="webgl">WebGL</Tech>, "低レベル API", "ブラウザで GPU を使い描画。シェーダで制御"],
          [<Tech id="webgpu">WebGPU</Tech>, "低レベル API", "WebGL の後継。高性能で GPU 計算にも使える"],
          [<Tech id="threejs">Three.js</Tech>, "ライブラリ", "WebGL を扱いやすくラップ。3D 表現の定番"],
        ]}
      />
      <Callout variant="info" title="まずは Three.js から">
        <Tech id="webgl">WebGL</Tech> を直接書くのは大変なので、多くの場合 <Tech id="threejs">Three.js</Tech> から入ります。より高い性能や GPU 計算が必要になったら <Tech id="webgpu">WebGPU</Tech> を検討します。
      </Callout>
      <Callout variant="tip" title="React で 3D を扱うなら">
        React プロジェクトでは、Three.js を React 流に書ける「React Three Fiber」がよく使われます。宣言的にシーンを組み立てられます。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Web の 3D は 低レベル API とライブラリの2層で捉える",
          "WebGL がブラウザの GPU 描画 API、WebGPU はその後継で高性能",
          "実装は Three.js が定番。WebGL を扱いやすくする",
          "高性能・GPU 計算が必要なら WebGPU を検討",
          "React では React Three Fiber で宣言的に 3D を書ける",
        ]}
      />
    </>
  );
}
