import { useEffect, useRef } from "react";

interface NetworkSphereProps {
  /** ノード数（多いほど密な網） */
  nodeCount?: number;
  /** 各ノードを結ぶ近傍数 */
  neighbors?: number;
  /** 全体の不透明度（背景なので控えめ） */
  opacity?: number;
  /** 回転速度（ラジアン/フレーム） */
  speed?: number;
  /** アクセント色（RGB） */
  rgb?: [number, number, number];
}

interface P3 {
  x: number;
  y: number;
  z: number;
}

/**
 * 球面に分布したノードを近傍同士で結んだ「球体ネットワーク網」を Canvas に描画。
 * ゆっくり Y 軸回転し、奥行きで明るさ・サイズを変える。背景レイヤー用（pointer-events なし）。
 * prefers-reduced-motion 時は回転を止めて静止描画する。
 */
const NetworkSphere = ({
  nodeCount = 120,
  neighbors = 4,
  opacity = 0.35,
  speed = 0.0016,
  rgb = [0, 229, 204],
}: NetworkSphereProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [cr, cg, cb] = rgb;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // --- 球面にノードを均等分布（フィボナッチ球） ---
    const points: P3[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < nodeCount; i++) {
      const y = 1 - (i / (nodeCount - 1)) * 2; // 1 → -1
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      points.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
    }

    // --- 近傍 k 本のエッジを事前計算（剛体なので一度だけ） ---
    const edges: [number, number][] = [];
    const seen = new Set<string>();
    for (let i = 0; i < points.length; i++) {
      const dists: { j: number; d: number }[] = [];
      for (let j = 0; j < points.length; j++) {
        if (i === j) continue;
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dz = points[i].z - points[j].z;
        dists.push({ j, d: dx * dx + dy * dy + dz * dz });
      }
      dists.sort((a, b) => a.d - b.d);
      for (let n = 0; n < neighbors && n < dists.length; n++) {
        const j = dists[n].j;
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push([i, j]);
      }
    }

    let w = 0;
    let h = 0;
    let cx = 0;
    let cy = 0;
    let radius = 0;
    let dpr = 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w * 0.5;
      cy = h * 0.46;
      radius = Math.min(w, h) * (w < 640 ? 0.42 : 0.34);
    };
    resize();

    const tiltX = -0.42; // 固定の傾き（地球儀風）
    const sinT = Math.sin(tiltX);
    const cosT = Math.cos(tiltX);
    let theta = 0;
    let raf = 0;

    const proj = new Array(points.length);

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      const cosA = Math.cos(theta);
      const sinA = Math.sin(theta);

      // 回転 → 投影
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // Y 軸回転
        const rx = p.x * cosA - p.z * sinA;
        const rz = p.x * sinA + p.z * cosA;
        // X 軸傾き
        const ry = p.y * cosT - rz * sinT;
        const rzz = p.y * sinT + rz * cosT;
        proj[i] = {
          sx: cx + rx * radius,
          sy: cy + ry * radius,
          depth: (rzz + 1) / 2, // 0(奥) → 1(手前)
        };
      }

      // エッジ
      for (let e = 0; e < edges.length; e++) {
        const a = proj[edges[e][0]];
        const b = proj[edges[e][1]];
        const d = (a.depth + b.depth) / 2;
        const alpha = (0.06 + d * 0.5) * opacity;
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
        ctx.lineWidth = 0.6 + d * 0.7;
        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      // ノード
      for (let i = 0; i < proj.length; i++) {
        const p = proj[i];
        const alpha = (0.2 + p.depth * 0.8) * opacity;
        const size = 0.8 + p.depth * 2.2;
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) {
        theta += speed;
        raf = requestAnimationFrame(render);
      }
    };

    render();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [nodeCount, neighbors, opacity, speed, rgb]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        // 端をやわらかくフェード（背景になじませる）
        maskImage:
          "radial-gradient(circle at 50% 46%, black 35%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(circle at 50% 46%, black 35%, transparent 78%)",
      }}
    />
  );
};

export default NetworkSphere;
