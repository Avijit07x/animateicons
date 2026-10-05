# Motion consistency tracker

Icons in the same family should move alike, so a user hovering related icons side by side does not feel different, confusing animations. This file tracks the icons that break that rule. Work one family at a time, top to bottom, and tick each box when it is fixed.

Snapshot: 2026-10-05. Found by reading the code of all 669 Lucide and 501 Huge icons. Nothing was checked in a browser yet, so confidence below means "how likely this is a mistake and not on purpose".

## How to fix a family

1. Read the siblings first. Copy `duration`, `times`, amplitude, ease, delay and pivot from the sibling named in "Copy from". Do not invent new numbers.
2. Change only the part that differs. Shapes stay identical to Lucide at rest.
3. Keep the icon rules: `animate={controls} initial="normal"` on the `m.svg`, every variant set has `normal` and `animate`, timings scale by `duration`, the motion starts and ends at rest, no comments in the file.
4. Run `pnpm exec prettier --write` on the changed files, then `pnpm gen:icons`, because the registry embeds the source.
5. Run `pnpm lint`, `pnpm typecheck` and `pnpm test`. Icon counts do not change, so the README counts stay as they are.
6. Look at the family in the gallery at 23px before ticking it off.

## Open decisions

These change how later families are fixed.

- [x] **Minus badge: grow or shrink?** Owner, 2026-10-05: all Lucide minus icons, the standalone one and every badge, copy the Huge `minus-sign`: spin 180 and shrink to 0.7. Done, see Done. The Huge badges themselves are not changed: 10 of them spin 180 and grow to 1.3 (`badge-minus`, `bell-minus`, `bookmark-minus`, `folder-minus`, `heart-minus`, `shield-minus` and more), and only `minus-sign`, `zoom-out` and `user-minus-0-1` shrink.
- [x] **Plus badge peak.** Owner, 2026-10-05: every child plus copies the standalone `plus` (rotate 90, peak 1.2, 0.5s). Done, see Done.
- [x] **X badge peak: 1.2 or 1.3?** Owner rule: a child x copies the standalone `x` (rotate 90, 1.2, 0.5s, no delay). Done for every Lucide x badge except `volume-x` (the x draws on, a different kind), see Done. The Huge x badges still use 1.3 and were not touched.
- [ ] **Lift size.** Most family lifts are 1.2 to 1.8 units, which is near the smallest size you can see at 23px. If a fixed family looks too quiet, raise the whole family together, never one icon alone.

## Done

- [x] **Search magnifier (8 icons).** `user-search`, `user-round-search`, `text-search`, `folder-search`, `calendar-search`, `mail-search`, `file-search` and `package-search` now share one lens motion: x `[0,-1.4,-0.4,0.7,0]`, y `[0,0.3,-1.3,-0.4,0]`, `0.8 * duration`, `easeInOut`, no delay, no `times`. Copy this block for any new `*-search` icon. The standalone `search` and `search-x` were not touched.

