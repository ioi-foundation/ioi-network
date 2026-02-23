import { Cpu, Globe, Layers, Network } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const MIN_BAR_PCT = 8;
const MAX_BLOCK_DELTA = 5;
// Network TPS
const MAX_TPS = 2000;
// Active Agents
const MAX_AGENTS = 20000;
const MAX_AGENT_DELTA = 2000;
// Global Nodes
const MAX_NODES = 5000;

const CHART_COLORS = ["#6441AC", "#17BDE7", "#23F5AE", "#F6EF2E"] as const;
const CHART_RATIOS = [0.31, 0.29, 0.30, 0.10] as const;
const CHART_BAR_H = 8;
const CHART_GAP = 12;
const CHART_WIDTH = 100;
const CHART_HEIGHT = 100;
const CHART_ANIM_MS = 200;

const BlockHeightChart = ({
  bars,
}: {
  bars: [number, number, number, number];
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const anim = useRef({
    cur: [...bars],
    from: [...bars],
    target: [...bars],
    t0: 0,
    raf: 0,
  });

  useEffect(() => {
    const s = anim.current;
    s.from = [...s.cur];
    s.target = [...bars];
    s.t0 = performance.now();
    cancelAnimationFrame(s.raf);

    const paint = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const elapsed = now - s.t0;
      const t = Math.min(1, elapsed / CHART_ANIM_MS);
      const ease = 1 - (1 - t) * (1 - t) * (1 - t);

      for (let i = 0; i < 4; i++) {
        s.cur[i] = s.from[i] + (s.target[i] - s.from[i]) * ease;
      }

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const padX = 0;
      const maxW = w - padX * 2;
      const totalBarsH = CHART_BAR_H * 4 + CHART_GAP * 3;
      const padY = (h - totalBarsH) / 2;

      for (let i = 0; i < 4; i++) {
        const fill = Math.max(MIN_BAR_PCT, s.cur[i]) / 100;
        const barW = maxW * fill;
        const y = padY + i * (CHART_BAR_H + CHART_GAP);
        let x = padX;

        for (let c = 0; c < 4; c++) {
          const segW = barW * CHART_RATIOS[c];
          ctx.fillStyle = CHART_COLORS[c];
          ctx.fillRect(x, y, segW, CHART_BAR_H);
          x += segW;
        }
      }

      if (t < 1) s.raf = requestAnimationFrame(paint);
    };

    s.raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(s.raf);
  }, [bars]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}
    />
  );
};

// Network TPS: 8 horizontal bars — professional pill-style bars, layered glow, subtle grid
const TPS_CHART_BARS = 8;
const TPS_BAR_H = 4; // pill height (capsule-style bars)
const TPS_CHART_GAP = 8;
const TPS_CHART_WIDTH = 100;
const TPS_CHART_HEIGHT = 115;
const TPS_CHART_ANIM_MS = 300;
const TPS_BAR_COLOR = "#3FEAA1";
const TPS_GRID_COLOR = "rgba(60, 70, 68, 0.6)"; // faint grey grid lines
const TPS_TICK_COLOR = "rgba(120, 130, 128, 0.5)"; // subtle axis tick marks

function computeTpsBars(tps: number, peakTps: number): number[] {
  const currentLoad = Math.min(100, (tps / MAX_TPS) * 100);
  const peakRef = Math.min(100, (peakTps / MAX_TPS) * 100);
  const utilization = peakTps > 0 ? Math.min(100, (tps / peakTps) * 100) : 0;
  const headroom = 100 - utilization;
  const currentThousands = Math.min(100, Math.floor(tps / 1000) * 10);
  const currentHundreds = (tps % 1000) / 10;
  const peakThousands = Math.min(100, Math.floor(peakTps / 1000) * 10);
  const peakHundreds = (peakTps % 1000) / 10;
  return [
    currentLoad,
    peakRef,
    utilization,
    headroom,
    currentThousands,
    currentHundreds,
    peakThousands,
    peakHundreds,
  ];
}

