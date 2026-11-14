# Writing a widget

A widget is one React component in the explainer's own folder. It exists to let the reader
find something out. Before writing one, be able to finish the sentence: *"When they drag ___,
they'll see ___, and that's the idea."*

## Rules

- **Import furniture from `@kit`**, never redefine it: colors (`AMBER`, `RED`, `BLUE`,
  `PAPER`, `GRID`, `PANEL`, `AMBER_DIM`, `INK`), fonts (`MONO`, `SERIF`), layout (`LabGrid`,
  `Figure`, `Stack`), instruments (`Readout`, `ReadoutRow`, `Stat`, `Slider`, `Button`,
  `ButtonRow`, `Verdict`), plotting (`makeScale`, `Axes`), behaviour (`useSvgDrag`,
  `usePlayback`). Read `src/kit/index.jsx`; it's short.
- **Color has meaning.** Amber = the answer, the optimum, the active thing. Red = wrong,
  alarm, the cost. Blue = the reader's own probe or a third category. Don't use color
  decoratively, and don't introduce new ones.
- **Compute, don't hardcode.** Derive every displayed number from state. The model should be
  a few plain functions at the top of the file that you could test by hand.
- **No hidden state, no hover.** Everything that matters is labelled and visible. Tooltips
  don't exist on a phone.
- **Give it a `Verdict`.** A sentence under the readout that changes with state and says, in
  words, what the reader is currently looking at. This is what turns fiddling into learning.
- **Make the interesting states reachable.** If the insight lives at a knife-edge (a tie, a
  phase change, a threshold), snap to it so a finger can land on it.
- **Touch works.** Drag via `useSvgDrag`; give drag handles an invisible hit circle of
  radius ≥ 18 viewBox units over the visible dot. Always pair a drag with a `Slider` or
  buttons that reach the same states.
- **SVG is responsive by viewBox.** Draw at a fixed viewBox (~520 wide), let it scale. SVG
  text ≥ 11 units so it survives being scaled down to a phone.
- **It renders on the server first.** No `window`/`document` at module scope or during render;
  put those in effects or handlers. Initial state must be deterministic (no `Math.random()`
  in initial render — seed it).
- **Motion serves comprehension.** `framer-motion` is installed. Animate a transition when
  seeing the in-between states explains something (a polytope shattering into lattice
  points); otherwise don't.

## Interaction patterns that have worked

- Drag two things and watch a property of the relationship between them.
- Toggle one assumption and watch the geometry change.
- Step through an algorithm with `usePlayback` (Reset / Back / Play / Next), with the current
  step's reasoning shown in words.
- Overlay two competing methods on the same picture.
- Let the reader try to break a claim, and show them the scoreboard (`lp-corner-optimum`).

## Skeleton

```jsx
import { useState } from "react";
import { AMBER, Axes, Figure, LabGrid, Readout, ReadoutRow, Slider, Stack, Verdict, makeScale, useSvgDrag } from "@kit";

const S = makeScale({ w: 520, h: 460, pad: 44, xMax: 8, yMax: 7 });

export default function ThingLab() {
  const [k, setK] = useState(3);
  const result = model(k); // plain function, defined above
  const drag = useSvgDrag((id, px, py) => { const [x] = S.fromPx(px, py); setK(clamp(x)); });
  return (
    <LabGrid>
      <Figure>
        <svg ref={drag.ref} viewBox={`0 0 ${S.w} ${S.h}`} {...drag.svgProps}>
          <Axes scale={S} xLabel="…" yLabel="…" />
          {/* the picture */}
        </svg>
      </Figure>
      <Stack>
        <Slider label="…" value={k} min={0} max={8} step={0.1} onChange={setK} />
        <Readout><ReadoutRow label="…" value={result.toFixed(2)} tone="accent" /></Readout>
        <Verdict>{/* one sentence that depends on state */}</Verdict>
      </Stack>
    </LabGrid>
  );
}
```
