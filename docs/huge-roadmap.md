# Huge roadmap

What to add next, in order. Each batch is about 20 icons that a new site or app actually needs, with the Hugeicons name to copy and a motion idea to start from. Work top to bottom: take the first batch that isn't done, follow [adding-huge-icons.md](./adding-huge-icons.md), then tick it off here.

**Next up: batch 5, Life and travel.**

## Status

Snapshot: 2026-10-02, 1170 icons in total (669 Lucide, 501 Huge).

| Done                      | Icons                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Everyday UI               | home, mail, calendar, camera, edit, delete, add, cancel, alert, information, share, link, filter, upload, clock, location, message, image, folder, lock                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Commerce                  | shopping bag, basket and cart set, credit card, payment success, store, delivery truck and box, tracking, invoice, receipt, discount tag, coupon, barcode, money bag, percent, return, package delivered                                                                                                                                                                                                                                                                                                                                                                                             |
| Developer                 | code, terminal, bug, the git set, database, server, api, braces, webhook, cpu, browser, command, component, workflow, repository                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Website essentials        | chevrons, phone, login, logout, sign up, user group, globe, help, minus, more, cookie, newspaper, quote, instagram, linkedin, youtube                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Social (boxed)            | facebook, twitter bird, X, tiktok, threads, medium, vk, behance, blogger, next to the boxed instagram, linkedin and youtube                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Forms and controls        | toggle on and off, the circle and square status set (check, cancel, add, minus), attachment, save, printer, qr code, fingerprint set, scan, keyboard, cursor, text styles, alignment, indent and lists, scissors, sliders horizontal and vertical                                                                                                                                                                                                                                                                                                                                                    |
| Feedback and status       | alert in circle, diamond and square, information square and diamond, help square, the badge set (check, alert, info, question, plus, minus, x), award, flag, hourglass, timer, fire, flash, the shield set, notification and bell variants, mood faces (smile, sad, neutral, confused, angry, laugh), sparkles, idea, check list                                                                                                                                                                                                                                                                     |
| Navigation and layout     | sidebars and panels in all four directions with open and close, grid and list view, layers, layout, table, expand and collapse, full screen, maximize and minimize screen, sorting up and down, more vertical, scroll, cursor pointer, home, the layout set (see below)                                                                                                                                                                                                                                                                                                                              |
| Life and travel (started) | coffee takeaway cup, cup and mug with steam, coffee beans (the rest is batch 5 below)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Families                  | thumbs-down, all eight corner arrows, zoom-out, user-minus, lock-open, stop, git-fork; add, remove, minus, check and off variants of heart, calendar, image, folder, wallet, shopping bag, store, location, basket, mail, copy, filter, user and the fingerprint set; the off variants of link, mic, wifi, phone, video, eye, camera, image, lightbulb, server, webhook, star, save, printer, keyboard, flag, hourglass, timer, flash, shield, notification; phone-incoming, outgoing and missed; filter-remove; mail-open; the off variants of headphones, volume, repeat and pen (as `pencil-off`) |
| Media and content         | music, music note, headphones, volume (low, high, up, minus, mute two ways), speaker, podcast, film, video, forward, backward, repeat, repeat one, playlist, book, book open, pen, pencil, paint brush, palette                                                                                                                                                                                                                                                                                                                                                                                      |
| Account and security      | shield (second style), security check, block, warning and lock, key (two styles), lock keyhole and open, password validation, user circle, user settings, user block, passport with valid and expired, id and id verified                                                                                                                                                                                                                                                                                                                                                                            |
| Business and productivity | analytics with up and down, chart line, briefcase, target, handshake, building, bank, calculator, task with add and remove, kanban, megaphone and megaphone off, blocks, chat, notebook, file with add, remove, up, down, check and block. Clipboard list is skipped because its Hugeicons source is a filled outline                                                                                                                                                                                                                                                                                |
| Social brands             | whatsapp, telegram, pinterest, reddit, twitch, spotify, slack, google, threads, mastodon, snapchat, dribbble, bluesky                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Brand logos (set 1)       | AI: claude, chat-gpt, copilot, deepseek, grok (2 styles), perplexity-ai, mistral, qwen, kimi-ai, google-gemini. Apple: apple (2 styles), music, news, finder, reminder, stocks, intelligence, vision-pro, siri (2 styles). Google: doc, sheet, drive, photos, maps, lens, home, waze. Microsoft: microsoft, admin, windows (new and old), office-3-6-5, wps-office (2 styles), skype. The rest of the brands are in [huge-brand-icons.md](./huge-brand-icons.md)                                                                                                                                     |
| Arrows                    | the arrow set with tails, diagonals, double chevrons, two-way, to-line, corner, undo, redo, shuffle, all directions                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Earlier icons             | the original 33: menu, dashboard, eye, bookmark set, loading, copy, download, heart, search, check, notification, activity, compass, settings, GitHub, Discord, Facebook, Figma, X                                                                                                                                                                                                                                                                                                                                                                                                                   |

