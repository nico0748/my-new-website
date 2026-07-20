/** IT用語コースの用語インデックス（自動生成）。
 *  生成元: src/content/learn/it-terms/*.tsx
 *  再生成: python3 scripts/gen-it-terms.py
 *  検索パレット（LearnSearch）が用語＋意味を表示するために使う。 */

export interface ItTerm {
  /** 見出し語 */
  term: string;
  /** 英語表記・分類（無い場合は空文字） */
  en: string;
  /** 意味 */
  desc: string;
  /** it-terms の章キー */
  section: string;
  /** 記事内の見出し（グループ） */
  group: string;
}

export const IT_TERMS: ItTerm[] = [
  {
    "term": "ハードウェア",
    "en": "Hardware",
    "desc": "目に見える物理的な装置。CPU・メモリ・ディスプレイなど",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "ソフトウェア",
    "en": "Software",
    "desc": "目に見えないプログラムやデータの総称。ハードウェアを動かす",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "OS",
    "en": "Operating System",
    "desc": "アプリやデバイスを動かす土台のソフトウェア。Windows / macOS / Linux など",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "CPU",
    "en": "Central Processing Unit",
    "desc": "計算処理を担う中枢。コア数・周波数などで性能が決まる",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "メモリ",
    "en": "Memory / RAM",
    "desc": "処理中のデータを一時的に置く作業机。電源を切ると消える",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "ストレージ",
    "en": "Storage",
    "desc": "データを保存する記憶装置。SSD / HDD。電源を切っても残る",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "プログラム",
    "en": "Program",
    "desc": "コンピュータへの命令をまとめたもの。ソフトの中身",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "アルゴリズム",
    "en": "Algorithm",
    "desc": "問題を解くための手順・計算方法",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "データ",
    "en": "Data",
    "desc": "処理や保存の対象となる情報",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "ネットワーク",
    "en": "Network",
    "desc": "複数のコンピュータをつなぎ、通信できるようにした仕組み",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "サーバー",
    "en": "Server",
    "desc": "要求に応じてデータや機能を提供する側のコンピュータ",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "クライアント",
    "en": "Client",
    "desc": "サーバーに要求を送り、サービスを利用する側",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "バグ",
    "en": "Bug",
    "desc": "プログラムの不具合・誤り",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "スペック",
    "en": "Spec",
    "desc": "性能や仕様（specification の略）",
    "section": "intro",
    "group": "まず押さえたい「基本のキ」"
  },
  {
    "term": "ビット / バイト",
    "en": "Bit / Byte",
    "desc": "情報の最小単位（0か1）/ 8ビットのまとまり。データ量の基本",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "2進数 / 16進数",
    "en": "Binary / Hex",
    "desc": "コンピュータが使う0と1の表記 / それを短く書くための16進の表記",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "文字コード",
    "en": "Character Encoding",
    "desc": "文字を数値に対応させる規則。今の主流は UTF-8",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "プロセス / スレッド",
    "en": "Process / Thread",
    "desc": "実行中のプログラム / その中で並行して動く処理の単位",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "カーネル",
    "en": "Kernel",
    "desc": "OS の中核。ハードとソフトの橋渡しをする",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "シェル",
    "en": "Shell",
    "desc": "コマンドで OS を操作する窓口となるソフト",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "CLI / GUI",
    "en": "CLI / GUI",
    "desc": "コマンドで操作する画面 / マウスなど視覚的に操作する画面",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "ファイル / ディレクトリ",
    "en": "File / Directory",
    "desc": "データのまとまり / ファイルを入れる場所（フォルダ）",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "パス",
    "en": "Path",
    "desc": "ファイルの場所を示す文字列。絶対パス / 相対パス",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "拡張子",
    "en": "Extension",
    "desc": "ファイル名末尾の種類表示。.txt / .png など",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "ドライバ",
    "en": "Driver",
    "desc": "周辺機器を OS から動かすためのソフト",
    "section": "intro",
    "group": "もう一歩 — コンピュータの中身と基本単位"
  },
  {
    "term": "叩く（たたく）",
    "en": "",
    "desc": "API やコマンドを呼び出す・実行する。例:「この API を叩いてユーザー情報を取る」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "キルする（kill）",
    "en": "",
    "desc": "プロセスを強制終了する。例:「固まったから該当プロセスをキルして」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "立てる / 立ち上げる",
    "en": "",
    "desc": "サーバーやサービスを起動・構築する。例:「検証用に一台サーバーを立てる」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "キックする（kick）",
    "en": "",
    "desc": "処理やジョブを起動する。例:「バッチをキックする」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "投げる（なげる）",
    "en": "",
    "desc": "リクエストを送る、または例外を throw する。例:「リクエストを投げる」「エラーを投げる」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "拾う（ひろう）",
    "en": "",
    "desc": "例外やイベントを catch して処理する。例:「例外を拾ってログに出す」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "蹴る（ける）",
    "en": "",
    "desc": "リクエストを拒否・はじく。例:「不正な入力はバリデーションで蹴る」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "なめる / 舐める",
    "en": "",
    "desc": "データを先頭から全部たどって処理する（全走査）。例:「テーブルを全部なめるので遅い」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "生やす（はやす）",
    "en": "",
    "desc": "メソッドやプロパティ、型などを新しく追加する。例:「便利メソッドを生やす」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "握る（にぎる）",
    "en": "",
    "desc": "ロックや状態を保持し続ける。例:「トランザクションを長く握るな」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "掘る（ほる）",
    "en": "",
    "desc": "ログや原因を深く調べる。例:「ログを掘って原因を特定する」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "踏む（ふむ）",
    "en": "",
    "desc": "バグや地雷（既知の落とし穴）に遭遇する。例:「既知のバグを踏んだ」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "焼く（やく）",
    "en": "",
    "desc": "イメージ（Docker イメージ・マシンイメージ等）を作成する。例:「AMI を焼く」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "モックする（mock）",
    "en": "",
    "desc": "本物の代わりに偽物（ダミー）で差し替える。例:「外部 API をモックしてテストする」",
    "section": "jargon",
    "group": "動詞系 — 「◯◯する」の言い回し"
  },
  {
    "term": "コミットする（commit）",
    "en": "",
    "desc": "変更を1つの区切りとして記録・確定する",
    "section": "jargon",
    "group": "Git・変更管理系"
  },
  {
    "term": "プルリク（を出す / 投げる）",
    "en": "",
    "desc": "プルリクエスト（PR）。変更をレビュー・取り込んでもらう依頼を出す",
    "section": "jargon",
    "group": "Git・変更管理系"
  },
  {
    "term": "マージする（merge）",
    "en": "",
    "desc": "ブランチの変更を取り込んで1つにする",
    "section": "jargon",
    "group": "Git・変更管理系"
  },
  {
    "term": "コンフリクト（が起きる）",
    "en": "",
    "desc": "同じ箇所を別々に変更して衝突すること。手で解消（コンフリクト解消）する",
    "section": "jargon",
    "group": "Git・変更管理系"
  },
  {
    "term": "リバート / ロールバックする",
    "en": "",
    "desc": "変更を取り消して前の状態に戻す（revert / rollback）",
    "section": "jargon",
    "group": "Git・変更管理系"
  },
  {
    "term": "チェリーピック（cherry-pick）",
    "en": "",
    "desc": "特定のコミットだけを選んで別ブランチに取り込む",
    "section": "jargon",
    "group": "Git・変更管理系"
  },
  {
    "term": "リベースする（rebase）",
    "en": "",
    "desc": "コミットの土台を付け替えて履歴を整える",
    "section": "jargon",
    "group": "Git・変更管理系"
  },
  {
    "term": "リファクタ（る）",
    "en": "",
    "desc": "動作を変えずにコードを整理・改善する（refactoring）",
    "section": "jargon",
    "group": "Git・変更管理系"
  },
  {
    "term": "デグる / デグレ",
    "en": "",
    "desc": "デグレード。修正で以前動いていた部分を壊す（regression）",
    "section": "jargon",
    "group": "Git・変更管理系"
  },
  {
    "term": "落ちる（おちる）",
    "en": "",
    "desc": "サーバー・プロセス・ビルドが停止・失敗する。例:「本番が落ちた」",
    "section": "jargon",
    "group": "トラブル系 — うまくいかないとき"
  },
  {
    "term": "こける",
    "en": "",
    "desc": "処理が失敗する。例:「ビルドがこける」「テストがこける」",
    "section": "jargon",
    "group": "トラブル系 — うまくいかないとき"
  },
  {
    "term": "通る（とおる） / グリーン",
    "en": "",
    "desc": "テストやビルドが成功する。逆は「落ちる・レッド」",
    "section": "jargon",
    "group": "トラブル系 — うまくいかないとき"
  },
  {
    "term": "ハングする / 固まる",
    "en": "",
    "desc": "応答が返らず停止したように見える状態",
    "section": "jargon",
    "group": "トラブル系 — うまくいかないとき"
  },
  {
    "term": "詰む（つむ）",
    "en": "",
    "desc": "手詰まりでどうにもならない状態。例:「依存関係が壊れて詰んだ」",
    "section": "jargon",
    "group": "トラブル系 — うまくいかないとき"
  },
  {
    "term": "刺さる（ささる）",
    "en": "",
    "desc": "リクエストやクエリが返らず詰まる。逆に「条件に刺さる（該当する）」の意味でも使う",
    "section": "jargon",
    "group": "トラブル系 — うまくいかないとき"
  },
  {
    "term": "飛ぶ（とぶ）",
    "en": "",
    "desc": "データや設定が消える。例:「設定が飛んだ」",
    "section": "jargon",
    "group": "トラブル系 — うまくいかないとき"
  },
  {
    "term": "枯れる（かれる）",
    "en": "",
    "desc": "枯れた技術＝新しくはないが安定して信頼できる技術。ほめ言葉",
    "section": "jargon",
    "group": "トラブル系 — うまくいかないとき"
  },
  {
    "term": "リトライ / タイムアウト",
    "en": "",
    "desc": "再試行すること / 制限時間を超えて打ち切ること",
    "section": "jargon",
    "group": "トラブル系 — うまくいかないとき"
  },
  {
    "term": "ざっくり",
    "en": "",
    "desc": "細部は置いて大まかに。例:「ざっくり見積もると3日」",
    "section": "jargon",
    "group": "ざっくり系 — 進め方・考え方の言い回し"
  },
  {
    "term": "えいや（で）",
    "en": "",
    "desc": "厳密に詰めず、思い切って決めること。例:「値はえいやで決めた」",
    "section": "jargon",
    "group": "ざっくり系 — 進め方・考え方の言い回し"
  },
  {
    "term": "おまじない",
    "en": "",
    "desc": "意味を深く理解せず慣習で書く定型コード。例:「この設定はおまじない」",
    "section": "jargon",
    "group": "ざっくり系 — 進め方・考え方の言い回し"
  },
  {
    "term": "ペライチ",
    "en": "",
    "desc": "1枚もの。1ページだけの資料やサイト",
    "section": "jargon",
    "group": "ざっくり系 — 進め方・考え方の言い回し"
  },
  {
    "term": "銀の弾丸（はない）",
    "en": "",
    "desc": "何にでも効く万能の解決策。「そんなものは無い」の文脈で使う",
    "section": "jargon",
    "group": "ざっくり系 — 進め方・考え方の言い回し"
  },
  {
    "term": "車輪の再発明",
    "en": "",
    "desc": "既にあるものを知らずに一から作り直す無駄",
    "section": "jargon",
    "group": "ざっくり系 — 進め方・考え方の言い回し"
  },
  {
    "term": "スケールする",
    "en": "",
    "desc": "利用者や負荷が増えても耐えられる・拡張できること",
    "section": "jargon",
    "group": "ざっくり系 — 進め方・考え方の言い回し"
  },
  {
    "term": "枯れさせる / 温める",
    "en": "",
    "desc": "すぐ本番投入せず様子を見て安定を待つ（キャッシュのウォームアップも「温める」）",
    "section": "jargon",
    "group": "ざっくり系 — 進め方・考え方の言い回し"
  },
  {
    "term": "ソースコード",
    "en": "Source Code",
    "desc": "プログラミング言語で書かれたプログラムの本体（設計書）",
    "section": "dev",
    "group": "書く・動かす"
  },
  {
    "term": "コンパイル",
    "en": "Compile",
    "desc": "人が書いたコードを、コンピュータが実行できる形式に変換すること",
    "section": "dev",
    "group": "書く・動かす"
  },
  {
    "term": "ビルド",
    "en": "Build",
    "desc": "コンパイルなどを経て、実行できる成果物（実行ファイル等）を作ること",
    "section": "dev",
    "group": "書く・動かす"
  },
  {
    "term": "デプロイ",
    "en": "Deploy",
    "desc": "作ったものをサーバーに配置し、いつでも使える状態にすること",
    "section": "dev",
    "group": "書く・動かす"
  },
  {
    "term": "実行 / ラン",
    "en": "Run / Execute",
    "desc": "プログラムを動かすこと",
    "section": "dev",
    "group": "書く・動かす"
  },
  {
    "term": "コンパイラ / インタプリタ",
    "en": "Compiler / Interpreter",
    "desc": "まとめて変換する方式 / 1行ずつ解釈して実行する方式",
    "section": "dev",
    "group": "書く・動かす"
  },
  {
    "term": "バイナリ",
    "en": "Binary",
    "desc": "0と1（2進数）で表された、コンピュータ向けのデータ形式",
    "section": "dev",
    "group": "書く・動かす"
  },
  {
    "term": "バグ",
    "en": "Bug",
    "desc": "プログラムの不具合・誤り",
    "section": "dev",
    "group": "直す・良くする"
  },
  {
    "term": "デバッグ",
    "en": "Debug",
    "desc": "バグを見つけて取り除くこと",
    "section": "dev",
    "group": "直す・良くする"
  },
  {
    "term": "デバッガ",
    "en": "Debugger",
    "desc": "実行を止めながらバグを調べるツール",
    "section": "dev",
    "group": "直す・良くする"
  },
  {
    "term": "リファクタリング",
    "en": "Refactoring",
    "desc": "動作を変えずにコードを整理・改善すること",
    "section": "dev",
    "group": "直す・良くする"
  },
  {
    "term": "リグレッション / デグレ",
    "en": "Regression",
    "desc": "修正によって以前は動いていた部分が壊れること",
    "section": "dev",
    "group": "直す・良くする"
  },
  {
    "term": "テスト",
    "en": "Test",
    "desc": "期待通り動くかを確認する作業。ユニット/結合/E2E など",
    "section": "dev",
    "group": "直す・良くする"
  },
  {
    "term": "レビュー",
    "en": "Review",
    "desc": "他人がコードを見て問題点や改善点を指摘すること",
    "section": "dev",
    "group": "直す・良くする"
  },
  {
    "term": "変数",
    "en": "Variable",
    "desc": "値を入れておく名前付きの箱",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "関数 / メソッド",
    "en": "Function / Method",
    "desc": "処理をひとまとめにして名前を付けたもの",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "引数（ひきすう）",
    "en": "Argument / Parameter",
    "desc": "関数を呼ぶときに渡す値",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "戻り値（もどりち）",
    "en": "Return Value",
    "desc": "関数が処理の結果として返す値",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "ライブラリ",
    "en": "Library",
    "desc": "よく使う機能をまとめた部品集。呼び出して使う",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "フレームワーク",
    "en": "Framework",
    "desc": "アプリの土台となる枠組み。決められた形に沿って作る",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "モジュール",
    "en": "Module",
    "desc": "機能ごとに分割したプログラムの部品",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "API",
    "en": "Application Programming Interface",
    "desc": "ソフト同士がやり取りするための窓口・約束事",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "SDK",
    "en": "Software Development Kit",
    "desc": "開発に必要な部品・ツールをまとめたもの",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "ネスト",
    "en": "Nest",
    "desc": "構造の内側にさらに同じ構造が入る入れ子状態",
    "section": "dev",
    "group": "プログラムの構成要素"
  },
  {
    "term": "オブジェクト指向",
    "en": "Object-Oriented",
    "desc": "プログラムを「モノ（オブジェクト）」の集まりとして捉える考え方",
    "section": "dev",
    "group": "オブジェクト指向"
  },
  {
    "term": "クラス",
    "en": "Class",
    "desc": "オブジェクトの設計図。プロパティとメソッドの集まり",
    "section": "dev",
    "group": "オブジェクト指向"
  },
  {
    "term": "インスタンス",
    "en": "Instance",
    "desc": "クラスから作られた実体。インスタンス化＝実体を作ること",
    "section": "dev",
    "group": "オブジェクト指向"
  },
  {
    "term": "プロパティ",
    "en": "Property",
    "desc": "オブジェクトが持つデータ（属性）",
    "section": "dev",
    "group": "オブジェクト指向"
  },
  {
    "term": "カプセル化",
    "en": "Encapsulation",
    "desc": "内部構造を隠し、決められた操作だけを外に見せること",
    "section": "dev",
    "group": "オブジェクト指向"
  },
  {
    "term": "継承",
    "en": "Inheritance",
    "desc": "既存クラスの性質を引き継いで新しいクラスを作ること",
    "section": "dev",
    "group": "オブジェクト指向"
  },
  {
    "term": "ポリモーフィズム",
    "en": "Polymorphism",
    "desc": "同名の操作を、対象の種類に応じて使い分けること",
    "section": "dev",
    "group": "オブジェクト指向"
  },
  {
    "term": "オーバーロード",
    "en": "Overload",
    "desc": "引数の型や数が異なる同名メソッドを複数定義すること",
    "section": "dev",
    "group": "オブジェクト指向"
  },
  {
    "term": "スコープ",
    "en": "Scope",
    "desc": "変数が参照できる有効範囲。グローバル / ローカル",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "クロージャ",
    "en": "Closure",
    "desc": "外側の変数を閉じ込めて覚えている関数",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "高階関数",
    "en": "Higher-order Function",
    "desc": "関数を引数に取る、または関数を返す関数",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "純粋関数 / 副作用",
    "en": "Pure Function / Side Effect",
    "desc": "同じ入力で同じ結果を返す関数 / 外部状態を変える処理",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "同期 / 非同期",
    "en": "Sync / Async",
    "desc": "順に待って進む / 待たずに進め、後で結果を受け取る",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "コールバック / Promise",
    "en": "Callback / Promise",
    "desc": "後で呼ぶ関数を渡す / 「いつか値になる箱」で非同期を扱う",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "例外 / スタックトレース",
    "en": "Exception / Stack Trace",
    "desc": "異常を表す仕組み / エラー発生までの呼び出し履歴",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "冪等性（べきとうせい）",
    "en": "Idempotency",
    "desc": "何回実行しても結果が同じになる性質",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "静的型 / 動的型",
    "en": "Static / Dynamic Typing",
    "desc": "実行前に型を固定 / 実行時に型が決まる",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "型推論 / ジェネリクス",
    "en": "Type Inference / Generics",
    "desc": "型を自動で判定 / 型を後から差し替えられる仕組み",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "インターフェース / 抽象クラス",
    "en": "Interface / Abstract Class",
    "desc": "実装の約束だけを定義したもの / 一部だけ実装した雛形",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "デザインパターン",
    "en": "Design Pattern",
    "desc": "よくある設計問題の定番の解法（MVC・Singleton など）",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "依存性注入（DI）",
    "en": "Dependency Injection",
    "desc": "必要な部品を外から渡して結合を弱める設計",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "パッケージマネージャ",
    "en": "Package Manager",
    "desc": "ライブラリの導入・更新・依存解決を行うツール（npm / pip など）",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "セマンティックバージョニング",
    "en": "SemVer",
    "desc": "x.y.z で意味を持たせたバージョン付け（メジャー.マイナー.パッチ）",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "リンター / フォーマッタ",
    "en": "Linter / Formatter",
    "desc": "問題を指摘するツール / 見た目を自動整形するツール",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "環境変数",
    "en": "Environment Variable",
    "desc": "実行環境ごとに切り替える設定値（API キーなど）",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "ガベージコレクション",
    "en": "Garbage Collection",
    "desc": "使われなくなったメモリを自動で回収する仕組み",
    "section": "dev",
    "group": "もう一歩 — プログラミングの専門用語"
  },
  {
    "term": "HTTP",
    "en": "HyperText Transfer Protocol",
    "desc": "Web でデータをやり取りするための約束事（プロトコル）",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "HTTPS",
    "en": "HTTP Secure",
    "desc": "HTTP を暗号化（SSL/TLS）して安全にしたもの",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "URL",
    "en": "Uniform Resource Locator",
    "desc": "Web 上の住所。どこにある何かを指す文字列",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "ドメイン",
    "en": "Domain",
    "desc": "URL やメールで使う識別名。example.com など",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "DNS",
    "en": "Domain Name System",
    "desc": "ドメイン名と IP アドレスを対応づけて引く仕組み",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "Cookie",
    "en": "Cookie",
    "desc": "訪問者のブラウザに保存する小さなデータ。ログイン状態などを保つ",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "セッション",
    "en": "Session",
    "desc": "サーバー側で管理する「一連のやり取り・ログイン状態」",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "リクエスト / レスポンス",
    "en": "Request / Response",
    "desc": "要求を送る / 結果が返る、の1往復",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "API",
    "en": "Application Programming Interface",
    "desc": "サービスの機能を外部から呼び出す窓口・約束事",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "REST",
    "en": "REST",
    "desc": "URL とHTTPメソッドでリソースを操作する API の主流スタイル",
    "section": "web-net",
    "group": "Web の基本"
  },
  {
    "term": "プロトコル",
    "en": "Protocol",
    "desc": "通信のやり方を定めた約束事",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "TCP/IP",
    "en": "TCP/IP",
    "desc": "インターネットの最も基本的な通信の仕組み（プロトコル群）",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "IP アドレス",
    "en": "IP Address",
    "desc": "ネットワーク上の宛先を表す番号",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "ポート",
    "en": "Port",
    "desc": "1台の中で「どのサービス宛か」を区別する番号。HTTP=80, HTTPS=443 など",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "パケット",
    "en": "Packet",
    "desc": "通信データを小さく分割した単位",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "ルータ",
    "en": "Router",
    "desc": "複数のネットワークをつなぎ、通信を中継する機器",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "ルーティング",
    "en": "Routing",
    "desc": "通信を目的地まで届ける最適な経路を決めること",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "ゲートウェイ",
    "en": "Gateway",
    "desc": "異なるネットワークをつなぐ出入り口",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "LAN / WAN",
    "en": "LAN / WAN",
    "desc": "狭い範囲のネットワーク / 地理的に離れた拠点を結ぶネットワーク",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "帯域 / トラフィック",
    "en": "Bandwidth / Traffic",
    "desc": "回線の太さ（通信容量）/ 実際に流れる通信量",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "レイテンシ",
    "en": "Latency",
    "desc": "通信の応答にかかる遅延時間",
    "section": "web-net",
    "group": "ネットワークの基本"
  },
  {
    "term": "プロキシ",
    "en": "Proxy",
    "desc": "通信を代理で中継するサーバー",
    "section": "web-net",
    "group": "中継・接続の仕組み"
  },
  {
    "term": "ロードバランサ",
    "en": "Load Balancer",
    "desc": "アクセスを複数サーバーに振り分けて負荷を分散する仕組み",
    "section": "web-net",
    "group": "中継・接続の仕組み"
  },
  {
    "term": "CDN",
    "en": "Content Delivery Network",
    "desc": "コンテンツを各地に分散配置し、近い場所から高速配信する仕組み",
    "section": "web-net",
    "group": "中継・接続の仕組み"
  },
  {
    "term": "VPN",
    "en": "Virtual Private Network",
    "desc": "公衆回線上に仮想的な専用線を作り、安全に接続する仕組み",
    "section": "web-net",
    "group": "中継・接続の仕組み"
  },
  {
    "term": "ファイアウォール",
    "en": "Firewall",
    "desc": "通信を許可/拒否して不正アクセスを防ぐ仕組み",
    "section": "web-net",
    "group": "中継・接続の仕組み"
  },
  {
    "term": "SSH",
    "en": "Secure Shell",
    "desc": "リモートのサーバーに安全に接続・操作するためのプロトコル",
    "section": "web-net",
    "group": "中継・接続の仕組み"
  },
  {
    "term": "SSL / TLS",
    "en": "SSL / TLS",
    "desc": "通信を暗号化し、盗聴・改ざんから守る技術",
    "section": "web-net",
    "group": "中継・接続の仕組み"
  },
  {
    "term": "Webhook",
    "en": "Webhook",
    "desc": "イベント発生時に、相手へ自動でHTTP通知を送る仕組み",
    "section": "web-net",
    "group": "中継・接続の仕組み"
  },
  {
    "term": "HTTP メソッド",
    "en": "GET / POST / PUT / DELETE",
    "desc": "取得 / 作成 / 更新 / 削除など、操作の種類を表す動詞",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "ステータスコード",
    "en": "Status Code",
    "desc": "結果を表す3桁の番号。2xx=成功, 4xx=呼び出し側, 5xx=サーバ側",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "ヘッダ / ボディ",
    "en": "Header / Body",
    "desc": "付帯情報（種類・認証など）/ 本体のデータ",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "クエリパラメータ",
    "en": "Query Parameter",
    "desc": "URL の ? 以降に付ける絞り込み・指定の値",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "CORS",
    "en": "Cross-Origin Resource Sharing",
    "desc": "別ドメインへのアクセスを許可/制限するブラウザの仕組み",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "MIME タイプ",
    "en": "MIME Type",
    "desc": "データの種類を示す表記。text/html, application/json など",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "JSON / XML / YAML",
    "en": "JSON / XML / YAML",
    "desc": "データをやり取り・記述するための代表的な形式",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "WebSocket / SSE",
    "en": "WebSocket / Server-Sent Events",
    "desc": "双方向のリアルタイム通信 / サーバーからの一方向通知",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "レートリミット",
    "en": "Rate Limit",
    "desc": "一定時間あたりの呼び出し回数の上限",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "ページネーション",
    "en": "Pagination",
    "desc": "大量データをページ単位に分けて返す仕組み",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "API キー / ベアラートークン",
    "en": "API Key / Bearer Token",
    "desc": "API 利用者を識別する鍵 / 認証済みを示す引換券",
    "section": "web-net",
    "group": "HTTP をもう少し詳しく"
  },
  {
    "term": "OSI 参照モデル",
    "en": "OSI Model",
    "desc": "通信の役割を7つの層に分けて整理した基本モデル",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "リバースプロキシ",
    "en": "Reverse Proxy",
    "desc": "サーバー側に置き、外からの通信を受けて内部へ振り分ける中継",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "名前解決",
    "en": "Name Resolution",
    "desc": "ドメイン名から IP アドレスを引くこと（DNS の働き）",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "サブネット / CIDR",
    "en": "Subnet / CIDR",
    "desc": "ネットワークを区切る単位 / その範囲の表記（/24 など）",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "MAC アドレス",
    "en": "MAC Address",
    "desc": "機器ごとに割り振られた物理的な識別番号",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "NAT",
    "en": "Network Address Translation",
    "desc": "プライベート IP と グローバル IP を変換する仕組み",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "DHCP",
    "en": "DHCP",
    "desc": "接続機器に IP アドレスを自動で割り当てる仕組み",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "TLS ハンドシェイク / 証明書",
    "en": "TLS Handshake / Certificate",
    "desc": "暗号通信を始める手続き / 通信相手の正当性を示す電子的な証明書",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "HTTP/2・HTTP/3",
    "en": "HTTP/2 / HTTP/3",
    "desc": "通信を高速化した新しい HTTP。HTTP/3 は QUIC を使う",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "IPv4 / IPv6",
    "en": "IPv4 / IPv6",
    "desc": "従来の IP アドレス方式 / 枯渇に対応した新しい方式",
    "section": "web-net",
    "group": "ネットワークをもう少し詳しく"
  },
  {
    "term": "サーバー",
    "en": "Server",
    "desc": "サービスやデータを提供する側のコンピュータ",
    "section": "infra",
    "group": "サーバーと仮想化"
  },
  {
    "term": "オンプレミス",
    "en": "On-Premises",
    "desc": "自社で物理的な機器を持って運用する形態（クラウドの対義）",
    "section": "infra",
    "group": "サーバーと仮想化"
  },
  {
    "term": "仮想化",
    "en": "Virtualization",
    "desc": "1台の物理資源を論理的に分割/集約し、柔軟に扱う技術",
    "section": "infra",
    "group": "サーバーと仮想化"
  },
  {
    "term": "仮想マシン",
    "en": "Virtual Machine (VM)",
    "desc": "仮想化で作った、独立した OS を持つ仮想のコンピュータ",
    "section": "infra",
    "group": "サーバーと仮想化"
  },
  {
    "term": "ハイパーバイザ",
    "en": "Hypervisor",
    "desc": "1台の上で複数の仮想マシンを動かす基盤ソフト",
    "section": "infra",
    "group": "サーバーと仮想化"
  },
  {
    "term": "インスタンス",
    "en": "Instance",
    "desc": "クラウド上で起動した1台分の仮想サーバー",
    "section": "infra",
    "group": "サーバーと仮想化"
  },
  {
    "term": "コンテナ",
    "en": "Container",
    "desc": "アプリと動作環境をまとめて軽量に隔離する仕組み。Docker が代表",
    "section": "infra",
    "group": "サーバーと仮想化"
  },
  {
    "term": "オーケストレーション",
    "en": "Orchestration",
    "desc": "多数のコンテナの配置・管理を自動化すること。Kubernetes が代表",
    "section": "infra",
    "group": "サーバーと仮想化"
  },
  {
    "term": "イメージ",
    "en": "Image",
    "desc": "コンテナや仮想マシンを起動するための雛形（テンプレート）",
    "section": "infra",
    "group": "サーバーと仮想化"
  },
  {
    "term": "クラウド",
    "en": "Cloud",
    "desc": "インターネット経由で計算資源やサービスを借りて使う形態",
    "section": "infra",
    "group": "クラウドのサービス形態"
  },
  {
    "term": "IaaS",
    "en": "Infrastructure as a Service",
    "desc": "サーバーやストレージなどのインフラを借りる形態",
    "section": "infra",
    "group": "クラウドのサービス形態"
  },
  {
    "term": "PaaS",
    "en": "Platform as a Service",
    "desc": "OS や実行環境まで用意された、開発の土台を借りる形態",
    "section": "infra",
    "group": "クラウドのサービス形態"
  },
  {
    "term": "SaaS",
    "en": "Software as a Service",
    "desc": "完成したソフトをネット経由で使う形態。Gmail など",
    "section": "infra",
    "group": "クラウドのサービス形態"
  },
  {
    "term": "サーバーレス",
    "en": "Serverless",
    "desc": "サーバー管理を意識せず、コードの実行だけに集中できる形態",
    "section": "infra",
    "group": "クラウドのサービス形態"
  },
  {
    "term": "プロビジョニング",
    "en": "Provisioning",
    "desc": "必要な資源を用意し、使える状態に割り当てること",
    "section": "infra",
    "group": "クラウドのサービス形態"
  },
  {
    "term": "リージョン / AZ",
    "en": "Region / Availability Zone",
    "desc": "クラウドの地理的な地域 / その中の独立した設備単位",
    "section": "infra",
    "group": "クラウドのサービス形態"
  },
  {
    "term": "スケールアウト / イン",
    "en": "Scale Out / In",
    "desc": "サーバーの台数を増やす / 減らして処理能力を調整する",
    "section": "infra",
    "group": "拡張性・信頼性"
  },
  {
    "term": "スケールアップ / ダウン",
    "en": "Scale Up / Down",
    "desc": "1台の性能（CPU・メモリ）を上げる / 下げる",
    "section": "infra",
    "group": "拡張性・信頼性"
  },
  {
    "term": "冗長化",
    "en": "Redundancy",
    "desc": "予備を用意し、一部が壊れても止まらないようにすること",
    "section": "infra",
    "group": "拡張性・信頼性"
  },
  {
    "term": "可用性",
    "en": "Availability",
    "desc": "システムが停止せず使い続けられる度合い",
    "section": "infra",
    "group": "拡張性・信頼性"
  },
  {
    "term": "フェイルオーバー",
    "en": "Failover",
    "desc": "障害時に待機系へ自動で切り替えること",
    "section": "infra",
    "group": "拡張性・信頼性"
  },
  {
    "term": "ロードバランシング",
    "en": "Load Balancing",
    "desc": "処理を複数サーバーに分散して負荷を平準化すること",
    "section": "infra",
    "group": "拡張性・信頼性"
  },
  {
    "term": "キャパシティ",
    "en": "Capacity",
    "desc": "処理・保存できる容量の上限",
    "section": "infra",
    "group": "拡張性・信頼性"
  },
  {
    "term": "ミドルウェア",
    "en": "Middleware",
    "desc": "OS とアプリの間で働くソフト。Web サーバー・DB など",
    "section": "infra",
    "group": "拡張性・信頼性"
  },
  {
    "term": "Dockerfile",
    "en": "Dockerfile",
    "desc": "コンテナイメージの作り方を書いた手順書",
    "section": "infra",
    "group": "コンテナ・オーケストレーション"
  },
  {
    "term": "レジストリ",
    "en": "Registry",
    "desc": "コンテナイメージを保管・配布する場所（Docker Hub など）",
    "section": "infra",
    "group": "コンテナ・オーケストレーション"
  },
  {
    "term": "ボリューム / マウント",
    "en": "Volume / Mount",
    "desc": "コンテナ外にデータを保存する領域 / それを結び付けること",
    "section": "infra",
    "group": "コンテナ・オーケストレーション"
  },
  {
    "term": "Kubernetes（K8s）",
    "en": "Kubernetes",
    "desc": "多数のコンテナの配置・自動復旧・拡張を管理する基盤",
    "section": "infra",
    "group": "コンテナ・オーケストレーション"
  },
  {
    "term": "Pod / ノード / クラスタ",
    "en": "Pod / Node / Cluster",
    "desc": "コンテナの最小単位 / 動かすサーバー / それらの集まり",
    "section": "infra",
    "group": "コンテナ・オーケストレーション"
  },
  {
    "term": "ヘルスチェック",
    "en": "Health Check",
    "desc": "サービスが正常かを定期的に確認する仕組み",
    "section": "infra",
    "group": "コンテナ・オーケストレーション"
  },
  {
    "term": "リバースプロキシ",
    "en": "Reverse Proxy",
    "desc": "外からの通信を受け、内部のサービスへ振り分ける中継（nginx など）",
    "section": "infra",
    "group": "コンテナ・オーケストレーション"
  },
  {
    "term": "CI / CD",
    "en": "Continuous Integration / Delivery",
    "desc": "変更を自動でテスト・統合 / 自動でリリースまで届ける仕組み",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "パイプライン",
    "en": "Pipeline",
    "desc": "ビルド→テスト→デプロイを自動でつなげた一連の流れ",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "IaC",
    "en": "Infrastructure as Code",
    "desc": "インフラの構成をコードで管理する手法（Terraform / Ansible）",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "デプロイ戦略",
    "en": "Blue-Green / Canary / Rolling",
    "desc": "無停止で切り替える / 一部に先行公開 / 順番に入れ替える",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "オートスケーリング",
    "en": "Auto Scaling",
    "desc": "負荷に応じてサーバー数を自動で増減させる仕組み",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "systemd / デーモン",
    "en": "systemd / Daemon",
    "desc": "サービスを常駐起動・管理する仕組み / 常駐プロセス",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "cron",
    "en": "cron",
    "desc": "決まった時刻に処理を自動実行する仕組み",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "オブザーバビリティ",
    "en": "Observability",
    "desc": "メトリクス・ログ・トレースでシステムの状態を可視化すること",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "SLA / SLO / SLI",
    "en": "SLA / SLO / SLI",
    "desc": "品質保証の約束 / 目標値 / 実測指標",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "SRE",
    "en": "Site Reliability Engineering",
    "desc": "信頼性をエンジニアリングで支える運用の考え方",
    "section": "infra",
    "group": "CI/CD・自動化・運用"
  },
  {
    "term": "データベース",
    "en": "Database",
    "desc": "決まった形式で整理されたデータの集まり",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "RDB",
    "en": "Relational Database",
    "desc": "行と列の表（テーブル）でデータを管理する方式",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "RDBMS",
    "en": "RDB Management System",
    "desc": "RDB を管理する専用ソフト。MySQL / PostgreSQL など",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "NoSQL",
    "en": "NoSQL",
    "desc": "表形式にとらわれない DB。文書型・KV型など。柔軟・大規模向き",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "テーブル",
    "en": "Table",
    "desc": "行と列からなる表。データの入れ物",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "カラム",
    "en": "Column",
    "desc": "表の「列」。項目（名前・メールなど）",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "レコード / ロー",
    "en": "Record / Row",
    "desc": "表の「行」。1件分のデータ",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "フィールド",
    "en": "Field",
    "desc": "行と列が交差する1つのデータ項目",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "主キー / 外部キー",
    "en": "Primary / Foreign Key",
    "desc": "行を一意に識別する列 / 別テーブルを参照する列",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "スキーマ",
    "en": "Schema",
    "desc": "データの構造・型を定義したもの（設計図）",
    "section": "data",
    "group": "データベースの基本構造"
  },
  {
    "term": "SQL",
    "en": "Structured Query Language",
    "desc": "RDB を操作するための専用言語",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "クエリ",
    "en": "Query",
    "desc": "データベースへの命令（抽出・更新など）",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "CRUD",
    "en": "Create/Read/Update/Delete",
    "desc": "作成・読み取り・更新・削除。データ操作の4基本",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "JOIN",
    "en": "Join",
    "desc": "複数テーブルを関連づけて結合し、まとめて取得すること",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "インデックス",
    "en": "Index",
    "desc": "検索を速くするための索引。本の索引と同じ発想",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "トランザクション",
    "en": "Transaction",
    "desc": "複数の処理を「全部やるか、全部取り消すか」でまとめる単位",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "ロック",
    "en": "Lock",
    "desc": "同時更新の衝突を防ぐため、データに一時的な鍵をかけること",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "キャッシュ",
    "en": "Cache",
    "desc": "よく使うデータを高速な場所に一時保存し、読み込みを速くする仕組み",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "マイグレーション",
    "en": "Migration",
    "desc": "DB の構造やデータを新しい形へ移行すること",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "ORM",
    "en": "Object-Relational Mapping",
    "desc": "DB の行を、プログラムのオブジェクトとして扱う仕組み",
    "section": "data",
    "group": "データの操作"
  },
  {
    "term": "DWH",
    "en": "Data Warehouse",
    "desc": "分析のために全社のデータを集約した大規模なデータベース",
    "section": "data",
    "group": "データ分析・基盤"
  },
  {
    "term": "データマート",
    "en": "Data Mart",
    "desc": "特定の目的向けに絞って加工したデータベース",
    "section": "data",
    "group": "データ分析・基盤"
  },
  {
    "term": "ETL",
    "en": "Extract/Transform/Load",
    "desc": "データを抽出・変換・書き込みする一連の処理",
    "section": "data",
    "group": "データ分析・基盤"
  },
  {
    "term": "データレイク",
    "en": "Data Lake",
    "desc": "生データをそのまま大量に貯めておく保管場所",
    "section": "data",
    "group": "データ分析・基盤"
  },
  {
    "term": "BI ツール",
    "en": "Business Intelligence",
    "desc": "データを可視化・分析して意思決定を助けるツール",
    "section": "data",
    "group": "データ分析・基盤"
  },
  {
    "term": "データマイニング",
    "en": "Data Mining",
    "desc": "大量データから有益なパターンや知見を掘り出すこと",
    "section": "data",
    "group": "データ分析・基盤"
  },
  {
    "term": "バッチ / ストリーム",
    "en": "Batch / Stream",
    "desc": "まとめて定期処理 / 発生した端から逐次処理",
    "section": "data",
    "group": "データ分析・基盤"
  },
  {
    "term": "ACID",
    "en": "ACID",
    "desc": "トランザクションが守る4性質（原子性・一貫性・分離性・永続性）",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "分離レベル",
    "en": "Isolation Level",
    "desc": "同時実行時にどこまで干渉を防ぐかの段階設定",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "楽観 / 悲観ロック",
    "en": "Optimistic / Pessimistic Lock",
    "desc": "更新時に衝突を確認 / 先に鍵をかけて待たせる",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "デッドロック",
    "en": "Deadlock",
    "desc": "互いに相手のロックを待ち続けて処理が止まる状態",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "正規化 / 非正規化",
    "en": "Normalization",
    "desc": "重複を排除して分割 / あえて重複を持たせ速度を優先",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "レプリケーション",
    "en": "Replication",
    "desc": "同じデータを複数の DB に複製して可用性・分散を高める",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "シャーディング / パーティション",
    "en": "Sharding / Partition",
    "desc": "データを分割して複数に分散 / 表を内部で分割して管理",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "OLTP / OLAP",
    "en": "OLTP / OLAP",
    "desc": "日々の取引処理向け / 集計・分析向けの処理方式",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "ビュー / ストアドプロシージャ",
    "en": "View / Stored Procedure",
    "desc": "仮想の表 / DB 内に保存した処理手続き",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "ベクトル DB / 全文検索",
    "en": "Vector DB / Full-text Search",
    "desc": "意味の近さで検索 / 文章中の語で検索する仕組み",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "コネクションプール",
    "en": "Connection Pool",
    "desc": "DB 接続を使い回して効率化する仕組み",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "プレースホルダ",
    "en": "Placeholder / Prepared Statement",
    "desc": "値を安全に埋め込み、SQL インジェクションを防ぐ書き方",
    "section": "data",
    "group": "もう一歩 — 専門用語"
  },
  {
    "term": "サイバーセキュリティ",
    "en": "Cyber Security",
    "desc": "情報システムを脅威から守る取り組み全般",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "CIA トライアド",
    "en": "Confidentiality / Integrity / Availability",
    "desc": "機密性・完全性・可用性。情報セキュリティの3本柱",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "脅威 / 脆弱性 / リスク",
    "en": "Threat / Vulnerability / Risk",
    "desc": "危険の原因 / 弱点 / 被害が起きる可能性の大きさ",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "脆弱性",
    "en": "Vulnerability",
    "desc": "攻撃に悪用されうるシステムの弱点・欠陥",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "エクスプロイト",
    "en": "Exploit",
    "desc": "脆弱性を突いて攻撃するコードや手法",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "PoC",
    "en": "Proof of Concept",
    "desc": "脆弱性が実際に悪用可能だと示す検証コード・実証",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "アタックサーフェス",
    "en": "Attack Surface",
    "desc": "攻撃を受けうる入口の総量。狭いほど安全",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "ゼロトラスト",
    "en": "Zero Trust",
    "desc": "内部も信用せず常に検証する前提の考え方",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "ZTNA",
    "en": "Zero Trust Network Access",
    "desc": "ゼロトラストに基づき、都度検証してアクセスを許可する仕組み",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "多層防御",
    "en": "Defense in Depth",
    "desc": "対策を何層も重ね、1つ破られても守る考え方",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "最小権限の原則",
    "en": "Least Privilege",
    "desc": "必要最小限の権限だけを与える設計方針",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "セキュアコーディング",
    "en": "Secure Coding",
    "desc": "脆弱性を作り込まない書き方を徹底する開発手法",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "インシデント",
    "en": "Incident",
    "desc": "セキュリティ上の事故・問題の発生",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "不正アクセス",
    "en": "Unauthorized Access",
    "desc": "権限がないのにシステムへ侵入・利用すること",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "なりすまし",
    "en": "Impersonation",
    "desc": "他人になりきってサービスを利用・操作すること",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "ハッキング",
    "en": "Hacking",
    "desc": "システムを解析・改変する行為。悪意あるものはクラッキングとも",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "踏み台",
    "en": "Stepping Stone",
    "desc": "攻撃者が身元を隠すために経由する第三者のコンピュータ",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "サイバーテロ",
    "en": "Cyber Terrorism",
    "desc": "社会基盤の混乱を狙ったサイバー攻撃",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "アノニマス",
    "en": "Anonymous",
    "desc": "政治的主張のもとに活動する国際的なハッカー集団",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "ネットリテラシー",
    "en": "Net Literacy",
    "desc": "インターネットを安全・適切に使いこなす知識と判断力",
    "section": "security",
    "group": "基本概念"
  },
  {
    "term": "マルウェア",
    "en": "Malware",
    "desc": "悪意を持って作られたソフトの総称",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "ウイルス",
    "en": "Virus",
    "desc": "他のファイルに寄生して感染・増殖するプログラム",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "ワーム",
    "en": "Worm",
    "desc": "単体で自己増殖し、ネットワーク越しに広がるプログラム",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "トロイの木馬",
    "en": "Trojan Horse",
    "desc": "無害なソフトを装って侵入し、内部で悪事を働くプログラム",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "ランサムウェア",
    "en": "Ransomware",
    "desc": "データを暗号化し、復旧と引き換えに身代金を要求する",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "スパイウェア",
    "en": "Spyware",
    "desc": "利用者に気づかれず情報を収集し外部に送信する",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "アドウェア",
    "en": "Adware",
    "desc": "望まない広告を表示するソフト。情報収集を伴うことも",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "キーロガー",
    "en": "Keylogger",
    "desc": "キー入力を記録し、パスワードなどを盗む",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "バックドア",
    "en": "Backdoor",
    "desc": "正規の認証を迂回して侵入できる裏口",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "RAT",
    "en": "Remote Access Trojan",
    "desc": "感染端末を遠隔操作するためのマルウェア",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "Bot",
    "en": "Bot",
    "desc": "外部からの指令で自動的に動作する感染端末・プログラム",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "Botnet",
    "en": "Botnet",
    "desc": "多数の Bot をまとめて操るネットワーク。DDoS 等に悪用される",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "C&C サーバー",
    "en": "Command and Control",
    "desc": "感染端末へ指令を出し、盗んだ情報を集める攻撃者のサーバー",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "ドロッパー",
    "en": "Dropper",
    "desc": "本体のマルウェアを内部に隠し持ち、感染先へ落とし込む",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "ダウンローダー",
    "en": "Downloader",
    "desc": "感染後に外部から本体マルウェアを取得して実行する",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "パッカー",
    "en": "Packer",
    "desc": "マルウェアを圧縮・難読化し、検知を逃れるツール",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "バンキングトロージャン",
    "en": "Banking Trojan",
    "desc": "ネットバンキングの認証情報や取引を狙うマルウェア",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "スケアウェア",
    "en": "Scareware",
    "desc": "偽の警告で不安を煽り、不要な購入や操作をさせる",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "ストーカーウェア",
    "en": "Stalkerware",
    "desc": "同意なく個人の位置や通信を監視するアプリ",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "ブラウザ・ハイジャッカー",
    "en": "Browser Hijacker",
    "desc": "ブラウザ設定を勝手に変え、特定サイトへ誘導する",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "PUA",
    "en": "Potentially Unwanted Application",
    "desc": "明確な悪意はないが望ましくない挙動をするアプリ",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "ステルス",
    "en": "Stealth",
    "desc": "検知や解析から逃れるためにマルウェアが自身を隠す技術",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "オートラン",
    "en": "Autorun",
    "desc": "メディア接続時に自動実行する仕組み。感染拡大に悪用された",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "クリプトジャッキング",
    "en": "Cryptojacking",
    "desc": "他人の端末を無断で暗号資産のマイニングに使う攻撃",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "Exploit Kit",
    "en": "Exploit Kit",
    "desc": "複数の脆弱性攻撃をまとめ、自動で感染させる攻撃ツール",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "マニピュレーションサーバー",
    "en": "Manipulation Server",
    "desc": "通信を改ざん・操作して不正な内容を送り込むサーバー",
    "section": "security",
    "group": "マルウェアの種類"
  },
  {
    "term": "Emotet",
    "en": "トロイの木馬",
    "desc": "メール添付から感染し、情報窃取と他マルウェア配布を行う。世界的に猛威",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "Dridex",
    "en": "バンキングトロージャン",
    "desc": "不正なマクロ付き文書で感染し、金融情報を狙う",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "Zbot（ZeuS）",
    "en": "バンキングトロージャン",
    "desc": "オンラインバンキングの認証情報を盗む代表的マルウェア",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "コンフィッカー",
    "en": "ワーム",
    "desc": "Windows の脆弱性を突いて大規模感染したワーム",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "ガンブラー",
    "en": "攻撃手法／一連の攻撃",
    "desc": "正規サイトを改ざんし、閲覧者を感染させた攻撃キャンペーン",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "メリッサ",
    "en": "ウイルス",
    "desc": "メール経由で爆発的に広がった初期の代表的マクロウイルス",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "Rbot",
    "en": "ボット型",
    "desc": "IRC 経由で遠隔操作されるボットの一種",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "Delf",
    "en": "トロイの木馬",
    "desc": "Delphi 製の多種多様な亜種を持つマルウェア群",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "Dorkbot",
    "en": "ワーム／ボット",
    "desc": "SNS やUSB経由で拡散し、認証情報を盗むボット",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "Sirefef（ZeroAccess）",
    "en": "ルートキット型",
    "desc": "深く潜伏し、クリック詐欺やマイニングを行う",
    "section": "security",
    "group": "代表的なマルウェアの名前"
  },
  {
    "term": "SQL インジェクション",
    "en": "SQL Injection",
    "desc": "入力に不正な SQL を混ぜ、DB を不正操作する攻撃",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "クロスサイトスクリプティング",
    "en": "XSS",
    "desc": "他人のブラウザ上で不正スクリプトを実行させる攻撃",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "クロスサイトリクエストフォージェリ",
    "en": "CSRF",
    "desc": "ログイン状態を悪用し、意図しない操作をさせる攻撃",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "クリックジャッキング",
    "en": "Clickjacking",
    "desc": "透明な要素を重ね、意図しないクリックをさせる攻撃",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "ディレクトリトラバーサル",
    "en": "Directory Traversal",
    "desc": "../ などで公開範囲外のファイルを読み出す攻撃",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "バッファオーバーフロー",
    "en": "Buffer Overflow",
    "desc": "想定以上のデータを送り込み、領域を溢れさせて任意コードを実行させる",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "OS コマンドインジェクション",
    "en": "OS Command Injection",
    "desc": "入力に OS コマンドを混ぜて実行させる攻撃",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "SSRF",
    "en": "Server-Side Request Forgery",
    "desc": "サーバーを踏み台にして内部ネットワークへアクセスさせる",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "IDOR",
    "en": "Insecure Direct Object Reference",
    "desc": "ID を書き換えるだけで他人のデータが見えてしまう不備",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "OWASP Top 10",
    "en": "OWASP Top 10",
    "desc": "Web の代表的な脆弱性をまとめた定番リスト",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "ブラクラ",
    "en": "Browser Crasher",
    "desc": "大量処理などでブラウザを強制終了させる悪質なページ",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "ActiveX",
    "en": "ActiveX",
    "desc": "旧 IE の拡張技術。強い権限ゆえ攻撃の温床になった",
    "section": "security",
    "group": "Web アプリケーションへの攻撃"
  },
  {
    "term": "DoS 攻撃",
    "en": "Denial of Service",
    "desc": "過剰な負荷をかけてサービスを停止させる攻撃",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "DDoS 攻撃",
    "en": "Distributed DoS",
    "desc": "多数の端末から一斉に行う大規模な DoS 攻撃",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "フラッディング攻撃",
    "en": "Flooding",
    "desc": "大量のパケットを送りつけて回線や機器を溢れさせる",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "ICMP 攻撃",
    "en": "ICMP Attack",
    "desc": "ping などに使う ICMP を悪用した攻撃",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "DNS キャッシュポイズニング",
    "en": "DNS Cache Poisoning",
    "desc": "DNS に偽の対応情報を覚えさせ、偽サイトへ誘導する",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "DNS リフレクター攻撃",
    "en": "DNS Reflection",
    "desc": "DNS を反射役に使い、増幅した通信を標的へ送る DDoS",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "オープンリゾルバ",
    "en": "Open Resolver",
    "desc": "誰からの問い合わせにも応じる DNS。攻撃に悪用されやすい",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "MITM 攻撃",
    "en": "Man-in-the-Middle",
    "desc": "通信の間に割り込み、盗聴・改ざんする攻撃",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "MITB 攻撃",
    "en": "Man-in-the-Browser",
    "desc": "ブラウザ内部に潜み、送信内容を書き換える攻撃",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "スプーフィング",
    "en": "Spoofing",
    "desc": "送信元 IP やメールアドレスを偽装する行為",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "ドメイン名ハイジャック",
    "en": "Domain Hijacking",
    "desc": "ドメインの管理権を奪い、別のサーバーへ誘導する",
    "section": "security",
    "group": "ネットワークへの攻撃"
  },
  {
    "term": "標的型攻撃",
    "en": "Targeted Attack",
    "desc": "特定の組織を狙い、綿密に準備して行う攻撃",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "APT",
    "en": "Advanced Persistent Threat",
    "desc": "長期間潜伏して執拗に狙い続ける高度な攻撃",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "ゼロデイ攻撃",
    "en": "Zero-Day Attack",
    "desc": "修正が公開される前の未知の脆弱性を突く攻撃",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "ドライブ・バイ・ダウンロード",
    "en": "Drive-by Download",
    "desc": "サイトを閲覧しただけで自動的に感染させる攻撃",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "水飲み場型攻撃",
    "en": "Watering Hole",
    "desc": "標的がよく訪れるサイトを改ざんして待ち伏せする攻撃",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "サプライチェーン攻撃",
    "en": "Supply Chain Attack",
    "desc": "取引先や利用ライブラリを経由して侵入する攻撃",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "イニシャルアクセスブローカー",
    "en": "Initial Access Broker",
    "desc": "侵入経路を確保し、他の攻撃者に売る仲介者",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "サイバーキルチェーン",
    "en": "Cyber Kill Chain",
    "desc": "偵察から目的達成までの攻撃段階を整理したモデル",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "ラテラルムーブメント",
    "en": "Lateral Movement",
    "desc": "侵入後、内部の別の機器へ横展開して被害を広げる",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "特権の昇格",
    "en": "Privilege Escalation",
    "desc": "より高い権限を不正に取得すること",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "Shellshock",
    "en": "Shellshock",
    "desc": "bash の脆弱性。遠隔から任意コマンドを実行できた重大事案",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "Heartbleed",
    "en": "Heartbleed",
    "desc": "OpenSSL の脆弱性。メモリ内容が漏洩した重大事案",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "root 化 / Jailbreak",
    "en": "Rooting / Jailbreak",
    "desc": "端末の制限を解除して管理者権限を得る行為。安全性が低下する",
    "section": "security",
    "group": "侵入・標的型の手口"
  },
  {
    "term": "ブルートフォース攻撃",
    "en": "Brute Force",
    "desc": "総当たりでパスワードを試す攻撃",
    "section": "security",
    "group": "認証・パスワードへの攻撃"
  },
  {
    "term": "リバースブルートフォース",
    "en": "Reverse Brute Force",
    "desc": "パスワードを固定し、ID 側を次々に変えて試す攻撃",
    "section": "security",
    "group": "認証・パスワードへの攻撃"
  },
  {
    "term": "パスワードリスト攻撃",
    "en": "Password List Attack",
    "desc": "他所で漏洩した ID/パスワードの組で不正ログインを試みる",
    "section": "security",
    "group": "認証・パスワードへの攻撃"
  },
  {
    "term": "アカウントリスト攻撃",
    "en": "Account List Attack",
    "desc": "パスワードリスト攻撃と同義。使い回しが被害を広げる",
    "section": "security",
    "group": "認証・パスワードへの攻撃"
  },
  {
    "term": "ソーシャル・エンジニアリング",
    "en": "Social Engineering",
    "desc": "技術ではなく人の心理や隙を突いて情報を得る手口",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "フィッシング詐欺",
    "en": "Phishing",
    "desc": "正規を装ったメール等で認証情報をだまし取る詐欺",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "フィッシングサイト",
    "en": "Phishing Site",
    "desc": "本物そっくりに作られた情報詐取用の偽サイト",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "スピアフィッシング",
    "en": "Spear Phishing",
    "desc": "特定個人・組織向けに内容を作り込んだフィッシング",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "スミッシング",
    "en": "Smishing",
    "desc": "SMS を使ったフィッシング詐欺",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "ビッシング",
    "en": "Vishing",
    "desc": "音声通話を使ったフィッシング詐欺",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "ファーミング",
    "en": "Pharming",
    "desc": "DNS 等を改ざんし、正規 URL でも偽サイトへ誘導する",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "サポート詐欺",
    "en": "Tech Support Scam",
    "desc": "偽の警告画面でサポートを装い、金銭や遠隔操作を要求する",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "スパム",
    "en": "Spam",
    "desc": "受信者の同意なく大量送信される迷惑メッセージ",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "Malspam",
    "en": "Malspam",
    "desc": "マルウェアを添付・誘導する悪意あるスパムメール",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "チェーンメール",
    "en": "Chain Mail",
    "desc": "転送を促し連鎖的に広がるメール。デマ拡散の温床",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "ドキシング",
    "en": "Doxing",
    "desc": "個人情報を暴き、ネット上で晒す嫌がらせ行為",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "ネットストーカー",
    "en": "Cyberstalking",
    "desc": "ネットを通じて執拗につきまとう行為",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "ダークウェブ",
    "en": "Dark Web",
    "desc": "通常の検索では届かない匿名性の高い領域",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "ダークマーケット",
    "en": "Dark Market",
    "desc": "ダークウェブ上で違法な物品・情報が売買される闇市場",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "CaaS",
    "en": "Crime-as-a-Service",
    "desc": "サイバー犯罪の道具や手口をサービスとして売買する形態",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "RaaS",
    "en": "Ransomware-as-a-Service",
    "desc": "ランサムウェアをサービスとして提供する犯罪ビジネス",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "PhaaS",
    "en": "Phishing-as-a-Service",
    "desc": "フィッシングの仕組みを一式提供する犯罪サービス",
    "section": "security",
    "group": "詐欺・ソーシャルエンジニアリング"
  },
  {
    "term": "認証 / 認可",
    "en": "Authentication / Authorization",
    "desc": "誰かを確かめること / 何を許すかを決めること",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "多要素認証（MFA）",
    "en": "Multi-Factor Authentication",
    "desc": "知識・所持・生体など複数要素を組み合わせる認証",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "二要素認証",
    "en": "Two-Factor Authentication",
    "desc": "異なる2種類の要素で認証する方式",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "二段階認証",
    "en": "Two-Step Verification",
    "desc": "2回に分けて確認する方式。要素は同種のこともある",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "ワンタイムパスワード",
    "en": "One-Time Password",
    "desc": "一度きり・短時間だけ有効な使い捨てパスワード",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "生体認証",
    "en": "Biometrics",
    "desc": "指紋・顔・虹彩など身体的特徴による認証",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "パスキー",
    "en": "Passkey",
    "desc": "パスワードを使わず端末の鍵と生体認証でログインする方式",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "パスフレーズ",
    "en": "Passphrase",
    "desc": "複数語をつないだ長く覚えやすいパスワード",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "シングルサインオン",
    "en": "Single Sign-On",
    "desc": "一度の認証で複数サービスを利用できる仕組み",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "OAuth",
    "en": "OAuth",
    "desc": "パスワードを渡さず、権限だけを外部サービスに委譲する仕組み",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "OpenID",
    "en": "OpenID",
    "desc": "外部の ID を使って本人確認を行う認証の規格",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "SAML",
    "en": "Security Assertion Markup Language",
    "desc": "企業向け SSO で認証情報を安全に受け渡す規格",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "IDaaS",
    "en": "Identity as a Service",
    "desc": "ID 管理・認証をクラウドで提供するサービス",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "特権 ID",
    "en": "Privileged ID",
    "desc": "管理者など強い権限を持つアカウント。厳重管理が必要",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "BYOD",
    "en": "Bring Your Own Device",
    "desc": "私物端末を業務利用すること。管理と情報漏洩に注意",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "シャドー IT",
    "en": "Shadow IT",
    "desc": "会社が把握しないまま従業員が使うIT機器・サービス",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "MDM",
    "en": "Mobile Device Management",
    "desc": "モバイル端末を一元管理し、紛失時に遠隔ロック等を行う",
    "section": "security",
    "group": "認証・アクセス管理"
  },
  {
    "term": "暗号化 / 復号",
    "en": "Encryption / Decryption",
    "desc": "読めない形に変換する / 元に戻す",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "共通鍵暗号方式",
    "en": "Common Key Cryptography",
    "desc": "暗号化と復号に同じ鍵を使う方式。高速",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "公開鍵暗号方式",
    "en": "Public Key Cryptography",
    "desc": "公開鍵で暗号化し秘密鍵で復号。鍵配布が安全",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "AES",
    "en": "Advanced Encryption Standard",
    "desc": "現在標準的に使われる強力な共通鍵暗号方式",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "ハッシュ値",
    "en": "Hash",
    "desc": "データから求まる固定長の値。改ざん検知や保存に使う",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "ソルト / ストレッチング",
    "en": "Salt / Stretching",
    "desc": "ハッシュに加える乱数 / 計算を遅くし総当たりを防ぐ",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "デジタル署名 / 電子署名",
    "en": "Digital Signature",
    "desc": "作成者の正当性と改ざんの有無を保証する仕組み",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "デジタル証明書",
    "en": "Digital Certificate",
    "desc": "公開鍵の持ち主を第三者が保証する電子的な証明書",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "SSL / TLS",
    "en": "SSL / TLS",
    "desc": "通信を暗号化する技術。現在の標準は TLS",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "IPsec",
    "en": "IPsec",
    "desc": "IP 層で通信を暗号化・認証する仕組み。VPN で使われる",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "VPN",
    "en": "Virtual Private Network",
    "desc": "公衆回線上に仮想の専用線を作り安全に通信する",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "SSH",
    "en": "Secure Shell",
    "desc": "サーバーへ安全に接続・操作するためのプロトコル",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "Tor",
    "en": "The Onion Router",
    "desc": "通信を多段中継し匿名性を高める仕組み",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "ステガノグラフィ",
    "en": "Steganography",
    "desc": "画像などにデータを埋め込み、存在自体を隠す技術",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "量子暗号",
    "en": "Quantum Cryptography",
    "desc": "量子力学の性質を利用し、盗聴を検知できる暗号技術",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "WEP / WPA / WPA2 / WPA3",
    "en": "Wi-Fi Security",
    "desc": "無線LANの暗号化規格。WEP は脆弱で WPA3 が最新",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "TKIP",
    "en": "Temporal Key Integrity Protocol",
    "desc": "WEP の弱点を補うために作られた暗号化方式（現在は非推奨）",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "SSID",
    "en": "Service Set Identifier",
    "desc": "無線 LAN のアクセスポイントを識別する名前",
    "section": "security",
    "group": "暗号・通信の保護"
  },
  {
    "term": "ファイアウォール",
    "en": "Firewall",
    "desc": "通信を許可/拒否して不正アクセスを防ぐ仕組み",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "パーソナルファイアウォール",
    "en": "Personal Firewall",
    "desc": "個々の端末上で動作するファイアウォール",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "WAF",
    "en": "Web Application Firewall",
    "desc": "Web アプリを狙う攻撃に特化した防御機構",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "IDS",
    "en": "Intrusion Detection System",
    "desc": "不正侵入を検知して知らせるシステム",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "IPS",
    "en": "Intrusion Prevention System",
    "desc": "不正侵入を検知し、通信の遮断まで行うシステム",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "UTM",
    "en": "Unified Threat Management",
    "desc": "複数のセキュリティ機能を1台に統合した機器",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "非武装ネットワーク（DMZ）",
    "en": "DeMilitarized Zone",
    "desc": "社内と外部の中間に置く、公開サーバー用の領域",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "プロキシサーバー",
    "en": "Proxy Server",
    "desc": "通信を代理で中継し、制御・記録を行うサーバー",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "SWG",
    "en": "Secure Web Gateway",
    "desc": "Web アクセスを検査し、危険な通信を遮断する仕組み",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "CASB",
    "en": "Cloud Access Security Broker",
    "desc": "クラウド利用を可視化・制御する仕組み",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "SASE",
    "en": "Secure Access Service Edge",
    "desc": "ネットワークとセキュリティをクラウドで統合提供する考え方",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "DLP",
    "en": "Data Loss Prevention",
    "desc": "機密情報を特定し、外部持ち出しを検知・ブロックする",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "EDR",
    "en": "Endpoint Detection and Response",
    "desc": "端末の挙動を記録・監視し、脅威の検知と対応を行う",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "XDR",
    "en": "Extended Detection and Response",
    "desc": "端末に加えネットワークやクラウドまで横断的に検知・対応",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "MDR",
    "en": "Managed Detection and Response",
    "desc": "検知と対応を専門事業者が代行するサービス",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "MSS",
    "en": "Managed Security Service",
    "desc": "セキュリティ運用を外部の専門事業者に委託するサービス",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "サンドボックス",
    "en": "Sandbox",
    "desc": "隔離環境で実行し、安全性を確かめる仕組み",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "ハニーポット",
    "en": "Honeypot",
    "desc": "わざと攻撃させて手口を観察するための囮システム",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "ターピット",
    "en": "Tarpit",
    "desc": "接続をわざと遅延させ、攻撃や大量送信を妨害する仕組み",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "ヒューリスティック",
    "en": "Heuristic",
    "desc": "既知パターンに頼らず、振る舞いから未知の脅威を推定する検知",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "プロアクティブ検知",
    "en": "Proactive Detection",
    "desc": "被害が出る前に、予兆や未知の脅威を先回りして検知すること",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "Web フィルタリング",
    "en": "Web Filtering",
    "desc": "有害・業務外のサイトへのアクセスを制限する仕組み",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "メールフィルタリング",
    "en": "Mail Filtering",
    "desc": "迷惑メールや不正な添付を検知・遮断する仕組み",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "ネットワーク検疫",
    "en": "Network Quarantine",
    "desc": "社内接続前に端末の安全性を検査し、問題があれば隔離する",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "SPF / DKIM / DMARC",
    "en": "SPF / DKIM / DMARC",
    "desc": "メール送信元の正当性を検証し、なりすましを防ぐ仕組み",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "EMET",
    "en": "Enhanced Mitigation Experience Toolkit",
    "desc": "脆弱性攻撃を緩和する Microsoft の旧ツール",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "CSP / セキュリティヘッダ",
    "en": "Content Security Policy",
    "desc": "ブラウザに安全策を指示する HTTP ヘッダ",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "サニタイズ / エスケープ",
    "en": "Sanitize / Escape",
    "desc": "危険な入力を無害化する / 特殊文字の意味を打ち消す",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "パッチ",
    "en": "Patch",
    "desc": "脆弱性や不具合を修正するための更新プログラム",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "アプライアンス",
    "en": "Appliance",
    "desc": "特定用途に特化した専用機器。導入が容易で高性能",
    "section": "security",
    "group": "防御の仕組み・製品"
  },
  {
    "term": "脆弱性診断",
    "en": "Vulnerability Assessment",
    "desc": "既知の弱点が無いかを網羅的に調べる検査",
    "section": "security",
    "group": "診断・テスト"
  },
  {
    "term": "ペネトレーションテスト",
    "en": "Penetration Test",
    "desc": "実際に攻撃を試み、侵入できるかを検証する診断",
    "section": "security",
    "group": "診断・テスト"
  },
  {
    "term": "ファジング",
    "en": "Fuzzing",
    "desc": "大量のランダム入力を与えて不具合や脆弱性を発見する手法",
    "section": "security",
    "group": "診断・テスト"
  },
  {
    "term": "SAST / DAST / SCA",
    "en": "Static / Dynamic / Composition Analysis",
    "desc": "静的解析 / 動的解析 / 依存ライブラリの解析",
    "section": "security",
    "group": "診断・テスト"
  },
  {
    "term": "DevSecOps / シフトレフト",
    "en": "DevSecOps / Shift Left",
    "desc": "開発の早い段階からセキュリティを組み込む考え方",
    "section": "security",
    "group": "診断・テスト"
  },
  {
    "term": "脅威モデリング / STRIDE",
    "en": "Threat Modeling / STRIDE",
    "desc": "設計段階で脅威を洗い出す手法 / その代表的な分類",
    "section": "security",
    "group": "診断・テスト"
  },
  {
    "term": "CSIRT（CERT）",
    "en": "Computer Security Incident Response Team",
    "desc": "インシデント対応を担う専門チーム",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "SOC",
    "en": "Security Operation Center",
    "desc": "監視と初動対応を継続的に行う専門組織",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "SIEM",
    "en": "Security Information and Event Management",
    "desc": "各種ログを集約・相関分析して脅威を検知する仕組み",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "ログ",
    "en": "Log",
    "desc": "システムの動作や操作を記録したもの。追跡の基礎",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "フォレンジック",
    "en": "Forensics",
    "desc": "証拠を保全し、侵害の経緯を科学的に調査すること",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "インシデント対応",
    "en": "Incident Response",
    "desc": "準備・検知・封じ込め・根絶・復旧・教訓の一連の対応",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "脅威インテリジェンス",
    "en": "Threat Intelligence",
    "desc": "攻撃者や手口の情報を収集・分析し、防御に活かす知見",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "IoC",
    "en": "Indicator of Compromise",
    "desc": "侵害を示す痕跡（不審な IP・ハッシュ値など）",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "OSINT",
    "en": "Open Source Intelligence",
    "desc": "公開情報を収集・分析して調査に活用する手法",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "MITRE ATT&CK",
    "en": "MITRE ATT&CK",
    "desc": "攻撃者の戦術・技術を体系化した知識ベース",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "脆弱性管理",
    "en": "Vulnerability Management",
    "desc": "棚卸し→検出→トリアージ→修正→検証を回す運用",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "CVE / CVSS / CWE",
    "en": "CVE / CVSS / CWE",
    "desc": "脆弱性の識別番号 / 深刻度スコア / 種類の分類",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "KEV / EPSS",
    "en": "KEV / EPSS",
    "desc": "悪用が確認済みの一覧 / 悪用されやすさの予測スコア",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "責任ある開示",
    "en": "Responsible Disclosure",
    "desc": "修正の猶予を与えたうえで脆弱性を報告する作法",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "ISMS",
    "en": "Information Security Management System",
    "desc": "情報セキュリティを組織的に管理する仕組み（ISO 27001）",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "コンプライアンス",
    "en": "Compliance",
    "desc": "法令や社内規程を遵守すること",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "個人情報保護法",
    "en": "APPI",
    "desc": "個人情報の取り扱いを定めた日本の法律",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "PCI DSS",
    "en": "PCI DSS",
    "desc": "クレジットカード情報を扱う事業者向けのセキュリティ基準",
    "section": "security",
    "group": "運用・組織・標準"
  },
  {
    "term": "IaaS / PaaS / SaaS",
    "en": "IaaS / PaaS / SaaS",
    "desc": "インフラ / 開発基盤 / 完成ソフトを借りるクラウド形態",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "DaaS / iPaaS",
    "en": "Desktop / Integration as a Service",
    "desc": "デスクトップ環境の提供 / システム連携基盤の提供",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "CDN",
    "en": "Content Delivery Network",
    "desc": "コンテンツを分散配置し高速配信する仕組み。DDoS 緩和にも",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "DNS",
    "en": "Domain Name System",
    "desc": "ドメイン名と IP アドレスを対応づける仕組み",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "Cookie",
    "en": "Cookie",
    "desc": "ブラウザに保存される小さなデータ。ログイン状態の保持等",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "パケット",
    "en": "Packet",
    "desc": "通信データを分割した単位",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "グローバル IP アドレス",
    "en": "Global IP Address",
    "desc": "インターネット上で一意な IP アドレス",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "NAS",
    "en": "Network Attached Storage",
    "desc": "ネットワークに接続して共有する記憶装置",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "SNMP",
    "en": "Simple Network Management Protocol",
    "desc": "ネットワーク機器を監視・制御するプロトコル",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "RDP",
    "en": "Remote Desktop Protocol",
    "desc": "遠隔から端末の画面を操作するプロトコル。攻撃対象になりやすい",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "IRC",
    "en": "Internet Relay Chat",
    "desc": "古くからあるチャット規格。ボットの指令に悪用された歴史がある",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "テザリング",
    "en": "Tethering",
    "desc": "スマホ経由で他端末をインターネット接続させる機能",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "シンクライアント",
    "en": "Thin Client",
    "desc": "端末側は最小限にし、処理をサーバー側で行う仕組み",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "ファイル共有ソフト",
    "en": "P2P File Sharing",
    "desc": "利用者同士でファイルを共有するソフト。情報漏洩の原因にも",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "IoT",
    "en": "Internet of Things",
    "desc": "あらゆるモノがネットにつながる仕組み。脆弱な機器が狙われる",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "人工知能",
    "en": "Artificial Intelligence",
    "desc": "学習・推論を行う技術。攻撃にも防御にも使われる",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "ブロックチェーン",
    "en": "Blockchain",
    "desc": "改ざんが困難な分散型の取引記録技術",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "暗号資産（仮想通貨）",
    "en": "Cryptocurrency",
    "desc": "ブロックチェーン上で流通する電子的な資産",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "NFT",
    "en": "Non-Fungible Token",
    "desc": "唯一性を証明できるデジタル資産の規格",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "Web3.0",
    "en": "Web3",
    "desc": "ブロックチェーンを基盤とする分散型のインターネット構想",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "エコシステム",
    "en": "Ecosystem",
    "desc": "製品やサービスが連携し合って成り立つ全体の仕組み",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "ブラウザーフィンガープリント",
    "en": "Browser Fingerprint",
    "desc": "ブラウザの設定情報から個人を識別・追跡する技術",
    "section": "security",
    "group": "関連する IT・基盤用語"
  },
  {
    "term": "DOM",
    "en": "Document Object Model",
    "desc": "HTML をツリー構造で表したもの。JS から操作できる",
    "section": "frontend",
    "group": "ブラウザとレンダリングの土台"
  },
  {
    "term": "仮想 DOM",
    "en": "Virtual DOM",
    "desc": "DOM のコピーをメモリ上に持ち、差分だけを実 DOM に反映して高速化する仕組み",
    "section": "frontend",
    "group": "ブラウザとレンダリングの土台"
  },
  {
    "term": "差分検出 / 差分調整",
    "en": "Reconciliation",
    "desc": "変更前後の仮想 DOM を比べ、実際に変わった箇所だけを割り出す処理",
    "section": "frontend",
    "group": "ブラウザとレンダリングの土台"
  },
  {
    "term": "Fiber",
    "en": "Fiber",
    "desc": "React 内部で仮想 DOM を表すノード。中断・再開できるレンダリングを実現する",
    "section": "frontend",
    "group": "ブラウザとレンダリングの土台"
  },
  {
    "term": "レンダーフェーズ / コミットフェーズ",
    "en": "Render / Commit",
    "desc": "差分を計算する段階 / それを実 DOM に反映する段階",
    "section": "frontend",
    "group": "ブラウザとレンダリングの土台"
  },
  {
    "term": "再レンダリング",
    "en": "Re-render",
    "desc": "state や props の変化に応じて UI を描き直すこと",
    "section": "frontend",
    "group": "ブラウザとレンダリングの土台"
  },
  {
    "term": "リフロー / リペイント",
    "en": "Reflow / Repaint",
    "desc": "レイアウトの再計算 / 見た目の再描画。多いと重くなる",
    "section": "frontend",
    "group": "ブラウザとレンダリングの土台"
  },
  {
    "term": "宣言的 UI / 命令的 UI",
    "en": "Declarative / Imperative",
    "desc": "「あるべき状態」を書く / 「手順」を書く。モダンな UI は宣言的",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "コンポーネント",
    "en": "Component",
    "desc": "UI を再利用できる部品に分けた単位",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "props",
    "en": "Properties",
    "desc": "親コンポーネントから子へ渡すデータ",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "state",
    "en": "State",
    "desc": "コンポーネントが内部に持つ状態。変わると再描画される",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "Hooks",
    "en": "Hooks",
    "desc": "関数コンポーネントで状態や副作用を扱う仕組み（useState / useEffect など）",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "単方向データフロー",
    "en": "One-way Data Flow",
    "desc": "データは親から子へ一方向に流れる（React の基本）",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "双方向バインディング",
    "en": "Two-way Binding",
    "desc": "入力欄とデータを相互に同期させる（Vue / Angular で多用）",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "リアクティビティ",
    "en": "Reactivity",
    "desc": "状態が変わると UI が自動で追従して更新される性質",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "リフトアップ",
    "en": "Lifting State Up",
    "desc": "複数コンポーネントで共有する状態を、共通の親に持ち上げること",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "状態管理",
    "en": "State Management",
    "desc": "アプリ全体の状態を一元管理する仕組み（Redux / Pinia / Context など）",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "副作用",
    "en": "Side Effect",
    "desc": "描画以外の処理（通信・購読など）。useEffect で扱う",
    "section": "frontend",
    "group": "コンポーネントと状態"
  },
  {
    "term": "JSX",
    "en": "JSX",
    "desc": "JavaScript の中に HTML のように UI を書く記法（React）",
    "section": "frontend",
    "group": "フレームワークの言葉"
  },
  {
    "term": "テンプレート / ディレクティブ",
    "en": "Template / Directive",
    "desc": "HTML に構文を足して描画を制御する仕組み（v-if など）",
    "section": "frontend",
    "group": "フレームワークの言葉"
  },
  {
    "term": "Composition API",
    "en": "Composition API",
    "desc": "ロジックを関数として組み立てる Vue の書き方",
    "section": "frontend",
    "group": "フレームワークの言葉"
  },
  {
    "term": "DI（依存性注入）",
    "en": "Dependency Injection",
    "desc": "必要な部品を外から渡す仕組み（Angular のサービスなど）",
    "section": "frontend",
    "group": "フレームワークの言葉"
  },
  {
    "term": "Observable / RxJS",
    "en": "Observable",
    "desc": "時間とともに流れる値を購読して扱う仕組み（Angular）",
    "section": "frontend",
    "group": "フレームワークの言葉"
  },
  {
    "term": "SFC",
    "en": "Single File Component",
    "desc": "テンプレート・スクリプト・スタイルを1ファイルにまとめた形式（Vue）",
    "section": "frontend",
    "group": "フレームワークの言葉"
  },
  {
    "term": "メタフレームワーク",
    "en": "Meta-framework",
    "desc": "フレームワークの上に乗る枠組み。Next.js / Nuxt など",
    "section": "frontend",
    "group": "フレームワークの言葉"
  },
  {
    "term": "ルーティング",
    "en": "Routing",
    "desc": "URL に応じて表示する画面を切り替えること（React Router 等）",
    "section": "frontend",
    "group": "フレームワークの言葉"
  },
  {
    "term": "History API",
    "en": "History API",
    "desc": "ページを再読み込みせず URL を書き換えるブラウザの API",
    "section": "frontend",
    "group": "フレームワークの言葉"
  },
  {
    "term": "SPA",
    "en": "Single Page Application",
    "desc": "1枚のページ内で画面を切り替えるアプリ",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "CSR / SSR",
    "en": "Client / Server Side Rendering",
    "desc": "ブラウザ側で描画 / サーバー側で HTML を生成して返す",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "SSG / ISR",
    "en": "Static Generation / Incremental",
    "desc": "事前に静的生成 / 一部を随時再生成する方式",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "ハイドレーション",
    "en": "Hydration",
    "desc": "SSR で送った HTML に、後から JS を結び付けて操作可能にすること",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "バンドラ",
    "en": "Bundler",
    "desc": "多数のモジュールを1つ（数個）にまとめるツール。Vite / webpack",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "トランスパイル",
    "en": "Transpile",
    "desc": "新しい構文や TS を、ブラウザが解釈できる JS へ変換すること",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "ミニファイ / ツリーシェイキング",
    "en": "Minify / Tree Shaking",
    "desc": "コードを圧縮 / 使われていないコードを除去して軽くする",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "HMR（ホットリロード）",
    "en": "Hot Module Replacement",
    "desc": "保存した瞬間に変更箇所だけを画面へ反映する開発機能",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "ユーティリティファースト",
    "en": "Utility-first CSS",
    "desc": "細かい用途別クラスを組み合わせてスタイルする手法（Tailwind）",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "a11y（アクセシビリティ）",
    "en": "Accessibility",
    "desc": "誰もが使えるようにする配慮。読み上げ・キーボード操作など",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "PWA",
    "en": "Progressive Web App",
    "desc": "Web をアプリのように使えるようにする技術（オフライン・インストール）",
    "section": "frontend",
    "group": "レンダリング方式・ビルド"
  },
  {
    "term": "アルゴリズム",
    "en": "Algorithm",
    "desc": "問題を解くための手順",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "データ構造",
    "en": "Data Structure",
    "desc": "データの持ち方・並べ方。アルゴリズムと対になる",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "計算量 / オーダー記法",
    "en": "Complexity / Big-O",
    "desc": "入力が増えたとき処理時間がどれだけ増えるかの目安。O(n), O(log n) など",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "時間計算量 / 空間計算量",
    "en": "Time / Space Complexity",
    "desc": "かかる時間 / 使うメモリの量",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "全探索",
    "en": "Brute Force",
    "desc": "考えうる候補をすべて試す素直な方法",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "貪欲法",
    "en": "Greedy",
    "desc": "その場で最善の選択を繰り返す方法",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "分割統治",
    "en": "Divide and Conquer",
    "desc": "問題を小さく分けて解き、統合する方法",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "動的計画法（DP）",
    "en": "Dynamic Programming",
    "desc": "部分問題の答えを表に記録して再利用し、無駄な再計算を省く方法",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "メモ化",
    "en": "Memoization",
    "desc": "一度計算した結果を覚えておき、次回は使い回すこと",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "再帰",
    "en": "Recursion",
    "desc": "関数が自分自身を呼び出して問題を小さくしていくこと",
    "section": "algorithm",
    "group": "基本の考え方"
  },
  {
    "term": "配列 / リスト",
    "en": "Array / List",
    "desc": "要素を順番に並べた基本の入れ物。動的配列は伸縮できる",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "スタック",
    "en": "Stack",
    "desc": "後入れ先出し（LIFO）。積んだ順の逆で取り出す",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "キュー",
    "en": "Queue",
    "desc": "先入れ先出し（FIFO）。並んだ順に取り出す",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "連結リスト",
    "en": "Linked List",
    "desc": "各要素が次を指してつながる構造。挿入・削除が速い",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "ハッシュ（辞書 / 集合）",
    "en": "Hash Map / Set",
    "desc": "キーから値を高速に引ける構造。dict / set",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "ヒープ（優先度付きキュー）",
    "en": "Heap / Priority Queue",
    "desc": "最小（最大）をすぐ取り出せる構造。ダイクストラ等で使う",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "木 / 二分木",
    "en": "Tree / Binary Tree",
    "desc": "枝分かれする階層構造 / 子が最大2つの木",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "二分探索木",
    "en": "Binary Search Tree",
    "desc": "左<親<右 の順序を保ち、探索を速くした木",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "グラフ",
    "en": "Graph",
    "desc": "頂点（ノード）と辺（エッジ）でつながりを表す構造",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "隣接リスト / 隣接行列",
    "en": "Adjacency List / Matrix",
    "desc": "グラフのつながりの持ち方。リスト（疎）/ 表（密）",
    "section": "algorithm",
    "group": "データ構造"
  },
  {
    "term": "線形探索",
    "en": "Linear Search",
    "desc": "先頭から順に1つずつ探す。O(n)",
    "section": "algorithm",
    "group": "探索とソート"
  },
  {
    "term": "二分探索",
    "en": "Binary Search",
    "desc": "ソート済みで中央と比べ、半分に絞って探す。O(log n)",
    "section": "algorithm",
    "group": "探索とソート"
  },
  {
    "term": "幅優先探索（BFS）",
    "en": "Breadth-First Search",
    "desc": "近いところから層状に探索。最短手数に強い",
    "section": "algorithm",
    "group": "探索とソート"
  },
  {
    "term": "深さ優先探索（DFS）",
    "en": "Depth-First Search",
    "desc": "行けるところまで進んで戻る探索。連結成分・閉路検出に",
    "section": "algorithm",
    "group": "探索とソート"
  },
  {
    "term": "ソート",
    "en": "Sort",
    "desc": "データを昇順/降順に並べ替えること",
    "section": "algorithm",
    "group": "探索とソート"
  },
  {
    "term": "安定ソート",
    "en": "Stable Sort",
    "desc": "同じ値の元の順序を保つソート",
    "section": "algorithm",
    "group": "探索とソート"
  },
  {
    "term": "最短経路",
    "en": "Shortest Path",
    "desc": "2点間を結ぶ、重みの合計が最小の経路",
    "section": "algorithm",
    "group": "グラフ・数論"
  },
  {
    "term": "ダイクストラ法",
    "en": "Dijkstra",
    "desc": "非負の重みで単一始点の最短経路を求める。ヒープで高速化",
    "section": "algorithm",
    "group": "グラフ・数論"
  },
  {
    "term": "ベルマンフォード法",
    "en": "Bellman-Ford",
    "desc": "負の重みも扱える最短経路法。負閉路も検出できる",
    "section": "algorithm",
    "group": "グラフ・数論"
  },
  {
    "term": "ワーシャルフロイド法",
    "en": "Warshall-Floyd",
    "desc": "全頂点対の最短経路をまとめて求める",
    "section": "algorithm",
    "group": "グラフ・数論"
  },
  {
    "term": "緩和",
    "en": "Relaxation",
    "desc": "より短い経路が見つかったら距離を更新する操作",
    "section": "algorithm",
    "group": "グラフ・数論"
  },
  {
    "term": "トポロジカルソート",
    "en": "Topological Sort",
    "desc": "依存関係（DAG）を満たす順に頂点を並べること",
    "section": "algorithm",
    "group": "グラフ・数論"
  },
  {
    "term": "最大流 / 最小カット",
    "en": "Max Flow / Min Cut",
    "desc": "ネットワークで流せる最大量 / 分断に必要な最小コスト",
    "section": "algorithm",
    "group": "グラフ・数論"
  },
  {
    "term": "エラトステネスの篩",
    "en": "Sieve of Eratosthenes",
    "desc": "一定範囲の素数をまとめて高速に求める方法",
    "section": "algorithm",
    "group": "グラフ・数論"
  },
  {
    "term": "ユークリッドの互除法",
    "en": "Euclidean Algorithm",
    "desc": "2数の最大公約数（GCD）を高速に求める方法",
    "section": "algorithm",
    "group": "グラフ・数論"
  },
  {
    "term": "機械学習",
    "en": "Machine Learning",
    "desc": "データからパターンを学び、予測や判断を行う技術",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "ディープラーニング",
    "en": "Deep Learning",
    "desc": "多層のニューラルネットワークを使った機械学習",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "ニューラルネットワーク",
    "en": "Neural Network",
    "desc": "脳の神経を模した、層状に計算するモデル",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "教師あり / なし / 強化学習",
    "en": "Supervised / Unsupervised / Reinforcement",
    "desc": "正解付きで学ぶ / 正解なしで構造を見つける / 報酬で試行錯誤して学ぶ",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "学習（訓練） / 推論",
    "en": "Training / Inference",
    "desc": "データからモデルを作る / 学習済みモデルで予測する",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "データセット / 特徴量 / ラベル",
    "en": "Dataset / Feature / Label",
    "desc": "学習に使うデータ / 入力の手がかり / 正解の値",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "分類 / 回帰",
    "en": "Classification / Regression",
    "desc": "カテゴリを当てる / 数値を予測する",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "過学習",
    "en": "Overfitting",
    "desc": "訓練データに適合しすぎ、未知のデータに弱くなること",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "汎化",
    "en": "Generalization",
    "desc": "未知のデータにもうまく対応できる性能",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "パラメータ / ハイパーパラメータ",
    "en": "Parameter / Hyperparameter",
    "desc": "学習で調整される値 / 人が事前に決める設定",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "勾配降下法",
    "en": "Gradient Descent",
    "desc": "誤差が小さくなる方向に少しずつ値を調整する学習法",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "MLOps",
    "en": "MLOps",
    "desc": "学習〜デプロイ〜監視まで、ML の運用を回す仕組み",
    "section": "ai",
    "group": "機械学習の基礎"
  },
  {
    "term": "LLM（大規模言語モデル）",
    "en": "Large Language Model",
    "desc": "大量のテキストで学習し、文章を生成・理解するモデル",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "生成 AI",
    "en": "Generative AI",
    "desc": "文章・画像・コードなどを生成する AI の総称",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "プロンプト",
    "en": "Prompt",
    "desc": "AI への指示・入力文。工夫することをプロンプトエンジニアリングという",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "トークン",
    "en": "Token",
    "desc": "AI が扱う文字のかたまりの単位。課金や長さの基準になる",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "コンテキストウィンドウ",
    "en": "Context Window",
    "desc": "モデルが一度に扱える入力の長さの上限",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "埋め込み / ベクトル",
    "en": "Embedding / Vector",
    "desc": "文章などを意味を保った数値の並びに変換したもの",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "ハルシネーション",
    "en": "Hallucination",
    "desc": "もっともらしいが誤った内容を生成してしまう現象",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "ファインチューニング",
    "en": "Fine-tuning",
    "desc": "既存モデルを追加学習させ、用途に合わせて調整すること",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "RAG（検索拡張生成）",
    "en": "Retrieval-Augmented Generation",
    "desc": "外部の知識を検索して渡し、回答の精度・最新性を高める手法",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "ベクトル DB",
    "en": "Vector Database",
    "desc": "埋め込みを保存し、意味の近いものを高速に検索する DB",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "temperature",
    "en": "Temperature",
    "desc": "出力のランダムさ（多様さ）を調整するパラメータ",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "マルチモーダル",
    "en": "Multimodal",
    "desc": "テキストだけでなく画像・音声なども扱えること",
    "section": "ai",
    "group": "LLM・生成 AI"
  },
  {
    "term": "AI エージェント",
    "en": "AI Agent",
    "desc": "目標に向け、自分で考えてツールを使い、タスクを進める AI",
    "section": "ai",
    "group": "AI エージェント開発"
  },
  {
    "term": "ツール使用 / 関数呼び出し",
    "en": "Tool Use / Function Calling",
    "desc": "AI が外部の機能（検索・実行など）を呼び出して使うこと",
    "section": "ai",
    "group": "AI エージェント開発"
  },
  {
    "term": "エージェンティックループ",
    "en": "Agentic Loop",
    "desc": "収集 → 行動 → 検証 を繰り返して進める動作の流れ",
    "section": "ai",
    "group": "AI エージェント開発"
  },
  {
    "term": "MCP",
    "en": "Model Context Protocol",
    "desc": "AI と外部サービスをつなぐ共通規格。ツールを標準的に追加できる",
    "section": "ai",
    "group": "AI エージェント開発"
  },
  {
    "term": "Hooks",
    "en": "Hooks",
    "desc": "ツール実行の前後に、決めた処理を自動で挟む仕組み",
    "section": "ai",
    "group": "AI エージェント開発"
  },
  {
    "term": "サブエージェント",
    "en": "Subagent",
    "desc": "タスクを別コンテキストの AI に委任する仕組み",
    "section": "ai",
    "group": "AI エージェント開発"
  },
  {
    "term": "スキル",
    "en": "Skill",
    "desc": "再利用できる作業手順をまとめ、AI に呼び出させる仕組み",
    "section": "ai",
    "group": "AI エージェント開発"
  },
  {
    "term": "メモリ",
    "en": "Memory",
    "desc": "会話やタスクの状態を保持する仕組み",
    "section": "ai",
    "group": "AI エージェント開発"
  },
  {
    "term": "プランニング",
    "en": "Planning",
    "desc": "実行前に手順を計画させること（Plan モードなど）",
    "section": "ai",
    "group": "AI エージェント開発"
  },
  {
    "term": "オーケストレーション",
    "en": "Orchestration",
    "desc": "複数のモデルやツール・エージェントを組み合わせて制御すること",
    "section": "ai",
    "group": "AI エージェント開発"
  }
];
