# Lucide roadmap

What to add next to the Lucide library (`icons/lucide/`), in order. Work top to bottom: take the first batch that isn't done, follow [adding-lucide-icons.md](./adding-lucide-icons.md), then tick it off here. The Huge library has its own list in [huge-roadmap.md](./huge-roadmap.md).

**Next up: batch 1, Shapes and status marks.**

## Status

Snapshot: 2026-10-01, 1108 icons in total (669 Lucide, 439 Huge). Lucide itself ships about 1,850 icons, so this list is the part people reach for first: 439 icons in 20 batches. Every name in batches 1 to 19 was checked against `lucide-react` 1.48 and is not in `data/lucide-icons.json` yet. Batches 1 to 10 are the core set. Batches 11 to 20 are worth doing after them, in order.

## How to pick

- **A family is finished in one batch.** If a batch touches a family, it carries every member of it: all four directions, all eight corners, plus and minus, check and x, on and off, every signal or battery level. Batches differ in size on purpose. Never split a family across two batches.
- Our name is the Lucide name, unchanged. The icon file is `<name>-icon.tsx`.
- The **Already shipped** column lists the members of the same family we have today, so you can match their motion and timing.
- Copy the shape exactly from `node_modules/lucide-react/dist/esm/icons/<name>.mjs`, then give it motion that fits its family. Reuse the family's `duration` default and timing so siblings feel alike.
- Skip near-duplicates. Check the geometry against what we have before adding, as described in [adding-lucide-icons.md](./adding-lucide-icons.md).
- Keep every new icon's `duration` default at `1` unless its siblings use something else, and scale every timing by it.

To see what is still missing from the whole list, run this from the repo root and read the names it prints (paste the names of the batch you are on):

```bash
node -e '
const have = new Set(require("./data/lucide-icons.json").map((i) => i.name));
for (const n of process.argv.slice(1)) if (!have.has(n)) console.log(n);
' name-one name-two name-three
```

## Batch 1: Shapes and status marks

The plain shapes every design tool has, and the status marks that go on them. Squares and circles get their full plus, minus, x, stop and slash set. 28 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Plain shapes | `circle`, `square`, `triangle`, `hexagon`, `octagon`, `diamond`, `pentagon` | none |
| Octagon set | `octagon-x`, `octagon-minus`, `octagon-pause` | `octagon-alert` |
| Diamond set | `diamond-plus`, `diamond-minus`, `diamond-percent` | none |
| Triangle set | `triangle-dashed`, `triangle-right` | `triangle-alert` |
| Square status set | `square-plus`, `square-minus`, `square-x`, `square-stop`, `square-slash`, `square-dot`, `square-check-big` | `square-check`, `square-pause`, `square-play`, `square-dashed` |
| Circle status set | `circle-slash`, `circle-slash-2`, `circle-off`, `circle-power`, `circle-ellipsis`, `circle-star` | `circle-check`, `circle-x`, `circle-plus`, `circle-minus`, `circle-dot` |

## Batch 2: Arrows: big and boxed

Block arrows and arrows in squares and circles, in every direction. The corner and out variants come with them so no direction is missing. 28 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Big arrows | `arrow-big-down`, `arrow-big-left`, `arrow-big-right`, `arrow-big-up-dash`, `arrow-big-down-dash`, `arrow-big-left-dash`, `arrow-big-right-dash` | `arrow-big-up` |
| Square arrows, four sides | `square-arrow-up`, `square-arrow-down`, `square-arrow-left`, `square-arrow-right` | none |
| Square arrows, corners | `square-arrow-up-left`, `square-arrow-up-right`, `square-arrow-down-left`, `square-arrow-down-right` | none |
| Square arrows, out and enter | `square-arrow-out-up-left`, `square-arrow-out-down-left`, `square-arrow-out-down-right`, `square-arrow-right-enter`, `square-arrow-right-exit` | `square-arrow-out-up-right` |
| Circle arrows, four sides | `circle-arrow-up`, `circle-arrow-down`, `circle-arrow-left`, `circle-arrow-right` | none |
| Circle arrows, out | `circle-arrow-out-up-left`, `circle-arrow-out-up-right`, `circle-arrow-out-down-left`, `circle-arrow-out-down-right` | none |