The layout set is `layout-0-2` to `layout-0-7`, two and three column, two and three row, grid, list, dashboard, template, panel left and top, and align left, right, top and bottom. `layout-top`, `layout-bottom`, `layout-left` and `layout-right` are skipped because they match `panel-top`, `panel-bottom`, `panel-left` and `panel-right`.

## How to pick

- Choose icons people reach for in the first week of a project, not the whole catalogue. If a designer would ask "do we have an icon for that", it belongs here.
- Skip near-duplicates of icons we already have. Check `data/huge-icons.json` first.
- Prefer shapes with an obvious motion: something that opens, spins, drops, fills, points or blinks.
- **Ship families whole.** If you add an icon, add its opposites and directional variants in the same batch: up and down, left and right, on and off, add and remove, in and out. Anyone who needs thumbs-up will need thumbs-down, and anyone who needs one corner arrow needs all eight. Run the family check in [adding-huge-icons.md](./adding-huge-icons.md) before you call a batch done.
- Keep each batch to one theme so the set feels coherent, and about 20 icons so reviews stay easy.
- Every name below was checked against `@hugeicons/core-free-icons`. Our name is the Hugeicons name in kebab-case, with a trailing `01` written as `-0-1`.

To see what is still missing from a batch, run this from the repo root and read the names it prints:

```bash
node -e '
const have = new Set(require("./data/huge-icons.json").map((i) => i.name));
for (const n of process.argv.slice(1)) if (!have.has(n)) console.log(n);
' name-one name-two name-three
```

## Batch 5: Life and travel

Everyday objects, places and weather. Motion ideas are left to whoever picks it up.

| Icon           | Hugeicons name |
| -------------- | -------------- |
| `pizza-0-1`    | `Pizza01`      |
| `airplane-0-1` | `Airplane01`   |
| `car-0-1`      | `Car01`        |
| `bicycle-0-1`  | `Bicycle01`    |
| `hospital-0-1` | `Hospital01`   |
| `stethoscope`  | `Stethoscope`  |
| `cloud`        | `Cloud`        |
| `umbrella`     | `Umbrella`     |
| `tree-0-1`     | `Tree01`       |
| `leaf-0-1`     | `Leaf01`       |
| `cat`          | `Cat`          |
| `bed`          | `Bed`          |
| `bath`         | `Bath`         |
| `sofa-0-1`     | `Sofa01`       |
| `tv-0-1`       | `Tv01`         |
| `gamepad-0-1`  | `Gamepad01`    |
| `football`     | `Football`     |

## After each batch

1. Move the batch into the Done table above and update the snapshot counts.
2. Run the checks listed in [adding-huge-icons.md](./adding-huge-icons.md), including `pnpm --filter @animateicons/react verify`.
3. If the `huge (full barrel)` size limit in `npm/package.json` fails, raise it. A batch of simple icons adds about 2 kB, a batch with many small parts closer to 6 kB.

## Lucide

The Lucide library follows the same rules, and its pool is `lucide-react` (see [adding-lucide-icons.md](./adding-lucide-icons.md)). Lucide already has broad coverage (669 icons against 437), so the first job there is finishing the families of icons we added in earlier batches. Each of these has a sibling we already ship:

| Icon to add           | Sibling we already ship |
| --------------------- | ----------------------- |
| `fold-horizontal`     | `unfold-vertical`       |
| `unfold-horizontal`   | `fold-vertical`         |
| `panel-right-open`    | `panel-left-open`       |
| `panel-right-close`   | `panel-left-close`      |
| `panel-top-open`      | `panel-left-open`       |
| `panel-top-close`     | `panel-left-close`      |
| `panel-bottom-open`   | `panel-left-open`       |
| `panel-bottom-close`  | `panel-left-close`      |
| `arrow-left-to-line`  | `arrow-up-to-line`      |
| `arrow-right-to-line` | `arrow-down-to-line`    |
| `badge-alert`         | `badge-info`            |
| `badge-plus`          | `badge-info`            |
| `badge-minus`         | `badge-info`            |
| `badge-x`             | `badge-info`            |
| `badge-question-mark` | `badge-info`            |
| `funnel-plus`         | `funnel-x`              |
| `list-filter-plus`    | `list-filter`           |
| `cloud-alert`         | `cloud-check`           |
| `cloud-backup`        | `cloud-sync`            |
| `chevrons-down-up`    | `chevrons-up-down`      |

After that, walk the same themes as above and add only what is genuinely missing.
