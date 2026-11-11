import fs from "node:fs";
import path from "node:path";

import { FRAMEWORK_GUIDES } from "../app/icons/docs/_lib/frameworks";
import { docMarkdownPath } from "../app/icons/docs/_lib/nav";
import { ICON_COUNT_LABELS } from "../lib/icon-count.generated";
import { SITE_URL } from "../lib/site";

export const SUMMARY = `${ICON_COUNT_LABELS.total} free, open source animated icons for React, Vue, Angular and plain JavaScript, in Lucide and Huge styles. Every animation is hand-crafted and tuned to feel smooth, and plays the same in every framework.`;

const OTHER_FRAMEWORKS =
	"Plain JS also covers web components, Svelte, Solid and Astro.";

type SizeBudget = { name: string; limit: string };

function sizeBudget(name: string): string {
	const pkg = JSON.parse(
		fs.readFileSync(path.join(process.cwd(), "npm", "package.json"), "utf8"),
	) as { "size-limit": SizeBudget[] };
	const budget = pkg["size-limit"].find((entry) => entry.name === name);
	if (!budget) {
		throw new Error(`npm/package.json has no size budget named "${name}".`);
	}
	return budget.limit;
}

const packageList = () =>
	FRAMEWORK_GUIDES.map(
		({ name, pkg, href, summary }) =>
			`- **${name}:** \`${pkg}\`. ${summary} Guide: ${SITE_URL}${docMarkdownPath(href)}`,
	);