## Batch 3: Arrows: move, sort and line

Finishes the move family, the sorting arrows and the arrows that touch a line or a dot. 23 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Move | `move-up`, `move-down`, `move-up-left`, `move-up-right`, `move-down-left`, `move-down-right` | `move`, `move-left`, `move-right`, `move-horizontal`, `move-vertical`, `move-diagonal`, `move-diagonal-2` |
| Sort by size | `arrow-up-narrow-wide`, `arrow-down-narrow-wide`, `arrow-up-wide-narrow`, `arrow-down-wide-narrow` | none |
| Sort by letter | `arrow-down-a-z`, `arrow-down-z-a` | `arrow-up-a-z`, `arrow-up-z-a` |
| Sort by number | `arrow-down-0-1`, `arrow-down-1-0` | `arrow-up-0-1`, `arrow-up-1-0` |
| From and to a line | `arrow-down-from-line`, `arrow-up-from-line`, `arrow-left-from-line`, `arrow-right-from-line`, `arrow-left-to-line`, `arrow-right-to-line` | `arrow-down-to-line`, `arrow-up-to-line` |
| Swap and dot | `arrow-right-left`, `arrow-down-to-dot`, `arrow-up-from-dot` | `arrow-left-right` |

## Batch 4: Chevron boxes and window controls

The boxed chevrons finish the chevron set we just reworked. Window controls pair each action with its opposite. 14 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Square chevrons | `square-chevron-up`, `square-chevron-down`, `square-chevron-left`, `square-chevron-right` | `circle-chevron-up`, `circle-chevron-down`, `circle-chevron-left`, `circle-chevron-right` |
| Chevron squeeze | `chevrons-down-up` | `chevrons-up-down` |
| Maximize and minimize | `maximize`, `minimize`, `maximize-2`, `minimize-2`, `fullscreen` | none |
| Refresh | `refresh-ccw`, `refresh-ccw-dot`, `refresh-cw-off` | `refresh-cw` |
| Power | `power-off` | `power` |

## Batch 5: Layout and panels

Panels in all four directions with open and close, the dashed outlines, and the column, row and grid layouts. 30 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Panels, right | `panel-right`, `panel-right-open`, `panel-right-close` | `panel-left`, `panel-left-open`, `panel-left-close` |
| Panels, top | `panel-top`, `panel-top-open`, `panel-top-close` | none |
| Panels, bottom | `panel-bottom`, `panel-bottom-open`, `panel-bottom-close` | none |
| Panels, dashed | `panel-left-dashed`, `panel-right-dashed`, `panel-top-dashed`, `panel-bottom-dashed`, `panel-left-right-dashed`, `panel-top-bottom-dashed` | none |
| Columns and rows | `columns-2`, `columns-3`, `columns-4`, `rows-2`, `rows-3`, `rows-4` | none |
| Grids | `grid-2x2`, `grid-3x2`, `grid-3x3`, `grid-2x2-plus`, `grid-2x2-check`, `grid-2x2-x` | `layout-grid` |
| Layout panels | `layout-panel-left`, `layout-panel-top`, `layout-template` | `layout-dashboard`, `layout-list` |

## Batch 6: People and accounts

Avatar shapes and the account actions that go with them. 9 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Avatars | `circle-user`, `square-user`, `square-user-round` | `circle-user-round` |
| Account actions | `user-round-plus`, `user-shield`, `user-key`, `user-round-key` | `user-plus`, `user-minus`, `user-check`, `user-x`, `user-round-check` |
| Groups | `user-group`, `user-round-group` | `users-round` |

## Batch 7: Messages

