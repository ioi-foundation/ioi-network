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

// Network TPS: 8 guide lines, 3 bars on 3rd / 5th / 7th lines — pill-style bars, luminous glow
const TPS_CHART_BARS = 3;
const TPS_GUIDE_LINES = 8;
const TPS_BAR_LINE_INDICES = [2, 4, 6]; // 1-based: 3rd, 5th, 7th guide lines
const TPS_BAR_H = 5; // pill height — slightly thicker for visibility
const TPS_CHART_WIDTH = 100;
const TPS_CHART_HEIGHT = 120;
const TPS_CHART_ANIM_MS = 300;
const TPS_BAR_COLOR = "#3FEAA1"; // vibrant green/cyan core
const TPS_GLOW_COLOR = "rgba(63, 234, 161, 0.8)"; // brighter cyan-green emissive glow
const TPS_GLOW_HALO = "rgba(63, 234, 161, 0.5)"; // soft outer halo
const TPS_GRID_COLOR = "rgba(80, 90, 88, 0.4)"; // faint grey grid lines
const TPS_TICK_COLOR = "rgba(255, 255, 255)"; // subtle axis tick marks on right

function computeTpsBars(tps: number, peakTps: number): number[] {
  const currentLoad = Math.min(100, (tps / MAX_TPS) * 100);
  const utilization = peakTps > 0 ? Math.min(100, (tps / peakTps) * 100) : 0;
  const peakRef = Math.min(100, (peakTps / MAX_TPS) * 100);
  return [currentLoad, utilization, peakRef];
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

      const padX = 6;
      const dotR = 2;
      const dotGap = 6;
      const padY = 12;
      const lineSpacing = (h - 2 * padY) / (TPS_GUIDE_LINES - 1);
      const guideLineCenterY = (lineIndex: number) => padY + lineIndex * lineSpacing;
      const barLeft = padX + dotR * 2 + dotGap;
      const maxW = w - barLeft - padX;

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

      // Left side short solid line markers (denotations) - positioned before guide lines
      ctx.strokeStyle = TPS_TICK_COLOR;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < TPS_GUIDE_LINES; i++) {
        const cy = guideLineCenterY(i);
        ctx.beginPath();
        ctx.moveTo(padX, cy);
        ctx.lineTo(padX + 5, cy);
        ctx.stroke();
      }
      // Grid: 8 solid horizontal guide lines (starting after dots)
      ctx.strokeStyle = TPS_GRID_COLOR;
      ctx.lineWidth = 1;
      for (let i = 0; i < TPS_GUIDE_LINES; i++) {
        const cy = guideLineCenterY(i);
        ctx.beginPath();
        ctx.moveTo(barLeft, cy);
        ctx.lineTo(w - padX, cy);
        ctx.stroke();
      }

      for (let i = 0; i < TPS_CHART_BARS; i++) {
        const fillPct = Math.max(4, Math.min(100, s.cur[i]));
        const barW = (maxW * fillPct) / 100;
        const cy = guideLineCenterY(TPS_BAR_LINE_INDICES[i]);
        // Bar grows from right to left
        const barStartX = barLeft + maxW - barW;
        if (barW > 0) {
          // 1. Outer soft luminous halo (wide glow)
          ctx.shadowColor = TPS_GLOW_HALO;
          ctx.shadowBlur = 25;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.fillStyle = "rgba(63, 234, 161, 0.25)";
          drawPill(barStartX, barW, cy);
          ctx.fill();
          ctx.shadowBlur = 0;

          // 2. Inner bright glow
          ctx.shadowColor = TPS_GLOW_COLOR;
          ctx.shadowBlur = 15;
          ctx.fillStyle = "rgba(63, 234, 161, 0.6)";
          drawPill(barStartX, barW, cy);
          ctx.fill();
          ctx.shadowBlur = 0;

          // 3. Core bar (solid vibrant green/cyan) with tight glow
          ctx.shadowColor = "#3FEAA1";
          ctx.shadowBlur = 6;
          ctx.fillStyle = TPS_BAR_COLOR;
          drawPill(barStartX, barW, cy);
          ctx.fill();
          ctx.shadowBlur = 0;
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
const AGENTS_GLOW_BLUR = 100;
// Inset so outer ring + 12 o'clock dot are fully inside canvas (no cut)
const AGENTS_SAFE_INSET = AGENTS_MAIN_STROKE / 2 + AGENTS_MARKER_R + 4;

// Outer ring: conic gradient (cyan top → green right → orange bottom → magenta left)
const AGENTS_OUTER_GRADIENT_STOPS: [number, string][] = [
  [0, "#0ac5ef"],      // Cyan at 12 o'clock (top)
  [0.25, "#77ff60"],   // Bright green at 3 o'clock (right)
  [0.5, "#e78d54"],    // Orange at 6 o'clock (bottom)
  [0.75, "#cc269d"],   // Magenta at 9 o'clock (left)
  [1, "#0ac5ef"],      // Back to cyan (top)
];
// Inner ring: bright neon green (main fill) + dark trailing segment (growth)
const AGENTS_INNER_ARC = "#77ff60";
const AGENTS_INNER_ARC_DARK = "rgba(22, 101, 52, 0.95)";
const AGENTS_TRACK = "rgba(15, 23, 22, 0.95)";
const AGENTS_GLOW = "rgba(119, 255, 96, 0.85)";
const AGENTS_MARKER_BLUE = "#0ac5ef";
const AGENTS_MARKER_GREEN = "#77ff60";
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
        ctx.shadowColor = "rgba(10, 197, 239, 0.5)";
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

      // Inner ring (thickness): Segment 1 – total scale (green) + Segment 2 – growth (dark), with strong glow
      if (rInnerInner < rInnerOuter) {
        if (innerBrightSweep > 0) {
          // Layer 1: Wide outer soft glow
          drawRingSegment(ctx, cx, cy, rInnerOuter, rInnerInner, AGENTS_1, innerBrightEnd);
          ctx.shadowColor = "rgba(119, 255, 96, 0.6)";
          ctx.shadowBlur = 55;
          ctx.fillStyle = "rgba(119, 255, 96, 0.35)";
          ctx.fill();
          ctx.shadowBlur = 0;

          // Layer 2: Inner bright glow
          drawRingSegment(ctx, cx, cy, rInnerOuter, rInnerInner, AGENTS_1, innerBrightEnd);
          ctx.shadowColor = AGENTS_GLOW;
          ctx.shadowBlur = AGENTS_GLOW_BLUR;
          ctx.fillStyle = AGENTS_INNER_ARC;
          ctx.fill();
          ctx.strokeStyle = "rgba(119, 255, 96, 0.6)";
          ctx.lineWidth = 1.5;
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

// Global Nodes: 8 thin neon curves with smooth glow — matching reference image exactly
const NODES_CHART_WIDTH = 100;
const NODES_CHART_HEIGHT = 110;
const NODES_CHART_ANIM_MS = 360;
const NODES_CORE_LINE_WIDTH = 1.2;
const NODES_GRID_COLOR = "rgba(100, 110, 120, 0.5)";
const NODES_TICK_COLOR = "rgba(255, 255, 255)";
// Design colors: Top 4 (flattest→steepest): purple, light cyan, cyan, blue. Bottom 4: yellow, orange, red, pink/magenta.
const NODES_SPLINE_COLORS = ["#6741b1", "#1796ec", "#0ac5ef", "#00fff0", "#fffc00", "#e90703", "#f22e7a", "#c503d4"] as const;

function computeNodesSplineAmplitudes(globalNodes: number, uptime: number): number[] {
  const nodeScale = Math.min(1, globalNodes / MAX_NODES);
  const health = Math.min(1, Math.max(0, uptime / 100));
  // All 8 curves visible, length varies from 0.45 to 1.0 based on variables
  // Minimum size increased so short curves are clearly visible
  return [
    0.45 + nodeScale * 0.55,         // Purple: driven by nodes
    0.45 + health * 0.55,            // Light cyan: driven by health
    0.5 + nodeScale * 0.5,           // Cyan: driven by nodes
    0.45 + health * 0.55,            // Blue: driven by health
    0.45 + health * 0.55,            // Yellow: driven by health
    0.5 + nodeScale * 0.5,           // Orange: driven by nodes
    0.45 + health * 0.55,            // Red: driven by health
    0.45 + nodeScale * 0.55,         // Pink: driven by nodes
  ];
}

// Cubic Bezier point at t: B(t) = (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
// This creates S-curve shapes: start flat → bend → end flat
function cubicBezierPoint(
  x0: number, y0: number,
  cx1: number, cy1: number,
  cx2: number, cy2: number,
  x3: number, y3: number,
  t: number,
) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x: mt3 * x0 + 3 * mt2 * t * cx1 + 3 * mt * t2 * cx2 + t3 * x3,
    y: mt3 * y0 + 3 * mt2 * t * cy1 + 3 * mt * t2 * cy2 + t3 * y3,
  };
}

// Draw partial cubic bezier from t=0 to t=endT (S-curve for natural look)
function drawPartialCubicBezier(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number,
  cx1: number, cy1: number,
  cx2: number, cy2: number,
  x3: number, y3: number,
  endT: number,
) {
  if (endT <= 0) return;
  const steps = 40;
  ctx.moveTo(x0, y0);
  for (let k = 1; k <= steps; k++) {
    const t = Math.min((k / steps) * endT, 1);
    const p = cubicBezierPoint(x0, y0, cx1, cy1, cx2, cy2, x3, y3, t);
    ctx.lineTo(p.x, p.y);
  }
}

// Draw one S-curve neon line with subtle glow
function drawNeonCurve(
  ctx: CanvasRenderingContext2D,
  x0: number, y0: number,
  cx1: number, cy1: number,
  cx2: number, cy2: number,
  x3: number, y3: number,
  color: string,
) {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const rgb = `${r}, ${g}, ${b}`;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Layer 1: Outer soft glow - draw full curve
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x3, y3);
  ctx.strokeStyle = `rgba(${rgb}, 0.08)`;
  ctx.lineWidth = 8;
  ctx.shadowColor = `rgba(${rgb}, 0.2)`;
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Layer 2: Mid glow - draw full curve
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x3, y3);
  ctx.strokeStyle = `rgba(${rgb}, 0.2)`;
  ctx.lineWidth = 4;
  ctx.shadowColor = `rgba(${rgb}, 0.3)`;
  ctx.shadowBlur = 4;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Layer 3: Bright core - draw full curve
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x3, y3);
  ctx.strokeStyle = color;
  ctx.lineWidth = NODES_CORE_LINE_WIDTH;
  ctx.shadowColor = color;
  ctx.shadowBlur = 2;
  ctx.stroke();
  ctx.shadowBlur = 0;
}

