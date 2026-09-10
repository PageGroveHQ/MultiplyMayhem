# Math Adventures maintenance

- Preserve local profiles and existing run history. Legacy runs without an operation are multiplication.
- Register new math games and variants in `dist/math-games.js`. Every new mode must ship with suitable achievements, analysis, correction teaching, timer support, and tests in the same change. Registry badges are the baseline; add skill-specific badges when appropriate.
- Keep arithmetic at the selected grade level, with accurate place-value explanations. Check multi-column carrying and borrowing through zeros.
- Preserve defaults: Solo, multiple choice, all questions, five-minute timer. All games must support untimed and 1-, 3-, 5-minute limits.
- Use the established robot artwork and local audio; keep music and effects independently controllable.

- After any source or asset change, regenerate `dist/sw.js` with `node scripts/build-offline.mjs` before tests and publication. Never auto-reload an active round to activate an update.
- Preserve backup format and non-destructive merge behavior. Guided errors must not inflate first-try accuracy.