const NetworkTpsChart = ({ tps, peakTps }: { tps: number; peakTps: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetBars = computeTpsBars(tps, peakTps);
  const anim = useRef({
    cur: [...targetBars],
    from: [...targetBars],
    target: targetBars,
    t0: 0,
    raf: 0,
  });

  useEffect(() => {
    const nextTarget = computeTpsBars(tps, peakTps);
    const s = anim.current;
    s.from = [...s.cur];
    s.target = nextTarget;
    s.t0 = performance.now();
    cancelAnimationFrame(s.raf);

    const paint = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const elapsed = now - s.t0;
      const t = Math.min(1, elapsed / TPS_CHART_ANIM_MS);
      const ease = 1 - (1 - t) * (1 - t) * (1 - t);

      for (let i = 0; i < TPS_CHART_BARS; i++) {
        s.cur[i] = s.from[i] + (s.target[i] - s.from[i]) * ease;
      }

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const padX = 8;
      const tickW = 4;
      const maxW = w - padX * 2 - tickW;
      const totalBarsH = TPS_BAR_H * TPS_CHART_BARS + TPS_CHART_GAP * (TPS_CHART_BARS - 1);
      const padY = (h - totalBarsH) / 2;
      const barLeft = padX + tickW;

      // Helper: draw a horizontal pill (semicircle caps) from barLeft to barLeft + barW at centerY
      const pillR = TPS_BAR_H / 2;
      const drawPill = (bx: number, bw: number, centerY: number) => {
        if (bw <= 0) return;
        const x1 = bx + bw;
        ctx.beginPath();
        ctx.moveTo(bx + pillR, centerY - pillR);
        ctx.lineTo(x1 - pillR, centerY - pillR);
        ctx.arc(x1 - pillR, centerY, pillR, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(bx + pillR, centerY + pillR);
        ctx.arc(bx + pillR, centerY, pillR, Math.PI / 2, Math.PI * 1.5);
        ctx.closePath();
      };

      const barCenterY = (i: number) =>
        padY + i * (TPS_BAR_H + TPS_CHART_GAP) + TPS_BAR_H / 2;

      // Grid: faint horizontal lines + left axis tick marks
      ctx.strokeStyle = TPS_GRID_COLOR;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      for (let i = 0; i < TPS_CHART_BARS; i++) {
        const cy = barCenterY(i);
        ctx.beginPath();
        ctx.moveTo(barLeft, cy);
        ctx.lineTo(barLeft + maxW, cy);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.strokeStyle = TPS_TICK_COLOR;
      ctx.lineWidth = 1;
      for (let i = 0; i < TPS_CHART_BARS; i++) {
        const cy = barCenterY(i);
        ctx.beginPath();
        ctx.moveTo(padX, cy);
        ctx.lineTo(padX + tickW, cy);
        ctx.stroke();
      }

      // Shadow offset so the cast shadow is clearly visible behind each bar
      const TPS_SHADOW_OFFSET_X = 3;
      const TPS_SHADOW_OFFSET_Y = 3;

      // Bars: pill-shaped with visible cast shadow + glow + core
      for (let i = 0; i < TPS_CHART_BARS; i++) {
        const fillPct = Math.max(4, Math.min(100, s.cur[i]));
        const barW = (maxW * fillPct) / 100;
        const cy = barCenterY(i);
        if (barW > 0) {
          // 1. Cast shadow: offset pill in dark color (visible on black) + soft blur
          ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.fillStyle = "rgba(15, 25, 22, 0.85)";
          drawPill(barLeft + TPS_SHADOW_OFFSET_X, barW, cy + TPS_SHADOW_OFFSET_Y);
          ctx.fill();
          ctx.shadowBlur = 0;

          // 2. Outer soft halo (glow)
          ctx.shadowColor = "rgba(63, 234, 161, 0.35)";
          ctx.shadowBlur = 14;
          ctx.fillStyle = "rgba(63, 234, 161, 0.45)";
          drawPill(barLeft, barW, cy);
          ctx.fill();
          ctx.shadowBlur = 0;

          // 3. Inner glow
          ctx.shadowColor = "rgba(63, 234, 161, 0.55)";
          ctx.shadowBlur = 8;
          ctx.fillStyle = "rgba(63, 234, 161, 0.55)";
          drawPill(barLeft, barW, cy);
          ctx.fill();
          ctx.shadowBlur = 0;

          // 4. Core bar (solid)
          ctx.fillStyle = TPS_BAR_COLOR;
          drawPill(barLeft, barW, cy);
          ctx.fill();
        }
      }

      if (t < 1) s.raf = requestAnimationFrame(paint);
    };

    s.raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(s.raf);
  }, [tps, peakTps]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: TPS_CHART_WIDTH, height: TPS_CHART_HEIGHT }}
    />
  );
};

