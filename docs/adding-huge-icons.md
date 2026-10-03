# Adding Huge icons

How to add icons to the Huge library (`icons/huge/`). The shapes come from the free [Hugeicons](https://hugeicons.com) set. Everything else (template, registry, checks) works exactly like the Lucide library, so read [CONTRIBUTING.md](../CONTRIBUTING.md) first for the general flow. This page covers what is specific to Huge.

## Where the shapes come from

The free icons are published as `@hugeicons/core-free-icons` (MIT license, about 6,000 stroke icons). It holds the raw SVG data. `@hugeicons/react` is only a component wrapper around that data, and we don't use it.

**Do not add either package to this repo.** Icons are copied in as plain SVG paths, the same way the existing Huge icons are. Install the data package in a temporary folder outside the repo:

```bash
mkdir -p /tmp/hugeicons && cd /tmp/hugeicons
npm init -y && npm i @hugeicons/core-free-icons
```

Only copy from this free package. Icons from Hugeicons Pro are under a different license and must not be used here.

Each icon is one file, `node_modules/@hugeicons/core-free-icons/dist/esm/<Name>Icon.js`, exporting a list of `[tag, attributes]`. Names are PascalCase, for example `Home01Icon`, `Filter`, `InformationCircle`. To browse, list the folder:

```bash
ls node_modules/@hugeicons/core-free-icons/dist/esm | grep -i "^calendar"
```

## 1. Pick an icon and print its geometry

Check `data/huge-icons.json` first so you don't add something that already exists, and skip look-alikes of icons already in the library.

Then print the shapes (replace `Clock01` with the icon name):

```bash
node -e '
const fs = require("fs");
const name = process.argv[1];
const src = fs.readFileSync(`node_modules/@hugeicons/core-free-icons/dist/esm/${name}Icon.js`, "utf8");
const node = eval(src.match(/= (\[[\s\S]*?\]);\n\nexport/)[1]);
for (const [tag, { key, stroke, strokeLinecap, strokeLinejoin, strokeWidth, ...rest }] of node) console.log(tag, JSON.stringify(rest));
' Clock01
```

```
circle {"cx":"12","cy":"12","r":"10"}
path {"d":"M12 8V12L14 14"}
```

Copy the `d` strings and circle attributes verbatim. Don't retype or simplify them.

## Add the whole family

Icons get used in sets. Anyone who needs `thumbs-up` will need `thumbs-down`, and anyone who needs `corner-down-left` will need all eight corner arrows. So when you add an icon, add its opposites and directional variants in the same batch:

- direction: up and down, left and right, and the diagonals
- state: on and off, open and closed, mute and unmute
- action: add and remove, in and out, incoming and outgoing

For the "off" variants (a diagonal slash across the icon), the slash is a separate path, so animate it as a draw-on over a dimmed icon. See `eye-off-icon.tsx` for the pattern.

To find siblings you haven't added yet, save this as `family.js` in the temporary Hugeicons folder and run it against the manifest:

```bash
cd /tmp/hugeicons
cat > family.js <<'EOF'
const fs = require("fs");
const dir = "node_modules/@hugeicons/core-free-icons/dist/esm";
const kebab = (n) => n.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Za-z])(\d)(\d)$/, "$1-$2-$3").replace(/([A-Za-z])(\d)$/, "$1-$2").toLowerCase();
const all = fs.readdirSync(dir).filter((f) => f.endsWith("Icon.js")).map((f) => f.slice(0, -7));
const byKebab = new Map(all.map((n) => [kebab(n), n]));
const have = new Set(JSON.parse(fs.readFileSync(process.argv[2], "utf8")).map((i) => i.name));
const parts = ["Off", "Add", "Remove", "Minus", "Plus", "Check", "Down", "Up", "Left", "Right", "Open", "Incoming", "Outgoing", "Missed"];
for (const name of have) {
  const base = byKebab.get(name);
  if (!base) continue;
  const stem = base.replace(/\d+$/, "");
  const siblings = all.filter((x) => x !== base && parts.some((p) => new RegExp(`^${stem}${p}(0\\d)?$`).test(x)) && !have.has(kebab(x)));
  if (siblings.length) console.log(`${name}: ${siblings.join(" ")}`);
}
EOF
node family.js /path/to/animateicons/data/huge-icons.json
```

It prints, for each icon we ship, the related Hugeicons names we don't have yet. Not every line is a true partner (an `Add` variant of an unrelated icon is not needed), so read the list and pick the real opposites and variants.

## 2. Name it

| Hugeicons name      | File                          | Component               | JSON `name`          |
| ------------------- | ----------------------------- | ----------------------- | -------------------- |
| `Clock01`           | `clock-0-1-icon.tsx`          | `Clock01Icon`           | `clock-0-1`          |
| `Edit02`            | `edit-0-2-icon.tsx`           | `Edit02Icon`            | `edit-0-2`           |
| `Filter`            | `filter-icon.tsx`             | `FilterIcon`            | `filter`             |
| `InformationCircle` | `information-circle-icon.tsx` | `InformationCircleIcon` | `information-circle` |

Names without a number become plain kebab-case. A trailing number `NN` becomes `-0-N` (`01` is `-0-1`, `02` is `-0-2`). The component must be `XxxIcon` with `XxxIconHandle` and `XxxIconProps`. `tests/icons/naming.test.ts` fails otherwise.

## 3. Create the icon file

Copy an existing file from `icons/huge/` (for example `download-icon.tsx`) and keep its structure: `"use client"`, `forwardRef`, `useImperativeHandle` exposing `startAnimation` and `stopAnimation`, `LazyMotion` with `domMin`, `onMouseEnter` and `onMouseLeave`. No comments in icon files, the lint rule rejects them.

Things that differ from copying a Lucide icon:

- **Stroke width.** Hugeicons are drawn with a 1.5 stroke. The library renders every icon at `strokeWidth="2"` on the `<svg>`, with round caps and joins, so leave the paths bare. Drop `stroke`, `strokeWidth`, `strokeLinecap`, `strokeLinejoin` and `key` from each path, as the dump command above already does.
- **Several strokes in one path.** Hugeicons often pack separate strokes into a single `d`. `Clock01` draws both hands as `M12 8V12L14 14`, so they can only move together. To animate parts independently, split the path into separate `<m.path>` elements first. With round caps and joins the icon looks identical at rest.
- **Dots are tiny paths** such as `M12.125 8.25H12M12.25 8.25C...`. Animate them as their own element (for example an opacity blink or a small `y` bounce).

### Animation rules

- Aim for 0.3s to 0.8s, visible but not distracting. Multiply every duration by the `duration` prop.
- Put `animate={controls} initial="normal"` on the `m.svg` and give child elements only `variants`. Every variant set needs `normal` and `animate`.
- For scale or rotate, set `style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}` using the icon's real pivot.
- If an animation ends on a look identical to the rest state but a different value (a full spin, a 180 degree turn of a symmetric shape), give `normal` `transition: { duration: 0 }` so mouse leave doesn't spin backwards.
- Draw-on effects use `strokeDasharray` set to the path length plus a `strokeDashoffset` variant. Measure the length with `path.getTotalLength()` in the browser console.
- Keep the shape identical to the Hugeicons source at rest.

## 4. Register it

Add an entry to `data/huge-icons.json`:

```json
{
	"name": "clock-0-1",
	"addedAt": "2026-09-29",
	"category": ["Time & Date"],
	"keywords": ["clock", "time", "watch", "hour", "schedule", "timer"]
}
```

`name` is the filename without `-icon`. Reuse categories that already exist in the manifests. Keywords should be the words someone would search for.

## 5. Generate and verify

Format first, because the registry embeds the source text:

```bash
pnpm exec prettier --write data/huge-icons.json icons/huge/<name>-icon.tsx
pnpm gen:icons
```

Update the icon counts in `README.md` (the headline and the `huge/` line in the layout tree) and `npm/README.md`. `pnpm check:readme` prints the numbers it expects.

Then run:

```bash
pnpm lint && pnpm typecheck && pnpm test
pnpm --filter @animateicons/react verify
```

The last command builds the npm package and enforces the bundle size budgets. If the `huge (full barrel)` entry fails, its limit is under `size-limit` in `npm/package.json`.

Finally run `pnpm dev`, open `/icons/huge`, and hover the new icons to check the motion.

## License

The free Hugeicons package is MIT licensed (Copyright (c) 2025 Hugeicons). The MIT license requires that copyright notice to accompany copies of the icons, so it belongs in the project's credits or third-party notices.