Every state of the chat bubbles: check, warning, off, reply, code, dashed and the square-only extras. 18 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Circle bubbles | `message-circle-check`, `message-circle-warning`, `message-circle-off`, `message-circle-reply`, `message-circle-code`, `message-circle-dashed`, `message-circle-dashed-check` | `message-circle`, `message-circle-plus`, `message-circle-x`, `message-circle-heart`, `message-circle-more` |
| Square bubbles | `message-square-check`, `message-square-warning`, `message-square-off`, `message-square-reply`, `message-square-code`, `message-square-dashed` | `message-square`, `message-square-plus`, `message-square-x`, `message-square-heart`, `message-square-dot`, `message-square-text` |
| Square extras | `message-square-more`, `message-square-quote`, `message-square-share`, `message-square-lock`, `message-square-diff` | none |

## Batch 8: Security

The whole shield family, plus the keyhole lock pair. 13 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Shield actions | `shield-plus`, `shield-minus`, `shield-off`, `shield-ban`, `shield-question-mark`, `shield-ellipsis` | `shield`, `shield-check`, `shield-alert`, `shield-x`, `shield-user` |
| Shield styles | `shield-half`, `shield-lock`, `shield-keyhole`, `shield-cog`, `shield-cog-corner` | none |
| Keyhole lock | `lock-keyhole`, `lock-keyhole-open` | none |

## Batch 9: Developer tools and data

Pull requests finish the git set, then the database and server families and the editor tools developers reach for. 27 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Pull requests | `git-pull-request`, `git-pull-request-draft`, `git-pull-request-closed`, `git-pull-request-create`, `git-pull-request-create-arrow`, `git-pull-request-arrow`, `git-graph` | `git-branch`, `git-merge`, `git-fork`, `git-compare`, `git-merge-conflict` |
| Database | `database-plus`, `database-minus`, `database-check`, `database-x`, `database-search`, `database-zap`, `database-arrow-down`, `database-arrow-up` | `database`, `database-backup` |
| Server | `server-plus`, `server-off`, `server-cog`, `server-crash` | `server` |
| Editor tools | `square-terminal`, `square-code`, `regex`, `variable`, `microchip`, `bug-off`, `bug-play`, `webhook-off` | none |

## Batch 10: Commerce

Cart, card, ticket and tag actions, plus the money circles. 22 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Cart | `shopping-cart-plus`, `shopping-cart-minus` | `shopping-cart` |
| Card | `credit-card-check`, `credit-card-plus`, `credit-card-minus`, `credit-card-x`, `credit-card-reader` | `credit-card` |
| Ticket | `ticket-check`, `ticket-plus`, `ticket-minus`, `ticket-x`, `ticket-slash` | `ticket`, `ticket-percent` |
| Tag | `tag-plus`, `tag-x` | `tag` |
| Money circles | `circle-dollar-sign`, `circle-euro`, `circle-pound-sterling`, `circle-percent` | none |
| Banknote | `banknote-check`, `banknote-x`, `banknote-arrow-up`, `banknote-arrow-down` | none |

## Batch 11: Text and lists

Alignment, the remaining headings, case and list actions. 29 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Text alignment | `text-align-start`, `text-align-center`, `text-align-end`, `text-align-justify` | none |
| Headings | `heading-3`, `heading-4`, `heading-5`, `heading-6` | `heading`, `heading-1`, `heading-2` |
| Script | `superscript`, `subscript` | none |
| List actions | `list-check`, `list-todo`, `list-minus`, `list-x`, `list-start`, `list-end`, `list-indent-increase`, `list-indent-decrease`, `list-filter-plus`, `list-chevrons-down-up` | `list`, `list-plus`, `list-ordered`, `list-checks`, `list-filter`, `list-collapse`, `list-chevrons-up-down` |
| Case | `case-upper`, `case-lower`, `case-sensitive` | none |
| Text blocks | `text-wrap`, `text-quote`, `text-initial`, `pilcrow-left`, `pilcrow-right`, `remove-formatting` | none |

## Batch 12: Devices and signal

