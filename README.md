# Star Quest

A parent-led multiplication adventure with original robot artwork. No accounts, tracking, ads, timers or subscriptions. Game progress lives only in the current session.

## Play

Choose all tables, odds (1,3,5,7,9), evens (0,2,4,6,8), or any custom selection. A table is the first factor; its second factor always ranges from 0 through 9. All tables / Every selected fact includes all 100 ordered facts. Quick missions sample without replacement and stop at the available number of facts.

Hold the screen so your child can answer out loud. Swipe right or tap Got it for a correct answer. Swipe left or tap Let's practice to see the answer, equal groups, and repeated addition. Desktop arrow keys work too. Feedback waits for the parent to continue. Missed facts can be practiced again after the mission. Tilt is not included in this version.

## Local use

Install Node.js, then run `npm start` and open http://127.0.0.1:4173. Run `npm test` to check deck coverage and explanations. No package install is required.

## GitHub Pages

Push this folder to the main branch of your repository. In Settings → Pages, select GitHub Actions as the source. The included workflow tests and publishes the dist folder. All paths are relative, so project Pages URLs work. GitHub Pages availability depends on repository visibility and account plan. The Sites preview is a separate private deployment.

## Extending

Game rules are in dist/engine.js, interaction and setup options in dist/app.js, styling in dist/style.css. To expand past 9, update the factor limit and selectable table controls together and adapt large repeated-addition explanations. Google Fonts is optional; the system font fallback works without it.

