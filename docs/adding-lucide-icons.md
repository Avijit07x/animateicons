# Adding Lucide icons

How to add icons to the Lucide library (`icons/lucide/`). The shapes come from [Lucide](https://lucide.dev). Read [CONTRIBUTING.md](../CONTRIBUTING.md) first for the general flow. This page covers what is specific to Lucide. For the Huge library see [adding-huge-icons.md](./adding-huge-icons.md).

## Where the shapes come from

The project already depends on `lucide-react` (kept only as the source of Lucide shapes, the site itself no longer imports it), so the icon data is in your own `node_modules`. No extra install is needed.

Each icon is one file, `node_modules/lucide-react/dist/esm/icons/<name>.mjs`, with a list called `__iconNode` holding `[tag, attributes]` pairs. File names are the Lucide icon names in kebab-case, and they are the names we use too.

The folder also holds old names as alias files that only re-export another icon. For example `activity-square.mjs` contains `export { default } from './square-activity.mjs'`. Always register the canonical name, and don't add an alias next to the icon it points to. The script below skips alias files.

## 1. Find icons you don't have yet

Run this from the repo root. It lists Lucide icons that are not in `data/lucide-icons.json` and whose geometry doesn't match an icon you already have:

```bash
cat > /tmp/candidates.mjs <<'EOF'
import { readFileSync, readdirSync } from "node:fs";

const icons = "node_modules/lucide-react/dist/esm/icons";
const have = new Set(JSON.parse(readFileSync("data/lucide-icons.json", "utf8")).map((i) => i.name));

const load = (name) => {
	try {
		const src = readFileSync(`${icons}/${name}.mjs`, "utf8");
		return eval(src.match(/const __iconNode = ([\s\S]*?);\n/)[1]);
	} catch {
		return null;
	}
};
const shape = (node) =>
	JSON.stringify(
		node
			.map(([tag, { key, ...attrs }]) => [tag, Object.entries(attrs).sort()])
			.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
	);

const owned = new Set([...have].map(load).filter(Boolean).map(shape));
const fresh = readdirSync(icons)
	.filter((f) => f.endsWith(".mjs"))
	.map((f) => f.slice(0, -4))
	.filter((name) => !have.has(name))
	.filter((name) => {
		const node = load(name);
		return node && !owned.has(shape(node));
	});

console.log(fresh.length, "candidates");
console.log(fresh.join(" "));
EOF
cp /tmp/candidates.mjs ./_candidates.mjs && node _candidates.mjs; rm _candidates.mjs
```

The script has to run inside the repo so the relative paths resolve, which is why it is copied in and then removed. Don't commit it.

The geometry check catches exact twins that only differ by name. Two examples from earlier batches: `gamepad-2` is identical to `gamepad`, and `share-2` is identical to `share`. It cannot catch icons that merely look alike, for example `maximize` next to `scan`, or `maximize-2` next to `move-diagonal`. Compare those by eye and skip them.

Prefer everyday UI icons over one-off illustrations, and favour icons that have an obvious motion (something that opens, spins, drops, fills or points).

### Add the whole family

Icons get used in sets. Anyone who needs `panel-left-open` will need the right, top and bottom versions and the matching `close` ones. So when you add an icon, add its opposites and directional variants in the same batch: up and down, left and right, on and off, open and close, add and remove.

To find the siblings of an icon, filter the candidate list by its stem:

```bash
node _candidates.mjs | tr ' ' '\n' | grep '^panel-'
```

Run it before `rm _candidates.mjs` from the step above, and read the result for real partners.

## 2. Print an icon's geometry

```bash
node -e '
const src = require("fs").readFileSync(`node_modules/lucide-react/dist/esm/icons/${process.argv[1]}.mjs`, "utf8");
const node = eval(src.match(/const __iconNode = ([\s\S]*?);\n/)[1]);
for (const [tag, { key, ...rest }] of node) console.log(tag, JSON.stringify(rest));
' pill
```

```
path {"d":"m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"}
path {"d":"m8.5 8.5 7 7"}
```

Copy the attributes verbatim into JSX (`rect`, `circle`, `line`, `path` and so on). Don't retype or simplify the coordinates. Drop the `key` attribute.

## 3. Name it

The Lucide name is the JSON `name`. The file adds `-icon`, and the component is PascalCase with `Icon` on the end.

| Lucide name        | File                        | Component           |
| ------------------ | --------------------------- | ------------------- |
| `dumbbell`         | `dumbbell-icon.tsx`         | `DumbbellIcon`      |
| `arrow-up-to-line` | `arrow-up-to-line-icon.tsx` | `ArrowUpToLineIcon` |
| `dice-5`           | `dice-5-icon.tsx`           | `Dice5Icon`         |

The component must be `XxxIcon`, with `XxxIconHandle` and `XxxIconProps` next to it. `tests/icons/naming.test.ts` fails otherwise.

## 4. Create the icon file

Copy an existing file from `icons/lucide/` and keep its structure: `"use client"`, `forwardRef`, `useImperativeHandle` exposing `startAnimation` and `stopAnimation`, `LazyMotion` with `domMin`, `onMouseEnter` and `onMouseLeave`. No comments in icon files, the lint rule rejects them.

Lucide icons are already drawn at `strokeWidth="2"` with round caps and joins, which is what the template's `<svg>` sets. The shapes go in as they are, with no stroke attributes on the individual elements.

### Animation rules

- Aim for 0.3s to 0.8s, visible but not distracting. Multiply every duration by the `duration` prop. If a motion is barely noticeable at 24px, make it bigger.
- Put `animate={controls} initial="normal"` on the `m.svg` and give child elements only `variants`. Every variant set needs `normal` and `animate`.
- For scale or rotate, set `style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}` using the icon's real pivot.
- If an animation ends on a look identical to the rest state but a different value (a full spin, a 180 degree turn of a symmetric shape), give `normal` `transition: { duration: 0 }` so mouse leave doesn't spin backwards.
- Draw-on effects use `strokeDasharray` set to the path length plus a `strokeDashoffset` variant. Measure the length with `path.getTotalLength()` in the browser console.
- Keep moves small enough that strokes don't get clipped by the 24 by 24 view box.
- Keep the shape identical to the Lucide source at rest.
- To animate parts independently, split them into separate elements. When a path packs several strokes into one `d`, split it into separate paths first.

## 5. Register it

Add an entry to `data/lucide-icons.json`:

```json
{
	"name": "dumbbell",
	"addedAt": "2026-09-27",
	"category": ["Medical"],
	"keywords": ["dumbbell", "fitness", "gym", "workout", "exercise", "strength"]
}
```

`name` is the Lucide name, which is also the filename without `-icon`. Reuse categories that already exist in the manifests, and add a new one only when nothing fits. Keywords should be the words someone would search for.

## 6. Generate and verify

Format first, because the registry embeds the source text:

```bash
pnpm exec prettier --write data/lucide-icons.json icons/lucide/<name>-icon.tsx
pnpm gen:icons
```

Update the icon counts in `README.md` (the headline and the `lucide/` line in the layout tree) and `npm/README.md`. `pnpm check:readme` prints the numbers it expects.

Then run:

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm --filter @animateicons/react verify
```

The last command builds the npm package and enforces the bundle size budgets. If the `lucide (full barrel)` entry fails, its limit is under `size-limit` in `npm/package.json`.

Finally run `pnpm dev`, open `/icons/lucide`, and hover the new icons to check the motion.

## License

Lucide is ISC licensed (Copyright (c) 2026 Lucide Icons and Contributors), and a few icons derived from Feather are MIT licensed (Copyright (c) 2013-present Cole Bemis). Both licenses require the copyright notice to accompany copies of the icons, so they belong in the project's credits or third-party notices.