- [x] **Check ticks (21 Lucide icons).** The tick draws on and pops: `strokeDashoffset` draw as before, plus scale `[0.8,1.12,1]`, 0.45s, `times [0,0.6,1]`, `easeInOut`, starting 0.04s after the tick starts, pivot at the centre of the tick. Owner chose this on 2026-10-05 (`alarm-clock-check` and `folder-check` already did it; `check` already popped). Changed: `badge-check`, `bookmark-check`, `book-open-check`, `calendar-check`, `circle-check`, `circle-check-big`, `clipboard-check`, `cloud-check`, `copy-check`, `file-check`, `mail-check`, `map-pin-check`, `map-pin-check-inside`, `package-check`, `shield-check`, `spell-check`, `square-check`, `user-check`, `user-round-check`. All 21 ticks now start together: the draw and the fade start at 0.15s and the pop at 0.19s, and every tick finishes at about 640ms (measured). The old delays were 0.14 to 0.35 depending on the icon. Not changed: `check-check` and `list-checks` (several ticks with their own stagger) and every Huge check icon (they draw only; ask before touching them). Copy this block for any new `*-check` icon.
- [x] **`mail-open` and Huge `mail-open-0-1` (owner request, 2026-10-05).** The envelope no longer moves (Lucide: the roof stretch is gone; Huge: the hop, the crease draw-on and the front stretch are gone, and their dash settings were dropped). A small paper with two lines comes into the open envelope: `y [-9,0,14]`, `opacity [0,1,1]`, 0.8s, `easeInOut`, `times [0,0.4,1]`. The paper is a 10 by 9.5 outline with stroke 1.5 and two short lines, so it reads as a paper at 24px (the first try, 12 by 11 at stroke 2, was too big; the first-first try with only two lines looked like lines). It is clipped by the front of the envelope (a `clipPath` along the pocket line, with an id from `useId`), so it slides behind the front and disappears. It is invisible at rest (`y 14`, `opacity 0`), so the rest shape is identical to the source. Checked with frames from a browser at 150 to 650ms for both icons.
- [x] **Lock badges (4 Lucide icons).** `user-lock`, `globe-lock`, `folder-lock` and `file-lock` share one lock motion, copied from `user-lock` (owner, 2026-10-05: "i liked the user-lock"): shackle `y [0,-2,0.5,0]` and body `scaleY [1,1,0.88,1]`, both 0.7s, `easeInOut`, `times [0,0.45,0.72,1]`, delay 0.1. The body pivot is the bottom centre of the lock body. Before: `globe-lock` lifted 1.5 with no wait, `folder-lock` lifted 2.2, and `file-lock` dropped its body instead of squashing it. Measured in a browser: all 4 lift the shackle -2.0 to 0.5 from about 120ms to 790ms and squash the body to 0.88 from about 430ms to 805ms. The standalone `lock` (a shake) and the Huge locks are not touched.
- [x] **Pen badges (4 Lucide icons).** `file-pen`, `user-pen`, `user-round-pen` and `wifi-pen` copy the pen of `notebook-pen` (the same pen motion as `square-pen`): x `[0,-1.5,1,-1,0]`, y `[0,1,-0.5,0.8,0]`, rotate `[0,-8,4,-4,0]`, 0.8s, `easeInOut`, no delay. Owner, 2026-10-05: "for this use notebook pen style". `user-pen` and `wifi-pen` keep their pivot at the pen tip, and `file-pen` got one (4.8, 21.6). Measured in a browser: all 4 move the same as `notebook-pen`. Not touched: `pencil` (rotates only, `[0,-4.5,4,-2,0]`, 0.7s), `pen-tool` and `square-pen` itself.
- [x] **X badges (13 Lucide icons).** `message-circle-x`, `message-square-x`, `bookmark-x`, `user-x`, `user-round-x`, `package-x`, `calendar-x`, `circle-x`, `folder-x`, `funnel-x`, `mail-x`, `search-x` and `shield-x` copy the main `x`, and `file-x` already matched: rotate `[0,90]`, scale `[1,1.2,1]`, 0.5s, `easeInOut`, no delay (owner, 2026-10-05: "ok do"). Measured in a browser: all 14 peak at 1.2, turn 90 and finish in about 0.5s. `volume-x` was left alone, because its x draws on and scales `[0.85,1.1,1]`. The Huge x badges (`user-remove-0-1`, `file-remove`, ...) still grow to 1.3 and were not touched.
- [x] **Heart badges (3 Lucide icons so far).** `message-circle-heart`, `message-square-heart` and `file-heart` copy the main `heart`: scale `[1,1.13,0.97,1.07,1]`, 0.8s, `easeInOut`, `times [0,0.25,0.5,0.75,1]`, no delay. Measured in a browser: all peak at 1.13 and finish in about 0.8s. `calendar-heart`, `folder-heart` and `hand-heart` are still on their own versions.
- [x] **Child plus (19 Lucide icons).** Every plus copies the standalone `plus`: rotate `[0,90]`, scale `[1,1.2,1]`, 0.5s, `easeInOut`. Owner rule, 2026-10-05: "we have a main animation, copy that". Measured in a real browser: all 19 turn 90, peak 1.2 and take 0.5s. Icons: `user-plus`, `git-branch-plus`, `circle-plus`, `list-plus`, `copy-plus`, `bookmark-plus` (now a group with the main plus, pivot 12,10), `message-circle-plus`, `message-square-plus`, `mail-plus`, `bell-plus`, `folder-plus`, `package-plus`, `calendar-plus`, `clock-plus`, `alarm-clock-plus`, `image-plus`, `file-plus`, `zoom-in`. Same start time too. The owner first said copying a motion does not mean removing its delay unless needed, then asked "where is the consistency" when 11 icons waited 0.1 to 0.3s and 8 did not. So the delays were removed, and all 19 start within one frame of each other (measured in a browser, 2026-10-05). Not touched: `diff` (plus turns 180, peak 1.1, 0.95s, next to a minus) and the Huge plus icons (they already match).
- [x] **Minus (13 Lucide icons).** Every minus, the standalone `minus` and the 12 badges, copies the Huge `minus-sign`: rotate `[0,180]`, scale `[1,0.7,1]`, 0.5s, `easeInOut`, no delay, with `normal` snapping back at once (`duration: 0`). Owner, 2026-10-05: "for minus copy the huge minus animation". This replaced a first version that squeezed sideways like the old standalone `minus` (`scaleX [1,0.55,1]`, `y [0,-1,0]`), done earlier the same day and then dropped. Icons: `minus`, `alarm-clock-minus`, `bell-minus`, `bookmark-minus`, `calendar-minus`, `circle-minus`, `file-minus`, `folder-minus`, `git-branch-minus`, `mail-minus`, `user-minus`, `user-round-minus`, `zoom-out`. Measured in a browser: all 13 turn 180, shrink to 0.70 and finish in about 500ms. Delays of 0.1 to 0.2s on 6 icons were removed, like the plus ones. Not touched: `diff` (it has a plus and a minus) and every Huge minus icon.
- [x] **Slash on alarm-clock-off and timer-off.** Draw-on. `cloud-off` was done later the same day. The vanish-and-return slash is still on `star-off`, `image-off` and `headphone-off`; see family 15.