const AGENTS_CHART_SIZE = 112;
const AGENTS_CHART_ANIM_MS = 520;
const AGENTS_MAIN_STROKE = 9;
const AGENTS_RING_GAP = 6;
const AGENTS_INNER_RING_THICKNESS = 6;
const AGENTS_MARKER_R = 4.5;
const AGENTS_CENTER_FONT = "500 18px system-ui, -apple-system, sans-serif";
const AGENTS_GLOW_BLUR = 20;
// Inset so outer ring + 12 o'clock dot are fully inside canvas (no cut)
const AGENTS_SAFE_INSET = AGENTS_MAIN_STROKE / 2 + AGENTS_MARKER_R + 4;

// Outer ring: full-circle conic gradient (light blue → purple → pink → red → orange → blue/teal), 12 o'clock = 0
const AGENTS_OUTER_GRADIENT_STOPS: [number, string][] = [
  [0, "#7DD3FC"],
  [0.18, "#A78BFA"],
  [0.35, "#F472B6"],
  [0.52, "#F87171"],
  [0.7, "#FB923C"],
  [0.88, "#38BDF8"],
  [1, "#7DD3FC"],
];
// Inner ring: bright neon green (main fill) + dark trailing segment (growth)
const AGENTS_INNER_ARC = "#4ADE80";
const AGENTS_INNER_ARC_DARK = "rgba(22, 101, 52, 0.95)";
const AGENTS_TRACK = "rgba(15, 23, 22, 0.95)";
const AGENTS_GLOW = "rgba(74, 222, 128, 0.35)";
const AGENTS_MARKER_BLUE = "#38BDF8";
const AGENTS_MARKER_GREEN = "#4ADE80";
const AGENTS_MARKER_BORDER = "rgba(9, 27, 28, 0.95)";

// Angles: 12 o'clock = -π/2. Green arc runs 1 o'clock → 7 o'clock (180°); growth dark segment at end.
const AGENTS_12 = -Math.PI / 2;
const AGENTS_1 = -Math.PI / 3;
const AGENTS_7 = (2 * Math.PI) / 3;
const AGENTS_INNER_SWEEP = Math.PI;
const AGENTS_GROWTH_SWEEP_MAX = Math.PI / 6;

// Red-part variables: activeAgents count and agentsDelta. Blue-part pie values are derived from these.
function computeAgentArcs(count: number, delta: number): { mainPct: number; growthPct: number; centerValue: number } {
  const mainPct = Math.min(100, (count / MAX_AGENTS) * 100);
  const growthPct = Math.min(100, Math.max(0, (delta / MAX_AGENT_DELTA) * 100));
  const centerValue = count / 1000;
  return { mainPct, growthPct, centerValue };
}

function angleToXY(cx: number, cy: number, angleRad: number, r: number) {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function drawRingSegment(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
) {
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter, startAngle, endAngle);
  ctx.arc(cx, cy, rInner, endAngle, startAngle, true);
  ctx.closePath();
}

