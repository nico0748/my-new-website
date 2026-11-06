/** 教材記事用のアニメーション図解キット（.learn-docs スコープの CSS に対応）。
 *  構造(LayerStack) / 通信(SequenceDiagram) / フロー(FlowChain, StepFlow) を動きで見せる。
 *  動きは「図が半分以上見えたときに 1 回だけ描いて止まる」（usePlayOnce）。無限ループはしない。
 *  繰り返すのは利用者が「もう一度再生」を押したときだけ。prefers-reduced-motion では最初から終状態。
 *  ⚠ 絵文字は使わない。色は learn.css の CSS 変数（クラス経由）で参照。 */

import type { CSSProperties, FC, ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { usePlayOnce } from "./usePlayOnce";

/** CSS カスタムプロパティを style に渡すための型 */
type CSSVars = CSSProperties & Record<`--${string}`, string>;

const sec = (v: number) => `${Math.round(v * 1000) / 1000}s`;

/** 線を順に描くタイミング（秒）。1 本 0.45s、間隔 min(0.3s, 2.0s/(n-1))。
 *  矢じりとラベルは線の終わり際（+0.35s）から 0.15s でフェードするので、
 *  最後の線は (n-1)×間隔 + 0.5s で描き終わる（図全体で 2.5s 以内）。
 *  走るドットは描き終えた後、線 1 本ずつリレーして 1 回だけ（合計 2.0s 以内）。 */
const drawTiming = (count: number) => {
  const stagger = count > 1 ? Math.min(0.3, 2.0 / (count - 1)) : 0;
  const drawEnd = Math.max(count - 1, 0) * stagger + 0.5;
  const hop = count > 0 ? Math.min(0.6, 2.0 / count) : 0;
  const vars: CSSVars = {
    "--dgm-stagger": sec(stagger),
    "--dgm-draw-end": sec(drawEnd),
    "--dgm-hop": sec(hop),
  };
  return { drawEndMs: drawEnd * 1000, vars };
};

/** 再生状態のクラス。is-playing＝再生した（する）、is-played＝1 回描き終えた（再生ボタンを出す） */
const playClass = (playing: boolean, played = false) =>
  `dgm dgm-play${playing ? " is-playing" : ""}${played ? " is-played" : ""}`;

/** キャプション行＋「もう一度再生」ボタン。
 *  ボタンは最初から DOM に置き、描き終えるまでは CSS で隠す（後から挿入すると目次の MutationObserver が反応する）。 */
const DiagramFoot: FC<{ caption?: ReactNode; onReplay: () => void }> = ({ caption, onReplay }) => (
  <div className="dgm-foot">
    {caption && <div className="dgm-caption">{caption}</div>}
    <button type="button" className="dgm-replay" onClick={onReplay} aria-label="図をもう一度再生">
      <RotateCcw aria-hidden="true" />
      もう一度再生
    </button>
  </div>
);

/* ────────────────────────────────────────────────────────────
   FlowChain — 横一列のノードを矢印でつなぎ、データが流れる様子を見せる。
   例: クライアント → API → サーバー、DNS 解決の連鎖 など。
   見えたら矢印を左から順に描き、描き終えたらドットが 1 回だけ左→右へ流れる。
   ──────────────────────────────────────────────────────────── */
export interface FlowNode {
  label: string;
  sub?: string;
  variant?: "primary" | "alt" | "cta";
}

export const FlowChain: FC<{ nodes: FlowNode[]; caption?: ReactNode }> = ({ nodes, caption }) => {
  const W = 720;
  const pad = 12;
  const boxH = 58;
  const y = 24;
  const cy = y + boxH / 2;
  const n = nodes.length;
  const slot = (W - pad * 2) / n;
  const boxW = Math.min(138, slot - 30);
  const centerX = (i: number) => pad + slot * (i + 0.5);
  const boxClass = (v?: string) => (v === "alt" ? "dgm-box-alt" : v === "cta" ? "dgm-box-cta" : "dgm-box");
  const H = boxH + 48;
  const timing = drawTiming(Math.max(n - 1, 0));
  const { ref, playing, played, replay } = usePlayOnce<HTMLDivElement>(timing.drawEndMs);
  const ariaLabel = `フロー図：${nodes.map((nd) => (nd.sub ? `${nd.label}（${nd.sub}）` : nd.label)).join(" → ")}`;

  return (
    <div ref={ref} className={playClass(playing, played)} style={timing.vars}>
      <svg className="dgm-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {/* 矢印（ノード間）。--len は描画用の dasharray、--dx はドットの移動量 */}
        {nodes.slice(0, -1).map((_, i) => {
          const x1 = centerX(i) + boxW / 2;
          const x2 = centerX(i + 1) - boxW / 2;
          const len = x2 - 7 - x1;
          const vars: CSSVars = { "--i": String(i), "--len": `${len}px`, "--dx": `${len}px` };
          return (
            <g key={`a${i}`} style={vars}>
              <line className="dgm-arrow dgm-line" x1={x1} y1={cy} x2={x2 - 7} y2={cy} />
              <polygon className="dgm-arrowhead dgm-fade" points={`${x2},${cy} ${x2 - 8},${cy - 5} ${x2 - 8},${cy + 5}`} />
              <circle className="dgm-dot dgm-runner" r={4} cx={x1} cy={cy} />
            </g>
          );
        })}
        {/* ノード箱 */}
        {nodes.map((nd, i) => {
          const x = centerX(i) - boxW / 2;
          return (
            <g key={`n${i}`}>
              <rect className={boxClass(nd.variant)} x={x} y={y} width={boxW} height={boxH} rx={9} />
              <text className="dgm-label" x={centerX(i)} y={nd.sub ? cy - 3 : cy + 5} textAnchor="middle">{nd.label}</text>
              {nd.sub && <text className="dgm-sub" x={centerX(i)} y={cy + 14} textAnchor="middle">{nd.sub}</text>}
            </g>
          );
        })}
      </svg>
      <DiagramFoot caption={caption} onReplay={replay} />
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   SequenceDiagram — アクター（列）と、その間を行き交うメッセージ。
   通信・認証・リクエスト/レスポンスなどの往復フローに最適。
   見えたらメッセージを上から順に描き（ラベルは線を描き終えた所で出る）、
   描き終えたらドットが 1 回だけ上から順にメッセージをたどる。
   ──────────────────────────────────────────────────────────── */
export interface SeqMessage {
  from: number;
  to: number;
  label: string;
  cta?: boolean;
}

export const SequenceDiagram: FC<{ actors: string[]; messages: SeqMessage[]; caption?: ReactNode }> = ({
  actors,
  messages,
  caption,
}) => {
  const W = 700;
  const margin = 24;
  const headY = 8;
  const headH = 34;
  const startY = headY + headH + 26;
  const rowH = 44;
  const n = actors.length;
  const colW = (W - margin * 2) / n;
  const colX = (i: number) => margin + colW * (i + 0.5);
  const headBoxW = Math.min(colW - 12, 150);
  const H = startY + messages.length * rowH + 12;
  const timing = drawTiming(messages.length);
  const { ref, playing, played, replay } = usePlayOnce<HTMLDivElement>(timing.drawEndMs);
  const ariaLabel =
    `通信シーケンス図（${actors.join("、")}）。` +
    messages.map((m) => `${actors[m.from] ?? ""} → ${actors[m.to] ?? ""}：${m.label}`).join("。");

  return (
    <div ref={ref} className={playClass(playing, played)} style={timing.vars}>
      <svg className="dgm-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        {/* ライフライン */}
        {actors.map((_, i) => (
          <line key={`l${i}`} className="dgm-lifeline" x1={colX(i)} y1={headY + headH} x2={colX(i)} y2={H - 6} />
        ))}
        {/* メッセージ。--len は描画用の dasharray、--dx はドットの移動量（左向きは負） */}
        {messages.map((m, i) => {
          const y = startY + i * rowH;
          const xF = colX(m.from);
          const xT = colX(m.to);
          const right = xT > xF;
          const headX = right ? xT : xT;
          const back = right ? xT - 9 : xT + 9;
          const arrowClass = m.cta ? "dgm-arrow-cta dgm-line" : "dgm-arrow dgm-line";
          const headClass = m.cta ? "dgm-arrowhead-cta dgm-fade" : "dgm-arrowhead dgm-fade";
          const dotClass = m.cta ? "dgm-dot dgm-runner" : "dgm-dot-primary dgm-runner";
          const vars: CSSVars = { "--i": String(i), "--len": `${Math.abs(back - xF)}px`, "--dx": `${back - xF}px` };
          return (
            <g key={`m${i}`} style={vars}>
              <text className="dgm-msg-label dgm-fade" x={(xF + xT) / 2} y={y - 8} textAnchor="middle">{m.label}</text>
              <line className={arrowClass} x1={xF} y1={y} x2={back} y2={y} />
              <polygon className={headClass} points={`${headX},${y} ${back},${y - 5} ${back},${y + 5}`} />
              <circle className={dotClass} r={4} cx={xF} cy={y} />
            </g>
          );
        })}
        {/* アクター見出し（前面） */}
        {actors.map((a, i) => (
          <g key={`h${i}`}>
            <rect className="dgm-box" x={colX(i) - headBoxW / 2} y={headY} width={headBoxW} height={headH} rx={7} />
            <text className="dgm-label" x={colX(i)} y={headY + headH / 2 + 5} textAnchor="middle">{a}</text>
          </g>
        ))}
      </svg>
      <DiagramFoot caption={caption} onReplay={replay} />
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   StepFlow — 縦の番号付きステップ。多段のフローや処理手順に。
   見えたら縦線が上から伸び、番号が順に点灯して 1 回だけパルスする。
   ──────────────────────────────────────────────────────────── */
export interface FlowStep {
  title: ReactNode;
  desc?: ReactNode;
}

export const StepFlow: FC<{ steps: FlowStep[]; caption?: ReactNode }> = ({ steps, caption }) => {
  const { ref, playing } = usePlayOnce<HTMLDivElement>();
  // 番号は 0.15s ずつ点灯。ステップが多い図でも全体 2.5s 以内に収める
  const stagger = steps.length > 1 ? Math.min(0.15, 1.4 / (steps.length - 1)) : 0;
  const vars: CSSVars = { "--dgm-stagger": sec(stagger) };
  return (
    <div ref={ref} className={playClass(playing)} style={vars}>
      <ol className="dgm-steps">
        {steps.map((s, i) => (
          <li className="dgm-step" key={i}>
            <span className="dgm-step-num" style={{ "--i": String(i) } as CSSVars}>{i + 1}</span>
            <div className="dgm-step-title">{s.title}</div>
            {s.desc && <div className="dgm-step-desc">{s.desc}</div>}
          </li>
        ))}
      </ol>
      {caption && <div className="dgm-caption">{caption}</div>}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   DomTreeFigure — 左に DOM ツリー、右に実際のレンダリング結果を並べ、
   同じ色で「ツリーの要素 ↔ ページ上のブロック」の対応を見せる。
   HTML→DOM→表示の理解に。色はこの図の凡例（4 系統）で固定。
   ──────────────────────────────────────────────────────────── */
export const DomTreeFigure: FC<{ caption?: ReactNode }> = ({ caption }) => (
  <div className="dgm">
    <div className="domfig">
      {/* 左: DOM ツリー */}
      <div className="domfig-col">
        <div className="domfig-head">DOM ツリー（HTML の構造）</div>
        <ul className="domtree">
          <li>
            <code>html</code>
            <ul>
              <li>
                <code>head</code>
                <ul>
                  <li><code>title</code></li>
                </ul>
              </li>
              <li>
                <code>body</code>
                <ul>
                  <li className="dt-a"><code>header</code><span>サイトタイトル</span></li>
                  <li>
                    <code>main</code>
                    <ul>
                      <li className="dt-b"><code>h1</code><span>見出し</span></li>
                      <li className="dt-c"><code>p</code><span>本文テキスト…</span></li>
                    </ul>
                  </li>
                  <li className="dt-d"><code>footer</code><span>&copy; 2026</span></li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      {/* 右: 実際のページ */}
      <div className="domfig-col">
        <div className="domfig-head">レンダリング結果（実際の表示）</div>
        <div className="domfig-browser">
          <div className="domfig-bar"><span /><span /><span /></div>
          <div className="domfig-view">
            <div className="dv-block dt-a"><span className="dv-tag">header</span>サイトタイトル</div>
            <div className="dv-block dt-b"><span className="dv-tag">h1</span><strong>見出し</strong></div>
            <div className="dv-block dt-c"><span className="dv-tag">p</span>本文テキスト…</div>
            <div className="dv-block dt-d"><span className="dv-tag">footer</span>&copy; 2026</div>
          </div>
        </div>
      </div>
    </div>
    <div className="domfig-note">同じ色の要素どうしが対応します。ブラウザは HTML を解析してこのツリー（DOM）を作り、それを画面のブロックとして描画します。</div>
    {caption && <div className="dgm-caption">{caption}</div>}
  </div>
);

/* ────────────────────────────────────────────────────────────
   VDomDiffFigure — 仮想 DOM の差分検出をアニメで見せる。
   ①新しい仮想DOMを再構築 → ②旧とdiffして変更ノードを検出 →
   ③実DOMは変わったノードだけ更新（他はスキップ）。
   1 本のタイムライン（learn.css の --vd-dur）に全要素を同期し、見えたら 1 周だけ流して止まる。
   「もう一度再生」で頭から。prefers-reduced-motion では最終状態を静的表示（アニメなし）。
   色は図の凡例で固定。
   ──────────────────────────────────────────────────────────── */
/** 1 周の長さ（ms）。CSS へは --vd-dur で渡し、再生ボタンもこの時間の後に出す */
const VDIFF_DURATION_MS = 4500;

export const VDomDiffFigure: FC<{ caption?: ReactNode }> = ({ caption }) => {
  const { ref, playing, played, replay } = usePlayOnce<HTMLDivElement>(VDIFF_DURATION_MS);
  const vars: CSSVars = { "--vd-dur": sec(VDIFF_DURATION_MS / 1000) };
  return (
    <div ref={ref} className={playClass(playing, played)} style={vars}>
      <div className="vdiff">
        <div className="vdiff-stages">
          <span className="vstage s1"><b>1</b> 仮想DOM 再構築</span>
          <span className="vsep" aria-hidden="true">→</span>
          <span className="vstage s2"><b>2</b> 差分検出 <i>diff</i></span>
          <span className="vsep" aria-hidden="true">→</span>
          <span className="vstage s3"><b>3</b> 実DOM へ最小反映</span>
        </div>

        <div className="vdiff-cols">
          {/* 前回の仮想DOM */}
          <div className="vcol">
            <div className="vcol-head">前回の仮想DOM</div>
            <ul className="vtree"><li><code>ul</code>
              <ul>
                <li><code>li</code><span className="vt">Cat</span></li>
                <li><code>li</code><span className="vt">Dog</span></li>
                <li className="vold"><code>li</code><span className="vt">Fish</span></li>
              </ul>
            </li></ul>
          </div>

          {/* 新しい仮想DOM */}
          <div className="vcol">
            <div className="vcol-head">新しい仮想DOM</div>
            <ul className="vtree"><li><code>ul</code>
              <ul>
                <li className="vsame"><code>li</code><span className="vt">Cat</span></li>
                <li className="vsame"><code>li</code><span className="vt">Dog</span></li>
                <li className="vnew"><code>li</code><span className="vt">Bird</span><span className="vbadge vbadge-diff">変更</span></li>
              </ul>
            </li></ul>
          </div>

          {/* 実 DOM */}
          <div className="vcol">
            <div className="vcol-head">実 DOM</div>
            <ul className="vtree"><li><code>ul</code>
              <ul>
                <li className="vskip"><code>li</code><span className="vt">Cat</span><span className="vbadge vbadge-skip">変更なし</span></li>
                <li className="vskip"><code>li</code><span className="vt">Dog</span><span className="vbadge vbadge-skip">変更なし</span></li>
                <li className="vapply"><code>li</code>
                  <span className="vswap"><span className="vt vt-old">Fish</span><span className="vt vt-new">Bird</span></span>
                  <span className="vbadge vbadge-apply">更新</span>
                </li>
              </ul>
            </li></ul>
          </div>
        </div>
      </div>
      <div className="domfig-note">
        state が変わると、React は<strong>新しい仮想DOMを丸ごと作り直し</strong>、前回と diff して<strong>変わったノードだけ</strong>を実DOMに反映します。Cat・Dog はスキップされ、Fish → Bird の 1 箇所だけが更新されます。
      </div>
      <DiagramFoot caption={caption} onReplay={replay} />
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   LayerStack — 積層構造。上→下（rev で下→上）にハイライトが流れる。
   TCP/IP 階層、ランタイム/フレームワークの層、OS 構造などに。
   見えたらハイライトが 1 周だけ流れて止まる。
   ──────────────────────────────────────────────────────────── */
export interface StackLayer {
  label: ReactNode;
  sub?: ReactNode;
}

export const LayerStack: FC<{ layers: StackLayer[]; caption?: ReactNode; reverse?: boolean }> = ({
  layers,
  caption,
  reverse,
}) => {
  const { ref, playing } = usePlayOnce<HTMLDivElement>();
  // 層ごとの間隔は最大 0.3s。層が多くても全体 2.5s 以内に収める
  const stagger = layers.length > 1 ? Math.min(0.3, 1.6 / (layers.length - 1)) : 0;
  const vars: CSSVars = { "--dgm-stagger": sec(stagger) };
  return (
    <div ref={ref} className={playClass(playing)} style={vars}>
      <div className={`dgm-stack${reverse ? " rev" : ""}`}>
        {layers.map((l, i) => (
          <div className="dgm-layer" key={i} style={{ "--i": String(i) } as CSSVars}>
            <span className="t">{l.label}</span>
            {l.sub && <span className="s">{l.sub}</span>}
          </div>
        ))}
      </div>
      {caption && <div className="dgm-caption">{caption}</div>}
    </div>
  );
};
