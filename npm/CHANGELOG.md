# @animateicons/react

## 0.12.0

### Minor Changes

- Made icons in the same family move alike, in both the `lucide` and `huge` subpaths. 175 icons changed (146 Lucide and 29 Huge). There are no new icons:
  - A mark inside a bigger icon now moves like the standalone icon, and every mark in a family starts at the same moment. The plus turns 90 degrees and grows like `PlusIcon`, the minus and the cross move like `MinusIcon` and `XIcon`, and check ticks draw on and pop. This covers icons such as `UserPlusIcon`, `FolderXIcon`, `MailMinusIcon` and `CalendarCheckIcon`.
  - Pairs move the same way with the direction reversed. `UploadIcon` and `DownloadIcon` (and Huge `Upload01Icon` and `DownloadIcon`) now share one motion, all `Chevron*` and `Chevrons*` icons take 0.6s, and `MoveLeftIcon` and `MoveRightIcon` slide like `MoveHorizontalIcon`.
  - Off icons draw the slash on and fade the body the same way, for example `BellOffIcon`, `StarOffIcon`, `EyeOffIcon`, `ImageOffIcon` and `AlarmClockOffIcon`. Each keeps its own family motion on top, such as the bell swing or the alarm clock rock. Huge `NotificationOffIcon` and `NotificationOff02Icon` now swing, fade and draw the slash.
  - Bells swing more slowly, in 1.1s instead of 0.8s, in both libraries: `BellIcon`, `BellRingIcon`, `BellPlusIcon`, `BellMinusIcon`, `BellDotIcon`, `NotificationIcon`, `Notification02Icon` and `NotificationOff02Icon`.
  - The `Battery*`, `Bookmark*`, `Cloud*`, `Folder*`, `Package*`, `MapPin*`, `Sun*`, `User*` and `Shield*` icons, and Huge `Location01Icon`, `Shield02Icon`, `Alert02Icon` and `BadgeCheckIcon`, now match the rest of their family.
- `MailOpenIcon` and Huge `MailOpen01Icon` keep the envelope still and drop a small sheet of paper into it.
- Three Lucide `Bookmark*` icons now use the current Lucide shape.
- Stopped the Huge `BellDotIcon` from clipping its dot while it grows.
- `MoveVerticalIcon`, `MoveHorizontalIcon`, `MoveDiagonalIcon`, `MoveDiagonal2Icon`, `BoxesIcon`, `GitlabIcon`, `LayoutDashboardIcon`, `ThumbsUpIcon` and `VenusIcon` now default `duration` to 1 like every other icon. Their timings were scaled so the default look is unchanged, and `duration={1}` now means normal speed for all icons.
- Component names, props (`size`, `color`, `duration`, `isAnimated`) and the `startAnimation` and `stopAnimation` handle are unchanged, so no code changes are needed.

## 0.11.0

### Minor Changes

- Added 38 animated Huge brand and app icons, bringing the `huge` subpath from 463 to 501 icons and the package to 1170:
  - Apple: `AppleIcon`, `Apple01Icon`, `AppleFinderIcon`, `AppleIntelligenceIcon`, `AppleMusicIcon`, `AppleNewsIcon`, `AppleReminderIcon`, `AppleStocksIcon`, `AppleVisionProIcon`, `SiriIcon` and `SiriNewIcon`.
  - Google: `GoogleDocIcon`, `GoogleDriveIcon`, `GoogleGeminiIcon`, `GoogleHomeIcon`, `GoogleLensIcon`, `GoogleMapsIcon`, `GooglePhotosIcon` and `GoogleSheetIcon`.
  - AI: `ChatGptIcon`, `ClaudeIcon`, `CopilotIcon`, `DeepseekIcon`, `GrokIcon`, `Grok02Icon`, `KimiAiIcon`, `MistralIcon`, `PerplexityAiIcon` and `QwenIcon`.
  - Microsoft and others: `MicrosoftIcon`, `MicrosoftAdminIcon`, `Office365Icon`, `SkypeIcon`, `WazeIcon`, `WindowsNewIcon`, `WindowsOldIcon`, `WpsOfficeIcon` and `WpsOfficeRectangleIcon`.