Signal bars, wifi and battery levels so each family has every step, and the full monitor set. 26 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Wifi levels | `wifi-high`, `wifi-low`, `wifi-zero` | `wifi`, `wifi-off` |
| Signal levels | `signal-high`, `signal-medium`, `signal-low`, `signal-zero` | `signal` |
| Battery levels | `battery-medium`, `battery-plus`, `battery-warning` | `battery`, `battery-low`, `battery-full`, `battery-charging` |
| Monitors | `monitor-check`, `monitor-x`, `monitor-off`, `monitor-up`, `monitor-down`, `monitor-play`, `monitor-pause`, `monitor-stop`, `monitor-dot`, `monitor-cog`, `monitor-cloud`, `monitor-speaker`, `monitor-pc` | `monitor`, `monitor-smartphone` |
| Laptop and phone | `laptop-minimal-check`, `smartphone-charging`, `smartphone-nfc` | none |

## Batch 13: Media and recording

Film, microphones, music notes, discs and cameras with their off states. 17 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Film and play | `film`, `play-off` | none |
| Microphones | `mic-vocal`, `mic-audio-lines`, `mic-signal` | `mic`, `mic-off` |
| Music | `music-2`, `music-3`, `music-4`, `disc`, `disc-album` | `music`, `disc-2`, `disc-3` |
| Cameras and radio | `webcam-off`, `cctv`, `cctv-off`, `radio-receiver`, `radio-off` | none |
| Audio lines | `audio-lines-off`, `audio-lines-x` | none |

## Batch 14: Places and map pins

Every map pin state, the house variants and the buildings people look for. 26 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Map pins | `map-pin-plus`, `map-pin-minus`, `map-pin-off`, `map-pin-x`, `map-pin-pen`, `map-pin-search`, `map-pin-house` | `map-pin`, `map-pin-check`, `map-pin-check-inside`, `map-pinned` |
| Map pins, inside | `map-pin-plus-inside`, `map-pin-minus-inside`, `map-pin-x-inside` | none |
| Maps | `map-plus`, `map-minus` | `map` |
| Houses | `house-plus`, `house-heart`, `house-cog`, `house-plug`, `house-wifi` | `house` |
| Buildings | `building`, `building-complex`, `building-complex-plus`, `hotel`, `hospital`, `school`, `university`, `factory`, `warehouse` | `building-2` |

## Batch 15: Transport

The vehicles that show up in booking, delivery and travel UIs. 14 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Road | `bus`, `bus-front`, `car-front`, `car-taxi-front`, `motorbike`, `scooter`, `ambulance`, `fuel`, `ev-charger` | `car` |
| Rail and water | `train-front`, `tram-front`, `ship` | none |
| Air | `plane-takeoff`, `plane-landing` | `plane` |

## Batch 16: Calendar and time

Calendar and clock states that are not covered by the Lucide set yet. 13 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Calendar | `calendar-off`, `calendar-sync`, `calendar-arrow-up`, `calendar-arrow-down`, `calendar-cog`, `calendar-chevrons-right`, `calendars` | `calendar`, `calendar-check`, `calendar-plus`, `calendar-minus`, `calendar-x`, `calendar-clock` |
| Clock | `clock-check`, `clock-arrow-left`, `clock-arrow-right`, `clock-fading` | `clock`, `clock-plus`, `clock-alert`, `clock-arrow-up`, `clock-arrow-down` |
| With a clock | `mail-clock`, `clipboard-clock` | `file-clock` |

## Batch 17: Favourites

Star and heart get every state, and bookmarks get their off state. 12 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Star | `star-half`, `star-plus`, `star-minus`, `star-x`, `star-check` | `star`, `star-off` |
| Heart | `heart-plus`, `heart-minus`, `heart-x`, `heart-off`, `heart-crack`, `heart-handshake` | `heart`, `heart-pulse` |
| Bookmark | `bookmark-off` | none |

## Batch 18: Files and folders

