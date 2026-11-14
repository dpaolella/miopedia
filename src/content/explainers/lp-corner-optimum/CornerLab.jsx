import { useState } from "react";
import {
  AMBER, AMBER_DIM, BLUE, GRID, MONO, PANEL, PAPER, RED,
  Axes, Figure, LabGrid, Readout, ReadoutRow, Slider, Stack, Verdict, makeScale, useSvgDrag,
} from "@kit";

// One hour at a small hybrid site. x = wind MW sold, y = gas MW sold.
const CONSTRAINTS = [
  { a: [1, 0], b: 6, name: "wind available" },
  { a: [0, 1], b: 5, name: "gas capacity" },
  { a: [1, 1], b: 8, name: "grid connection" },
  { a: [-1, 0], b: 0, name: "wind ≥ 0" },
  { a: [0, -1], b: 0, name: "gas ≥ 0" },
];
const CORNERS = [[0, 0], [6, 0], [6, 2], [3, 5], [0, 5]];
// Angles (degrees) at which the price vector is perpendicular to an edge: the ties.
const TIES = { 0: "wind available", 45: "grid connection", 90: "gas capacity", 180: "wind ≥ 0", "-90": "gas ≥ 0" };

const S = makeScale({ w: 520, h: 460, pad: 44, xMax: 8, yMax: 7 });
const dot = (u, v) => u[0] * v[0] + u[1] * v[1];
const feasible = (p) => CONSTRAINTS.every((k) => dot(k.a, p) <= k.b + 1e-9);
const ANCHOR = [6.3, 5.3]; // where the price compass sits, in data space
const ARROW = 54; // compass arrow length, px

function snap(deg) {
  for (const t of Object.keys(TIES)) {
    const d = Math.abs(((deg - Number(t) + 540) % 360) - 180);
    if (d < 2.5) return Number(t);
  }
  return deg;
}

