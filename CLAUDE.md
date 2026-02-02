# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**expense-tracker-ai** is a Next.js expense tracking application demonstrating the **Best-of-N Pattern** for feature development.

### What is Best-of-N Pattern?

Instead of implementing one solution and hoping it's the best, we:
1. **Build multiple valid implementations** (V1, V2, V3) quickly
2. **Compare them** against clear criteria (UX, complexity, scalability)
3. **Pick a winner** and merge it (or keep alternatives as reference)

This approach leverages AI's speed to explore solution space rather than committing to one path upfront.

---

## Repository Structure

```
expense-tracker-ai/
├── README.md                  # Public documentation (Best-of-N overview)
├── CLAUDE.md                  # This file (development guidance)
├── .github/                   # GitHub templates
│   ├── pull_request_template.md
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md
│       └── feature_request.md
├── web/                       # Next.js application
│   ├── src/
│   │   ├── app/              # Next.js 13+ app directory
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utility functions
│   ├── public/               # Static assets
│   ├── package.json
│   └── POLISH_SUMMARY.md     # UI/UX improvements log
└── .claude/                   # Claude Code settings
```

---

## Branch Strategy (Best-of-N Implementation)

### Main Branches

| Branch | Purpose | Status | Recommendation |
|--------|---------|--------|----------------|
| `main` | Baseline + Documentation | ✅ Stable | Safe to work on |
| `feature-data-export-v1` | Simple CSV export (baseline) | ✅ Complete | Reference only |
| `feature-data-export-v2` | Advanced export modal | ✅ Complete | **Winner** - Merge candidate |
| `feature-data-export-v3` | Cloud export concept | ✅ Complete | Future/Learning |

### Version Comparison

**V1 (Simple):**
- Single "Export CSV" button
- Minimal code (~35 lines)
- Fast to ship, limited UX
- **Use case:** MVP, quick prototypes

**V2 (Advanced):** ⭐ **Recommended**
- Export modal with filters, preview, multiple formats (CSV/JSON/PDF)
- Date range & category filtering
- Export summary & preview table
- **Use case:** Production, professional tools

**V3 (Cloud):**
- Multi-tab interface (Export, Integrations, Schedule, History, Share)
- Mock integrations (Google Sheets, Dropbox, etc.)
- Scheduling & sharing features
- **Use case:** SaaS products, enterprise scale

### Pull Requests
- PR #1: V2 → main (https://github.com/thomas-sutter/expense-tracker-ai/pull/1)
- PR #2: V3 → main (https://github.com/thomas-sutter/expense-tracker-ai/pull/2)

---

## Development Commands

### First Time Setup

```bash
# Clone repository
git clone https://github.com/thomas-sutter/expense-tracker-ai.git
cd expense-tracker-ai

# Navigate to web app
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Access at: http://localhost:3000

### Common Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Git operations
git branch -a            # List all branches
git checkout <branch>    # Switch branches (e.g., feature-data-export-v2)
git log --oneline        # View commit history
```

### Testing Different Versions

```bash
# Test V1 (Simple)
git checkout feature-data-export-v1
npm run dev
# → Click "Export CSV" button

# Test V2 (Advanced)
git checkout feature-data-export-v2
npm run dev
# → Click "Export Data" → Modal with options

# Test V3 (Cloud)
git checkout feature-data-export-v3
npm run dev
# → Click "☁️ Cloud Export" → Multi-tab interface

# Return to main
git checkout main
```

---

## Architecture

### Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks (useState, useEffect, useMemo)
- **Data Storage:** localStorage (client-side only, no backend)
- **Build Tool:** Webpack (via Next.js)

### Key Patterns

**1. Component Structure:**
```
src/components/
├── ui/                    # Reusable UI primitives
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   └── Toast.tsx
├── DashboardCards.tsx     # Summary statistics
├── CategoryChart.tsx      # Visualization
├── ExpenseList.tsx        # Table with filters
├── ExpenseForm.tsx        # Add/Edit form
├── ExportModal.tsx        # V2: Advanced export (on v2 branch)
└── CloudExportModal.tsx   # V3: Cloud export (on v3 branch)
```

**2. Data Flow:**
```
useExpenses hook (src/hooks/useExpenses.ts)
    ↓
localStorage (persistent storage)
    ↓
React State (expenses array)
    ↓
Components (DashboardCards, ExpenseList, etc.)
```

**3. Type Safety:**
```typescript
// src/types/expense.ts
export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
}
```

### File Naming Conventions

- **Components:** PascalCase (e.g., `ExpenseForm.tsx`)
- **Utilities:** camelCase (e.g., `formatCurrency.ts`)
- **Types:** camelCase files, PascalCase types (e.g., `expense.ts` → `Expense`)
- **Hooks:** camelCase with `use` prefix (e.g., `useExpenses.ts`)

---

## Known Issues & Solutions

### 1. Select Component: `Cannot read properties of undefined (reading 'map')`

**Problem:** Select component crashes if `options` prop is undefined.

**Solution (implemented on v2 branch):**
```typescript
// src/components/ui/Select.tsx
interface SelectProps {
  options?: Option[];  // Make optional
  children?: ReactNode; // Support children pattern
}

export const Select = ({ options = [], children, ...props }) => {
  const hasChildren = Children.count(children) > 0;
  return (
    <select {...props}>
      {hasChildren ? children : options.map(...)}
    </select>
  );
};
```

