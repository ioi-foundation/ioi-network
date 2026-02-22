# Network TPS Widget: Chart Bar Roles & Animation Concept

**Purpose:** Define how the 2 numerical values (red area) drive the 8 chart bars (blue area) with clear roles and animation behavior for implementation by design/development.

---

## 1. The Two Source Values (Red Part)

| Value | Example | Meaning |
|-------|--------|--------|
| **Current TPS** | `1,055` | Transactions per second right now. |
| **Peak TPS** | `Peak: ↑1612` | Highest TPS (e.g. recent or session peak). |

Design constraint: only these two values update; the 8 bars must derive from them in a consistent, explainable way.

---

## 2. Role of Each of the 8 Chart Bars

Give each bar a single, named role so the widget tells a short story: **current load**, **peak reference**, **utilization**, **headroom**, and four **scale/digit** bars.

| Bar | Role | Drives from | Designer intent |
|-----|------|-------------|-----------------|
| **Bar 1** | **Current load** | Current TPS (normalized) | “How high is load right now?” (e.g. 1055 → fill %) |
| **Bar 2** | **Peak reference** | Peak TPS (normalized) | “Where is the peak on the scale?” (e.g. 1612 → fill %) |
| **Bar 3** | **Utilization** | Current ÷ Peak | “How much of peak are we using?” (1055/1612 ≈ 65%) |
| **Bar 4** | **Headroom** | 1 − (Current ÷ Peak) | “How much room to peak?” (inverse of utilization) |
| **Bar 5** | **Current – thousands** | First digit of current (e.g. 1) | “Magnitude band” of current TPS |
| **Bar 6** | **Current – hundreds** | Next digits / segment of current | “Finer scale” of current |
| **Bar 7** | **Peak – thousands** | First digit of peak (e.g. 1) | “Magnitude band” of peak |
| **Bar 8** | **Peak – hundreds** | Next digits / segment of peak | “Finer scale” of peak |

This way: **2 values → 8 bars** by splitting *current TPS* into load + utilization + digits, and *peak TPS* into reference + headroom + digits.

---

## 3. How Each Bar Gets Its Length (Logic for Designers)

Describe in plain language how bar fill (e.g. 0–100%) is determined. No code, only rules.

### Bar 1 — Current load

- **Idea:** Fill reflects *current TPS* on a fixed scale.
- **Rule:** Choose a “max TPS” (e.g. 2000 or 1.2× typical peak). Map current TPS to 0–100% (e.g. 0 → 0%, 2000 → 100%). So 1055 → ~53% if max is 2000.
- **On update:** When current TPS changes, bar animates to the new length.

### Bar 2 — Peak reference

- **Idea:** Fill shows *where the peak sits* on the same scale.
- **Rule:** Use the same “max TPS” as Bar 1. Map peak TPS to 0–100%. So 1612 → ~81% if max is 2000.
- **On update:** When peak TPS changes, bar animates to the new length.

### Bar 3 — Utilization

- **Idea:** Fill = *current ÷ peak* (how much of peak we’re using).
- **Rule:** 0% if peak is 0; else (current / peak) capped at 100%. So 1055/1612 ≈ 65%.
- **On update:** When either current or peak changes, bar animates to the new length.

### Bar 4 — Headroom

- **Idea:** Fill = *room left until peak* (inverse of utilization).
- **Rule:** 100% − utilization, or (peak − current) / peak capped at 0–100%. So ~35% when utilization is 65%.
- **On update:** When either value changes, bar animates to the new length.

### Bar 5 — Current (thousands)

- **Idea:** Fill reflects the *thousands digit* of current TPS (magnitude band).
- **Rule:** Map digit 0–9 to 0–100% (e.g. 1 → 10%, 2 → 20%). Or use (current / 1000) capped at 0–1 then to %. So 1055 → 1.x → ~10% or use 1 → 10%.
- **On update:** When current TPS changes, bar animates to the new length.

### Bar 6 — Current (hundreds / finer)

- **Idea:** Fill reflects the *hundreds (and below)* part of current TPS.
- **Rule:** e.g. (current % 1000) / 1000 → 0–100%. So 1055 → 55 → 5.5% of 1000 → 5.5%, or normalize to 0–100% for “hundreds” only: (55/100) = 55%.
- **On update:** When current TPS changes, bar animates to the new length.

### Bar 7 — Peak (thousands)

- **Idea:** Same as Bar 5 but for *peak TPS* (e.g. 1612 → 1 → 10%).
- **Rule:** Same mapping as Bar 5, using peak value.
- **On update:** When peak TPS changes, bar animates to the new length.

### Bar 8 — Peak (hundreds / finer)

- **Idea:** Same as Bar 6 but for *peak TPS* (e.g. 1612 → 612/1000 or 12/100).
- **Rule:** Same mapping as Bar 6, using peak value.
- **On update:** When peak TPS changes, bar animates to the new length.

---

## 4. Animation Behavior (What the User Should Feel)

- **Trigger:** Any change in current TPS or peak TPS.
- **Motion:** Bars animate *to* the new target length (smooth ease; duration ~200–400 ms). No flicker; one continuous motion per value change.
- **Segments:** If bars use multiple colors (e.g. grey track + neon green fill), animate the *fill* length; track can stay fixed.
- **Order:** Optionally stagger bar updates (e.g. Bar 1–2 first, then 3–4, then 5–8) for a subtle “cascade” feel, or update all in sync for clarity.
- **Peak vs current:** When current approaches or exceeds peak, Bar 3 (utilization) nears or hits 100% and Bar 4 (headroom) nears 0%—designer can add a brief highlight or color shift at 100% utilization if desired.

---

## 5. Summary Table for Handoff

| Bar | Role | Driven by | When it changes |
|-----|------|-----------|-----------------|
| 1 | Current load | Current TPS (normalized to max) | Every current TPS update |
| 2 | Peak reference | Peak TPS (normalized to max) | Every peak TPS update |
| 3 | Utilization | Current ÷ Peak | Every current or peak update |
| 4 | Headroom | 1 − (Current ÷ Peak) | Every current or peak update |
| 5 | Current (thousands) | Current TPS magnitude band | Every current TPS update |
| 6 | Current (hundreds) | Current TPS finer scale | Every current TPS update |
| 7 | Peak (thousands) | Peak TPS magnitude band | Every peak TPS update |
| 8 | Peak (hundreds) | Peak TPS finer scale | Every peak TPS update |

---

## 6. Optional Design Notes

- **Max TPS:** Define a single “max TPS” (e.g. 2000) for Bars 1 and 2 so both current and peak sit on the same scale; adjust if real data often exceeds it.
- **Empty / zero:** When peak is 0, utilization and headroom can show 0% or a neutral state; when current is 0, Bar 1 is empty and utilization is 0%.
- **Color:** e.g. same neon green for all fills; or Bar 3/4 in a different tint (e.g. amber when utilization > 90%) to signal “near peak.”
- **Accessibility:** One short sentence for screen readers: “Network TPS: current load, peak reference, utilization, headroom, and current/peak scale bars.”

This gives your designer a single reference: **which value drives which bar**, **how length is determined**, and **how animations should behave** when the red numbers update.
