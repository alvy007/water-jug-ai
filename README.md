# JugLab: Water Jug AI Solver

An interactive, responsive implementation of the **Water Jug Problem** for **Week 1: Classical AI Foundations, State-Space Search & Problem Solving**.

## Features

- Two user-configurable jug capacities (1 to 30 litres), plus a target quantity.
- **Breadth-First Search (BFS)** that guarantees the shortest sequence of actions.
- **Depth-First Search (DFS)** for comparison with BFS.
- Six valid transitions: fill jug A/B, empty jug A/B, pour A→B, pour B→A.
- State-space representation `(water_in_A, water_in_B)` with a visited-state set to avoid cycles.
- Animated jug levels, interactive step timeline, previous/next buttons, and autoplay.
- Explored/discovered state counts and maximum frontier size.
- Handles zero-target, invalid inputs, impossible targets, and GCD-based impossibility.
- Works on phones and desktops. No API, paid services, npm packages, or database required.

## Quick start

Open `index.html` in a modern browser. If your browser blocks JavaScript module imports on `file://`, start a local web server instead:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Example

- Capacity A: **4 L**
- Capacity B: **3 L**
- Target: **2 L**
- Search: **BFS**
- Expected: **4 actions** (starting state plus 4 transitions)

## How it works

Each state is `(a, b)`, with `0 ≤ a ≤ capacityA` and `0 ≤ b ≤ capacityB`.

1. Begin at `(0, 0)`.
2. Produce all legal successor states from fill, empty, and pour operations.
3. For BFS, use a FIFO queue. For DFS, use a LIFO stack.
4. Record parent pointers as new states are discovered, so the solution sequence can be reconstructed.
5. Stop when **either** jug contains the target amount.
6. Display the actions and water levels for every step.

With `A` and `B` as the jug capacities, there are at most `(A+1)(B+1)` states. Both algorithms take **O(A × B) time and space** in the worst case for positive capacities, using a constant number of successor operations per state. BFS guarantees a minimum number of moves because all transitions cost one move; DFS does not.

For a target above zero, the target is mathematically reachable only if it fits in one jug and is divisible by `gcd(A, B)`, assuming unlimited water supply and that fill/empty operations are allowed.

## Tests

Requires Node.js 18+ (no dependencies):

```bash
node --test tests/solver.test.mjs
```

## File structure

```text
water-jug-ai/
├── index.html           # Interactive application
├── favicon.svg          # Icon
├── styles.css           # Responsive styling
├── js/
│   ├── app.mjs          # DOM handling and playback
│   └── solver.mjs       # Pure BFS/DFS search algorithms
├── tests/
│   └── solver.test.mjs  # Automated tests
├── SUBMISSION.md        # Submission checklist and remarks
└── README.md
```

## Deploy for free using GitHub Pages

**Live URL:** https://alvy007.github.io/water-jug-ai/

The deployable site is in `docs/`, mirroring the top-level application. GitHub Pages publishes directly from branch `main`, folder `/docs`, without a build step. The `docs/.nojekyll` marker disables Jekyll processing.

- Repository: https://github.com/alvy007/water-jug-ai
- Pages Settings: https://github.com/alvy007/water-jug-ai/settings/pages
- Pages Source: **Deploy from a branch**, **main**, **/docs**
- Automated tests: GitHub Actions runs `node --test tests/solver.test.mjs` on every push to main.

Changes to the top-level app files should also be mirrored into `docs/` before pushing, because that directory hosts the public demo.

## Tech stack

HTML5, CSS3, vanilla JavaScript (ES modules), Node.js built-in test runner. No external runtime dependencies; an online Google Fonts import is optional and has local system font fallbacks.

## License

MIT license. See `LICENSE`.

## Single-file attachment

`water-jug-ai-standalone.html` is also available in the submission package. It bundles the JavaScript and CSS into one HTML file, which can be opened directly from your computer without running a server. Use this if your assignment portal requests a single code attachment.
