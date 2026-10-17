# MCP server

`@animateicons/mcp` is a [Model Context Protocol](https://modelcontextprotocol.io) server. Connect it to an AI coding agent (Claude Code, Cursor, and others), and the agent can search the AnimateIcons catalog and drop animated icons straight into your project, no copy-pasting.

## What it can do

Once connected, your agent gets five tools:

- `search_icons`: fuzzy-search the catalog by name, keyword, or category.
- `get_icon`: return an icon's component source plus a ready-to-paste import (read-only). Pass the optional `framework` argument (`react`, `vanilla`, `vue` or `angular`, default `react`) to get the install command and usage code for that framework.
- `add_icon`: write an icon's React component file into your project (default `components/icons/`).
- `get_docs`: read these docs, including the props, the ref handle, the `useIconHover` hook and the examples. Without a page it lists them.
- `list_libraries`: list the libraries and how many icons each has.

Working in Vue, Angular or plain JS? Name your framework when you ask, and the agent gets the right package and code from `get_icon`.

## Claude Code

Register the server in one command:

```bash title="Terminal"
claude mcp add animateicons -- npx -y @animateicons/mcp
```

> **Tip:** Restart Claude Code (or reload your editor window) after adding the server so it registers the new tools.

Then just ask, and the agent picks the right tool:

```tsx title="In your editor"
// Then just ask your agent in plain language:
//   "add a notification bell icon"
//
// → it calls search_icons, picks bell-ring, then add_icon
//   and writes components/icons/bell-ring.tsx for you.
```

## Cursor & other clients

Add the server to your MCP config (e.g. `.cursor/mcp.json` or `.mcp.json`):

```json title=".mcp.json"
{
	"mcpServers": {
		"animateicons": {
			"command": "npx",
			"args": ["-y", "@animateicons/mcp"]
		}
	}
}
```

## Requirements

> **Note:** Icons written by `add_icon` import `cn` from `@/lib/utils` (the shadcn convention) and require the [motion](https://motion.dev) package at runtime.

Prefer the terminal? The [CLI](https://animateicons.in/icons/docs/cli) does the same thing with `npx animateicons add`.

---

Source: https://animateicons.in/icons/docs/mcp
All AnimateIcons docs: https://animateicons.in/llms.txt
