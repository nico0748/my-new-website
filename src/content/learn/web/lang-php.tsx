import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KeyPoints, KVList, ComparisonTable, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "lang-php",
  title: "PHP 言語とは",
  description: "Web 開発に特化したサーバーサイド言語 PHP の特徴・歴史・用途・エコシステム(Laravel など)を押さえる。",
  domain: "web",
  section: "backend",
  order: 4,
  level: "basic",
  tags: ["PHP", "バックエンド", "言語"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        PHP は <strong>Web 開発に特化したサーバーサイド言語</strong>です。HTML に直接埋め込める手軽さと学習コストの低さから、長らく Web の定番であり続けてきました。W3Techs の調査では、世界の Web サイトの<strong>約 77%</strong>が PHP を使っているとされ、WordPress をはじめ膨大なサイトの土台になっています。
      </Lead>

      <Section>歴史と現在</Section>
      <p>
        PHP は 1994 年に Rasmus Lerdorf が個人サイトのツールとして作ったのが始まりです。以来 Web の成長とともに進化し、2022 年の PHP 8.2、そして最新の 8.3.x では <strong>JIT コンパイラ</strong>が強化され、かつて「遅い」と言われた時代とは別物の実行速度になっています。
      </p>

      <SubSection>PHP はどう実行されるのか</SubSection>
      <p>
        PHP は Python と同じく、ソースを<strong>オペコード（opcode）</strong>にコンパイルしてから <strong>Zend Engine</strong>（PHP の仮想マシン）が実行する<strong>インタプリタ方式</strong>の言語です。JIT はこのオペコードのうちホットな部分をさらに機械語へ翻訳して高速化する仕組みで、OPcache がコンパイル結果を再利用します。
      </p>

      <Bridge course="言語処理系">
        ソース → 字句・構文解析 → オペコード → 仮想マシン（Zend Engine）が実行、という流れは<strong>言語処理系</strong>の講義で扱うインタプリタ／バイトコード実行そのものです。JIT は「実行時に頻出コードを機械語へ翻訳する」動的コンパイルの実例で、静的コンパイルと純粋なインタプリタの中間に位置します。「なぜ PHP 8 で速くなったのか」を、コンパイル戦略の違いから説明できるようになります。
      </Bridge>

      <Section>特徴</Section>
      <ul>
        <li><strong>学びやすい</strong> — 文法がシンプルで、初学者でも動くものを作りやすい</li>
        <li><strong>Web 特化</strong> — HTML にそのまま埋め込め、リクエスト処理やフォーム操作が容易</li>
        <li><strong>PHP 7 以降で高速化</strong> — 実行速度・メモリ効率が大きく改善</li>
        <li><strong>DB 連携が容易</strong> — MySQL / PostgreSQL 等との接続が簡単</li>
        <li><strong>Composer</strong> — 依存パッケージ管理の標準ツールが整備されている</li>
        <li><strong>OSS ＆巨大コミュニティ</strong> — 情報・ライブラリが豊富</li>
      </ul>

      <Section>HTML に埋め込む書き方</Section>
      <p>
        PHP の象徴的な特徴が、<Cmd>{"<?php ... ?>"}</Cmd> で HTML の中に処理を書けることです。テンプレートとロジックが同居するため、動的ページを直感的に組み立てられます。
      </p>

      <Code lang="php" filename="index.php">{`<h1><?php echo "Hello, PHP"; ?></h1>
<p>現在時刻: <?php echo date("Y年m月d日 H:i:s"); ?></p>`}</Code>

      <Callout variant="warn" title="埋め込みは便利だが規律が要る">
        HTML とロジックを自由に混ぜられる反面、大規模化するとコードが読みにくくなります。実務では Laravel の Blade などのテンプレートエンジンで表示ロジックを分離するのが定石です。
      </Callout>

      <Section>リクエスト毎に生まれ、リクエスト毎に死ぬ</Section>
      <p>
        PHP を理解する鍵は、その<strong>実行モデル</strong>です。Node.js や Rails が「常駐プロセスがメモリ上の状態を保ったまま多数のリクエストを捌く」のに対し、伝統的な PHP は<strong>1 リクエストごとにスクリプトを最初から実行し、応答を返したらメモリを丸ごと破棄</strong>します。次のリクエストはまっさらな状態から始まります。これを<strong>シェアードナッシング（shared-nothing）</strong>と呼びます。
      </p>

      <KVList
        items={[
          { key: "起動", val: "リクエスト到着ごとにスクリプトを頭から実行" },
          { key: "状態", val: "グローバル変数もリクエストをまたいで残らない（都度リセット）" },
          { key: "永続化", val: "跨ぎたい状態は セッション・DB・キャッシュ（Redis 等）に逃がす" },
          { key: "終了", val: "応答を返すとメモリ解放。メモリリークが積み上がりにくい" },
        ]}
      />

      <Bridge course="Web アーキテクチャ / OS・並行処理">
        「毎回まっさらから始める」設計は、<strong>HTTP がステートレス</strong>であること（<strong>Web アーキテクチャ</strong>の講義で習う原則）と綺麗に噛み合っています。状態をプロセスに持たないので、サーバーを横に並べる<strong>水平スケール</strong>やロードバランシングが素直に効き、1 リクエストのバグが他へ波及しにくい。一方 Node の常駐モデルは高速だがメモリリークや状態共有のリスクを抱える——このトレードオフは、OS・並行処理で習う「プロセスと状態管理」の観点で捉えると腑に落ちます。
      </Bridge>

      <Callout variant="warn" title="よくある落とし穴">
        <ul>
          <li>ステートレス前提を忘れ「前のリクエストの変数が残る」と思い込むと不具合になる。永続化はセッションや DB へ</li>
          <li>ユーザー入力（<Cmd>$_GET</Cmd> / <Cmd>$_POST</Cmd>）をそのまま SQL や HTML に混ぜると SQL インジェクション・XSS の温床。プリペアドステートメントとエスケープを徹底する</li>
          <li>毎回起動するぶん、初期化が重いと遅くなる。OPcache とオートローダのキャッシュが効いているか確認する</li>
        </ul>
      </Callout>

      <Section>エコシステム</Section>
      <p>
        現代の PHP 開発はフレームワークとツールで支えられています。特に <strong>Laravel</strong> は圧倒的な人気を誇り、ルーティング・ORM（Eloquent）・認証などをフルスタックで提供します。
      </p>
      <ul>
        <li><strong>フレームワーク</strong>: Laravel / Symfony / CakePHP / CodeIgniter</li>
        <li><strong>依存管理</strong>: Composer</li>
        <li><strong>テンプレート</strong>: Blade / Twig</li>
        <li><strong>テスト</strong>: PHPUnit</li>
      </ul>

      <Callout variant="info" title="採用事例">
        WordPress・Facebook（初期）・Wikipedia・Slack・pixiv など、世界を支える大規模サービスで PHP が使われています。
      </Callout>

      <SubSection>実行モデルの位置づけ</SubSection>
      <ComparisonTable
        headers={["観点", "PHP（伝統的）", "Node.js / Rails（常駐）"]}
        rows={[
          ["プロセス", "リクエスト毎に生成・破棄", "常駐して使い回す"],
          ["状態", "共有しない（shared-nothing）", "メモリ上に保持できる"],
          ["水平スケール", "素直に効く", "状態設計次第"],
          ["リスク", "毎回の初期化コスト", "メモリリーク・状態共有バグ"],
        ]}
      />

      <Divider />

      <KeyPoints
        items={[
          "PHP は Web 特化のサーバーサイド言語。世界の Web の約 77% で使われている",
          "ソース → オペコード → Zend Engine 実行。JIT は動的コンパイルの実例",
          "リクエスト毎に生成・破棄する shared-nothing。HTTP のステートレス性と噛み合い水平スケールに強い",
          "HTML に直接埋め込める手軽さが特徴。大規模化ではテンプレートで分離する",
          "入力の混入は SQLi/XSS の温床。プリペアドステートメントとエスケープを徹底する",
        ]}
      />
    </>
  );
}
