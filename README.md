# TrailBoard

A small hiking-trail dashboard (Vite + vanilla TypeScript) that starts out **slow on purpose**, then gets fixed step by step, and finally gets a performance gate in GitHub Actions so it can't quietly get slow again.

Made for the AIGeeks video **"Fix a Slow Web App — Then Lock the Speed Forever"** by Kashif.

## Run it

Requires Node 22+.

```bash
npm install
npm run build
npm run preview   # http://localhost:4173  (mock API adds 250-350 ms per request)
```

Measure it the way users feel it: Chrome DevTools, **Slow 4G + 4x CPU slowdown**, Incognito window.

## Branches

| Branch | What changes |
|---|---|
| `baseline` | The slow app: 3 sequential requests, a 2.6 MB lazy-loaded PNG hero with no size, a late banner with no reserved space, a sort button that blocks the main thread and thrashes layout, and a bundle with all of lodash, moment + every locale, and chart.js loaded up front. |
| `fix-critical-path` | Parallel requests with `Promise.all`, AVIF/WebP hero with `fetchpriority="high"` and real dimensions, reserved space for the banner, conditions widget loaded with `IntersectionObserver`. |
| `fix-inp` | Sort click: no layout reads in a loop, work split into chunks with `scheduler.yield()` (with a `setTimeout` fallback). |
| `fix-bundle` | Treemap with `rollup-plugin-visualizer`, ES-module `lodash-es` + `Intl` instead of moment, chart.js loaded with `import()` only when the Elevation tab opens. |
| `ci` / `main` | Two-layer performance gate: `size-limit` (deterministic gzipped JS budget) + Lighthouse CI (`@lhci/cli`, 3 runs, median) in `.github/workflows/perf.yml`. |
| `challenge` | Something slipped back in and CI is red. Can you find it? |

## The challenge

Fork this repo, switch to the `challenge` branch, and find the one change that breaks the performance budget. Tell us what you caught in the video comments.

## Notes on Lighthouse CI today

- Lighthouse 12 removed `budgets.json` / `--budget-path`. Budgets now live in `lighthouserc.json` assertions.
- `resource-summary:*:size` values are in **bytes**, not KB.
- Lighthouse 13 replaced many older audit IDs with `*-insight` audits, so old config files can fail.
- Run `npx @lhci/cli autorun` directly on Node 22+.