const ActiveAgentsChart = ({
  activeAgents,
  agentsDelta,
}: {
  activeAgents: number;
  agentsDelta: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  type AgentAnimState = {
    mainCur: number;
    mainFrom: number;
    mainTarget: number;
    growthCur: number;
    growthFrom: number;
    growthTarget: number;
    centerCur: number;
    centerFrom: number;
    centerTarget: number;
    t0: number;
    raf: number;
  };

  const anim = useRef<AgentAnimState | null>(null);
  const targetsRef = useRef({ mainPct: 0, growthPct: 0, centerValue: 0 });

  // Keep targets in sync with variables (concept doc: arc fill = count/max, growth = delta/max_delta)
  useEffect(() => {
    const { mainPct, growthPct, centerValue } = computeAgentArcs(activeAgents, agentsDelta);
    targetsRef.current = { mainPct, growthPct, centerValue };
    const s = anim.current;
    if (s) {
      s.mainFrom = s.mainCur;
      s.mainTarget = mainPct;
      s.growthFrom = s.growthCur;
      s.growthTarget = growthPct;
      s.centerFrom = s.centerCur;
      s.centerTarget = centerValue;
      s.t0 = performance.now();
    }
  }, [activeAgents, agentsDelta]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { mainPct, growthPct, centerValue } = computeAgentArcs(activeAgents, agentsDelta);
    targetsRef.current = { mainPct, growthPct, centerValue };
    anim.current = {
      mainCur: mainPct,
      mainFrom: mainPct,
      mainTarget: mainPct,
      growthCur: growthPct,
      growthFrom: growthPct,
      growthTarget: growthPct,
      centerCur: centerValue,
      centerFrom: centerValue,
      centerTarget: centerValue,
      t0: performance.now(),
      raf: 0,
    };

    const paint = (now: number) => {
      const c = canvasRef.current;
      if (!c) return;
      const s = anim.current;
      if (!s) return;

      const ctx = c.getContext("2d");
      if (!ctx) return;

      const elapsed = now - s.t0;
      const t = Math.min(1, elapsed / AGENTS_CHART_ANIM_MS);
      const ease = 1 - (1 - t) ** 2.2;

      if (t >= 1) {
        s.mainCur = s.mainTarget;
        s.growthCur = s.growthTarget;
        s.centerCur = s.centerTarget;
      } else {
        s.mainCur = s.mainFrom + (s.mainTarget - s.mainFrom) * ease;
        s.growthCur = s.growthFrom + (s.growthTarget - s.growthFrom) * ease;
        s.centerCur = s.centerFrom + (s.centerTarget - s.centerFrom) * ease;
      }

      const dpr = window.devicePixelRatio || 1;
      const w = AGENTS_CHART_SIZE;
      const h = AGENTS_CHART_SIZE;
      if (c.width !== w * dpr || c.height !== h * dpr) {
        c.width = w * dpr;
        c.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const rMain = Math.min(w, h) / 2 - AGENTS_SAFE_INSET;
      const rInnerOuter = rMain - AGENTS_MAIN_STROKE - AGENTS_RING_GAP;
      const rInnerInner = Math.max(2, rInnerOuter - AGENTS_INNER_RING_THICKNESS);

      const mainPctClamped = Math.min(100, Math.max(0, s.mainCur)) / 100;
      const growthPctClamped = Math.min(100, Math.max(0, s.growthCur)) / 100;
      const innerBrightSweep = mainPctClamped * AGENTS_INNER_SWEEP;
      const innerDarkSweep = growthPctClamped * AGENTS_GROWTH_SWEEP_MAX;
      const innerBrightEnd = AGENTS_1 + innerBrightSweep;
      const innerDarkEnd = innerBrightEnd + innerDarkSweep;

      const outerSweep = mainPctClamped * Math.PI * 2;
      const outerArcEnd = AGENTS_12 + outerSweep;

      ctx.lineCap = "round";

      // Outer ring track (full circle, subtle) — background for the animated segment
      ctx.strokeStyle = AGENTS_TRACK;
      ctx.lineWidth = AGENTS_MAIN_STROKE + 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rMain, AGENTS_12, AGENTS_12 + Math.PI * 2);
      ctx.stroke();

      // Outer ring (Segment 1 – Total scale): gradient arc animated by count/max, fills 0–100% of circle (with soft glow)
      if (outerSweep > 0.02) {
        ctx.shadowColor = "rgba(125, 211, 252, 0.5)";
        ctx.shadowBlur = 12;
        let gradientStyle: CanvasGradient | string = AGENTS_OUTER_GRADIENT_STOPS[0][1];
        const createConic = (ctx as CanvasRenderingContext2D & { createConicGradient?(startAngle: number, x: number, y: number): CanvasGradient }).createConicGradient;
        if (createConic) {
          const grad = createConic.call(ctx, AGENTS_12, cx, cy);
          AGENTS_OUTER_GRADIENT_STOPS.forEach(([pos, color]) => grad.addColorStop(pos, color));
          gradientStyle = grad;
        }
        ctx.strokeStyle = gradientStyle;
        ctx.lineWidth = AGENTS_MAIN_STROKE;
        ctx.beginPath();
        ctx.arc(cx, cy, rMain, AGENTS_12, outerArcEnd);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Marker A (blue): current position at end of outer scale arc (with subtle glow)
      const bluePt = angleToXY(cx, cy, outerSweep > 0.02 ? outerArcEnd : AGENTS_12, rMain);
      ctx.shadowColor = "rgba(56, 189, 248, 0.6)";
      ctx.shadowBlur = 8;
      ctx.fillStyle = AGENTS_MARKER_BLUE;
      ctx.strokeStyle = AGENTS_MARKER_BORDER;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bluePt.x, bluePt.y, AGENTS_MARKER_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner ring (thickness): Segment 1 – total scale (green) + Segment 2 – growth (dark), both with shadow
      if (rInnerInner < rInnerOuter) {
        if (innerBrightSweep > 0) {
          drawRingSegment(ctx, cx, cy, rInnerOuter, rInnerInner, AGENTS_1, innerBrightEnd);
          ctx.shadowColor = AGENTS_GLOW;
          ctx.shadowBlur = AGENTS_GLOW_BLUR;
          ctx.fillStyle = AGENTS_INNER_ARC;
          ctx.fill();
          ctx.strokeStyle = "rgba(74, 222, 128, 0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        if (innerDarkSweep > 0) {
          drawRingSegment(ctx, cx, cy, rInnerOuter, rInnerInner, innerBrightEnd, innerDarkEnd);
          ctx.shadowColor = "rgba(22, 101, 52, 0.5)";
          ctx.shadowBlur = AGENTS_GLOW_BLUR;
          ctx.fillStyle = AGENTS_INNER_ARC_DARK;
          ctx.fill();
          ctx.strokeStyle = "rgba(22, 101, 52, 0.6)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      const rInnerMid = (rInnerOuter + rInnerInner) / 2;
      const greenStartPt = angleToXY(cx, cy, AGENTS_1, rInnerMid);
      ctx.shadowColor = "rgba(74, 222, 128, 0.6)";
      ctx.shadowBlur = 6;
      ctx.fillStyle = AGENTS_MARKER_GREEN;
      ctx.strokeStyle = AGENTS_MARKER_BORDER;
      ctx.beginPath();
      ctx.arc(greenStartPt.x, greenStartPt.y, AGENTS_MARKER_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (innerBrightSweep > 0.02) {
        const greenCurrentPt = angleToXY(cx, cy, innerBrightEnd, rInnerMid);
        ctx.shadowColor = "rgba(74, 222, 128, 0.6)";
        ctx.shadowBlur = 6;
        ctx.fillStyle = AGENTS_MARKER_GREEN;
        ctx.strokeStyle = AGENTS_MARKER_BORDER;
        ctx.beginPath();
        ctx.arc(greenCurrentPt.x, greenCurrentPt.y, AGENTS_MARKER_R, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
      ctx.font = AGENTS_CENTER_FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.centerCur.toFixed(1), cx, cy);

      s.raf = requestAnimationFrame(paint);
    };

    anim.current.raf = requestAnimationFrame(paint);
    return () => {
      if (anim.current) cancelAnimationFrame(anim.current.raf);
      anim.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: AGENTS_CHART_SIZE, height: AGENTS_CHART_SIZE }}
      className="shrink-0"
      aria-label={`Active agents: ${activeAgents.toLocaleString()}, change ${agentsDelta >= 0 ? "+" : ""}${agentsDelta} in 10 minutes; circular chart shows scale, growth, and activity.`}
    />
  );
};

// Global Nodes: radial "network pulse" — 6 beams, each driven by the 2 variables per role (concept doc §2). No background.
// Beam roles: 0 scale (nodes) | 1 health (uptime) | 2 magnitude (nodes) | 3 finer (nodes) | 4 stability (uptime) | 5 blend (both)
const NODES_CHART_SIZE = 100;
const NODES_CHART_ANIM_MS = 360;
const NODES_BEAM_COLORS = ["#06B6D4", "#10B981", "#8B5CF6", "#EAB308", "#F97316", "#EC4899"] as const;
const NODES_MIN_RADIUS_PCT = 0.22;
const NODES_BEAM_THICKNESS = 5;
const NODES_GLOW_BLUR_MAX = 18;

function computeNodesBeamLengths(globalNodes: number, uptime: number): number[] {
  const nodeScale = Math.min(1, globalNodes / MAX_NODES);
  const health = Math.min(1, Math.max(0, uptime / 100));
  const magnitudeOffset = Math.min(1, Math.floor(globalNodes / 1000) / 10);
  const finer = (globalNodes % 1000) / 1000;
  const blend = nodeScale * 0.5 + health * 0.5;
  return [nodeScale, health, magnitudeOffset, finer, health, blend];
}

const GlobalNodesChart = ({ globalNodes, uptime }: { globalNodes: number; uptime: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetLengths = computeNodesBeamLengths(globalNodes, uptime);
  const anim = useRef({
    lengths: [...targetLengths],
    from: [...targetLengths],
    target: targetLengths,
    t0: 0,
    raf: 0,
  });

  useEffect(() => {
    const next = computeNodesBeamLengths(globalNodes, uptime);
    const s = anim.current;
    s.from = [...s.lengths];
    s.target = next;
    s.t0 = performance.now();
    cancelAnimationFrame(s.raf);

    const paint = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const elapsed = now - s.t0;
      const t = Math.min(1, elapsed / NODES_CHART_ANIM_MS);
      const ease = 1 - (1 - t) ** 2.4;

      for (let i = 0; i < 6; i++) {
        s.lengths[i] = s.from[i] + (s.target[i] - s.from[i]) * ease;
      }

      const breath = 0.04 * Math.sin(now / 2800);
      const dpr = window.devicePixelRatio || 1;
      const size = NODES_CHART_SIZE;
      if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const maxR = size / 2 - 8;
      const minR = maxR * NODES_MIN_RADIUS_PCT;
      const angleStep = (2 * Math.PI) / 6;
      const startAngle = -Math.PI / 2;

      const breathPeriod = 1800;
      const breathAmp = 0.16;
      const glowPulse = 0.88 + 0.14 * Math.sin(now / 1400);

      for (let i = 0; i < 6; i++) {
        const raw = Math.max(0, Math.min(1, s.lengths[i]));
        const beamPhase = (i / 6) * Math.PI * 2;
        const breathI = breathAmp * Math.sin(now / breathPeriod + beamPhase);
        const r = minR + (maxR - minR) * (raw * (1 + breathI));
        const angle = startAngle + i * angleStep;
        const ex = cx + r * Math.cos(angle);
        const ey = cy + r * Math.sin(angle);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = NODES_BEAM_COLORS[i];
        ctx.lineWidth = NODES_BEAM_THICKNESS;
        ctx.lineCap = "round";
        ctx.shadowColor = NODES_BEAM_COLORS[i];
        ctx.shadowBlur = NODES_GLOW_BLUR_MAX * (0.4 + 0.6 * raw) * glowPulse;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      const corePulse = 2.6 + 1.2 * Math.sin(now / 1200);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, corePulse * 3);
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.4, "rgba(200,220,255,0.4)");
      grad.addColorStop(1, "rgba(200,220,255,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
      ctx.fill();

      s.raf = requestAnimationFrame(paint);
    };

    s.raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(s.raf);
  }, [globalNodes, uptime]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: NODES_CHART_SIZE, height: NODES_CHART_SIZE }}
      className="shrink-0"
      aria-label={`Global nodes: ${globalNodes.toLocaleString()}, uptime ${uptime.toFixed(2)}%; radial chart shows scale, health, magnitude, finer scale, stability, and network state.`}
    />
  );
};

export const StatTicker = () => {
  const [blockHeight, setBlockHeight] = useState(12940221);
  const [blockUpdateTime, setBlockUpdateTime] = useState(0.4);
  const [tps, setTps] = useState(1240);
  const [peakTps, setPeakTps] = useState(1612);
  const [activeAgents, setActiveAgents] = useState(14203);
  const [agentsDelta, setAgentsDelta] = useState(1024);
  const [globalNodes, setGlobalNodes] = useState(842);
  const [uptime, setUptime] = useState(99.99);

  const prevBlockHeight = useRef(blockHeight);

  // Block Height: 4 bar fill % (0–100) per concept doc §2–§3, driven by blockHeight + blockUpdateTime
  const [blockBars, setBlockBars] = useState<[number, number, number, number]>([
    20, 80, 22, 30,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight(h => h + 1);
      setBlockUpdateTime(Math.random() * 1.5 + 0.1);
      setTps(prev => {
        const next = prev + Math.floor(Math.random() * 40) - 20;
        return Math.max(0, next);
      });
      // Random peak so chart bars (utilization, headroom, peak ref, etc.) update visibly
      setPeakTps(
        () => Math.floor(1000 + Math.random() * (MAX_TPS - 1000)),
      );
      setActiveAgents(prev => Math.max(0, prev + Math.floor(Math.random() * 1400) - 500));
      setAgentsDelta(prev => Math.max(0, prev + Math.floor(Math.random() * 900) - 350));
      setGlobalNodes(prev => Math.max(100, prev + Math.floor(Math.random() * 10) - 5));
      setUptime(prev => Math.min(100, Math.max(95, prev + (Math.random() * 0.02 - 0.01))));
    }, 2000);
    return () => clearInterval(interval);
  }, [tps]);

  // Block Height: recompute 4 bar fills when blockHeight or blockUpdateTime change (concept doc §3)
  useEffect(() => {
    const delta = blockHeight - prevBlockHeight.current;
    prevBlockHeight.current = blockHeight;

    const bar1 = Math.min(100, (delta / MAX_BLOCK_DELTA) * 100);
    const bar2 = Math.max(0, (1 - blockUpdateTime / 2)) * 100;
    const bar3 = ((blockHeight % 10000) / 10000) * 100;
    const bar4 = Math.max(0, 1 - blockUpdateTime) * (delta > 0 ? 100 : 50);

    setBlockBars([bar1, bar2, bar3, bar4]);
  }, [blockHeight, blockUpdateTime]);

  const fmt = (n: number) => n.toLocaleString();

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 border-l border-r border-b border-white/10 p-4 sm:p-6 md:p-8">
        <div
          className="relative w-full min-h-[100px] sm:min-h-[120px] flex items-center justify-between border border-white/10 py-3 pl-3 pr-2 sm:py-4 sm:pl-4 sm:pr-4"
        >
          <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-1.5 items-start font-sans">
            <div className="flex items-center gap-1.5 text-white/60">
              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <div className="text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-wider font-medium truncate">
                Block Height
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-medium text-white tabular-nums">
              #{fmt(blockHeight)}
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              ↑{blockUpdateTime.toFixed(1)}s
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 flex items-center">
            <BlockHeightChart bars={blockBars} />
          </div>
        </div>
        <div
          className="relative w-full min-h-[100px] sm:min-h-[120px] flex items-center justify-between border border-white/10 py-3 pl-3 pr-2 sm:py-4 sm:pl-4 sm:pr-4"
        >
          <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-1.5 items-start font-sans">
            <div className="flex items-center gap-1.5 text-white/60">
              <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <div className="text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-wider font-medium truncate">
                Network TPS
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-medium text-white tabular-nums">
              {fmt(tps)}
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              Peak:↑{fmt(peakTps)}
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 flex items-center">
            <NetworkTpsChart tps={tps} peakTps={peakTps} />
          </div>
        </div>
        <div
          className="relative w-full min-h-[100px] sm:min-h-[120px] flex items-center justify-between border border-white/10 py-3 pl-3 sm:py-4 sm:pl-4 overflow-visible"
          style={{ paddingRight: AGENTS_CHART_SIZE + 12 }}
        >
          <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-1.5 items-start font-sans">
            <div className="flex items-center gap-1.5 text-white/60">
              <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <div className="text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-wider font-medium truncate">
                Active Agents
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-medium text-white tabular-nums">
              {fmt(activeAgents)}
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              +{fmt(agentsDelta)} (10m)
            </div>
          </div>
          <div className="absolute right-2 top-0 bottom-0 flex items-center justify-end overflow-visible">
            <ActiveAgentsChart activeAgents={activeAgents} agentsDelta={agentsDelta} />
          </div>
        </div>
        <div
          className="relative w-full min-h-[100px] sm:min-h-[120px] flex items-center justify-between border border-white/10 py-3 pl-3 pr-2 sm:py-4 sm:pl-4 sm:pr-4"
          style={{ paddingRight: NODES_CHART_SIZE + 12 }}
        >
          <div className="w-full min-w-0 flex flex-col gap-1 sm:gap-1.5 items-start font-sans">
            <div className="flex items-center gap-1.5 text-white/60">
              <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <div className="text-[11px] sm:text-[13px] md:text-[14px] uppercase tracking-wider font-medium truncate">
                Global Nodes
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-medium text-white tabular-nums">
              {fmt(globalNodes)}
            </div>
            <div className="text-xs sm:text-sm tracking-wider text-white/60 font-medium truncate">
              Uptime:{uptime.toFixed(2)}%
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 flex items-center">
            <GlobalNodesChart globalNodes={globalNodes} uptime={uptime} />
          </div>
        </div>
    </div>
  );
};