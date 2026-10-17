# animateicons CLI

The fastest way to copy React icons into your project. Same result as the shadcn CLI, but a first-party command instead of a registry URL.

> **Note:** The animateicons CLI copies React components. For Vue, Angular or plain JS, install the package for your framework from the [Introduction](https://animateicons.in/icons/docs).

#### 1. Add an icon

```bash title="Terminal"
npx animateicons add eye

# add several at once, or use the lu-/hu- prefixed id

npx animateicons add eye bell-ring user
```

Prefer a short command? Install the CLI globally and an `animateicons` binary is added to your PATH:

```bash title="Terminal"
npm i -g animateicons
animateicons add eye
```

Icons land at `components/icons/<name>.tsx` (override with `--dir`). The CLI also prints the `motion` install command for your package manager.

> **Note:** Copied icons import `cn` from `@/lib/utils`. If your project isn't shadcn-based, pass `--with-utils` and the CLI scaffolds a minimal helper for you.

#### 2. Browse without leaving the terminal

```bash title="Terminal"
npx animateicons search notification
npx animateicons list --library huge
npx animateicons info eye
```

Or open the interactive dashboard to search, multi-select, and add icons live in your terminal:

```bash title="Terminal"
npx animateicons browse
```

#### 3. Import and use

```tsx title="Example.tsx"
import { EyeIcon } from "@/components/icons/eye"

export default function Example() {
	return <EyeIcon size={24} color="#f45b48" />
}
```

---

Source: https://animateicons.in/icons/docs/cli
All AnimateIcons docs: https://animateicons.in/llms.txt