const GlobalNodesChart = ({ globalNodes, uptime }: { globalNodes: number; uptime: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const targetAmps = computeNodesSplineAmplitudes(globalNodes, uptime);
  const anim = useRef({
    amps: [...targetAmps],
    from: [...targetAmps],
    target: targetAmps,
    t0: 0,
    raf: 0,
  });

  useEffect(() => {
    const next = computeNodesSplineAmplitudes(globalNodes, uptime);
    const s = anim.current;
    s.from = [...s.amps];
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

      for (let i = 0; i < 8; i++) {
        s.amps[i] = s.from[i] + (s.target[i] - s.from[i]) * ease;
      }

      const dpr = window.devicePixelRatio || 1;
      const w = NODES_CHART_WIDTH;
      const h = NODES_CHART_HEIGHT;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);

      const padX = 4;
      const tickW = 4;
      const tickGap = 8; // Gap between tick marks and guide lines
      const padY = 8;
      const barLeft = padX + tickW + tickGap;
      const barRight = w - 4;
      const maxW = barRight - barLeft;

      // Grid lines
      const gridLineCount = 9;
      const gridYs: number[] = [];
      for (let g = 0; g < gridLineCount; g++) {
        gridYs.push(padY + (g / (gridLineCount - 1)) * (h - 2 * padY));
      }
      
      // Left side short solid line markers (denotations) - positioned before guide lines
      ctx.strokeStyle = NODES_TICK_COLOR;
      ctx.lineWidth = 1.5;
      for (const y of gridYs) {
        ctx.beginPath();
        ctx.moveTo(padX, y);
        ctx.lineTo(padX + 5, y);
        ctx.stroke();
      }
      
      // Solid horizontal guide lines (starting after denotations)
      ctx.strokeStyle = NODES_GRID_COLOR;
      ctx.lineWidth = 1;
      for (const y of gridYs) {
        ctx.beginPath();
        ctx.moveTo(barLeft, y);
        ctx.lineTo(barRight, y);
        ctx.stroke();
      }

      // All curves show COMPLETE S-curve within graphic width:
      // flat start → curve in middle → flat approach to end
      // S-curve intensity increases toward center
      
      // Top 4: all start from top-left (first guide line), fan out down-right
      // Leave gap in the center between top and bottom curves
      const originTopY = gridYs[0];
      const centerGap = 8;
      const topEndYs = [gridYs[1], gridYs[2], gridYs[3], gridYs[4] - centerGap];
      // S-curve concentrated in middle: flat left → S in center → flat right
      // Purple (gentle) → Blue (sharp)
      const topCurveParams = [
        { c1x: 0.45, c1y: 0.0, c2x: 0.55, c2y: 1.0 },   // Purple: S in center
        { c1x: 0.42, c1y: 0.0, c2x: 0.58, c2y: 1.0 },   // Light cyan: slightly wider S
        { c1x: 0.38, c1y: 0.0, c2x: 0.62, c2y: 1.0 },   // Cyan: wider S
        { c1x: 0.35, c1y: 0.0, c2x: 0.65, c2y: 1.0 },   // Blue: widest S
      ];
      for (let i = 0; i < 4; i++) {
        // Data-driven deformation: amplitude controls how far the curve bends
        // Stronger pulse for visible continuous animation
        const pulse = Math.sin(now / 800 + i * 1.2) * 0.15;
        const deform = Math.max(0.2, Math.min(1, s.amps[i] + pulse));
        const targetEndY = topEndYs[i];
        // Interpolate endpoint Y between origin and target based on deformation
        const endY = originTopY + (targetEndY - originTopY) * deform;
        const p = topCurveParams[i];
        // Control points also deform proportionally
        const cx1 = barLeft + maxW * p.c1x;
        const cy1 = originTopY + (endY - originTopY) * p.c1y;
        const cx2 = barLeft + maxW * p.c2x;
        const cy2 = originTopY + (endY - originTopY) * p.c2y;
        drawNeonCurve(ctx, barLeft, originTopY, cx1, cy1, cx2, cy2, barRight, endY, NODES_SPLINE_COLORS[i]);
      }

      // Bottom 4: all start from bottom-left (last guide line), fan out up-right
      // Leave gap in the center between top and bottom curves
      const originBottomY = gridYs[gridYs.length - 1];
      const bottomEndYs = [gridYs[4] + centerGap, gridYs[5], gridYs[6], gridYs[7]];
      // Yellow (widest S) → Pink (S in center)
      const bottomCurveParams = [
        { c1x: 0.35, c1y: 0.0, c2x: 0.65, c2y: 1.0 },   // Yellow: widest S
        { c1x: 0.38, c1y: 0.0, c2x: 0.62, c2y: 1.0 },   // Orange: wider S
        { c1x: 0.42, c1y: 0.0, c2x: 0.58, c2y: 1.0 },   // Red: slightly wider S
        { c1x: 0.45, c1y: 0.0, c2x: 0.55, c2y: 1.0 },   // Pink: S in center
      ];
      for (let i = 0; i < 4; i++) {
        // Data-driven deformation: amplitude controls how far the curve bends
        // Stronger pulse for visible continuous animation
        const pulse = Math.sin(now / 800 + (i + 4) * 1.2) * 0.15;
        const deform = Math.max(0.2, Math.min(1, s.amps[i + 4] + pulse));
        const targetEndY = bottomEndYs[i];
        // Interpolate endpoint Y between origin and target based on deformation
        const endY = originBottomY + (targetEndY - originBottomY) * deform;
        const p = bottomCurveParams[i];
        // Control points also deform proportionally
        const cx1 = barLeft + maxW * p.c1x;
        const cy1 = originBottomY - (originBottomY - endY) * p.c1y;
        const cx2 = barLeft + maxW * p.c2x;
        const cy2 = originBottomY - (originBottomY - endY) * p.c2y;
        drawNeonCurve(ctx, barLeft, originBottomY, cx1, cy1, cx2, cy2, barRight, endY, NODES_SPLINE_COLORS[i + 4]);
      }

      s.raf = requestAnimationFrame(paint);
    };

    s.raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(s.raf);
  }, [globalNodes, uptime]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: NODES_CHART_WIDTH, height: NODES_CHART_HEIGHT, background: "#000" }}
      className="shrink-0"
      aria-label={`Global nodes: ${globalNodes.toLocaleString()}, uptime ${uptime.toFixed(2)}%; spline chart shows network state.`}
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
          style={{ paddingRight: NODES_CHART_WIDTH + 12 }}
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