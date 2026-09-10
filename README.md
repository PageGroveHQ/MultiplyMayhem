# iPhone home-screen updates

Keep the existing home-screen icon between builds. Use **Check for updates**, then **Update ready · apply** from a menu. Updates replace cached application files, not player storage. The app now watches updates already downloading at startup as well as newly discovered updates. Manifest identity, start URL, and player storage key remain unchanged.

Deleting/re-adding the app is not the update path. Safari and the installed app can have separate local saves. Use Download player backup in the copy with progress, then Import backup in the installed copy. Protect device saves requests persistent storage where supported, but cannot preserve data after a user deletes the app or clears its data. Downloaded backups remain important.

## Previous release

# Current release: Hands-on learning, addition blitz, and offline saves

- Addition blitz includes all 81 ordered 1–9 + 1–9 pairs and a 45-question carrying-only variant. Correct answers advance after a short celebration. Incorrect answers pause for a ten-frame and make-a-ten explanation. All timers and existing answer formats apply.
- Addition and subtraction offer interactive column math and place-value blocks. Learners enter digits and carries, tap digits to borrow, trade blocks, and remove blocks. Hints and corrected attempts count as practice in first-try reports; the completed solution is still celebrated.
- Setup follows three steps (practice, answer style, length), with scenery and ordering under More options. Play again restores the previous settings.
- The Starway map has six selectable stops, restored scenery states, and Nova dialogue. Sixteen additional cutouts from the user-provided sprite sheet decorate the app; sprites are cropped and blue-background-cleaned under the existing permission, not regenerated.
- The parent dashboard summarizes seven skills, uses recent first tries, and requires at least eight recent attempts across four distinct questions before assigning a status. Each skill links to a filtered practice bank. New lesson formats and blitz achievements accompany the modes.
- Offline support caches the app, art, local fonts, and music after the first successful online visit. The page shows Ready for offline play when installed. Updates wait for the player to apply them from a menu; active rounds are never reloaded automatically. Home-screen app identity is unchanged.
- JSON backups export every local profile, avatar, story progress, and mission. Import previews the additions, validates the file, and merges missing IDs without overwriting local profiles or duplicate runs. Store backups outside the browser for safekeeping. Saves remain local and do not automatically sync.

Maintenance: run `node scripts/build-offline.mjs` after changing assets/source, then `npm test`. The cache hash must match the published files.

## Previous release

# Current release: Math Adventures and the Starway

The entry screen is now an extensible math hub: multiplication, addition, and subtraction. Addition and subtraction each include two-digit and three-digit regrouping banks with 20 unique questions per bank (80 new questions). Three-digit subtraction includes borrowing through zeros; addition includes carrying through both ones and tens. Every incorrect answer has place-value explanations and a column layout.

Defaults: Solo, three-option multiple choice, all available questions, five minutes. Every game and answer style supports untimed, one-, three-, and five-minute rounds, with 10, 20, or all questions. Trials stop when the selected set is answered or the deadline expires, whichever happens first. Records compare identical games, variants, question sets, durations, controllers, answer formats, and practice ordering. Older multiplication saves remain readable and full-set records remain comparable.

Nova & the Lost Starway is a six-mission story, started with this release. Finish a set to restore one beacon; expired rounds still save learning progress but do not advance the chapter. After six beacons, missions become patrols. Older achievements and histories stay intact. The game registry automatically supplies discovery, practice, and variant achievements; timer lengths and story completion also have badges.

The original menu composition plays on all menus once Music is enabled and the player interacts. Music/effects preferences remain local. Menu and gameplay tracks switch without overlapping; the finish fanfare returns to the menu theme.

## Earlier release notes

# Star Quest

A solo or parent-led multiplication adventure with original SNES-inspired pixel artwork. No accounts, tracking, ads or subscriptions. Multiple local player profiles retain avatars, achievements, and completed mission histories in this browser using localStorage.

## Play

Choose all tables, odds (1,3,5,7,9), evens (0,2,4,6,8), or any custom selection. A table is the first factor; its second factor always ranges from 0 through 9. All tables / Every selected fact includes all 100 ordered facts. Quick missions sample without replacement and stop at the available number of facts.

Hold the screen so your child can answer out loud. Swipe right or tap Got it for a correct answer. Swipe left or tap Let's practice to see the answer, equal groups, and repeated addition. Desktop arrow keys work too. Feedback waits for the parent to continue. A missed original fact returns once after up to three intervening cards; a missed retry does not add further cards. Undo removes a mark or restores the previous card and its scheduled retry. Tilt is not included.

## Solo and timed play

Choose Parent-led for swipe/button grading, or Solo for automatic answer checking. Solo supports typing every answer, three unique multiple-choice answers per fact, or an alternating mix. Both modes show the same corrections. Untimed rounds and nonfinal trial cards wait for Continue after feedback; the last trial answer ends the round immediately. Solo does not expose parent grading or undo controls.

