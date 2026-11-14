// Shared instrument-panel pieces for widgets. Import from "@kit".
// These are furniture (readouts, buttons, axes). The interaction itself is
// always invented per explainer — never add a generic "widget" here.
import { useEffect, useRef, useState } from "react";
import { AMBER, AMBER_DIM, GRID, INK, MONO, PANEL, PAPER, RED, SERIF } from "./tokens.js";
export * from "./tokens.js";

const label = { fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.6 };

/** Two-column lab: figure on the left, controls/readouts on the right. Stacks on narrow screens. */
export function LabGrid({ children, ratio = "1.5fr 1fr" }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 300px), 1fr))`, gap: 32, alignItems: "start" }} data-ratio={ratio}>
      {children}
    </div>
  );
}

/** Dark panel that holds an SVG figure. */
export function Figure({ children, style }) {
  return <div style={{ background: PANEL, border: `1px solid ${GRID}`, borderRadius: 2, padding: 12, ...style }}>{children}</div>;
}

export function Stack({ children, gap = 20 }) {
  return <div style={{ display: "flex", flexDirection: "column", gap }}>{children}</div>;
}

export function Readout({ children }) {
  return <div style={{ padding: "12px 20px", background: PANEL, border: `1px solid ${GRID}`, borderRadius: 2 }}>{children}</div>;
}

export function ReadoutRow({ label: l, value, tone }) {
  const color = tone === "accent" ? AMBER : tone === "alarm" ? RED : PAPER;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "7px 0", fontFamily: MONO, fontSize: 13, borderBottom: `1px dashed ${GRID}` }}>
      <span style={{ opacity: 0.7 }}>{l}</span>
      <span style={{ color, textAlign: "right" }}>{value}</span>
    </div>
  );
}

export function Stat({ label: l, value, tone }) {
  return (
    <div style={{ padding: 16, background: INK, border: `1px solid ${GRID}` }}>
      <div style={{ ...label, marginBottom: 8 }}>{l}</div>
      <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 500, color: tone === "alarm" ? RED : AMBER }}>{value}</div>
    </div>
  );
}

export function Button({ active, primary, children, ...rest }) {
  const on = active || primary;
  return (
    <button
      {...rest}
      style={{
        fontFamily: MONO, fontSize: 11, padding: "9px 14px", minHeight: 36,
        border: `1px solid ${on ? AMBER : AMBER_DIM}`, borderRadius: 2,
        background: on ? AMBER : "transparent", color: on ? INK : PAPER,
        cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}

export function ButtonRow({ children }) {
  return <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{children}</div>;
}

export function Slider({ label: l, value, display, onChange, min = 0, max = 1, step = 0.01 }) {
  return (
    <label style={{ display: "block", fontFamily: SERIF, fontSize: 14 }}>
      <span style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, opacity: 0.85 }}>
        <span>{l}</span>
        <span style={{ color: AMBER, fontFamily: MONO, fontSize: 13 }}>{display ?? value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: AMBER, margin: 0 }} />
    </label>
  );
}

/** A sentence that changes with state: the "what you're looking at" line under a readout. */
export function Verdict({ children, tone }) {
  return (
    <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.6, padding: "4px 0 4px 16px", borderLeft: `2px solid ${tone === "alarm" ? RED : AMBER_DIM}`, fontWeight: 300, opacity: 0.92 }}>
      {children}
    </div>
  );
}

/** Step-through state for algorithm walks. Returns state + a ready-made control row. */
export function usePlayback(totalSteps, intervalMs = 1100) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = totalSteps - 1;
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => (step < last ? setStep(step + 1) : setPlaying(false)), intervalMs);
    return () => clearTimeout(t);
  }, [playing, step, last, intervalMs]);
  const controls = (
    <ButtonRow>
      <Button onClick={() => { setStep(0); setPlaying(false); }}>⟲ Reset</Button>
      <Button onClick={() => setStep(Math.max(0, step - 1))}>◀ Back</Button>
      <Button primary onClick={() => { if (step >= last) { setStep(0); setPlaying(true); } else setPlaying(!playing); }}>
        {playing ? "⏸ Pause" : step >= last ? "↺ Replay" : "▶ Play"}
      </Button>
      <Button onClick={() => setStep(Math.min(last, step + 1))}>Next ▶</Button>
    </ButtonRow>
  );
  return { step, setStep, playing, controls };
}

/** Data-space ↔ pixel-space for a W×H SVG with padding. */
export function makeScale({ w, h, pad, xMax, yMax, xMin = 0, yMin = 0 }) {
  const toPx = (x, y) => [pad + ((x - xMin) / (xMax - xMin)) * (w - 2 * pad), h - pad - ((y - yMin) / (yMax - yMin)) * (h - 2 * pad)];
  const fromPx = (px, py) => [xMin + ((px - pad) / (w - 2 * pad)) * (xMax - xMin), yMin + ((h - pad - py) / (h - 2 * pad)) * (yMax - yMin)];
  return { toPx, fromPx, w, h, pad, xMax, yMax, xMin, yMin };
}

/** Gridlines, axes and tick labels for a scale from makeScale. */
export function Axes({ scale, xStep = 1, yStep = 1, xLabel, yLabel }) {
  const { toPx, w, h, pad, xMax, yMax, xMin, yMin } = scale;
  const xs = []; for (let x = xMin; x <= xMax + 1e-9; x += xStep) xs.push(x);
  const ys = []; for (let y = yMin; y <= yMax + 1e-9; y += yStep) ys.push(y);
  const text = { fill: AMBER_DIM, fontSize: 11, fontFamily: MONO };
  return (
    <g>
      {xs.map((x) => { const [px] = toPx(x, 0); return <line key={`gx${x}`} x1={px} x2={px} y1={pad} y2={h - pad} stroke={GRID} strokeWidth="0.5" />; })}
      {ys.map((y) => { const [, py] = toPx(0, y); return <line key={`gy${y}`} x1={pad} x2={w - pad} y1={py} y2={py} stroke={GRID} strokeWidth="0.5" />; })}
      <line x1={pad} x2={w - pad} y1={h - pad} y2={h - pad} stroke={AMBER_DIM} strokeWidth="1.5" />
      <line x1={pad} x2={pad} y1={pad} y2={h - pad} stroke={AMBER_DIM} strokeWidth="1.5" />
      {xs.map((x) => { const [px] = toPx(x, 0); return <text key={`tx${x}`} x={px} y={h - pad + 16} textAnchor="middle" {...text}>{x}</text>; })}
      {ys.map((y) => { const [, py] = toPx(0, y); return <text key={`ty${y}`} x={pad - 8} y={py + 3} textAnchor="end" {...text}>{y}</text>; })}
      {xLabel && <text x={w - pad} y={h - pad + 32} textAnchor="end" {...text}>{xLabel}</text>}
      {yLabel && <text x={pad} y={pad - 12} textAnchor="start" {...text}>{yLabel}</text>}
    </g>
  );
}

/**
 * Pointer-drag inside an SVG, reported in viewBox coordinates.
 * Usage: const drag = useSvgDrag((id, x, y) => ...);
 *   <svg ref={drag.ref} {...drag.svgProps}> <circle {...drag.handle("a")} /> </svg>
 */
export function useSvgDrag(onDrag) {
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  const locate = (e) => {
    const svg = ref.current; const r = svg.getBoundingClientRect(); const vb = svg.viewBox.baseVal;
    return [((e.clientX - r.left) / r.width) * vb.width, ((e.clientY - r.top) / r.height) * vb.height];
  };
  return {
    ref, active,
    svgProps: {
      onPointerMove: (e) => { if (active != null) onDrag(active, ...locate(e)); },
      onPointerUp: () => setActive(null),
      onPointerLeave: () => setActive(null),
      // Without touchAction none, dragging on a phone scrolls the page instead.
      style: { touchAction: "none", width: "100%", height: "auto", display: "block", cursor: active != null ? "grabbing" : "default" },
    },
    handle: (id) => ({
      onPointerDown: (e) => { e.preventDefault(); setActive(id); onDrag(id, ...locate(e)); },
      style: { cursor: "grab" },
    }),
  };
}
