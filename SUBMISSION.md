# Internship Assignment 01: Water Jug Problem

**Repository:** https://github.com/alvy007/water-jug-ai

**Live demo:** https://alvy007.github.io/water-jug-ai/

**Attachment:** `water-jug-ai-submission.zip`

## Implementation remarks (paste into submission portal)

Implemented a fully interactive Water Jug Problem solver using JavaScript and classical AI state-space search. Each state is modeled as (water in Jug A, water in Jug B), with six valid fill, empty, and pour operations. Implemented BFS for minimum-move solutions and DFS for alternative path exploration, using visited-state tracking and parent pointers to reconstruct the exact solution sequence. The responsive web interface visualizes both jugs and provides step-by-step navigation and autoplay, with search metrics including explored states, discovered states, and maximum frontier size. Added input validation, unreachable-case handling using GCD, and automated unit tests. Built with HTML, CSS, and JavaScript without external runtime dependencies.

## Submission checklist

- [x] App source code complete
- [x] BFS and DFS logic
- [x] Step-by-step animated visualization
- [x] Documentation and implementation remarks
- [x] Confirm automated tests pass (14/14)
- [x] Create GitHub repository and push source
- [ ] Verify GitHub Pages deployment from main /docs at the public URL
- [ ] Attach ZIP to portal
- [ ] Submit once all fields are verified
