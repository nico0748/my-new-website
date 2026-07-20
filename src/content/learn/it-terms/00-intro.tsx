import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, Callout, ComparisonTable, KeyPoints, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "it-intro",
  title: "はじめに・基本のキ",
  description: "このコースの使い方と、まず押さえたい最重要の基本用語（ハードウェア/ソフトウェア/OS/CPU/メモリ/ストレージなど）。分からない言葉を引くための IT 用語辞典。",
  domain: "it-terms",
  section: "intro",
  order: 1,
  level: "intro",
  tags: ["IT用語", "基礎", "辞典"],
  updated: "2026-07-18",
  minutes: 6,
};

export default function Article() {
  return (
    <>
      <Lead>
        このコースは、IT の会話でよく出てくる用語や、現場ならではの言い回しを「引いて確かめる」ための辞典です。頭から読む必要はありません。分からない言葉が出てきたら、そのカテゴリのページを開いて探してください。他コース（Web / インフラ / セキュリティ など）と関連する用語を中心に、幅広く収録しています。
      </Lead>

      <Callout variant="tip" title="このコースの構成">
        <ul>
          <li><strong>現場の言い回し・スラング</strong> — 「API を叩く」「プロセスをキルする」など、教科書に載らない業界表現</li>
          <li><strong>開発・プログラミング</strong> / <strong>フロントエンド・UI</strong> / <strong>Web・ネットワーク</strong> / <strong>インフラ・クラウド</strong> / <strong>データ・DB</strong> — 作る・動かすための用語</li>
          <li><strong>アルゴリズム・データ構造</strong> / <strong>AI・機械学習・エージェント</strong> / <strong>セキュリティ</strong> — 専門分野の用語</li>
        </ul>
        各ページは「用語・英語・意味」の一覧です。ブラウザの検索（<strong>Ctrl/⌘ + F</strong>）で語を探すのも便利です。
      </Callout>

      <Section>まず押さえたい「基本のキ」</Section>
      <p>どのカテゴリを読むにも土台になる、もっとも基本的な用語です。</p>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["ハードウェア", "Hardware", "目に見える物理的な装置。CPU・メモリ・ディスプレイなど"],
          ["ソフトウェア", "Software", "目に見えないプログラムやデータの総称。ハードウェアを動かす"],
          ["OS", "Operating System", "アプリやデバイスを動かす土台のソフトウェア。Windows / macOS / Linux など"],
          ["CPU", "Central Processing Unit", "計算処理を担う中枢。コア数・周波数などで性能が決まる"],
          ["メモリ", "Memory / RAM", "処理中のデータを一時的に置く作業机。電源を切ると消える"],
          ["ストレージ", "Storage", "データを保存する記憶装置。SSD / HDD。電源を切っても残る"],
          ["プログラム", "Program", "コンピュータへの命令をまとめたもの。ソフトの中身"],
          ["アルゴリズム", "Algorithm", "問題を解くための手順・計算方法"],
          ["データ", "Data", "処理や保存の対象となる情報"],
          ["ネットワーク", "Network", "複数のコンピュータをつなぎ、通信できるようにした仕組み"],
          ["サーバー", "Server", "要求に応じてデータや機能を提供する側のコンピュータ"],
          ["クライアント", "Client", "サーバーに要求を送り、サービスを利用する側"],
          ["バグ", "Bug", "プログラムの不具合・誤り"],
          ["スペック", "Spec", "性能や仕様（specification の略）"],
        ]}
      />

      <Section>もう一歩 — コンピュータの中身と基本単位</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["ビット / バイト", "Bit / Byte", "情報の最小単位（0か1）/ 8ビットのまとまり。データ量の基本"],
          ["2進数 / 16進数", "Binary / Hex", "コンピュータが使う0と1の表記 / それを短く書くための16進の表記"],
          ["文字コード", "Character Encoding", "文字を数値に対応させる規則。今の主流は UTF-8"],
          ["プロセス / スレッド", "Process / Thread", "実行中のプログラム / その中で並行して動く処理の単位"],
          ["カーネル", "Kernel", "OS の中核。ハードとソフトの橋渡しをする"],
          ["シェル", "Shell", "コマンドで OS を操作する窓口となるソフト"],
          ["CLI / GUI", "CLI / GUI", "コマンドで操作する画面 / マウスなど視覚的に操作する画面"],
          ["ファイル / ディレクトリ", "File / Directory", "データのまとまり / ファイルを入れる場所（フォルダ）"],
          ["パス", "Path", "ファイルの場所を示す文字列。絶対パス / 相対パス"],
          ["拡張子", "Extension", "ファイル名末尾の種類表示。.txt / .png など"],
          ["ドライバ", "Driver", "周辺機器を OS から動かすためのソフト"],
        ]}
      />

      <Callout variant="info" title="英語を知ると意味が読める">
        IT 用語の多くは英語の直訳です。<strong>deploy（配置する）</strong>、<strong>commit（確定する）</strong>のように、元の英単語の意味を知ると用語が一気に腑に落ちます。各ページでは英語も併記しています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "このコースは頭から読む教材ではなく「引く」辞典。分からない言葉をカテゴリから探す",
          "ハードウェア=物理、ソフトウェア=プログラム。OS がその橋渡し",
          "CPU=処理、メモリ=一時作業机（消える）、ストレージ=保存（残る）",
          "用語は英語の直訳が多い。元の英単語を知ると意味が読める",
        ]}
      />
    </>
  );
}
