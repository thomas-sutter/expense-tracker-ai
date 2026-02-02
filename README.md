# expense-tracker-ai — Best-of-N Export Pattern (V1 → V2 → V3)

A small expense tracker project used to demonstrate the **Best-of-N Pattern**: solving the same feature in multiple approaches, then comparing results and selecting a winner.

## What's inside
This repo contains **three alternative export implementations**, each on its own branch:

- **V1 (Simple)**: `feature-data-export-v1` — minimal export button (quick & simple)
- **V2 (Advanced)**: `feature-data-export-v2` — export modal with filters, preview, formats (best UX)
- **V3 (Cloud)**: `feature-data-export-v3` — direction for a cloud/export service approach (scalable)

> Tip: Open PRs to compare versions side-by-side (Best-of-N is easiest to understand via diffs).

---

## Best-of-N Pattern (how we use it here)
Instead of arguing about the "best" solution upfront, we:
1. Build multiple valid solutions quickly (V1, V2, V3)
2. Compare them against clear criteria (UX, maintainability, scalability, risk)
3. Pick a winner and merge it (or keep alternatives as reference)

---

## Evaluation (summary)

| Criterion | V1 (Simple) | V2 (Advanced) | V3 (Cloud) |
|---|---:|---:|---:|
| Time-to-ship | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐☆ | ⭐⭐☆☆☆ |
| User experience | ⭐⭐☆☆☆ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆ |
| Maintainability | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐☆ | ⭐⭐⭐⭐☆ |
| Scalability (large data / multi-user) | ⭐⭐☆☆☆ | ⭐⭐⭐☆☆ | ⭐⭐⭐⭐⭐ |
| Risk / complexity | ⭐⭐⭐⭐⭐ | ⭐⭐⭐☆ | ⭐⭐☆☆☆ |
| **Overall (today)** | **7/10** | **9/10** | **7/10 (future)** |

**Winner (recommended): V2**
V2 provides the strongest user value now (format selection, filters, preview, summaries).
V3 is the best long-term direction if export becomes heavy (background jobs, storage, audit logs, role-based access).

---

## Known issue / note
If you see a runtime error like `Cannot read properties of undefined (reading 'map')` from `Select.tsx`, it typically means the Select component receives `options` as `undefined`.
Fix: make `options` optional and default to `[]`, and/or render `children` when provided. (See Issue template / Bug report.)

---

## Running locally

### Prerequisites
- Node.js (recommended: recent LTS)
- npm / pnpm / yarn (depending on your setup)

### Install & run
```bash
npm install
npm run dev
```
