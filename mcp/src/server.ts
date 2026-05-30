import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
	addIconTool,
	getIconTool,
	listLibrariesTool,
	searchIconsTool,
	type ToolContext,
} from "./tools";

const VERSION = "0.1.0";

const libraryEnum = z.enum(["lucide", "huge"]);

function asJson(value: unknown) {
	return {
		content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
	};
}

/**
 * Build the AnimateIcons MCP server. The transport is attached by the caller
 * so this factory can be exercised directly in tests.
 */
export function createServer(ctx: ToolContext = {}): McpServer {
	const server = new McpServer({ name: "animateicons", version: VERSION });

	server.tool(
		"search_icons",
		"Search the AnimateIcons catalog by name, keyword, or category. Returns matching icons with their registry ids.",
		{
			query: z.string().describe("Search text, e.g. 'notification' or 'arrow'"),
			library: libraryEnum.optional().describe("Restrict to one library"),
			limit: z.number().int().positive().max(50).optional(),
		},
		async (args) => asJson(await searchIconsTool(ctx, args)),
	);

	server.tool(
		"get_icon",
		"Get an icon's React component source plus a ready-to-paste import snippet. Read-only - use this to write the file yourself.",
		{
			name: z
				.string()
				.describe("Icon name ('bell-ring') or registry id ('lu-bell-ring')"),
		},
		async (args) => asJson(await getIconTool(ctx, args)),
	);

	server.tool(
		"add_icon",
		"Write an icon's component file into the project (default components/icons/). The icon requires the `motion` package.",
		{
			name: z.string().describe("Icon name or registry id"),
			targetDir: z
				.string()
				.optional()
				.describe("Directory to write into (default components/icons)"),
			overwrite: z.boolean().optional(),
		},
		async (args) => asJson(await addIconTool(ctx, args)),
	);

	server.tool(
		"list_libraries",
		"List the available icon libraries and how many icons each has.",
		{},
		async () => asJson(await listLibrariesTool(ctx)),
	);

	return server;
}
