# Active Agents Widget: Circular Chart Roles & Animation Concept

**Purpose:** Define how the 2 numerical values (red area) drive the circular chart (blue area)—arc segments, central number, and markers—with clear roles and animation behavior for implementation by design/development.

---

## 1. The Two Source Values (Red Part)

| Value | Example | Meaning |
|-------|--------|--------|
| **Active agents count** | `18,858` | Total number of active agents right now. |
| **Recent change** | `+1,024 (10m)` | Net change over the last 10 minutes (delta); indicates growth rate / momentum. |

Design constraint: only these two values update; the circular chart elements must derive from them in a consistent, explainable way.

---

## 2. Roles for the Circular Chart (Blue Part)

Treat the blue area as:

- **Central number** (e.g. 18.8) — one role
- **Arc segments** (the colored “chart bars” around the circle) — one role per segment
- **Markers** (e.g. dots on the arcs) — optional roles (e.g. “current” vs “growth”)

Give each element a single, named role so the widget tells a short story.

### Central number (e.g. 18.8)

| Element | Role | Drives from | Designer intent |
|---------|------|-------------|-----------------|
| **Center value** | **Agents in units** | Active agents count | “Agents in thousands” (18,858 → 18.8 or 18.9) or a normalized KPI (e.g. % of target). Define one rule and stick to it. |

### Arc segments (the “chart bars”)

Map the **two values** to **N segments** (e.g. 6–8). Example mapping:

| Segment | Role | Drives from | Designer intent |
|---------|------|-------------|-----------------|
| **1** | **Total scale** | Active agents (normalized) | “How full is the system?” (e.g. 18,858 on 0–20k → fill % of this arc). |
| **2** | **Growth / momentum** | Delta (+1,024) | “How strong is recent growth?” (e.g. map delta to 0–100% fill of this arc). |
| **3** | **Magnitude (thousands)** | First digits of count (e.g. 18) | “Which ‘ten-thousands’ band we’re in” (e.g. 18 → 90% of segment length). |
| **4** | **Finer scale (hundreds)** | Last digits (e.g. 858) | “Position within the thousands” (e.g. 858/1000 → 85.8% fill). |
| **5** | **Delta magnitude** | Size of +1,024 | “How big the change is” on a fixed scale (e.g. 0–2,000 → 0–100%). |
| **6** | **Activity blend** | Count + delta combined | “Overall activity” (e.g. small formula from both: count % + delta %). |
| **7** | **Headroom** | Distance to a cap (if you have one) | “Room to grow” (e.g. (20,000 − 18,858) / 20,000 → fill). |
| **8** | **Trend indicator** | Delta only (signed) | “Direction of change” (e.g. positive = fill, zero/negative = empty or different color). |

If you have fewer segments, merge roles (e.g. 1+2 = “scale + growth”); if more, split (e.g. “current” vs “10m ago” if you ever have that data).

### Markers on the arcs

| Marker | Role | Drives from | Designer intent |
|--------|------|-------------|-----------------|
| **Marker A** (e.g. blue) | **Current position** | Active agents (normalized) | Angle or position on the circle that represents “where we are” (e.g. 18,858/20,000 → 94% around the circle). |
| **Marker B** (e.g. green) | **Growth / target** | Delta (+1,024) | Position or intensity that reflects “recent growth” (e.g. high delta = marker brighter or further along an arc). |

---

## 3. How Each Element Gets Its Value (Logic for Designers)

Plain-language rules only.

### Central number (18.8)

- **Idea:** One clear rule from the agents count.
- **Rule (example):** “Agents in thousands” = count ÷ 1000, one decimal (18,858 → 18.9). Or “% of target” if you have a target (e.g. 20,000 → 94.3%). Decide one and document it.
- **On update:** When active agents count changes, central number animates (count-up or crossfade) to the new value.

### Arc segments (fill or length)

- **Segment 1 – Total scale:** Choose a max (e.g. 20,000). Fill = (count / max) × 100%. 18,858 → 94.3%.
- **Segment 2 – Growth:** Choose a “max delta” (e.g. 2,000 in 10m). Fill = (1,024 / 2,000) × 100% = 51.2%. Cap at 100%.
- **Segment 3 – Magnitude (thousands):** e.g. count ÷ 1000 = 18.85 → take 18. Map 0–20 to 0–100% (18 → 90%).
- **Segment 4 – Finer scale:** e.g. (count % 1000) / 1000 = 858/1000 → 85.8% fill.
- **Segment 5 – Delta magnitude:** Same as Segment 2 or a separate scale; e.g. |+1,024| / 2,000 → 51.2%.
- **Segment 6 – Activity blend:** e.g. (Segment1% + Segment2%) / 2, or a custom mix of count and delta.
- **Segment 7 – Headroom:** If max = 20,000, (20,000 − 18,858) / 20,000 = 5.7% fill (or “inverse” so empty = no headroom).
- **Segment 8 – Trend:** e.g. delta &gt; 0 → 100% fill (or green), delta ≤ 0 → 0% or different color.

**On update:** When either the count or the delta changes, recalculate each segment’s target fill and animate to that length (or angle) over ~200–400 ms.

### Markers

- **Marker A (current):** Angle (or position along an arc) = (count / max) × 360° (or × arc length). When count updates, animate marker to the new angle.
- **Marker B (growth):** Position or intensity from delta (e.g. delta / max_delta → angle or opacity). When delta updates, animate.

---

## 4. Animation Behavior (What the User Should Feel)

- **Trigger:** Any change in active agents count or in the delta (+1,024 (10m)).
- **Motion:** Arc segments animate *to* their new fill length (or angle); no flicker; smooth ease, ~200–400 ms. Central number counts or fades to the new value. Markers move smoothly to new positions.
- **Stagger (optional):** Slight delay between segments (e.g. 1 → 2 → 3…) or between center vs arcs for a subtle cascade.
- **Colors:** Keep segment colors consistent (e.g. blue = scale, green = growth, etc.) so “more fill” has the same meaning per segment.
- **Edge cases:** If delta is negative, define how Segment 2 and 8 look (e.g. different color or “empty”). If count is 0, define central number and segment fills (e.g. 0 or minimal).

---

## 5. Summary Table for Handoff

| Element | Role | Driven by | When it changes |
|---------|------|-----------|-----------------|
| Center number | Agents (e.g. in thousands) or KPI | Active agents count | Every count update |
| Arc 1 | Total scale | Count (normalized) | Every count update |
| Arc 2 | Growth / momentum | Delta (+1,024) | Every delta update |
| Arc 3 | Magnitude (thousands) | Count | Every count update |
| Arc 4 | Finer scale (hundreds) | Count | Every count update |
| Arc 5 | Delta magnitude | Delta | Every delta update |
| Arc 6 | Activity blend | Count + delta | Every update |
| Arc 7 | Headroom | Count (vs cap) | Every count update |
| Arc 8 | Trend (direction) | Delta | Every delta update |
| Marker A | Current position | Count | Every count update |
| Marker B | Growth indicator | Delta | Every delta update |

---

## 6. Optional Design Notes

- **Max agents / max delta:** Define “max agents” (e.g. 20,000) and “max delta” (e.g. 2,000 per 10m) so all percentages are consistent.
- **Central 18.8:** Decide once whether it’s “thousands,” “% of target,” or something else, and note it in the spec.
- **Accessibility:** One short sentence for screen readers: “Active agents: [count], change [delta] in 10 minutes; circular chart shows scale, growth, and activity.”

This gives your designer a single reference: **which value drives which chart element**, **how each segment’s fill is determined**, and **how animations behave** when the red numbers update.
