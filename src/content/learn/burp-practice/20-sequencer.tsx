import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Cmd, Steps, Step, ComparisonTable, KVList, KeyPoints, Figure, Quiz, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "burp-20-sequencer",
  title: "20. Sequencer — トークンの推測しにくさを測る",
  description: "セッションIDやパスワードリセットトークンが「見た目はランダムだが統計的には偏っている」ケースを、Live capture と FIPS 140-2 の統計検定で見抜く方法を学ぶ。",
  domain: "burp-practice",
  section: "toolset",
  order: 2,
  level: "practice",
  tags: ["Burp Suite", "Sequencer", "エントロピー", "セッション管理"],
  updated: "2026-07-28",
  minutes: 55,
};

export default function Article() {
  return (
    <>
      <Lead>
        セッション ID やパスワードリセットトークンは、見た目がランダムな文字列であれば安全というわけではありません。Sequencer は、大量のサンプルを集めて統計的にランダム性を測定し、「予測できてしまうかどうか」を数値で示してくれるツールです。（目標学習時間：55分）
      </Lead>

      <Callout variant="tip" title="この章の学習目標">
        <ul>
          <li>「見た目のランダムさ」と「統計的なランダムさ」の違いを説明できる</li>
          <li>Live capture と Manual load、それぞれの使い所を理解する</li>
          <li>Overall result・Character-level analysis・Bit-level analysis の各項目が何を見ているか説明できる</li>
          <li>結果からエントロピーの目安を読み取り、判断材料にできる</li>
        </ul>
      </Callout>

      <Section>1. なぜトークンのランダム性を測るのか</Section>
      <p>
        セッション ID、パスワードリセットトークン、CSRF トークンといった値は「攻撃者に予測されない」ことが前提で安全性が成り立っています。もしこれらの値が実は予測可能、あるいは総当たりで現実的な時間内に当てられるものだったら、正規のログインを経ずになりすましが成立してしまいます。
      </p>
      <Callout variant="info" title="「見た目」と「統計」は別物">
        英数字がランダムに並んでいるように見えるトークンでも、生成アルゴリズムの実装によっては、特定の桁に偏りが出たり、時刻由来の値が混ざっていたりします。人間の目でパターンを見抜くのは困難で、<strong>統計的な検定にかけて初めて偏りが判明する</strong>ことが多くあります。Sequencer はこの検定を自動でやってくれる道具です。
      </Callout>
      <SubSection>実務でどう役立つか</SubSection>
      <p>
        診断業務では「このトークンは推測可能ではないか」という指摘を裏付けるために使います。目視だけで「ランダムに見えるので問題なし」と判断するのは危険で、実際には連番に毛が生えた値やタイムスタンプを混ぜただけの値が「ランダムに見える」ことは珍しくありません。Sequencer の結果は、報告書に定量的な根拠を添えるための材料になります。
      </p>

      <Section>2. Live capture — 実際の通信からトークンを集める</Section>
      <p>
        Live capture は、Burp がターゲットに実際にリクエストを送り続け、レスポンスに含まれるトークンをその場で収集するモードです。
      </p>
      <Steps>
        <Step title="対象レスポンスを選ぶ">Set-Cookie などトークンを含むレスポンスを Proxy history や Repeater で見つけ、右クリックして「Send to Sequencer」を選ぶ</Step>
        <Step title="トークンの位置を指定">Sequencer タブで、対象のトークンがレスポンスのどこにあるか（Cookie の特定の名前、あるいはレスポンスボディの特定の位置）を選択する</Step>
        <Step title="Start live capture">キャプチャを開始すると、Burp が同じリクエストを繰り返し送信し、返ってきたトークンを1件ずつ蓄積していく</Step>
        <Step title="十分なサンプル数まで待つ">信頼できる分析には数千サンプル程度が目安。溜まったらキャプチャを止めて解析結果を確認する</Step>
      </Steps>
      <Callout variant="warn" title="許可された環境でのみ実行する">
        Live capture は同じリクエストを何百〜何千回も送り続けます。対象サーバーに大きな負荷をかける可能性があるため、<strong>Web Security Academy のラボや自分で用意したローカル環境（DVWA・Juice Shop など）以外では絶対に実行しないでください。</strong>許可されていない本番環境やスコープ外のホストに対して行うと、サービス妨害とみなされかねません。
      </Callout>

      <Figure
        src="/learn/shots/burp-practice/burp-20-sequencer-01.svg"
        alt="Sequencer の Live capture 画面。トークンの位置選択とキャプチャ中のサンプル数カウンタが表示されている"
        caption="Live capture でトークンの位置を選び、サンプルを収集している様子"
      />

      <SubSection>Manual load — 既に集めたトークンを読ませる</SubSection>
      <p>
        Live capture でリアルタイムに集める代わりに、すでにテキストファイルなどにまとめてあるトークンの一覧を読み込ませることもできます。これが Manual load です。ログから抽出したトークン群を検証したい場合や、Burp から直接リクエストを送れない（別ツールで収集した）場合に使います。1行に1トークンの形式で読み込ませれば、Live capture と同じ解析にかけられます。
      </p>

      <Section>3. 結果画面の読み方</Section>
      <p>
        十分なサンプルが集まったら「Analyze now」で解析を実行します。結果は大きく Overall result / Character-level analysis / Bit-level analysis の3つに分かれます。
      </p>
      <SubSection>Overall result</SubSection>
      <KVList
        items={[
          { key: "Effective entropy", val: "トークン全体が実質的に何ビット分のランダム性を持つかの推定値。ビット数が大きいほど推測されにくい" },
          { key: "Reliability", val: "サンプル数が解析結果の信頼性にとって十分かどうかの評価。少なすぎると結論を出せない" },
          { key: "Significance level", val: "各種検定でどの程度厳しい基準（有意水準）を使ったかの指標。低いほど偏りの検出に厳しい基準を使っている" },
        ]}
      />
      <SubSection>Character-level analysis</SubSection>
      <p>
        トークンを文字（あるいは指定した単位）ごとに分解し、<strong>各桁ごとに</strong>文字の出現がどれだけ偏っているかを見ます。たとえば「先頭2文字はほぼ固定」「特定の桁だけ特定の文字が出やすい」といった偏りがあれば、ここで一目瞭然になります。
      </p>
      <SubSection>Bit-level analysis — FIPS 140-2 の統計検定</SubSection>
      <p>
        トークンをビット列として扱い、米国の暗号モジュール規格 FIPS 140-2 に由来する複数の統計検定にかけます。それぞれが見ている観点は次の通りです。
      </p>
      <ComparisonTable
        headers={["検定", "何を見ているか"]}
        rows={[
          ["Monobit test", "ビット列全体で 0 と 1 の出現数が偏っていないか"],
          ["Poker test", "一定の長さのビットパターンの出現頻度が均等かどうか"],
          ["Runs test", "同じビットが連続する「連（run）」の長さの分布が理論値に沿っているか"],
          ["Long runs test", "極端に長い連（同じビットが長く連続する箇所）が出現していないか"],
          ["Correlation（自己相関）", "サンプルの位置をずらしたときに値同士が相関していないか。時系列的な規則性の有無を見る"],
          ["Compression test", "データを圧縮できてしまう＝繰り返しパターンがあるかどうかを圧縮率から推定する"],
        ]}
      />
      <Callout variant="info" title="検定結果は「合格/不合格」の一覧で出る">
        各検定は、選んだ有意水準のもとで「合格 (pass)」か「不合格 (fail)」のどちらかを返します。複数の検定に不合格が続く場合、そのビット位置やパターンに何らかの規則性がある強い兆候です。
      </Callout>

      <Figure
        src="/learn/shots/burp-practice/burp-20-sequencer-02.svg"
        alt="Sequencer の解析結果画面。Overall result のエントロピー値、Character-level analysis の文字分布グラフ、Bit-level analysis の各検定結果一覧が表示されている"
        caption="解析結果画面。エントロピー・文字分布・ビット検定の3つの観点で結果が示される"
      />

      <Section>4. 判断の目安</Section>
      <KVList
        items={[
          { key: "エントロピーのビット数", val: "一般に大きいほど良いが、絶対的な閾値があるわけではない。トークンの用途（短命なCSRFトークンか、長期間有効なパスワードリセットトークンか）とセットで評価する" },
          { key: "サンプル数", val: "少なすぎる（数十〜数百程度）と Reliability が低いと表示され、結論を出すには不十分。数千件を目安に集める" },
          { key: "Significance level", val: "厳しい水準（値を小さく）にするほど、偽陽性は減るが偏りの検出は鈍くなる。デフォルト設定のまま実行し、不合格が出た場合に水準を変えて再確認するのが実務的" },
        ]}
      />
      <Callout variant="tip" title="単独の指標で結論を出さない">
        エントロピーの数値1つだけを見て「安全」「危険」と断定しないことが大切です。Reliability が低い状態でのエントロピー値は参考程度にしかならず、Bit-level analysis で複数の検定に不合格が出ていれば、たとえエントロピー自体は高く見えても偏りが存在する可能性があります。複数の指標を突き合わせて総合的に判断してください。
      </Callout>

      <Section>5. 落とし穴</Section>
      <ComparisonTable
        headers={["落とし穴", "内容"]}
        rows={[
          ["固定プレフィックス", <>{"トークンの先頭に "}<Cmd>sess_</Cmd>{" のような固定文字列が付いている場合、そのままだと解析が歪む。可変部分だけを対象として選び直す"}</>],
          ["Base64 のパディング", <>{"Base64 エンコードされたトークンは末尾に "}<Cmd>=</Cmd>{" のパディングが付くことがあり、見かけ上のビット偏りとして検出されてしまう。デコードしてから解析する、あるいはパディングを除いて評価する"}</>],
          ["負荷のかけすぎ", "Live capture は大量のリクエストを送るため、対象サーバーやネットワークに過度な負荷をかけない。サンプル数と送信間隔のバランスを見ながら実行する"],
        ]}
      />

      <Section>6. 演習</Section>
      <Steps>
        <Step title="対象を用意する">Juice Shop など手元のアプリでログイン後に発行されるセッション Cookie を確認する</Step>
        <Step title="Live capture を実行">ログイン応答を Send to Sequencer し、トークンの位置を指定して Live capture を開始。1000 件程度サンプルを集める</Step>
        <Step title="解析結果を読む">Overall result のエントロピー値、Bit-level analysis の各検定の合否を確認する</Step>
        <Step title="一文にまとめる">「このトークンは実効エントロピー約◯◯ビットで、FIPS 140-2 の◯個の検定のうち◯個に不合格だった」という、レポートにそのまま書ける一文を作成する</Step>
      </Steps>

      <Figure
        src="/learn/shots/burp-practice/burp-20-sequencer-03.svg"
        alt="演習の流れ図。Juice Shop のセッション Cookie を Sequencer に送り、1000件のサンプルを集めて解析する手順"
        caption="演習：セッション Cookie を1000件収集して解析する流れ"
      />

      <Divider />

      <Quiz
        question="Sequencer の Bit-level analysis で、同じビットが異常に長く連続する箇所がないかを確認する検定はどれですか？"
        options={[
          "Monobit test",
          "Poker test",
          "Long runs test",
          "Compression test",
        ]}
        answer={2}
        explanation="Long runs test は、同じビット（0または1）が極端に長く連続する箇所がないかを見る検定です。Runs test が連の長さの分布全体を見るのに対し、Long runs test は特に長い連に着目します。"
      />

      <KeyPoints
        items={[
          "「見た目のランダムさ」と「統計的なランダムさ」は別物。Sequencer は後者を測定するツール",
          "Live capture は実際にリクエストを送り続けてトークンを収集する。許可された環境でのみ実行する",
          "Manual load は既に集めたトークンをファイルから読ませる方法",
          "Overall result（エントロピー・Reliability）、Character-level analysis（桁ごとの偏り）、Bit-level analysis（FIPS 140-2 の各検定）の3観点で結果を読む",
          "固定プレフィックスや Base64 のパディングは解析結果を歪めるので、可変部分だけを対象に選び直す",
          "サンプル数が少ないと結論を出せない。数千件を目安に集める",
        ]}
      />

      <Callout variant="info" title="次のステップ">
        次章「21. Professional 版の全体像」では、Community 版には無い Scanner や Collaborator といった機能が何をしてくれるのか、そして Community でどう代替するかを地図として整理します。
      </Callout>
    </>
  );
}