- Changed the hover animation of the 22 Lucide `File*` icons (from `FileIcon` to `FileXIcon`). The page now pops and settles instead of flipping over, and the mark inside each icon (plus, cross, check, lock and the rest) moves the way it does in the standalone icon.
- Stopped the Huge `Home01Icon` from clipping its animation at the edge of the icon.
- Component names, props (`size`, `color`, `duration`, `isAnimated`) and the `startAnimation` and `stopAnimation` handle are unchanged, so no code changes are needed.
- The `huge` barrel is now about 129 kB brotlied, close to the 130 kB budget. Single icons and small sets are unaffected because every icon is its own module.

## 0.10.0

### Minor Changes

- Added the `useIconHover` hook. It plays an icon when a user hovers or clicks the button, link or card around it, so you no longer write the mouse handlers yourself:
  - `const { ref, triggerProps } = useIconHover()` for one icon. Pass `{ trigger: "click" }` or `{ trigger: "both" }` to change when it plays. Put `ref` on the icon and spread `triggerProps` on the element.
  - `const { icon, trigger } = useIconHover({ trigger: [{ icon: "bell", trigger: "click" }, ...] })` for several icons in one component. Spread `{...icon.bell}` on each icon and `{...trigger}` on each element. Each element plays only the icons inside it.
  - `IconTrigger` and `IconConfig` are exported as types.
- Stopped the Huge `BookmarkIcon`, `BookmarkCheckIcon`, `BookmarkMinusIcon` and `BookmarkRemoveIcon` from clipping their animation at the edge of the icon.
- The package now ships `THIRD_PARTY_NOTICES.md` for the Lucide and Hugeicons shapes.
- Component names, props and the `startAnimation` and `stopAnimation` handle are unchanged, so no code changes are needed.

## 0.9.0

### Minor Changes

- Added 24 animated Huge icons, bringing the `huge` subpath from 439 to 463 icons and the package to 1132. They arrive as whole families with their opposites and directional variants:
  - Layout: `Layout02Icon` to `Layout07Icon`, `LayoutAlignBottomIcon`, `LayoutAlignLeftIcon`, `LayoutAlignRightIcon`, `LayoutAlignTopIcon`, `LayoutDashboardIcon`, `LayoutGridIcon`, `LayoutListIcon`, `LayoutPanelLeftIcon`, `LayoutPanelTopIcon`, `LayoutTemplateIcon`, `LayoutThreeColumnIcon`, `LayoutThreeRowIcon`, `LayoutTwoColumnIcon` and `LayoutTwoRowIcon`.
  - Coffee: `Coffee01Icon`, `Coffee02Icon`, `Coffee03Icon` and `CoffeeBeansIcon`.
- Reworked the hover animation of 52 Lucide icons. Motion is still a single eased pass that starts and ends at rest, now with larger and more readable movement:
  - `ChevronUpIcon`, `ChevronDownIcon`, `ChevronLeftIcon` and `ChevronRightIcon` give one clear nudge in their direction.
  - The `File*` family (22 icons, from `FileIcon` to `FileXIcon`) now moves as one: the page flips over once, and each icon's own mark keeps its meaning.
  - The `MessageCircle*` and `MessageSquare*` icons (8 icons) squash and pop back, while the mark inside (plus, cross, dots or text) moves on its own.
  - `MoveDiagonalIcon`, `MoveDiagonal2Icon`, `MoveHorizontalIcon` and `MoveVerticalIcon` slide out along their axis and back.
  - `RocketIcon` launches off one corner and comes back in from the opposite one. `PaperclipIcon` swings from its clip, and `LayersIcon`, `VideoIcon`, `GamepadIcon`, `HeadphonesIcon`, `HeadsetIcon`, `LaptopIcon`, `MapPinIcon`, `ClipboardIcon`, `CloudCheckIcon`, `BoxIcon`, `BatteryFullIcon` and `AudioWaveformIcon` were refined the same way.
- Reworked the hover animation of 4 Huge icons. `Layers01Icon` and `Rocket01Icon` now match their Lucide versions, `StarIcon` has a softer wiggle, and `ToggleOnIcon` keeps its track still while the knob moves.
- Component names, props (`size`, `color`, `duration`, `isAnimated`) and the `startAnimation` and `stopAnimation` handle are unchanged, so no code changes are needed.
- The `huge` barrel is now about 119 kB brotlied, close to the 120 kB budget, and the `lucide` barrel is about 93 kB. Single icons and small sets are unaffected because every icon is its own module.