The optional five-minute challenge overrides mission length and shows each selected fact exactly once, with no retries or extra decks. It ends immediately on the final submitted answer or at five minutes, whichever comes first. The clock runs continuously, including feedback, leave confirmation and background tabs. Expiry records a submitted answer even if Continue was not pressed, excludes unanswered cards, and saves the run once. Leaving without saving discards the run and stops its timer. The history and CSV identify mode, solo format and timed rounds. Existing untimed rounds remain readable as Parent-led.

## Players and progress

Create a nickname and customize a bust avatar: six hairstyles, six hair colors, five skin tones, four eye colors, six shirt colors, four patterns and four backdrops. The portrait studio offers visual hair previews, shuffle and reset. Two cosmetic mission backdrops are selectable: Cosmic Circuit and Skyland Scouts. The questions and difficulty are the same; the existing World traveler achievement recognizes trying both. Gear has been removed from the editor and rendering; old profiles still load safely. The reference robot accompanies each flash card, celebrates correct answers, and teaches missed facts using groups of energy tiles and running totals. Existing profiles can be customized without losing history.

Seventeen achievements reward completed missions, practice, successful retries, stars, and exploration. The Progress page shows per-table coverage and first-try accuracy, individual mission details, and a CSV history export. Practice for me prioritizes the selected tables' latest missed facts, then unseen facts, then previously correct facts.

Only completed missions are saved. Reports keep first tries separate from retries. Each run has an ID to prevent duplicate saves. Players remain independent; switching players does not merge histories. Storage failure shows a visible warning and permits session-only play. Malformed existing saves are left untouched.

Saves are browser- and origin-specific. Clearing browser data removes them. Private/incognito sessions may discard saves. GitHub Pages and the private Sites preview have separate saves; use the GitHub URL consistently. There is no cloud sync, backup/restore, or login. Older versions did not store progress, so there is no historical data to migrate.

## Local use

Install Node.js, then run `npm start` and open http://127.0.0.1:4173. Run `npm test` to check deck coverage and explanations. No package install is required.

## Home-screen icon

Open the GitHub Pages game on your phone and use your browser's Add to Home Screen command. The manifest includes 192px and 512px robot icons, a maskable icon, and an Apple touch icon. The manifest launches within the repository path. An older shortcut can retain its cached icon; re-add the shortcut without clearing browser/site data, which contains player saves. This release does not include offline caching.

## GitHub Pages

Push this folder to the main branch of your repository. In Settings → Pages, select GitHub Actions as the source. The included workflow tests and publishes the dist folder. All paths are relative, so project Pages URLs work. GitHub Pages availability depends on repository visibility and account plan. The Sites preview is a separate private deployment.

## Extending

Game rules are in dist/engine.js, undo and retry scheduling in dist/session.js, local saves/reports/achievements in dist/progress.js, avatar rendering in dist/avatar.js, interaction in dist/app.js, and styling in dist/style.css, dist/studio.css and dist/modes.css. Avatar sheets use runtime palette replacement; recoloring preserves alpha and neutral highlights. The robot reference is the user-supplied bot_sprite_sheet_-fullview.jpg. Artwork was generated with built-in ImageGen; exact new prompts are in art-prompts-v3.json and prior prompts in art-prompts.json. To expand past 9, update the factor limit, selectable table controls, reporting validation, and large repeated-addition explanations together. Google Fonts is optional; system fonts work without it.
Release 3 cutout backgrounds were cleaned in code with explicit user permission, inspected on dark and light backgrounds, and saved with real PNG alpha. The runtime does not perform background removal.



## Flight reports and records

Each round includes accuracy, correct out of the set, time used, unanswered facts, strong tables and missed-fact explanations with practice links. Unanswered facts are excluded from accuracy. Completion records compare capped trials with the same tables, parent/solo mode, solo format and practice ordering. A faster time is a completion record even with mistakes; accuracy is displayed alongside it and perfect accuracy has a separate achievement. Earlier unlimited timed rounds remain in history but cannot become capped-trial records. Trials do not offer undo.

## Original audio and space numerals

Enable Music at the top of the game to hear the original 32-second loop. Sound effects default on and cover launch, correct answers, gentle correction, the final ten seconds, timeout and set completion. Both controls save locally. Hidden tabs suspend audio while the clock continues. If the browser prevents playback, gameplay continues. WAV files and reuse details are in dist/audio; scripts/compose-audio.mjs reproduces them without external samples or services.

Numerals use a locally bundled Orbitron font from https://github.com/google/fonts/tree/main/ofl/orbitron under the included SIL Open Font License (dist/fonts/OFL.txt).