## Families to fix

### 1. folder

Majority (9 icons: `folder-closed`, `-dot`, `-heart`, `-key`, `-lock`, `-minus`, `-plus`, `-search`, `-x`): only the folder body moves, `y [0,-1.2,0.4,0]`, `0.6 * duration`, `easeInOut`, `times [0,0.35,0.7,1]`. Extra parts start 0.1s late.

Decision (2026-10-05): the owner chose the Lift for the whole family. `folder-open` and `folder-tree` keep their own motion.

- [x] `folder`: was scale, rotate and lift over 0.9s, applied twice (on the `m.svg` and on the `m.path`). Now the body lift only, copied from `folder-plus`, with the motion on the path and nothing extra on the svg.
- [x] `folder-check` body: was a whole-svg scale `[1,1.05,1]` over 0.5s. Now the same body lift as `folder-plus`, applied to a group that holds the body and the check, so the check moves with the folder.
- [x] `folder-check` badge: owner chose draw and pop (2026-10-05). It stays as it is, and every other Lucide check tick now follows it. See Done.
- [x] `folder-dot` badge: leave as it is (owner, 2026-10-05). It is a tiny centre dot (r 1 at 12,13), not a corner notification dot (r 3), so `bell-dot` is not its sibling. The audit grouped dots by name and got this one wrong. The only other centre dot is in `circle-dot`, which has its own motion.
- [ ] Low, optional: `folder-key` rotate `[0,24,-8,0]` with delay 0.1 (copy `file-key`: `[0,24,-6,0]`, no delay). `folder-lock` now copies `user-lock` (done 2026-10-05). `folder-plus`, `folder-minus` and `folder-x` have delay 0.1 and `folder-heart` has delay 0.1, siblings have none.
- [ ] Leave: `folder-open` (skew and lift, looks on purpose), `folder-tree` (sideways on purpose).
- [ ] Huge: `folder-0-1` draws on, then scales over 0.5s, ending at 1.0s. The Huge majority lifts `y [0,-1.5,0.5,0]` over 0.6s. Copy `folder-add`. Confidence: 55%.

### 2. clock (done 2026-10-05)

