import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, Steps, Step, KVList, ComparisonTable, KeyPoints, Bridge, TipBox, Divider } from "../../../components/learn/kit";
import { StepFlow } from "../../../components/learn/diagrams";

export const meta: LearnMeta = {
  id: "react-commit-phase",
  title: "React コミットフェーズ",
  description: "レンダー結果を実 DOM に反映するコミットフェーズの流れと、FiberRootNode.current の切り替えを図解的に理解する。",
  domain: "web",
  section: "frontend",
  order: 12,
  level: "practice",
  tags: ["React", "Fiber", "レンダリング"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        React のレンダリングは大きく 2 段階に分かれます。あるべき Fiber ツリーを組み立てる<strong>レンダーフェーズ</strong>と、
        その結果を実際の UI に反映する<strong>コミットフェーズ</strong>です。この章では後者、
        差分を実 DOM に「確定」させるコミットフェーズの流れを追います。
      </Lead>

      <Section>コミットフェーズとは</Section>
      <p>
        コミットフェーズは、レンダーフェーズで計算された結果を<strong>実際の UI へ適用する</strong>段階です。
        各 Fiber に付けられたフラグ（何をすべきか＝挿入・更新・削除など）を確認しながら、実 DOM を書き換えていきます。
        レンダーフェーズが中断・やり直し可能なのに対し、コミットフェーズは<strong>中断できません</strong>。
        画面が中途半端な状態で止まらないよう、一気に反映しきります。
      </p>

      <Callout variant="warn" title="コミットは中断不可">
        レンダーフェーズは優先度に応じて中断・再開できますが、コミットフェーズは一貫性を保つため一気に完了させます。
        ここで DOM 操作・参照（ref）の更新・ライフサイクルメソッドの呼び出しが行われます。
      </Callout>

      <SubSection>なぜコミットだけ中断できないのか</SubSection>
      <p>
        前章で見たとおり、レンダーフェーズは Fiber を 1 個ずつ処理し、途中で yield できる<strong>中断可能</strong>な計算でした。
        なぜコミットだけは真逆に<strong>中断不可</strong>なのでしょうか。答えは<strong>一貫性（consistency）</strong>です。
        コミットは実 DOM を実際に書き換える段階なので、途中で止まると
        「新しいヘッダー＋古い本文」のような<strong>ちぐはぐな中間状態</strong>がユーザーに見えてしまいます。
        一部だけ反映された画面は、しばしば壊れて見える／誤操作を招くため許容できません。
      </p>
      <p>
        だから React は、レンダーで安全に「下準備」を済ませたうえで、コミットでは
        <strong>もう分割しない一気の適用</strong>に振り切ります。「重い計算は細切れにできるが、
        結果の反映は不可分でなければならない」という役割分担です。
      </p>

      <ComparisonTable
        headers={["フェーズ", "何をする", "中断", "理由"]}
        rows={[
          ["レンダー", "workInProgress を計算（純粋な準備）", "できる", "途中で捨ててやり直しても副作用が無い"],
          ["コミット", "実 DOM へ確定反映（副作用あり）", "できない", "中途半端な画面＝不整合を避ける"],
        ]}
      />

      <Bridge course="OS（オペレーティングシステム）">
        コミットフェーズは、OS で学ぶ<strong>クリティカルセクション</strong>や<strong>アトミック操作</strong>の考え方に対応します。
        レンダー（準備計算）は割り込み可能でも、状態を実際に更新する瞬間は<strong>不可分（atomic）</strong>に完了させ、
        「全部反映された」か「まだ何も反映されていない」かのどちらかしか外から観測できないようにする——
        これは並行制御で「中途半端な状態を他者に見せない」ために課す不変条件そのものです。
        React はシングルスレッドなので<strong>ロック</strong>は要りませんが、「更新の適用は一気に」という
        <strong>一貫性の保証</strong>の目的は OS のそれと同じです。
      </Bridge>

      <Section>コミットで行われること</Section>
      <Steps>
        <Step title="Fiber のフラグを確認">
          各 Fiber に付いた副作用フラグ（挿入・更新・削除など）を走査し、必要な操作を洗い出します。
        </Step>
        <Step title="実 DOM を操作">
          フラグに従って実 DOM に対する挿入・更新・削除を実行します。ここで画面が実際に変わります。
        </Step>
        <Step title="参照とライフサイクルの反映">
          <Cmd>ref</Cmd> の更新や、ライフサイクルメソッド（副作用）の呼び出しを行います。
        </Step>
      </Steps>

      <StepFlow
        steps={[
          { title: "レンダーフェーズ", desc: "workInProgress を構築（中断可）" },
          { title: "コミットフェーズ開始", desc: "ここから中断不可" },
          { title: "DOM へ変更を反映" },
          { title: "ライフサイクル / ref を更新" },
          { title: "FiberRootNode.current = workInProgress", desc: "current を切り替え" },
        ]}
        caption="コミットフェーズの流れ"
      />

      <Section>current の切り替え</Section>
      <p>
        React は<strong>2 つの Fiber ツリー</strong>を保持します。今画面に映っている「現在のツリー（current）」と、
        次に表示するために組み立て中の「作業中ツリー（workInProgress）」です。
        コミットが完了した瞬間、<Cmd>FiberRootNode.current</Cmd> の指し先を作業中ツリーへ切り替えます。
      </p>

      <Code lang="js" filename="commit（概念）">{`// コミット完了時にルートの current を差し替える
FiberRootNode.current = workInProgress;
// これ以降、新しいツリーが「現在（current）」として扱われる`}</Code>

      <p>
        図で言えば、コミット<strong>前</strong>は <Cmd>current</Cmd> が古いツリーを指しています。
        コミット<strong>後</strong>は <Cmd>current</Cmd> が新しいツリーを指し、役目を終えた古いツリーは破棄されます。
        この一瞬の切り替えによって、次回のレンダーでは新しいツリーが「現状」として扱われるようになります。
      </p>

      <Callout variant="tip" title="ダブルバッファリング">
        2 つのツリーを使い分けるこの仕組みは、グラフィックスのダブルバッファリングに似ています。
        裏で完成させてから一気に表へ切り替えることで、ちらつきのない一貫した更新を実現しています。
      </Callout>

      <SubSection>ダブルバッファリングを分解する</SubSection>
      <p>
        コンピュータグラフィックスでは、画面に直接ピクセルを描き込むと、描いている途中の未完成な絵が見えて
        <strong>ちらつき（tearing / flicker）</strong>が起きます。そこで「表に見せる<strong>フロントバッファ</strong>」と
        「裏で描く<strong>バックバッファ</strong>」の 2 枚を用意し、裏で 1 フレームを描き切ってから
        <strong>ポインタの付け替え 1 回</strong>で表裏を入れ替えます。この付け替えが<strong>アトミック</strong>だから、
        ユーザーは常に「完成したフレーム」だけを見ます。
      </p>

      <KVList
        items={[
          { key: "フロントバッファ", val: "React の current ツリー（今表示中）" },
          { key: "バックバッファ", val: "React の workInProgress ツリー（裏で構築中）" },
          { key: "バッファスワップ", val: "FiberRootNode.current = workInProgress の1行（付け替え）" },
        ]}
      />

      <p>
        つまり <Cmd>FiberRootNode.current</Cmd> の差し替えは、グラフィックスの<strong>バッファスワップ</strong>と
        まったく同じ役割です。実 DOM への個々の書き込みが済んだ<strong>後</strong>に、
        「現在のツリー」を指すポインタ 1 本を切り替えることで、次のレンダーは新しいツリーを土台に始まります。
      </p>

      <Bridge course="コンピュータグラフィックス / 計算機アーキテクチャ">
        <Cmd>current</Cmd> と <Cmd>workInProgress</Cmd> の使い分けは、講義で学ぶ<strong>ダブルバッファリング</strong>の
        UI 版です。「表示用」と「作業用」の 2 面を持ち、作業面を完成させてから<strong>ポインタ 1 回の付け替え</strong>で
        切り替える——この設計により、<strong>不完全な中間状態を決して見せない</strong>という一貫性を、
        全体をロックせず安価に実現しています。ハードウェアの描画（VSync に合わせたスワップ）でも、
        React の Fiber ツリーでも、<strong>「裏で作って、一瞬で入れ替える」</strong>という同じ原理が使われている、という
        座学 ↔ 実務の対応が見えると理解が一段深まります。
      </Bridge>

      <TipBox>
        古いツリーをすぐ捨てず保持しておくのにも利点があります。次の更新では、この
        <strong>古い（もう表示されていない）ツリーを再利用</strong>して workInProgress を組み直せるため、
        メモリ確保のコストを抑えられます。2 枚を交互に使い回す、という点まで含めてダブルバッファリングと相似形です。
      </TipBox>

      <Divider />

      <KeyPoints
        items={[
          "レンダリングはレンダーフェーズ（中断可）とコミットフェーズ（中断不可）の2段階",
          "コミットが中断不可なのは、中途半端な画面＝不整合を避ける一貫性のため（アトミック適用）",
          "React は current（表示中）と workInProgress（構築中）の2ツリーを保持する",
          "current 差し替えはグラフィックスのバッファスワップと同じ。ポインタ1回で一気に切替",
          "2ツリーを交互に使い回す点まで含めてダブルバッファリングと相似形",
        ]}
      />
    </>
  );
}
