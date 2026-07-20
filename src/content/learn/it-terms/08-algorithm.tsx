import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, ComparisonTable, KeyPoints, Callout, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "it-algorithm",
  title: "アルゴリズム・データ構造用語",
  description: "計算量(オーダー記法)・スタック/キュー/ヒープ・木/グラフ・探索(二分探索/BFS/DFS)・最短経路(ダイクストラ等)・動的計画法(DP)など、アルゴリズムとデータ構造の基本用語を収録。",
  domain: "it-terms",
  section: "algorithm",
  order: 1,
  level: "intro",
  tags: ["アルゴリズム", "データ構造", "計算量"],
  updated: "2026-07-19",
  minutes: 8,
};

export default function Article() {
  return (
    <>
      <Lead>
        「速く・正しく解く」ための考え方と道具の用語です。まず計算量、次にデータ構造、探索、グラフ、数論の順に整理します。競技プログラミングや技術面接でよく出ます。
      </Lead>

      <Section>基本の考え方</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["アルゴリズム", "Algorithm", "問題を解くための手順"],
          ["データ構造", "Data Structure", "データの持ち方・並べ方。アルゴリズムと対になる"],
          ["計算量 / オーダー記法", "Complexity / Big-O", "入力が増えたとき処理時間がどれだけ増えるかの目安。O(n), O(log n) など"],
          ["時間計算量 / 空間計算量", "Time / Space Complexity", "かかる時間 / 使うメモリの量"],
          ["全探索", "Brute Force", "考えうる候補をすべて試す素直な方法"],
          ["貪欲法", "Greedy", "その場で最善の選択を繰り返す方法"],
          ["分割統治", "Divide and Conquer", "問題を小さく分けて解き、統合する方法"],
          ["動的計画法（DP）", "Dynamic Programming", "部分問題の答えを表に記録して再利用し、無駄な再計算を省く方法"],
          ["メモ化", "Memoization", "一度計算した結果を覚えておき、次回は使い回すこと"],
          ["再帰", "Recursion", "関数が自分自身を呼び出して問題を小さくしていくこと"],
        ]}
      />

      <Section>データ構造</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["配列 / リスト", "Array / List", "要素を順番に並べた基本の入れ物。動的配列は伸縮できる"],
          ["スタック", "Stack", "後入れ先出し（LIFO）。積んだ順の逆で取り出す"],
          ["キュー", "Queue", "先入れ先出し（FIFO）。並んだ順に取り出す"],
          ["連結リスト", "Linked List", "各要素が次を指してつながる構造。挿入・削除が速い"],
          ["ハッシュ（辞書 / 集合）", "Hash Map / Set", "キーから値を高速に引ける構造。dict / set"],
          ["ヒープ（優先度付きキュー）", "Heap / Priority Queue", "最小（最大）をすぐ取り出せる構造。ダイクストラ等で使う"],
          ["木 / 二分木", "Tree / Binary Tree", "枝分かれする階層構造 / 子が最大2つの木"],
          ["二分探索木", "Binary Search Tree", "左<親<右 の順序を保ち、探索を速くした木"],
          ["グラフ", "Graph", "頂点（ノード）と辺（エッジ）でつながりを表す構造"],
          ["隣接リスト / 隣接行列", "Adjacency List / Matrix", "グラフのつながりの持ち方。リスト（疎）/ 表（密）"],
        ]}
      />

      <Section>探索とソート</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["線形探索", "Linear Search", "先頭から順に1つずつ探す。O(n)"],
          ["二分探索", "Binary Search", "ソート済みで中央と比べ、半分に絞って探す。O(log n)"],
          ["幅優先探索（BFS）", "Breadth-First Search", "近いところから層状に探索。最短手数に強い"],
          ["深さ優先探索（DFS）", "Depth-First Search", "行けるところまで進んで戻る探索。連結成分・閉路検出に"],
          ["ソート", "Sort", "データを昇順/降順に並べ替えること"],
          ["安定ソート", "Stable Sort", "同じ値の元の順序を保つソート"],
        ]}
      />

      <Section>グラフ・数論</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["最短経路", "Shortest Path", "2点間を結ぶ、重みの合計が最小の経路"],
          ["ダイクストラ法", "Dijkstra", "非負の重みで単一始点の最短経路を求める。ヒープで高速化"],
          ["ベルマンフォード法", "Bellman-Ford", "負の重みも扱える最短経路法。負閉路も検出できる"],
          ["ワーシャルフロイド法", "Warshall-Floyd", "全頂点対の最短経路をまとめて求める"],
          ["緩和", "Relaxation", "より短い経路が見つかったら距離を更新する操作"],
          ["トポロジカルソート", "Topological Sort", "依存関係（DAG）を満たす順に頂点を並べること"],
          ["最大流 / 最小カット", "Max Flow / Min Cut", "ネットワークで流せる最大量 / 分断に必要な最小コスト"],
          ["エラトステネスの篩", "Sieve of Eratosthenes", "一定範囲の素数をまとめて高速に求める方法"],
          ["ユークリッドの互除法", "Euclidean Algorithm", "2数の最大公約数（GCD）を高速に求める方法"],
        ]}
      />

      <Callout variant="info" title="手を動かして学ぶなら">
        これらの実装と考え方は「競技プログラミング」コースで、Python のコードとともに1つずつ解説しています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "計算量（O 記法）で速さを見積もる。O(n) より O(log n) が速い",
          "データ構造: スタック=LIFO、キュー=FIFO、ヒープ=最小/最大をすぐ取れる",
          "探索: 二分探索=半分に絞る、BFS=最短手数、DFS=行けるだけ進む",
          "最短経路: ダイクストラ（非負）・ベルマンフォード（負可）・ワーシャルフロイド（全点対）",
          "設計方針: 全探索 → 貪欲・分割統治・動的計画法（DP＋メモ化）で効率化",
        ]}
      />
    </>
  );
}