The file and folder variants a document UI needs. The eight `*-corner` file icons are left out on purpose, see below. 44 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| File charts | `file-chart-column`, `file-chart-column-increasing`, `file-chart-line`, `file-chart-pie` | none |
| File in and out | `file-input`, `file-output`, `file-symlink`, `file-stack`, `file-diff` | none |
| File content | `file-braces`, `file-cog`, `file-user`, `file-badge`, `file-box`, `file-sliders`, `file-pen-line`, `file-digit`, `file-axis-3d` | `file`, `file-code`, `file-text`, `file-type`, `file-image` |
| File media | `file-play`, `file-video-camera`, `file-headphone`, `file-volume`, `file-signal` | `file-music` |
| File status | `file-question-mark`, `file-exclamation-point` | `file-check`, `file-x`, `file-minus`, `file-plus` |
| Folders | `folder-archive`, `folder-bookmark`, `folder-clock`, `folder-code`, `folder-cog`, `folder-down`, `folder-up`, `folder-git`, `folder-git-2`, `folder-input`, `folder-output`, `folder-kanban`, `folder-open-dot`, `folder-pen`, `folder-root`, `folder-search-2`, `folder-symlink`, `folder-sync`, `folders` | none |

## Batch 19: Books and notes

The whole book family, the library and notebook sets and sticky notes. 37 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Book | `book`, `book-check`, `book-plus`, `book-minus`, `book-x`, `book-alert`, `book-lock`, `book-search`, `book-key`, `book-user`, `book-heart`, `book-bookmark` | `book-open`, `book-open-check`, `book-open-text` |
| Book content | `book-text`, `book-type`, `book-a`, `book-image`, `book-audio`, `book-headphones`, `book-copy`, `book-dashed`, `book-down`, `book-up`, `book-up-2` | none |
| Library and notebooks | `library`, `library-big`, `notebook`, `notebook-text`, `notebook-tabs`, `notebook-dot`, `notepad-text`, `notepad-text-dashed` | `notebook-pen` |
| Sticky notes | `sticky-note-check`, `sticky-note-plus`, `sticky-note-minus`, `sticky-note-x`, `sticky-note-off`, `sticky-notes` | none |

## Batch 20: Brands from older Lucide

Lucide dropped its brand logos in 1.0, so the installed `lucide-react` no longer has these. Copy the paths from the last releases that did: `lucide-react@0.468.0` for codepen, codesandbox, dribbble, pocket, slack, trello, twitch and youtube, and `lucide-react@0.544.0` for chromium. The set finishes the nine logos already shipped. 9 icons.

| Family | Icons to add | Already shipped |
| --- | --- | --- |
| Brand logos | `codepen`, `codesandbox`, `dribbble`, `pocket`, `slack`, `trello`, `twitch`, `youtube`, `chromium` | `github`, `gitlab`, `twitter`, `facebook`, `linkedin`, `instagram`, `chrome`, `figma`, `framer` |

## Not planned

These are in Lucide but are left out on purpose. Add one only when a real project asks for it, and then add its whole family.

- **Look-alikes of icons we have:** the eight `file-*-corner` icons (`file-plus-corner`, `file-minus-corner`, `file-check-corner`, `file-x-corner`, `file-search-corner`, `file-code-corner`, `file-type-corner`, `file-braces-corner`), the `*-2` calendar variants (`calendar-check-2`, `calendar-plus-2`, `calendar-minus-2`, `calendar-x-2`), `pen`, `pencil-line`, `cog` and `settings-2`.
- **Currency variants:** the `badge-*` and `receipt-*` icons for euro, pound, yen, rupee, ruble, franc and lira.
- **Clock faces:** `clock-1` to `clock-12`.
- **Design-tool alignment:** the 27 `align-*` icons and the `between-*`, `gap-*` and `stretch-*` icons.
- **Hobbies and nature:** food and drink, animals, plants, chess and playing cards, zodiac signs, tools, sport and the music clefs.
- **Everything else:** about 900 single-purpose icons that no batch above needs.
