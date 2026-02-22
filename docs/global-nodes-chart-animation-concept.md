# Global Nodes Widget: Node Graph Curves – Roles & Animation Concept

**Purpose:** Define how the 2 numerical values (red area) drive the node graph lines / curves (blue area) so that **mock data modifies the curves** in a clear, consistent way. Same principles as Block Height, Network TPS, and Active Agents: each curve has one role, derived from the two values, with defined animation behavior.

**Client requirement:** *"Mock data should modify curve of node graph lines, and same principles applied per the aforementioned."*

---

## 1. The Two Source Values (Red Part)

| Value | Example | Meaning |
|-------|--------|--------|
| **Global nodes count** | `4,129` | Number of nodes in the network right now. |
| **Uptime** | `Uptime: 99.99%` | Reliability/availability (0–100%); indicates network health. |

Design constraint: only these two values update; the curves must derive from them so that when mock data (e.g. 4,129 and 99.99%) changes, the **curves are modified**—shape, amplitude, position, or visibility—in a consistent, explainable way.

---

## 2. Role of Each Curve (Blue Part – Node Graph Lines)

Give each curve a single, named role so the widget tells a short story: **scale**, **health**, **magnitude**, **stability**, **blend**, and **trend**. Same principle as “one role per bar” in the other widgets.

| Curve | Role | Drives from | How mock data modifies the curve |
|-------|------|-------------|-----------------------------------|
| **Curve 1** | **Node scale** | Global nodes count (normalized) | **Amplitude** or **vertical range**: e.g. 4,129 on 0–5,000 → curve height or Y-scale. More nodes = taller/higher curve. |
| **Curve 2** | **Uptime / health** | Uptime % (99.99%) | **Amplitude** or **smoothness**: e.g. 99.99% → curve near “full” height and smooth; lower uptime = lower or noisier curve. |
| **Curve 3** | **Magnitude (thousands)** | First digit(s) of count (e.g. 4) | **Vertical offset** or **baseline**: e.g. 4 in 4,129 → curve shifted up/down or second “tier” of the line. Count change → curve moves. |
| **Curve 4** | **Finer scale (hundreds)** | Last digits (e.g. 129) | **Wave amplitude** or **oscillation**: e.g. 129/1000 → 12.9% modulation of a base wave. Count change → wave depth changes. |
| **Curve 5** | **Stability** | Uptime % | **Smoothness / noise**: e.g. 99.99% = very smooth line; 95% = slightly wobbly; &lt;90% = more jagged. Uptime modifies the “curve” of the line. |
| **Curve 6** | **Blend / network state** | Count + uptime combined | **Shape or phase**: e.g. (count % 1000)/1000 + uptime/100 → drives a combined wave (phase or blend). Both values modify this curve. |

If you have 5 curves, merge two roles (e.g. Curve 5 + 6); if more than 6, split (e.g. “count trend” vs “uptime trend”). Keep the principle: **each curve = one role, driven by one or both values, so mock data clearly modifies that curve.**

---

## 3. How Mock Data Modifies Each Curve (Logic for Designers)

Describe in plain language **how** the two values change the curve: amplitude, vertical offset, smoothness, phase, or visibility. No code, only rules.

### Curve 1 — Node scale

- **Idea:** The curve’s **vertical extent** (amplitude or Y-range) reflects node count.
- **Rule:** Choose a max nodes (e.g. 5,000). Map 4,129 → 82.6%. Use that % to scale the curve’s amplitude (e.g. 82.6% of max height). When mock data changes the count, **modify the curve** by recalculating amplitude and animating to the new height.
- **On update:** New count → new amplitude → curve animates to new shape/height.

### Curve 2 — Uptime / health

- **Idea:** The curve’s **height or “fullness”** reflects uptime.
- **Rule:** 99.99% → curve at “100%” of its design height; 90% uptime → curve at 90% height; 50% → half. When uptime changes, **modify the curve** by scaling its Y-values or cap. When mock data changes uptime, curve animates to new level.
- **On update:** New uptime % → curve animates to new level.

### Curve 3 — Magnitude (thousands)

- **Idea:** The **vertical offset** (baseline) of the curve reflects the “thousands” part of the count.
- **Rule:** e.g. 4 in 4,129 → 4/10 = 40% of an offset range (or 4 × 10% = 40%). **Modify the curve** by moving it up/down as this value changes. When count crosses 5,000, offset steps to next tier.
- **On update:** New count → new offset → curve animates vertically.

