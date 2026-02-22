# Block Height Widget: Chart Bar Roles & Animation Concept

**Purpose:** Define how the 2 numerical values (blue area) drive the 4 chart bars (red area) with clear roles and animation behavior for implementation by design/development.

---

## 1. The Two Source Values (Blue Part)

| Value | Example | Meaning |
|-------|--------|--------|
| **Block height** | `#12,940,707` | Current chain block number; increases over time. |
| **Update time** | `↑0.4s` | Time since last update (e.g. 0.4 seconds ago); indicates how fresh/live the data is. |

Design constraint: only these two values update; the 4 bars must derive from them in a consistent, explainable way.

---

## 2. Role of Each of the 4 Chart Bars

Give each bar a single, named role so the widget tells a short story: **height growth**, **freshness**, **scale**, and **pulse**.

| Bar | Role | Drives from | Designer intent |
|-----|------|-------------|-----------------|
| **Bar 1** | **Height growth** | Block height *change* (delta) | “How fast blocks are being produced right now.” |
| **Bar 2** | **Data freshness** | Update time (`↑0.4s`) | “How up-to-date / live the feed is.” |
| **Bar 3** | **Height scale** | Block height *magnitude* (e.g. last digits) | “Where we are in the current ‘cycle’ of the number.” |
| **Bar 4** | **Pulse / activity** | Update time + height updates | “Overall liveliness” (e.g. recent update = active). |

This way: **2 values → 4 bars** by splitting *block height* into “growth” + “scale” and *update time* into “freshness” + “pulse.”

---

## 3. How Each Bar Gets Its Length (Logic for Designers)

Describe in plain language how bar fill (e.g. 0–100%) is determined. No code, only rules.

### Bar 1 — Height growth

- **Idea:** Fill reflects *recent block height growth* (how much the number went up since last check).
- **Rule:** Map “recent delta” to a range (e.g. 0 = no change, 1 block = small fill, N blocks = full fill). Cap at a “max normal” so huge jumps don’t break the scale.
- **On update:** When block height changes, recalculate delta → new target fill → animate bar to that length.

### Bar 2 — Data freshness

- **Idea:** Fill reflects *how fresh* the data is; fresher = fuller bar.
- **Rule:** Map update time to 0–100%: e.g. `0s` → 100% full, `1s` → lower %, `2s+` → low or empty. Exact curve (linear / stepped) is a design choice.
- **On update:** When `↑0.4s` changes (e.g. to `↑0.1s` or `↑1.2s`), bar animates to the new length.

### Bar 3 — Height scale

- **Idea:** Fill reflects *position within a repeating “cycle”* of the block height (so the bar doesn’t just grow forever).
- **Rule:** Use a modulo of the block height (e.g. last 2 or 4 digits, or `height % 10000`). Map that to 0–100% (e.g. 0 → 0%, 9999 → 100%). Bar “resets” visually as the number crosses each cycle.
- **On update:** When block height changes, new modulo → new target fill → animate (with optional “wrap” effect at cycle boundary).

### Bar 4 — Pulse / activity

- **Idea:** Fill reflects *recent activity* (data just updated = high activity).
- **Rule:** Invert or complement update time: e.g. `0s` → 100%, `1s` → 50%, `2s` → 0%. Or use a short “activity window” (e.g. “updated in last 1s?” → full, else decay).
- **On update:** When update time or block height changes, bar animates to the new “activity” level. Can add a brief “peak” then settle for a stronger “pulse” feel.

---

## 4. Animation Behavior (What the User Should Feel)

- **Trigger:** Any change in block height or update time.
- **Motion:** Bars animate *to* the new target length (smooth ease; duration ~200–400 ms). No flicker; one continuous motion per value change.
- **Segments:** If bars are multi-segment (e.g. purple / cyan / green / yellow), either:
  - animate total length and keep segment *ratios* fixed, or  
  - define segment breakpoints from the same logic (e.g. Bar 2: 0–25% purple, 25–50% cyan, etc.) so segments grow/shrink with the bar.
- **Bar 3 wrap:** When the “scale” bar crosses from 100% back to 0% (new cycle), consider a quick reset animation (e.g. short shrink then grow) so the cycle is readable.
- **Bar 4 pulse:** Optional: on each update, briefly overshoot (e.g. 100% → 90%) then settle to the true value to emphasize “something just happened.”

---

## 5. Summary Table for Handoff

| Bar | Role | Driven by | When it changes |
|-----|------|-----------|-----------------|
| 1 | Height growth | Block height delta | Every block height update |
| 2 | Data freshness | Update time (e.g. ↑0.4s) | Every time the “time since update” changes |
| 3 | Height scale | Block height modulo (cycle) | Every block height update |
| 4 | Pulse / activity | Update time (inverted/activity window) | Every update time or height change |

---

## 6. Optional Design Notes

- **Color meaning:** If segment colors are fixed (e.g. purple → cyan → green → yellow), keep the same order across bars so “fuller = more of the same story” (e.g. green/yellow = good/fresh).
- **Empty state:** Define min fill (e.g. 5% or 0%) so bars never look “off” when values are zero or very stale.
- **Accessibility:** Ensure the narrative (“growth, freshness, scale, pulse”) can be communicated in one short sentence for screen readers or tooltips.

This gives your designer a single reference: **which value drives which bar**, **how length is determined**, and **how animations should behave** when the blue numbers update.
