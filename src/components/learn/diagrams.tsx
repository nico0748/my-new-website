/** 教材記事用のアニメーション図解キット（.learn-docs スコープの CSS に対応）。
 *  構造(LayerStack) / 通信(SequenceDiagram) / フロー(FlowChain, StepFlow) を
 *  動きで見せる。SVG＋SMIL の走行ドット＋CSS のマーチングアント。
 *  ⚠ 絵文字は使わない。色は learn.css の CSS 変数（クラス経由）で参照。 */

import type { FC, ReactNode } from "react";

/* ────────────────────────────────────────────────────────────
   FlowChain — 横一列のノードを矢印でつなぎ、データが流れる様子を見せる。
   例: クライアント → API → サーバー、DNS 解決の連鎖 など。
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

  return (
    <div className="dgm">
      <svg className="dgm-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="フロー図">
        {/* 矢印（ノード間） */}
        {nodes.slice(0, -1).map((_, i) => {
          const x1 = centerX(i) + boxW / 2;
          const x2 = centerX(i + 1) - boxW / 2;
          return (
            <g key={`a${i}`}>
              <line className="dgm-arrow dgm-dash" x1={x1} y1={cy} x2={x2 - 7} y2={cy} />
              <polygon className="dgm-arrowhead" points={`${x2},${cy} ${x2 - 8},${cy - 5} ${x2 - 8},${cy + 5}`} />
              <circle className="dgm-dot" r={4} cy={cy}>
                <animate attributeName="cx" from={x1} to={x2 - 7} dur="1.8s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" dur="1.8s" begin={`${i * 0.35}s`} repeatCount="indefinite" />
              </circle>
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
      {caption && <div className="dgm-caption">{caption}</div>}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   SequenceDiagram — アクター（列）と、その間を行き交うメッセージ。
   通信・認証・リクエスト/レスポンスなどの往復フローに最適。
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

  return (
    <div className="dgm">
      <svg className="dgm-svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="通信シーケンス図">
        {/* ライフライン */}
        {actors.map((_, i) => (
          <line key={`l${i}`} className="dgm-lifeline" x1={colX(i)} y1={headY + headH} x2={colX(i)} y2={H - 6} />
        ))}
        {/* メッセージ */}
        {messages.map((m, i) => {
          const y = startY + i * rowH;
          const xF = colX(m.from);
          const xT = colX(m.to);
          const right = xT > xF;
          const headX = right ? xT : xT;
          const back = right ? xT - 9 : xT + 9;
          const arrowClass = m.cta ? "dgm-arrow-cta dgm-dash" : "dgm-arrow dgm-dash";
          const headClass = m.cta ? "dgm-arrowhead-cta" : "dgm-arrowhead";
          const dotClass = m.cta ? "dgm-dot" : "dgm-dot-primary";
          return (
            <g key={`m${i}`}>
              <text className="dgm-msg-label" x={(xF + xT) / 2} y={y - 8} textAnchor="middle">{m.label}</text>
              <line className={arrowClass} x1={xF} y1={y} x2={back} y2={y} />
              <polygon className={headClass} points={`${headX},${y} ${back},${y - 5} ${back},${y + 5}`} />
              <circle className={dotClass} r={4} cy={y}>
                <animate attributeName="cx" from={xF} to={back} dur="1.7s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0;1;1;0" dur="1.7s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </circle>
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
      {caption && <div className="dgm-caption">{caption}</div>}
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   StepFlow — 縦の番号付きステップ。多段のフローや処理手順に。
   番号がパルスして「進行中」を演出（reduced-motion で停止）。
   ──────────────────────────────────────────────────────────── */
export interface FlowStep {
  title: ReactNode;
  desc?: ReactNode;
}

export const StepFlow: FC<{ steps: FlowStep[]; caption?: ReactNode }> = ({ steps, caption }) => (
  <div className="dgm">
    <ol className="dgm-steps">
      {steps.map((s, i) => (
        <li className="dgm-step" key={i}>
          <span className="dgm-step-num" style={{ animationDelay: `${i * 0.25}s` }}>{i + 1}</span>
          <div className="dgm-step-title">{s.title}</div>
          {s.desc && <div className="dgm-step-desc">{s.desc}</div>}
        </li>
      ))}
    </ol>
    {caption && <div className="dgm-caption">{caption}</div>}
  </div>
);

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
   LayerStack — 積層構造。上→下（rev で下→上）にハイライトが流れる。
   TCP/IP 階層、ランタイム/フレームワークの層、OS 構造などに。
   ──────────────────────────────────────────────────────────── */
export interface StackLayer {
  label: ReactNode;
  sub?: ReactNode;
}

export const LayerStack: FC<{ layers: StackLayer[]; caption?: ReactNode; reverse?: boolean }> = ({
  layers,
  caption,
  reverse,
}) => (
  <div className="dgm">
    <div className={`dgm-stack${reverse ? " rev" : ""}`}>
      {layers.map((l, i) => (
        <div className="dgm-layer" key={i} style={{ animationDelay: `${i * 0.3}s` }}>
          <span className="t">{l.label}</span>
          {l.sub && <span className="s">{l.sub}</span>}
        </div>
      ))}
    </div>
    {caption && <div className="dgm-caption">{caption}</div>}
  </div>
);