export function homeMarkdown(): string {
	return `${[
		"# AnimateIcons",
		"",
		`> ${SUMMARY}`,
		"",
		`Website: ${SITE_URL}. Every docs page as markdown: [llms.txt](${SITE_URL}/llms.txt). Guide for AI agents: [skill.md](${SITE_URL}/skill.md).`,
		"",
		"## Icons",
		"",
		`- ${ICON_COUNT_LABELS.lucide} Lucide-style icons: ${SITE_URL}/icons/lucide`,
		`- ${ICON_COUNT_LABELS.huge} Huge-style icons: ${SITE_URL}/icons/huge`,
		`- Every icon with its library, category and keywords: ${SITE_URL}/r/catalog.json`,
		"",
		"## Why AnimateIcons",
		"",
		"- **Hand-crafted motion.** Every icon has its own animation, tuned to feel smooth.",
		"- **Same motion in every framework.** The Vue, Angular and plain JS packages are checked frame by frame against React.",
		`- **Lightweight.** One React icon, with the motion runtime it needs, is under ${sizeBudget("single icon (tree-shaken)")} minified and brotli-compressed. Five icons stay under ${sizeBudget("5 icons (tree-shaken)")}. CI fails any change that goes over. React itself is not counted.`,
		"- **Hover or code.** Icons play on hover, or from your own code with `startAnimation()` and `stopAnimation()`.",
		"- **Accessible.** The Reduce Motion setting is respected with no setup.",
		"- **Free and open source.** MIT licensed, for personal and commercial use.",
		"",
		"## Packages",
		"",
		...packageList(),
		"",
		`${OTHER_FRAMEWORKS} Each package bundles \`motion\`, so it is the only install.`,
		"",
		"## Usage",
		"",
		"Install the package for your framework, for example `npm install @animateicons/react`. Then:",
		"",
		"```tsx",
		'import { BellRingIcon } from "@animateicons/react/lucide";',
		"",
		"export default function Example() {",
		'\treturn <BellRingIcon size={32} color="tomato" />;',
		"}",
		"```",
		"",
		"The name is the icon name in PascalCase plus `Icon`: `bell-ring` is `BellRingIcon`. In the Next.js App Router, import each icon from its own file, such as `@animateicons/react/lucide/bell-ring-icon`.",
		"",
		"## Other ways to add icons",
		"",
		"- **shadcn CLI:** `npx shadcn@latest add @animateicons/lu-eye` copies one React icon into your project as a file you can edit.",
		"- **CLI:** `npx animateicons add eye` does the same from the terminal.",
		"- **MCP server:** `npx -y @animateicons/mcp` lets AI agents search icons, read the docs and add icons.",
		"",
		"## Links",
		"",
		"- GitHub: https://github.com/Avijit07x/animateicons",
		"- npm: https://www.npmjs.com/package/@animateicons/react",
		"- License: MIT",
		"- Author: Avijit Dey (https://github.com/Avijit07x)",
	].join("\n")}\n`;
}

export function skillMarkdown(): string {
	return `${[
		"---",
		"name: animateicons",
		`description: Add animated icons from AnimateIcons (${SITE_URL}) to React, Vue, Angular or plain JavaScript projects. Use when a user wants animated icons, an animated Lucide or Huge icon, or mentions AnimateIcons.`,
		"---",
		"",
		"# AnimateIcons skill",
		"",
		`> Every docs page as markdown: [llms.txt](${SITE_URL}/llms.txt). Overview: [index.md](${SITE_URL}/index.md).`,
		"",
		`AnimateIcons has ${ICON_COUNT_LABELS.total} free, open source animated icons in two styles: ${ICON_COUNT_LABELS.lucide} Lucide and ${ICON_COUNT_LABELS.huge} Huge. Every animation is hand-crafted and tuned to feel smooth.`,
		"",
		"## 1. Pick the package",
		"",
		"Use the package for the user's framework:",
		"",
		...packageList(),
		"",
		`${OTHER_FRAMEWORKS} Each package bundles \`motion\`, so install only that package, for example \`npm install @animateicons/react\`.`,
		"",
		"## 2. Find the icon",
		"",
		"- Icon names are kebab-case, like `bell-ring` or the Huge `arrow-up-right-0-1`.",
		`- ${SITE_URL}/r/catalog.json lists every icon with its library, category and keywords.`,
		"- With the MCP server (`npx -y @animateicons/mcp`), call `search_icons`, then `get_icon` with the `framework` argument for the install command and usage code.",
		"",
		"## 3. Import it",
		"",
		"Use the `lucide` or `huge` subpath for the icon's library.",
		"",
		'- **React:** `import { BellRingIcon } from "@animateicons/react/lucide"`. The name is PascalCase plus `Icon`.',
		'- **Next.js App Router:** import each icon from its own file: `import { BellRingIcon } from "@animateicons/react/lucide/bell-ring-icon"`.',
		'- **Vue:** `import { BellRingIcon } from "@animateicons/vue/lucide"`.',
		'- **Angular:** add `AnimateIcons` from `@animateicons/angular` to the component\'s `imports`, import the icon data with `import { BellRing } from "@animateicons/angular/lucide"`, set `bellRing = BellRing` on the component and render `<animate-icons [icon]="bellRing" />`.',
		"- **Plain JS:** `createIcon(BellRing, { size: 32 })`, with `createIcon` from `@animateicons/vanilla` and `BellRing` from `@animateicons/vanilla/lucide`.",
		"",
		"## 4. Control it",
		"",
		"- Every package takes `size` (default `24`), `color` (default `currentColor`), `duration` (a speed multiplier, default `1`) and `isAnimated` (play on hover, default `true`). Vue templates and the plain JS tag write it as `is-animated`.",
		"- To play an icon from code, for example when its button is hovered or clicked, call `startAnimation()` and `stopAnimation()` on it. In React, pass a ref typed with the icon's `*Handle` type.",
		"",
		"## Common pitfalls",
		"",
		"- In the Next.js App Router, importing from `@animateicons/react/lucide` loads every icon. Import each icon from its own file.",
		"- Per-icon paths are ESM only. With `require()`, import from the main package.",
		"- With the Reduce Motion setting on, hover does nothing and `startAnimation()` keeps the icon at rest. That is expected.",
	].join("\n")}\n`;
}