- [x] `alarm-clock-off`, `timer-off`: the slash now draws on like `bell-off` (`strokeDashoffset [31,0]`, `strokeDasharray "30 200"`, 0.45s, delay 0.1). Owner chose draw-on.
- [x] `alarm-clock-check`: owner chose draw and pop. It stays as it is, and the other check icons were brought to it. See Done.
- [x] `clock-arrow-down`: the arrow now moves down first, `y [0,1.5,-0.45,0]`, `times [0,0.35,0.7,1]`, the exact mirror of `clock-arrow-up`.
- [x] `alarm-clock-plus`: the plus now copies the main `plus`, with no delay (owner's rule, see Done).
- [ ] Left alone on purpose: base timing. `alarm-clock` rotates 8 over 0.9s but its badge icons rotate 6 over 0.7s, and the `clock` hand takes 0.9s while `clock-plus`, `clock-alert` and `clock-arrow-*` take 0.8s. The gaps are 0.1s or 2 degrees, so they were not changed.
- [x] Huge: `clock-0-1` was a wrong finding. Its only neighbours are timers, not clocks, and it moves both hands on purpose.

### 3. message (done 2026-10-05, owner said "next" so my advice was applied)

Majority: the bubble scales `[1,0.7,1.05,1]` over 0.65s, `times [0,0.35,0.75,1]`, pivot 4,20. All 12 icons except `messages-square` now use it (measured in a browser).

- [x] `message-circle`: the whole-svg wobble was removed and the pivot is now 4,20, like `message-square`.
- [x] `message-circle-question-mark`: the bubble now squeezes like the family, with the curl and the dot inside the squeezed group. Their own curl wobble and dot hop are unchanged.
- [x] `messages-square`: left alone. Two bubbles move one after the other (`[1,0.85,1.08,1]`, 0.55s, second bubble 0.25s later), on purpose.
- [x] Plus: `message-circle-plus` and `message-square-plus` copy the main `plus` with no delay (see Done).
- [x] Heart: `message-circle-heart` and `message-square-heart` copy the main `heart`: scale `[1,1.13,0.97,1.07,1]`, 0.8s, `times [0,0.25,0.5,0.75,1]`, no delay.
- [x] X: `message-circle-x` and `message-square-x` copy the main `x`: rotate 90, scale `[1,1.2,1]`, 0.5s, no delay.
- [x] Dot: `message-square-dot` copies `bell-dot` (there is no main dot icon): scale `[1,1.25,1]`, 0.5s, delay 0.1.
- [ ] The heart badges outside message and file (`calendar-heart`, `folder-heart`, ...) and the x badges of `file-x`, `folder-x` and others are not changed yet. Do them when their family comes up, or all at once if the owner says so.

### 4. bookmark (done 2026-10-05, owner: "go with your advice")

Was split: `bookmark`, `-minus` and `-plus` dropped (`y -4` plus a squash, `easeOut`, 0.55s or 0.45s). `bookmark-check` and `-x` hopped (`y -1.6`, 0.6s). All Huge bookmarks already use the drop.

- [x] Shape: `bookmark`, `bookmark-plus` and `bookmark-minus` still had the old pointed bottom. Installed Lucide 1.48.0 draws all 5 with the rounded notch, so they now use that path (`M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578...`). This was found while reading the family, not in the audit.
- [x] Motion: all 5 Lucide bookmarks drop, copied from `bookmark`: `y [0,-4,0]`, `scaleY [1,1.1,0.95,1]`, `scaleX [1,0.97,1.02,1]`, 0.55s, `easeOut`, applied to the `m.svg` itself so nothing is clipped. `bookmark-check` and `bookmark-x` lost their inner hop group. Measured in a browser: all 5 move `y -4` and finish at about 550ms.
- [x] `bookmark-plus`: the plus copies the main `plus` (see Done).
- [x] `bookmark-x`: the x copies the main `x`: rotate 90, scale `[1,1.2,1]`, 0.5s, no delay.
- [x] `bookmark-minus`: the minus copies the Huge `minus-sign` like every other Lucide minus (see Done).
- [x] Huge bookmarks: no change, they already share one drop.

### 5. cloud (done 2026-10-05)

No clear majority. Six weather clouds move the body `x [0,1,-0.5,0]` over 0.7s. `cloud` uses `y -2` plus rotate 3 over 0.9s. `cloud-drizzle` uses `x [1,-1]` over 1.0s with no `times`. `cloud-check` lifts 1.2 over 0.6s. `cloud-upload` lifts 2 and `cloud-download` lifts 1.5.

- [x] `cloud-drizzle`: the body now slides like `cloud-rain`: `x [0,1,-0.5,0]`, 0.7s, `easeInOut`, `times [0,0.35,0.7,1]` (owner: "ok do this"). The drops keep their own bob.
- [x] `cloud`: the body now slides like `cloud-rain` instead of floating and tilting (done 2026-10-05). The pivot style it needed for the tilt was removed.
- [x] `cloud-fog`: the cloud now slides like `cloud-rain` instead of swelling 5% (done 2026-10-05). The fog lines still draw on. The pivot style it needed for the swell was removed.
- [x] Left alone on purpose: `cloud-lightning` (its cloud pulses after the bolt), `cloud-rain-wind` (slides left, the wind blows that way), `cloud-check` (lifts 1.2), `cloud-download` and `cloud-upload` (only the arrow moves), `cloud-sun-rain` and `cloud-moon-rain` (no body motion). Measured in a browser: `cloud`, `cloud-drizzle`, `cloud-fog`, `cloud-rain`, `cloud-snow`, `cloud-hail`, `cloud-sun` and `cloud-moon` all slide from -0.5 to 1.0 in about 0.7s.
- [ ] Later, with the sun and moon family: the moon inside `cloud-moon` and `cloud-moon-rain` turns 12 degrees but the standalone `moon` turns 16, and the sun inside `cloud-sun` turns 24 over 0.8s.
- [x] `cloud-off`: the slash now draws on like `bell-off` (done 2026-10-05, owner: "go with your advice"). Measured in a browser: the same curve as `bell-off`.
- [x] `cloud-sync`: the arrows now copy `refresh-cw`, the main sync icon: rotate `[0,180]`, scale `[1,0.92,1]`, 0.9s, `easeInOut` (done 2026-10-05). It was 180 over 0.8s with no squeeze. `wifi-sync` turns 360 and is not changed.

### 6. file (done 2026-10-05)

The 22 `file-*` icons use the Pop (page scale `[1,1.08,0.98,1]` over 0.6s). `files` is different on purpose. Do not bring back the corner nudge or the paper fold.

- [x] `file-lock`: the lock now copies `user-lock` (owner: "i liked the user-lock"), see Done.
- [x] `file-pen`: the pen now copies `notebook-pen` (owner, 2026-10-05: "for this use notebook pen style"), see Done.
- [x] `file-down` and `file-up`: arrow moves 1.5, which now matches the other small arrows (see family 9).
- [x] Huge: `file-add`, `file-block`, `file-remove`, `file-down` and `file-up` now grow the file body like `file-0-1` and `file-check` (`scale [1,1.04,1]`, 0.4s, `easeInOut`, pivot 12,12), and only the body grows, not the small part (done 2026-10-05, owner: "do this"). Measured in a browser: all 7 Huge file icons grow the body from 1.00 to 1.04 in about 0.39s.

### 7. user (done 2026-10-05)

Head bounce: 20 Lucide user icons are consistent.

- [x] `user-plus`: the plus now copies the main `plus` (done 2026-10-05).
- [x] `user-minus`, `user-round-minus`: the minus now copies the Huge `minus-sign` (done 2026-10-05).
- [x] `user-pen`, `user-round-pen`: the pen now copies `notebook-pen`, with no delay (done 2026-10-05, see Done).
- [x] `user-lock`: it is the reference lock badge, unchanged, and the other three lock badges now copy it (see Done).
- [x] `user-x`, `user-round-x`: the x now copies the main `x` (rotate 90, scale `[1,1.2,1]`, 0.5s, no delay), see Done (owner: "yes do").
- [x] Huge: `user-block-0-1` and `user-settings-0-1` now lift the head like `user-add-0-1` (`y [0,-1.5,0.5,0]`, 0.6s, `times [0,0.35,0.7,1]`) instead of puffing it up 15% over 0.4s, and the head pivot style they needed for the puff was removed (done 2026-10-05, owner: "yes do"). Measured in a browser: all 3 heads move y -1.5 to 0.5 in about 0.6s. Left alone: Huge `user` (head lifts 2, a half pixel more than its badges), `user-circle`, `user-group`, Lucide `users`, `users-round` (the second head waits 0.1s on purpose), `user-star`, `user-cog` and `user-round-cog`.

### 8. package (done 2026-10-05)

- [x] Box: `package-check`, `package-plus`, `package-search` and `package-x` now lift and tilt like `package` (`y [0,-1,0.3,0]`, `rotate [0,-6,4,0]`, 0.7s, `easeInOut`, `times [0,0.35,0.7,1]`, pivot 12,12), instead of only lifting 1 over 0.6s. Owner, 2026-10-05: "i liked the tilt, will try both, lets see first add tilt for all". To try the other way later, remove the `rotate` and set the duration back to 0.6s in all 5 files, including `package`. Measured in a browser: all 5 lift -1.0 to 0.3 and tilt 6 degrees in about 0.69s.
- [x] `package-plus`: the plus now copies the main `plus` (done 2026-10-05).
- [x] `package-x`: the x now copies the main `x` (rotate 90, scale `[1,1.2,1]`, 0.5s, no delay), owner: "yes". Measured in a browser: it matches `bookmark-x`.
- [x] Left alone: `package-open` (the flaps open on purpose), Huge `package-delivered` and the `delivery-*` icons (a lid, a truck and a pin, not the same family).

### 9. arrow, hard-drive and download (done 2026-10-05)

- [x] `arrow-down-up`: now copies `arrow-up-down`: the two halves slide 3 apart in 0.6s, `times [0,0.5,1]`, and the whole icon no longer grows 4% (owner: "ye do"). The redundant `initial` and `animate` props on its paths were removed. Measured in a browser: it matches `arrow-up-down`.
- [x] `hard-drive-upload`: the arrow now copies `hard-drive-download` mirrored: `y [0,-1.8,0.4,0]`, 0.6s, `times [0,0.35,0.7,1]`, no fade (owner: "use hard-drive-download animation"), instead of flying out and fading over 0.8s. The arrow tip sits at y=2, so a 1.8 lift would cut off its top; the svg got `style={{ overflow: "visible" }}`, like `headset` and `move-vertical`. Measured in a browser: the svg and its parents are `overflow: visible` and the arrow is not cut.
- [x] Small arrows inside bigger icons (owner: "i will go with your advice"): `file-down`, `file-up`, `cloud-download`, `cloud-upload`, `clock-arrow-down` and `clock-arrow-up` now all dip or lift 1.5, settle back 0.4, 0.6s, `times [0,0.35,0.7,1]`, no delay. Changed: `cloud-upload` (lifted 2), `cloud-download` (settle 0.375), `clock-arrow-down` and `clock-arrow-up` (settle 0.45 and a 0.1s delay). The big `download` (2.5) and `upload` (1.5) keep their own size: the tracker idea of one 2.5 amplitude was wrong, because the up arrows sit near the top edge and would be cut off.
- [ ] Huge: `file-down` and `file-up` nudge ±2.2 in 0.5s, but `download` and `upload-0-1` fly ±4 and fade. Left alone: it is a different style from Lucide and the badges nudge on purpose.
- [x] Left alone: the plain `arrow-left`, `arrow-right`, `arrow-up` and `arrow-down` (all wind up and thrust the same way), `arrow-down-to-line`, `arrow-up-to-line`, `arrow-big-up` and the Huge arrows.

### 10. move (done 2026-10-05)

- [x] `move-left`, `move-right`: now slide like `move-horizontal`: `x [0,2.5,-2.5,0]` (mirrored for right), 0.6s, `times [0,0.25,0.6,1]`, and the svg draws outside its box (`overflow: visible`) so the head is not cut (owner: "ok do"). Measured in a browser: both move -2.5 to 2.5 in about 0.6s like `move-horizontal`.
- [x] The `duration` default (owner: "ok do", 2026-10-05): `move-vertical`, `move-horizontal`, `move-diagonal`, `move-diagonal-2`, `boxes`, `gitlab`, `layout-dashboard`, `thumbs-up` and `venus` now default to 1 and scale their timings like every other icon, as the docs say ("duration is a multiplier"). Every timing was multiplied by the old default, so nothing looks different at the default speed (`move-vertical` still ends at about 0.6s). `boxes` also stopped ignoring `duration` in its stagger delay. People who set `duration` themselves on these icons will now see the same speed change as on other icons.

### 11. chevron (done 2026-10-05)

- [x] `chevrons-up`, `-down`, `-left`, `-right`: they now slide like the Huge `arrow-*-double` icons (owner: "go with this chevron-down, and copy the Huge arrow-*-double motion"): the first chevron goes 2 in its direction and settles -0.5 (`[0,2,-0.5,0]`, mirrored for up and left), `easeInOut`, `times [0,0.4,0.75,1]`, and the second chevron follows later. Before: pull back 1.5 then thrust 4 over 1.0s, `times [0,0.18,0.55,1]`. Then the owner said they looked a bit fast, so all 16 chevron icons were slowed from 0.5s to 0.6s (owner: "yes go with this"): Lucide `chevron-*` and `chevrons-*`, Huge `chevron-*` and `arrow-*-double`. The second chevron of a double now follows 0.15s later (was 0.12s). The distances are unchanged (singles 2.5, doubles 2). Measured in a browser: every single chevron in both libraries reaches its farthest point at about 0.24s and ends at about 0.6s, and every double finishes at about 0.75s.
- [x] Speed check that led to this: `chevrons-down` was not faster than other motions (10.9 units/s against 10.7 for `arrow-up-down`, 11.0 for `download` and 11.8 for `arrow-down`), but 0.5s is on the short side, since most icons take about 0.6s.
- [x] `chevrons-up-down` and `chevrons-left-right` were also slowed from 0.5s to 0.6s (owner named them: "fix this one also its fast"). Measured in a browser: they end at about 0.6s like the single chevrons. `chevrons-right-left` and `chevrons-left-right-ellipsis` were slowed from 0.5s to 0.6s too (owner: "ok do"), including the hopping dots of the ellipsis icon so its parts stay in step. Measured: all four end at about 0.6s.
- [x] Left alone: `chevron-first`, `chevron-last` (the bar grows on purpose, 0.6s already). The plain `arrow-up/down/left/right` icons still wind up and thrust, and may follow later if the owner prefers the slide.

### 12. copy (owner, 2026-10-05: "we dont have to do anything here")

- [x] `copy`: left alone by the owner's decision. It still spins and moves 3 over 0.9s, while `copy-plus` and `copy-check` spread 1 over 0.6s. Huge `copy` and `copy-check` are left alone too.
- [x] `copy-plus`: the plus now copies the main `plus` (done 2026-10-05).

### 13. bell (done 2026-10-05)

- [x] Lucide `bell`, `bell-ring`, `bell-plus`, `bell-minus` and `bell-dot` now copy the Huge bell swing (owner: "a", option A): rotate `[0,-12,10.2,-6,3,0]`, 0.8s, `easeInOut`, six evenly spaced steps. The clapper moves `x [0,1.7,-1.4,0.8,-0.4,0]` over 0.8s with no delay (it was 5 in `bell` and `bell-ring`, with a 0.04s or 0.06s delay). In `bell-ring` the waves went from 1.0s to 0.8s (`delay 0.05`) to stay in step. Before: `bell` and `bell-ring` swung 18 degrees over 1.0s, the three badge bells 10 degrees over 0.8s. The pivots were left as they are (`bell` and `bell-ring` turn the whole svg from the top centre, the badges turn from 12,3). Measured in a browser: all 5 Lucide bells and all 5 Huge bells (`notification`, `bell-plus`, `bell-ring`, `bell-minus`, `bell-dot`) swing 12 degrees and end at about 0.8s.
- [x] Left alone: `bell-electric`, `bell-off` (its slash already draws on), the dot of `bell-dot` (bigger in Huge on purpose, 1.6 against 1.25) and the Huge notification clapper (it turns, the Lucide clapper slides).

- [x] Bell timing (2026-10-05, owner said the bells looked fast): the swing was the fastest of the rocking icons, 139 degrees per second at its peak against 91 to 126 on `pin`, `discount-tag`, `shopping-basket` and `help-circle`. All 12 bell swings (5 Lucide bells, Huge `bell-*` x4, `notification`, `notification-0-2`, `notification-off`) now take 1.1s, about 101 degrees per second. The wave and clapper timings moved with them.

- [x] Huge `notification-off` and `notification-off-0-2` swing like the other bells (1.1s, clapper 0.07s later) and now also fade the body to 0.4 over 0.7s like the other off icons. `notification-off-0-2` had no swing at all before (done 2026-10-05). Huge `bell-dot` got `overflow: visible` because its dot grows 1.6 past the box edge.

### 14. battery

- [x] `battery-low` and `battery-charging` now copy the body squeeze (`scaleX 0.92`) and the cap slide (`x -1.3`, taller) of `battery`, 0.6s with `times [0,0.35,0.7,1]` (done 2026-10-05). They keep their own part: the bar blink of `battery-low` (0.8s, two blinks need the time) and the bolt pulse of `battery-charging`. Measured in a browser: all four end at about 0.59s. Lucide only, there are no Huge battery icons.

### 15. Slash (off) icons

12 Lucide icons draw the slash on (`strokeDashoffset [L,0]`, 0.45s, delay 0.1), and all 31 Huge `*-off` icons do too. The canonical one is `bell-off`.

- [x] All 11 Lucide slash icons that differed now draw the slash on like `bell-off` and the Huge icons: 0.45s, easeInOut, 0.1s wait (done 2026-10-05). They are `star-off`, `headphone-off`, `image-off` (no more undraw and redraw), `eye-off`, `mic-off`, `video-off`, `volume-off`, `wifi-off` (were easeOut), `locate-off` (was no wait, 0.6s), `phone-off` and `pin-off` (were 0.15s wait). Body dim and the phone and pin wiggle are unchanged. Measured in a browser: all 12 slashes finish at 0.55s. `alarm-clock-off`, `cloud-off` and `timer-off` were already done.
- [x] `alarm-clock-off` now rocks 6 degrees like the alarm-clock family and also fades the body like the other off icons, both over 0.7s (done 2026-10-05, owner asked for both). `phone-off` and `pin-off` already did the same two things.

### 16. Singles

- [x] `circle-minus`: the line now copies the Huge `minus-sign` (done 2026-10-05). The circle squeeze is unchanged.
- [x] `zoom-out`: the minus now copies the Huge `minus-sign` (done 2026-10-05). Huge `zoom-out` is not changed.
- [x] Standalone `minus`: now spins 180 and shrinks to 0.7 like the Huge `minus-sign`, and it is the reference for the Lucide badges (done 2026-10-05).
- [x] `git-branch-plus`: the plus already copies the main plus since the plus family (nothing left to do).
- [x] `sun`, `sun-dim`, `sun-medium` all take 0.8s now. `sun` swings its rays out and back like `sun-medium` instead of turning 12 and staying (done 2026-10-05, owner said next, so my advice was applied). Measured: all three end at about 0.8s.
- [x] `upload` and `download` match in both libraries (done 2026-10-05, owner asked). Lucide `upload` and `download` copy the Huge pair: the arrow slides out 4 while fading, comes back from the other end, the tray dips 1 at the end, all 0.8s. Huge `upload-0-1` tray timing now equals Huge `download` (0.75 and 0.9). The two arrows go opposite ways on purpose. Measured in a browser: all four end at about 0.8s.
- [x] `thumbs-up` default 0.9 and `venus` default 0.8 were fixed to 1 with the `duration` default change (see family 10). `thumbs-down` and `mars` already had 1, so the four now agree on the setting, but their own timings are still tuned separately.
- [x] `map-pin` copies `pin` (dip 1, rock 9 degrees, 0.7s) and so do `map-pin-check`, `map-pin-check-inside` and `map-pinned`, which shared the old 1.1s rock of `map-pin` (done 2026-10-05). `pin-off` is unchanged.
- [ ] `shield` dips first, its siblings swell first. Confidence: 45%.
- [x] Huge singles (done 2026-10-05, owner said do the best): `location-0-1` lifts 1.5 like its three siblings (was 3, which would also reach past the top edge). `shield-0-2` copies the `shield-0-1` pulse (grow 1.1, dip 0.96, 0.6s) and keeps its head pulse. `alert-0-2` copies the alert family (triangle pulses, the exclamation mark swings 0.6s) instead of shaking the whole icon. `badge-check` pulses like the other Huge badges and the tick starts at 0.15s like `shield-check` (the 360 spin is gone). Measured in a browser. Left alone: `volume-minus` (the squeeze may be on purpose, like `volume-x`), `shield` (Lucide) and `badge-info`.

## Not worth fixing

- X badge scale 1.3 against 1.2, and delays 0, 0.1, 0.15 and 0.3. The delays are staged per family, for example `message-*` waits 0.3s for the bubble.
- Alert and question marks that differ by a few degrees. `history` reverses on purpose. `cloud-check` and the Huge `badge-check` delay look on purpose.
- Families with no real majority and no clear model: Lucide `wallet`, `hand`, `eye`, `mouse`, `music`, `wifi`. Huge `pencil`, `video`, `text`, `coffee`, `lock`, `delivery`, `phone`, `check`.

## Already consistent

Lucide: user, calendar, git, corner, list, mail, square, volume, badge, align, flag, heading, image, key, layout, locate, plug, repeat, trending, trash, file (the 22 Pop icons), circle (14 of 17).

Huge: layout, arrow, panel, corner, notification, calendar, heart, mail, finger, git, bookmark, chevron, security, sidebar, add, analytics, cancel, dashboard, information, minus, passport, store, task, wallet, volume, image, repeat, sorting.

Parts that already match everywhere: the 8 search magnifiers, the Huge plus, x, slash, alert, question and info badges, the Lucide cog badge, the Lucide user head, the clock minute hand, the folder lift, calendar rings, the mail flap and the file pop.