### Curve 4 — Finer scale (hundreds)

- **Idea:** The **oscillation depth** (wave amplitude) of the curve reflects the last digits of the count.
- **Rule:** e.g. (4,129 % 1000) / 1000 = 0.129 → 12.9% of a max wave depth. **Modify the curve** by increasing/decreasing how much the line “waves” (amplitude of a sine-like component). When count updates, wave depth updates.
- **On update:** New count → new wave depth → curve animates to new shape.

### Curve 5 — Stability

- **Idea:** **Smoothness** of the line reflects uptime (high uptime = stable = smooth).
- **Rule:** 99.99% → very smooth curve (low noise); 95% → add slight variation; &lt;90% → more jagged or noisy. **Modify the curve** by changing filter/smoothing or noise level so the same base data looks smoother or rougher. When mock uptime changes, curve smoothness animates or transitions.
- **On update:** New uptime → curve transitions to smoother or rougher path.

### Curve 6 — Blend / network state

- **Idea:** A **combined** signal from count + uptime (e.g. “network state”).
- **Rule:** e.g. blend = (count/5000)×0.5 + (uptime/100)×0.5. Use blend to set **phase** of a wave, or **shape** (e.g. which segment of a template curve is active). **Modify the curve** so when either value changes, this curve’s shape or phase shifts.
- **On update:** New count or uptime → curve animates to new phase/shape.

---

## 4. Animation Behavior (What the User Should Feel)

- **Trigger:** Any change in global nodes count or uptime % (mock data updates).
- **Motion:** Curves **animate to their new shape/position**—no sudden jumps. Smooth transition (~200–400 ms): amplitude, offset, smoothness, or phase change over time. Same principle as “bars animate to new length” in the other widgets.
- **Consistency:** When mock data modifies a value, **every curve that depends on it** updates together; the graph feels like one coherent response to the new numbers.
- **Stagger (optional):** Slight delay between curves (e.g. Curve 1 → 2 → 3…) for a subtle cascade, or all in sync for clarity.
- **Glow / color:** If curves use glow or color, keep meaning consistent (e.g. green = health, blue = scale) so “modified by data” is readable.

---

## 5. Summary Table for Handoff

| Curve | Role | Driven by | How mock data modifies the curve |
|-------|------|-----------|-----------------------------------|
| 1 | Node scale | Nodes count | Amplitude / vertical range |
| 2 | Uptime / health | Uptime % | Height / fullness / level |
| 3 | Magnitude (thousands) | Nodes count | Vertical offset / baseline |
| 4 | Finer scale (hundreds) | Nodes count | Wave amplitude / oscillation depth |
| 5 | Stability | Uptime % | Smoothness / noise (smooth vs jagged) |
| 6 | Blend / network state | Count + uptime | Phase / combined shape |

---

## 6. Same Principles as the Other Widgets (Aforementioned)

- **Two values only** — Global nodes count and Uptime % are the only inputs; all curve changes come from them.
- **One role per curve** — Each line has a single, named role (scale, health, magnitude, stability, blend, trend).
- **Mock data modifies the curve** — When count or uptime changes, the corresponding curves change in a defined way (amplitude, offset, smoothness, phase).
- **Animate, don’t jump** — Curves transition smoothly to the new shape/position when data updates.
- **Explainable** — A designer or developer can say: “Curve 2 is uptime; when uptime goes down, that curve’s height goes down.”

---

## 7. Optional Design Notes

- **Max nodes:** Define a max (e.g. 5,000) for normalizing Curve 1 and 3 so percentages are consistent.
- **Uptime scale:** 0–100% is fixed; define how 99.99% vs 99% vs 90% maps to curve level and smoothness.
- **Empty state:** If nodes = 0 or uptime = 0%, define curve state (e.g. flat, or minimal visibility).
- **Accessibility:** One short sentence: “Global nodes: [count], uptime [%]; curves show scale, health, stability, and network state.”

This gives your designer a single reference so that **mock data modifies the curve of each node graph line** in a clear, consistent way, with the same principles applied as in the Block Height, Network TPS, and Active Agents widgets.
