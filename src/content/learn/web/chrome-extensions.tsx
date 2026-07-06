import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Code, Steps, Step, KVList, TipBox, KeyPoints, ComparisonTable, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "chrome-extensions",
  title: "開発におすすめの Chrome 拡張機能",
  description: "フロントエンド開発を効率化する Chrome 拡張機能。色の抽出、技術スタック検出、レスポンシブ確認、フレームワークのデバッグなど用途別に紹介する。",
  domain: "web",
  section: "dev-tools",
  order: 2,
  level: "intro",
  tags: ["Chrome拡張", "ツール", "効率化"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        Chrome 拡張機能は、DevTools だけでは手が届かない作業を補ってくれます。デザインの模写、他サイトの技術調査、
        コンポーネントの状態確認など、<strong>用途別</strong>に定番を押さえておくと開発が一段速くなります。
        ここでは実務で出番の多いものを目的ごとに紹介します。
      </Lead>

      <SubSection>そもそも拡張機能とは何か（仕組みを一言で）</SubSection>
      <p>
        Chrome 拡張は特別な魔法ではなく、<strong>HTML / CSS / JavaScript で作られた小さなプログラム</strong>です。
        ブラウザが用意した拡張 API を通じて、閲覧中のページに介入します。中心になるのは主に 3 つの部品です。
      </p>
      <ComparisonTable
        headers={["部品", "役割", "たとえるなら"]}
        rows={[
          [<><Cmd>manifest.json</Cmd></>, "権限・構成を宣言する設定ファイル", "アプリの入国申告書"],
          ["Content Script", "見ているページの DOM に直接触るスクリプト", "ページに送り込まれた出張員"],
          ["Background (Service Worker)", "ページとは独立して常駐し、通信や状態を管理", "裏方のサーバ役"],
        ]}
      />
      <p>
        たとえば ColorZilla が「画面のどのピクセルでも色を拾える」のは、Content Script が今開いているページに入り込み、
        DOM やキャンバスの情報を読めるからです。「拡張がページを覗ける＝強い権限を持つ」——後半の安全面の話はこの仕組みが土台になります。
      </p>

      <Bridge course="ソフトウェア工学（ツールによる生産性） / ブラウザの仕組み">
        拡張機能は「ツールで人間の作業を肩代わりし、生産性を上げる」というソフトウェア工学の基本思想の身近な実例です。
        毎回手作業でやっていた「色を測る」「技術を調べる」を自動化し、判断だけを人間に残す。これは<strong>自動化による省力化</strong>の縮図です。
        同時に、Content Script がページ DOM に注入される仕組みは、講義で触れる<strong>ブラウザのサンドボックスと権限モデル</strong>
        （どこまでのアクセスを誰に許すか）を理解する入口になります。
      </Bridge>

      <Section>色・デザインを調べる</Section>
      <SubSection>ColorZilla</SubSection>
      <p>
        画面上の任意のピクセルから<strong>色を抽出（スポイト）</strong>できる拡張です。
        参考にしたいサイトの配色を拾ったり、要素に効いている背景色を <Cmd>HEX</Cmd> / <Cmd>rgb()</Cmd> で取得したりできます。
        グラデーションの生成・読み取りにも対応しています。
      </p>
      <SubSection>WhatFont</SubSection>
      <p>
        カーソルを乗せた文字の<strong>フォント名・サイズ・行間・色</strong>を表示します。
        「このサイトの見出しは何のフォント？」という調査が一瞬で終わります。
      </p>
      <SubSection>Page Ruler</SubSection>
      <p>
        画面上をドラッグして<strong>ピクセル単位で寸法を計測</strong>できる定規です。
        要素の幅・高さ・余白をデザインカンプと突き合わせるときに便利です。
      </p>

      <TipBox>
        実務での使いどころ: デザインカンプ（Figma など）が渡されない案件で、参考サイトの色・フォント・寸法を拾って再現する「模写」作業。
        目測で <Cmd>#3a7</Cmd> のような色を当てるより、スポイトで拾えば一発で正確な値が手に入ります。
      </TipBox>

      <Section>技術スタックを調べる</Section>
      <SubSection>Wappalyzer</SubSection>
      <p>
        開いているサイトが<strong>どの技術で作られているか</strong>を検出します。
        フレームワーク（React / Vue / Next.js など）、CMS、解析ツール、ホスティングなどを一覧表示。
        競合調査や、参考実装の技術選定を知りたいときに使います。
      </p>
      <TipBox>
        実務での使いどころ: 「このサイト、動きが速いけど何で作ってる？」を数秒で確認できます。技術選定の参考にしたり、
        面接前に応募先企業のプロダクトの構成を推測したりと、調査コストを大きく下げてくれます。
      </TipBox>

      <Section>レスポンシブを確認する</Section>
      <SubSection>Responsive Viewer / モバイルシミュレーター</SubSection>
      <p>
        複数のデバイス幅を<strong>並べて同時プレビュー</strong>できる拡張です。
        スマホ・タブレット・PC の表示を横並びで確認できるため、ブレイクポイントごとの崩れを一度に洗い出せます。
      </p>
      <TipBox>
        簡易な確認なら DevTools のデバイスツールバーで十分ですが、「複数幅を一望したい」「実機に近い枠で見たい」場面でこれらの拡張が効きます。
      </TipBox>

      <Section>フレームワークをデバッグする</Section>
      <SubSection>React Developer Tools</SubSection>
      <p>
        React アプリの<strong>コンポーネントツリー</strong>を表示し、各コンポーネントの props / state / hooks を確認・編集できます。
        DevTools に <Cmd>Components</Cmd> / <Cmd>Profiler</Cmd> タブが追加され、再レンダリングの原因調査にも使えます。
      </p>
      <SubSection>Vue.js devtools</SubSection>
      <p>
        Vue 向けの同種ツールです。コンポーネント階層・<strong>リアクティブな state</strong>・Pinia / Vuex ストア・イベントを可視化します。
      </p>
      <Callout variant="tip" title="本番ビルドでは動かないことがある">
        フレームワーク系の devtools は、開発ビルドで最も情報が出ます。本番ビルドだと state が読めない・そもそも認識されないことがあるため、
        調査はローカルの開発サーバで行うのが基本です。
      </Callout>

      <Section>API レスポンスを見やすくする</Section>
      <SubSection>JSON Viewer</SubSection>
      <p>
        ブラウザで JSON を直接開いたときに、<strong>整形・シンタックスハイライト・折りたたみ</strong>を適用します。
        API の生レスポンスを目で追うのが一気に楽になります。キー検索やパスのコピーに対応するものもあります。
      </p>

      <Section>アクセシビリティを検査する</Section>
      <SubSection>axe DevTools</SubSection>
      <p>
        ページの<strong>アクセシビリティ問題</strong>を自動検出します。コントラスト不足・ラベル欠落・見出し構造の乱れなどを、
        該当箇所と修正方針つきで指摘してくれます。Lighthouse より詳細な A11y チェックが必要なときに使います。
      </p>

      <Section>デザインを微調整・計測する</Section>
      <SubSection>VisBug</SubSection>
      <p>
        ブラウザ上で<strong>デザインを直接いじれる</strong>ツールです。要素の移動・余白調整・文字やスタイルの変更を GUI で試せるため、
        コードを触る前に「こう変えたらどう見えるか」を素早く検証できます。
      </p>

      <Section>安全に使う — 権限とリスク</Section>
      <p>
        便利さの裏返しとして、拡張は<strong>強い権限</strong>を持ちます。<Cmd>manifest.json</Cmd> の <Cmd>permissions</Cmd> に
        たとえば <Cmd>"&lt;all_urls&gt;"</Cmd> と書かれていれば、その拡張は<strong>あなたが開くすべてのページの内容を読める</strong>——
        つまり入力中のパスワードや表示中の社内情報も、原理的には見えてしまいます。
      </p>
      <Code lang="json" filename="manifest.json">{`{
  "manifest_version": 3,
  "name": "example-extension",
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["<all_urls>"]
}`}</Code>
      <p>
        インストール時に「すべてのサイトのデータの読み取りと変更」と警告が出るのは、この <Cmd>host_permissions</Cmd> が広いためです。
        導入前に権限を吟味する習慣は、そのままセキュリティ講義の<strong>最小権限の原則（least privilege）</strong>の実践になります。
      </p>
      <Steps>
        <Step title="1. 権限を確認する">
          「なぜこの拡張に全サイトのアクセスが必要？」を自問します。色抽出ツールに全サイト権限は不釣り合いかもしれません。
        </Step>
        <Step title="2. 作者と評価を見る">
          レビュー数・更新頻度・作者の実績を確認します。星は高いがレビューが極端に少ないものは警戒します。
        </Step>
        <Step title="3. 使うときだけ有効化">
          常時オンにせず、開発プロファイルにだけ入れる・使う時だけ有効化する運用でリスク面を絞ります。
        </Step>
      </Steps>

      <Bridge course="情報セキュリティ（最小権限の原則）">
        拡張の権限画面は、セキュリティで学ぶ<strong>最小権限の原則</strong>と<strong>攻撃面（attack surface）</strong>の考え方を
        日常で使う場面です。権限を絞れば絞るほど、万一その拡張が乗っ取られたときの被害範囲は小さくなります。
        「便利だから」で全許可せず、必要最小限だけ渡す——この判断は業務システムの権限設計にもそのまま通じます。
      </Bridge>

      <Divider />

      <SubSection>用途別まとめ</SubSection>
      <KVList
        items={[
          { key: "色・フォント・寸法", val: "ColorZilla / WhatFont / Page Ruler" },
          { key: "技術スタック調査", val: "Wappalyzer" },
          { key: "レスポンシブ確認", val: "Responsive Viewer / モバイルシミュレーター" },
          { key: "フレームワーク", val: "React Developer Tools / Vue.js devtools" },
          { key: "API レスポンス整形", val: "JSON Viewer" },
          { key: "アクセシビリティ", val: "axe DevTools" },
          { key: "デザイン微調整", val: "VisBug" },
        ]}
      />

      <Callout variant="warn" title="拡張の入れすぎに注意">
        拡張機能はページの読み込みやプライバシーに影響します。信頼できる作者のものを選び、権限の要求範囲を確認し、
        使わないものは無効化しておきましょう。開発時だけ有効にする運用も有効です。
      </Callout>

      <KeyPoints
        items={[
          "拡張は manifest / Content Script / Background で動く小さな Web プログラム",
          "拡張は DevTools の弱点を補う。用途別に定番を持っておく",
          "React / Vue の状態確認は各 devtools を開発ビルドで使う",
          "権限（host_permissions）を吟味するのは最小権限の原則の実践",
          "便利さと引き換えに強い権限を渡す。数を絞り、信頼できるものだけ入れる",
        ]}
      />
    </>
  );
}
