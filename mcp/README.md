# @animateicons/mcp

A [Model Context Protocol](https://modelcontextprotocol.io) server for
[AnimateIcons](https://animateicons.in). It lets AI coding agents (Claude Code, Cursor,
etc.) search the icon catalog and drop animated React icons straight into a project.

## Tools

| Tool             | Description                                                                      |
| ---------------- | -------------------------------------------------------------------------------- |
| `search_icons`   | Fuzzy-search by name, keyword, or category.                                      |
| `get_icon`       | Return an icon's component source + a ready-to-paste import snippet (read-only). |
| `add_icon`       | Write an icon's component file into the project (default `components/icons/`).   |
| `list_libraries` | List the libraries and their icon counts.                                        |

Icons require the [`motion`](https://motion.dev) package and import `cn` from
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