export default function CornerLab() {
  const [deg, setDeg] = useState(20);
  const [p, setP] = useState([2, 1.5]);

  const th = (deg * Math.PI) / 180;
  const c = [Math.cos(th), Math.sin(th)];
  const price = [10 * c[0], 10 * c[1]]; // $/MWh margin on each product

  const values = CORNERS.map((v) => dot(c, v));
  const best = Math.max(...values);
  const winners = CORNERS.filter((_, i) => best - values[i] < 1e-6);
  const tie = winners.length > 1;

  // From P, walk in the direction of improvement until a wall stops you.
  let t = Infinity, wall = null;
  for (const k of CONSTRAINTS) {
    const rate = dot(k.a, c);
    if (rate > 1e-9) {
      const tk = (k.b - dot(k.a, p)) / rate;
      if (tk < t) { t = tk; wall = k; }
    }
  }
  const hit = [p[0] + t * c[0], p[1] + t * c[1]];
  const gap = 10 * (best - dot(c, p));

  const [ax, ay] = S.toPx(...ANCHOR);
  const tip = [ax + ARROW * c[0], ay - ARROW * c[1]];

  const drag = useSvgDrag((id, px, py) => {
    if (id === "price") {
      const raw = (Math.atan2(-(py - ay), px - ax) * 180) / Math.PI;
      setDeg(snap(Math.round(raw)));
    } else {
      const q = S.fromPx(px, py);
      if (feasible(q)) setP(q);
    }
  });

  // An iso-revenue line through `pt`: perpendicular to c, drawn long and clipped.
  const iso = (pt, props) => {
    const [x, y] = S.toPx(...pt);
    const L = 900;
    return <line x1={x - L * c[1]} y1={y - L * c[0]} x2={x + L * c[1]} y2={y + L * c[0]} clipPath="url(#plot)" {...props} />;
  };

  const [ppx, ppy] = S.toPx(...p);
  const [hx, hy] = S.toPx(...hit);
  const money = (v) => `${v < 0 ? "−" : ""}$${Math.abs(v).toFixed(1)}`;
  const text = { fontFamily: MONO, fontSize: 12 };

  return (
    <LabGrid>
      <Figure>
        <svg ref={drag.ref} viewBox={`0 0 ${S.w} ${S.h}`} {...drag.svgProps} role="img"
          aria-label="Feasible region with a draggable price direction and a draggable operating point">
          <defs>
            <clipPath id="plot"><rect x={S.pad} y={S.pad} width={S.w - 2 * S.pad} height={S.h - 2 * S.pad} /></clipPath>
            <marker id="tipA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={AMBER} /></marker>
            <marker id="tipB" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill={BLUE} /></marker>
          </defs>
          <Axes scale={S} xLabel="wind sold, MW →" yLabel="↑ gas sold, MW" />

          <polygon points={CORNERS.map((v) => S.toPx(...v).join(",")).join(" ")} fill={`${AMBER}14`} stroke={AMBER_DIM} strokeWidth="1.5" />

          {/* iso-revenue lines: through P (dim) and through the optimum (bright) */}
          {iso(p, { stroke: BLUE, strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.6 })}
          {iso(winners[0], { stroke: AMBER, strokeWidth: 1.5, strokeDasharray: "6 4" })}

          {/* a tie lights up the whole edge */}
          {tie && (() => { const [a, b] = winners.map((v) => S.toPx(...v)); return <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={AMBER} strokeWidth="5" strokeLinecap="round" />; })()}

          {/* the improving walk from P to the wall it hits */}
          {t > 0.05 && <line x1={ppx} y1={ppy} x2={hx} y2={hy} stroke={BLUE} strokeWidth="1.5" markerEnd="url(#tipB)" />}

          {CORNERS.map((v, i) => {
            const [x, y] = S.toPx(...v);
            const win = best - values[i] < 1e-6;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={win ? 8 : 4} fill={win ? AMBER : PANEL} stroke={win ? PAPER : AMBER_DIM} strokeWidth={win ? 2 : 1.5} />
                <text x={x + (v[0] === 0 ? 10 : 12)} y={y - 10} fill={win ? AMBER : AMBER_DIM} {...text}>{money(10 * values[i])}</text>
              </g>
            );
          })}

          {/* draggable operating point */}
          <circle cx={ppx} cy={ppy} r={18} fill="transparent" {...drag.handle("p")} />
          <circle cx={ppx} cy={ppy} r={7} fill={BLUE} stroke={PAPER} strokeWidth="2" pointerEvents="none" />
          <text x={ppx + 12} y={ppy + 16} fill={BLUE} {...text}>P</text>

          {/* price compass */}
          <circle cx={ax} cy={ay} r={ARROW} fill="none" stroke={GRID} strokeDasharray="2 4" />
          <line x1={ax} y1={ay} x2={tip[0]} y2={tip[1]} stroke={AMBER} strokeWidth="2" markerEnd="url(#tipA)" />
          <circle cx={ax} cy={ay} r={2.5} fill={AMBER} />
          <circle cx={tip[0]} cy={tip[1]} r={20} fill="transparent" {...drag.handle("price")} />
          <circle cx={tip[0]} cy={tip[1]} r={6} fill={PANEL} stroke={AMBER} strokeWidth="2" pointerEvents="none" />
          <text x={ax} y={ay - ARROW - 10} textAnchor="middle" fill={AMBER_DIM} {...text}>DRAG: PRICES POINT THIS WAY</text>
        </svg>
      </Figure>

      <Stack>
        <Slider label="Price direction" value={deg} min={-180} max={180} step={1} display={`${deg}°`} onChange={(v) => setDeg(snap(v))} />
        <Readout>
          <ReadoutRow label="Wind margin" value={`${money(price[0])}/MWh`} tone={price[0] < 0 ? "alarm" : undefined} />
          <ReadoutRow label="Gas margin" value={`${money(price[1])}/MWh`} tone={price[1] < 0 ? "alarm" : undefined} />
          <ReadoutRow label="Best corner" value={tie ? `${winners.map((v) => `(${v})`).join(" & ")}` : `(${winners[0][0]}, ${winners[0][1]})`} tone="accent" />
          <ReadoutRow label="Best revenue" value={money(10 * best)} tone="accent" />
          <ReadoutRow label="Revenue at P" value={money(10 * dot(c, p))} />
          <ReadoutRow label="Left on the table" value={money(gap)} tone={gap > 0.05 ? "alarm" : "accent"} />
        </Readout>
        <Verdict>
          {tie ? (
            <>Prices are exactly perpendicular to the <strong>{TIES[deg]}</strong> edge, so the whole edge earns the same. Infinitely many optima — and two of them are still corners.</>
          ) : gap < 0.05 ? (
            <>P is sitting on the winning corner. Nothing left to gain.</>
          ) : t < 0.05 ? (
            <>P is pinned against <strong>{wall.name}</strong>, but it isn't done: slide along that wall toward the amber corner and revenue keeps rising.</>
          ) : (
            <>From P, the blue arrow is pure profit: every step that way earns more, until <strong>{wall.name}</strong> stops it.</>
          )}
        </Verdict>
      </Stack>
    </LabGrid>
  );
}
