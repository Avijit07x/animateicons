<div align="center">

# AnimateIcons

**542 animated SVG icons for React.** Hover & imperative triggers, configurable size, color, and duration. Built on `motion/react`.

[Browse icons](https://animateicons.in/icons/lucide) &nbsp;·&nbsp; [Docs](https://animateicons.in/icons/docs) &nbsp;·&nbsp; [MCP](https://animateicons.in/icons/docs/mcp) &nbsp;·&nbsp; [Sponsor](https://github.com/sponsors/Avijit07x)

<p>
  <a href="https://www.npmjs.com/package/@animateicons/react"><img alt="npm" src="https://shieldcn.dev/npm/v/@animateicons/react.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="https://github.com/Avijit07x/animateicons/stargazers"><img alt="GitHub stars" src="https://shieldcn.dev/github/stars/Avijit07x/animateicons.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="https://github.com/Avijit07x/animateicons/graphs/contributors"><img alt="Contributors" src="https://shieldcn.dev/github/contributors/Avijit07x/animateicons.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="https://github.com/Avijit07x/animateicons/commits"><img alt="Last commit" src="https://shieldcn.dev/github/last-commit/Avijit07x/animateicons.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="./LICENSE"><img alt="License MIT" src="https://shieldcn.dev/github/license/Avijit07x/animateicons.svg?variant=secondary&size=xs&theme=zinc" /></a>
  <a href="https://vercel.com/open-source-program"><img alt="Vercel OSS Program" src="https://shieldcn.dev/badge/Vercel_OSS_Program_Member.svg?variant=branded&size=xs&theme=zinc&logo=vercel" /></a>
</p>

<br />

![AnimateIcons preview](./public/og.png)

</div>

---

## Quick start

```bash
pnpm add @animateicons/react
```

```tsx
import { BellRingIcon } from "@animateicons/react/lucide";

export function Notifications() {
	return <BellRingIcon size={24} color="#f45b48" />;
}
```

Icons animate on hover by default, and `motion` is bundled. Don't want a dependency? Copy the source instead with `npx animateicons add bell-ring`, browse them interactively with `npx animateicons browse`, the shadcn CLI, or an AI agent via the MCP server.

> **Full documentation lives on the site** &nbsp;·&nbsp; [Install, CLI, styling & API](https://animateicons.in/icons/docs) &nbsp;·&nbsp; [MCP server](https://animateicons.in/icons/docs/mcp) &nbsp;·&nbsp; [Browse the gallery](https://animateicons.in/icons/lucide)

---

## Repository layout

```
animateicons/
├── icons/
│   ├── lucide/          509 Lucide-style icons
│   └── huge/             33 Huge-style icons
├── npm/                 @animateicons/react published package
├── core/                shared catalog/search/write logic (bundled into cli + mcp)
├── cli/                 animateicons CLI (npx animateicons add / browse)
├── mcp/                 @animateicons/mcp server for AI agents
├── app/
│   ├── icons/[library]/ gallery routes
│   └── icons/docs/      install + MCP guides (MDX)
├── components/          shared UI (Hero, Section, etc.)
├── hooks/               useIconFilter, useIconAnimation
├── tests/               Vitest + React Testing Library
└── scripts/             registry + catalog codegen, codemods
```

---

## Local development

```bash
git clone https://github.com/Avijit07x/animateicons.git
cd animateicons
pnpm install
pnpm dev
```

Common scripts:

```bash
pnpm dev          # gallery dev server (Turbopack)
pnpm build        # production build
pnpm test         # vitest run
pnpm typecheck    # tsc --noEmit

pnpm --filter @animateicons/react build       # build the npm package
pnpm --filter @animateicons/react test:smoke  # smoke-test the built dist
```

---

## Contributing

PRs adding icons are welcome. Each icon is a single React component file - copy any existing one as a template.

1. Create `icons/<library>/<name>-icon.tsx` from an existing icon
2. Register it in `data/<library>-icons.json`
3. Run `pnpm gen:icons` to regenerate the registry + catalog
4. Open a PR against `main`

Full workflow in [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

[MIT](./LICENSE).

If AnimateIcons saves you time, consider [sponsoring the project](https://github.com/sponsors/Avijit07x).

---

<div align="center">

Built with [Next.js](https://nextjs.org), [motion/react](https://motion.dev), and [shadcn/ui](https://ui.shadcn.com).

**[animateicons.in](https://animateicons.in)** &nbsp;·&nbsp; [GitHub](https://github.com/Avijit07x/animateicons) &nbsp;·&nbsp; [@animateicons/react on npm](https://www.npmjs.com/package/@animateicons/react)

</div>
