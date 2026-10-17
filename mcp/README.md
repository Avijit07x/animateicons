# @animateicons/mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server for
[AnimateIcons](https://animateicons.in). It lets AI coding agents (Claude Code, Cursor,
etc.) search the icon catalog and drop animated React icons straight into a project, or get
install and usage code for the Vue, Angular and vanilla JavaScript packages.

## Tools

| Tool             | Description                                                                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `search_icons`   | Fuzzy-search by name, keyword, or category.                                                                             |
| `get_icon`       | Return an icon's component source + a ready-to-paste import snippet (read-only). Pass `framework` for other frameworks. |
| `add_icon`       | Write an icon's component file into the project (default `components/icons/`).                                          |
| `get_docs`       | Read the docs (props, ref handle, `useIconHover`, examples), or list the pages.                                         |
| `list_libraries` | List the libraries and their icon counts.                                                                               |

### `get_icon` frameworks

`get_icon` takes an optional `framework` argument:

- `react` (default): the component source and an import snippet.
- `vanilla`: install command, `createIcon` usage, the `<animate-icons>` custom element and the CDN script for `@animateicons/vanilla`.
- `vue`: install command and a `<script setup>` example for `@animateicons/vue`.
- `angular`: install command and a standalone component example for `@animateicons/angular`.

React icons require the [`motion`](https://motion.dev) package and import `cn` from
`@/lib/utils` (the shadcn convention).

## Use with Claude Code

```bash
claude mcp add animateicons -- npx -y @animateicons/mcp
```

## Use with Cursor / other clients

Add to your MCP config (e.g. `.cursor/mcp.json` or `.mcp.json`):

```json
{
	"mcpServers": {
		"animateicons": {
			"command": "npx",
			"args": ["-y", "@animateicons/mcp"]
		}
	}
}
```

### Environment

- `ANIMATEICONS_REGISTRY` - override the registry base URL or point at a local directory
  (advanced / testing). Defaults to `https://animateicons.in/r`.

MIT © Avijit Dey