**Status:** ✅ Fixed on `feature-data-export-v2` branch with defensive programming.

### 2. Hydration Mismatch (Resolved)

**Problem:** Server/client mismatch with dates and localStorage.

**Solution:** All date/locale formatting happens client-side only (useEffect).

**Status:** ✅ Resolved (see web/POLISH_SUMMARY.md)

### 3. Expenses Disappearing (localStorage)

**Problem:** Expenses vanish on page reload.

**Cause:** localStorage can be cleared by browser/incognito mode.

**Workaround:** Re-add test expenses or implement backend storage.

---

## Important Conventions

### 1. Locale & Formatting

**Currency:** CHF (Swiss Franc) with de-CH locale
```typescript
// src/utils/formatCurrency.ts
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
  }).format(amount);
}
```

**Dates:** de-CH locale (DD.MM.YYYY)

### 2. Git Commit Messages

Follow conventional commits:
```
feat: add export modal with filters
fix: resolve Select component crash
refactor: make Select defensive with children support
docs: update CLAUDE.md with Best-of-N documentation
```

### 3. Component Design

- **Minimal props:** Only pass what's needed
- **Composition over configuration:** Use children when appropriate
- **Defensive programming:** Default values, null checks
- **TypeScript strict mode:** No `any` types

### 4. Best-of-N Workflow

When implementing a new feature with Best-of-N:

```bash
# 1. Start from clean main
git checkout main
git pull origin main

# 2. Create variant branches
git checkout -b feature/my-feature-v1
# Implement simple version, commit
git checkout main

git checkout -b feature/my-feature-v2
# Implement advanced version, commit
git checkout main

git checkout -b feature/my-feature-v3
# Implement alternative version, commit

# 3. Compare via PRs
gh pr create --base main --head feature/my-feature-v1
gh pr create --base main --head feature/my-feature-v2
gh pr create --base main --head feature/my-feature-v3

# 4. Review, pick winner, merge
gh pr merge <winner-pr-number>

# 5. Clean up (optional)
git branch -d feature/my-feature-v1 feature/my-feature-v3
```

---

## Lessons Learned (Best-of-N Export Feature)

### What Worked Well ✅

1. **Parallel exploration:** Building V1, V2, V3 simultaneously revealed tradeoffs clearly
2. **Branch isolation:** No merge conflicts, clean comparisons
3. **Clear criteria:** Evaluating on UX, complexity, scalability made decision obvious
4. **Git PRs:** Side-by-side diffs were invaluable for comparison
5. **Defensive programming:** V2's Select fix prevented future bugs

### What Could Improve 🔄

1. **V1 baseline:** Should have created a separate commit for V1 before adding docs to main
2. **Screenshots:** Would help PRs for visual comparison
3. **Performance metrics:** Could measure bundle size, render time for each version
4. **User testing:** Could have gotten feedback on V2 vs V3 UX

### Key Insights 💡

1. **Speed wins:** V1 took 15 minutes, V2 took 45 minutes, V3 took 60 minutes - but V2 was best value
2. **Sweet spot exists:** V2 hit the sweet spot (professional UX without overkill)
3. **Context matters:** V3 is "best" for enterprise, but overkill for this app
4. **AI enables this:** Best-of-N only works because AI can implement 3 versions quickly

---

## Future Development

### Potential Features

- **Backend integration:** Replace localStorage with database (Supabase, Firebase)
- **Authentication:** User accounts and data isolation
- **AI features:** Expense categorization, insights, predictions
- **Real exports:** Implement actual Google Sheets, Dropbox integrations (V3)
- **Mobile app:** React Native version
- **Collaborative:** Multi-user expense sharing

### Recommended Next Steps

1. **Merge V2 to main** (winner of Best-of-N)
2. **Add tests** (Jest + React Testing Library)
3. **Backend API** (Next.js API routes + database)
4. **Deploy to Vercel** (optional, for portfolio)

---

## Tips for Working with This Repo

### For Claude Code Sessions

1. **Always read CLAUDE.md first** to understand context
2. **Check current branch** before making changes
3. **Use git status often** to avoid conflicts
4. **Test locally** with `npm run dev` before committing
5. **Follow conventions** (TypeScript strict, conventional commits)

### For New Contributors

1. Read README.md for high-level overview
2. Read CLAUDE.md (this file) for technical details
3. Review PRs #1 and #2 to see Best-of-N comparison
4. Check web/POLISH_SUMMARY.md for UI/UX context
5. Run `npm install && npm run dev` to start development

### For Debugging

```bash
# Common issues:

# 1. Port 3000 in use
lsof -ti:3000 | xargs kill -9
npm run dev

# 2. Dependencies out of sync
rm -rf node_modules package-lock.json
npm install

# 3. TypeScript errors
npm run lint
# Fix errors, then retry

# 4. Git branch confusion
git branch -vv        # Show current branch + tracking
git status            # Show modified files
git log --oneline -5  # Show recent commits
```

---

## Contact & Resources

- **GitHub:** https://github.com/thomas-sutter/expense-tracker-ai
- **PRs:** [V2](https://github.com/thomas-sutter/expense-tracker-ai/pull/1), [V3](https://github.com/thomas-sutter/expense-tracker-ai/pull/2)
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

*Last Updated: 2026-02-02*
*Best-of-N Pattern Exercise - Complete ✅*
