# Star Quest

A parent-led multiplication adventure with original SNES-inspired pixel artwork. No accounts, tracking, ads, timers or subscriptions. Multiple local player profiles retain avatars, achievements, and completed mission histories in this browser using localStorage.

## Play

Choose all tables, odds (1,3,5,7,9), evens (0,2,4,6,8), or any custom selection. A table is the first factor; its second factor always ranges from 0 through 9. All tables / Every selected fact includes all 100 ordered facts. Quick missions sample without replacement and stop at the available number of facts.

Hold the screen so your child can answer out loud. Swipe right or tap Got it for a correct answer. Swipe left or tap Let's practice to see the answer, equal groups, and repeated addition. Desktop arrow keys work too. Feedback waits for the parent to continue. A missed original fact returns once after up to three intervening cards; a missed retry does not add further cards. Undo removes a mark or restores the previous card and its scheduled retry. Tilt is not included.

## Players and progress

Create a nickname and customize a bust avatar: six hairstyles, six hair colors, five skin tones, four eye colors, four accessory settings, six shirt colors, four patterns and four backdrops. The portrait studio offers visual hair previews, shuffle and reset. Two pixel-art worlds are selectable: Cosmic Circuit and Skyland Scouts. The reference robot accompanies each flash card, celebrates correct answers, and teaches missed facts using groups of energy tiles and running totals. Existing profiles can be customized without losing history.

Eight achievements reward completed missions, practice, successful retries, stars, and exploration. The Progress page shows per-table coverage and first-try accuracy, individual mission details, and a CSV history export. Practice for me prioritizes the selected tables' latest missed facts, then unseen facts, then previously correct facts.

Only completed missions are saved. Reports keep first tries separate from retries. Each run has an ID to prevent duplicate saves. Players remain independent; switching players does not merge histories. Storage failure shows a visible warning and permits session-only play. Malformed existing saves are left untouched.

Saves are browser- and origin-specific. Clearing browser data removes them. Private/incognito sessions may discard saves. GitHub Pages and the private Sites preview have separate saves; use the GitHub URL consistently. There is no cloud sync, backup/restore, or login. Older versions did not store progress, so there is no historical data to migrate.

## Local use

Install Node.js, then run `npm start` and open http://127.0.0.1:4173. Run `npm test` to check deck coverage and explanations. No package install is required.

## Home-screen icon

Open the GitHub Pages game on your phone and use your browser's Add to Home Screen command. The manifest includes 192px and 512px robot icons, a maskable icon, and an Apple touch icon. The manifest launches within the repository path. An older shortcut can retain its cached icon; re-add the shortcut without clearing browser/site data, which contains player saves. This release does not include offline caching.

## GitHub Pages

Push this folder to the main branch of your repository. In Settings → Pages, select GitHub Actions as the source. The included workflow tests and publishes the dist folder. All paths are relative, so project Pages URLs work. GitHub Pages availability depends on repository visibility and account plan. The Sites preview is a separate private deployment.

## Extending

Game rules are in dist/engine.js, undo and retry scheduling in dist/session.js, local saves/reports/achievements in dist/progress.js, avatar rendering in dist/avatar.js, interaction in dist/app.js, and styling in dist/style.css and dist/studio.css. Avatar sheets use runtime palette replacement and accessory compositing; recoloring preserves alpha and neutral highlights. The robot reference is the user-supplied bot_sprite_sheet_-fullview.jpg. Artwork was generated with built-in ImageGen; exact new prompts are in art-prompts-v3.json and prior prompts in art-prompts.json. To expand past 9, update the factor limit, selectable table controls, reporting validation, and large repeated-addition explanations together. Google Fonts is optional; system fonts work without it.
Release 3 cutout backgrounds were cleaned in code with explicit user permission, inspected on dark and light backgrounds, and saved with real PNG alpha. The runtime does not perform background removal.