## 0.8.0

### Minor Changes

- Added 87 animated Huge icons, bringing the `huge` subpath from 352 to 439 icons and the package to 1108. They arrive as whole families with their opposites and directional variants:
  - Files and tasks: `FileAddIcon`, `FileBlockIcon`, `FileCheckIcon`, `FileDownIcon`, `FileRemoveIcon`, `FileUpIcon`, `TaskAdd01Icon`, `TaskRemove01Icon`, `Notebook01Icon`.
  - Security and identity: `SecurityBlockIcon`, `SecurityCheckIcon`, `SecurityLockIcon`, `SecurityWarningIcon`, `LockKeyholeIcon`, `LockKeyholeOpenIcon`, `PassportIcon`, `PassportValidIcon`, `PassportExpiredIcon`, `IdVerifiedIcon`, `UserBlock01Icon`.
  - Audio and media: the `Volume*` family (`VolumeHighIcon`, `VolumeUpIcon`, `VolumeMinusIcon`, `VolumeMute01Icon`, `VolumeMute02Icon`, `VolumeOffIcon`), `HeadphonesIcon`, `HeadphoneOffIcon`, `Playlist01Icon`, `PodcastIcon`, `RepeatIcon`, `RepeatOffIcon`, `RepeatOne01Icon`.
  - Analytics and productivity: `AnalyticsUpIcon`, `AnalyticsDownIcon`, `ChartLineIcon`, `KanbanIcon`, `CalculatorIcon`, `Briefcase01Icon`, `Building01Icon`.
  - Brands: Bluesky, Dribbble, Google, Mastodon, Pinterest, Reddit, Slack, Snapchat, Spotify, Telegram, Threads, Twitch and WhatsApp, for example `BlueskyIcon` and `WhatsappIcon`.
  - Assistants: `BotIcon` (blinking eyes, a wiggling antenna and nudging ears) and its opposite `BotOffIcon`.
- Reworked the hover animation of 33 existing Huge icons, among them `EyeIcon`, `HeartIcon`, `SearchIcon`, `DownloadIcon`, `CopyIcon`, `NotificationIcon`, `BookmarkIcon`, `CheckIcon`, `CompassIcon` and the `Dashboard`, `Menu`, `Loading`, `Settings` and social brand icons. As with the Lucide rework in 0.7.0, motion is a single eased pass that starts and ends at rest. Component names, props (`size`, `color`, `duration`, `isAnimated`) and the `startAnimation` and `stopAnimation` handle are unchanged, so no code changes are needed.
- Refined the `FigmaIcon` hover animation in the `lucide` subpath.
- The `huge` barrel is now about 115 kB brotlied, and the size budget for both full barrels is 120 kB.

## 0.7.1

### Patch Changes

- Fixed the TypeScript types for CommonJS consumers. The `require` condition now points to `.d.cts` declarations, so `require("@animateicons/react")` under `node16` or `nodenext` resolution no longer gets ESM types for a CJS file. ESM and bundler resolution are unchanged.
- Fixed the `HistoryIcon` hover animation. Both clock hands used to turn together as one rigid shape. Now only the minute hand makes the full turn and the hour hand stays put, like the other clock icons. No API changes.

## 0.7.0

### Minor Changes

- Added 319 animated Huge icons, bringing the `huge` subpath from 33 to 352 icons and the package to 1021. They arrive as whole families with their opposites and directional variants: forms and controls, feedback and status (`AlertCircleIcon`, `AlertDiamondIcon`, `BadgeCheckIcon`), navigation and layout (`ArrowUpDownIcon`, `BellRingIcon`), calendars, bells, brands and more.
- Added 20 Lucide icons, bringing the `lucide` subpath to 669: `ArrowDownToLineIcon`, `ArrowUpToLineIcon`, `BadgeInfoIcon`, `ChevronFirstIcon`, `ChevronLastIcon`, `CloudCheckIcon`, `CloudSyncIcon`, `ContrastIcon`, `ExpandIcon`, `FoldVerticalIcon`, `FunnelXIcon`, `HardDriveUploadIcon`, `ListFilterIcon`, `MousePointerIcon`, `PanelLeftCloseIcon`, `PanelLeftOpenIcon`, `RotateCcwIcon`, `ShrinkIcon`, `ToggleLeftIcon` and `UnfoldVerticalIcon`.
- Reworked the hover animation of every Lucide icon. Motion is now a single eased pass that starts and ends at rest, with no springs, endless loops or hard jumps. Icons that only pulsed now animate the part that carries the meaning (a tick draws in, a lock shackle lifts, a clock's minute hand turns), and icons of the same family move alike. Component names, props (`size`, `color`, `duration`, `isAnimated`) and the `startAnimation` and `stopAnimation` handle are unchanged, so no code changes are needed.
- The `lucide` barrel is smaller (about 93 kB brotlied, down from about 101 kB) and the `huge` barrel is about 95 kB.

## 0.6.0

### Minor Changes

- Added 140 animated Lucide icons, bringing the `lucide` subpath to 649 icons and the package to 682. Most are everyday UI icons: editing (`SquarePenIcon`, `UndoIcon`, `RedoIcon`, `ClipboardPasteIcon`, `CopyCheckIcon`), status and feedback (`CircleXIcon`, `CircleAlertIcon`, `OctagonAlertIcon`, `SearchXIcon`, `BadgeCheckIcon`), layout and controls (`PanelLeftIcon`, `ToggleRightIcon`, `GripVerticalIcon`, `ChevronsUpDownIcon`, `ZoomInIcon`, `ZoomOutIcon`), plus media, documents, design tools and more.
- Every new icon follows the existing API and is importable three ways: from the barrel (`import { BotIcon } from "@animateicons/react/lucide"`), by its bare alias (`Bot`), or as a deep import (`@animateicons/react/lucide/bot-icon`).

## 0.5.0

### Minor Changes

- Icons are now tree-shakeable. The ESM build ships one module per icon instead of bundling all 542 into a single file, so bundlers can drop the ones you don't import. Previously `import { BellRingIcon }` pulled in the entire library. Measured with esbuild, one icon went from 809 kB to 72 kB raw (86 kB to 26 kB gzipped).
- Added per-icon subpath exports: `@animateicons/react/lucide/<icon-file>` and `@animateicons/react/huge/<icon-file>`, with types. Next.js App Router cannot tree-shake through the `lucide` / `huge` barrels, because the `"use client"` directive on them forms a client boundary. Importing an icon directly takes a Next 16 production build from 918 kB to 71 kB of client JS for one icon. Deep subpaths are ESM-only; `require()` consumers should keep using the barrels.
- No changes to icon markup, animation timing or the public component API. The barrel imports still work exactly as before.

### Patch Changes

- Fixed the `"use client"` banner injector, which was silently not running from tsup's `onSuccess` hook.
- CJS output is unchanged: still a single bundled file per library, since `require()` consumers do not tree-shake.

## 0.4.3

### Patch Changes

- On-demand icon loading in the gallery and updated icon counts across the docs.

## 0.4.2

### Patch Changes

- Enabled ESLint with an icon-structure rule, enforced in CI and on pre-push, and fixed all findings.

## 0.4.1

### Patch Changes

- Refined hover animations for several icons using the `transformBox: view-box` origin pattern (fixes off-pivot rotations and unreliable line draws): trash, trash-2, circle-check, house, mail, message-circle, share, shopping-bag, and wifi (+ wifi-cog, wifi-off, wifi-pen, wifi-sync).

## 0.4.0

### Minor Changes

- Icon names now match Lucide's, with bare-name aliases exported alongside the `*Icon` names.

## 0.3.5

### Patch Changes

- Added pet, daily-life and sound icons; icon count is now derived dynamically.
- Raised the single-icon size budget to 55 kB to match the full-barrel ceiling.

## 0.3.4

### Patch Changes

- New motion system for the bell, alert and navigation icons.

## 0.3.3

### Patch Changes

- 3145a37: Reduce bundle size by ~60% by switching to LazyMotion + lazy m component
