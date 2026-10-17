import { createRequire } from "node:module";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
	addIconTool,
	FRAMEWORKS,
	getDocsTool,
	getIconTool,
	listLibrariesTool,
	searchIconsTool,
	type ToolContext,
} from "./tools";

const VERSION: string = createRequire(import.meta.url)(
	"../package.json",
).version;

const INSTRUCTIONS =
	"AnimateIcons is a library of animated icons for React, Vue, Angular and plain JavaScript. Find icons with search_icons and add React icons with add_icon. Before you wire an icon into a button, card, menu or input, or use props such as duration or the useIconHover hook, read the docs with get_docs. For Vue, Angular or plain JavaScript, call get_icon with the framework argument instead of add_icon.";

const libraryEnum = z.enum(["lucide", "huge"]);

function asJson(value: unknown) {
	return {
		content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
	};
}

export function createServer(ctx: ToolContext = {}): McpServer {
	const server = new McpServer(
		{ name: "animateicons", version: VERSION },
		{ instructions: INSTRUCTIONS },
	);

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
		"Get an icon's React component source plus a ready-to-paste import snippet. Read-only - use this to write the file yourself. Pass framework 'vanilla', 'vue' or 'angular' to get that package's install command and usage code instead.",
		{
			name: z
				.string()
				.describe("Icon name ('bell-ring') or registry id ('lu-bell-ring')"),
			framework: z
				.enum(FRAMEWORKS)
				.optional()
				.describe(
					"Framework to return code for. Defaults to 'react', which returns the component source. 'vanilla', 'vue' and 'angular' return the npm install command and usage code for @animateicons/vanilla, @animateicons/vue or @animateicons/angular",
				),
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
		"get_docs",
		"Read the AnimateIcons documentation: a guide for each framework (React, Vue, Angular and plain JS) with install, props and playing icons from code, plus the React useIconHover hook and examples. Call with no page to list the pages, or pass a page slug to read one.",
		{
			page: z
				.string()
				.optional()
				.describe(
					"Page slug or title, e.g. 'react', 'vue' or 'examples/hover-helper'. Leave out to list the pages",
				),
		},
		async (args) => asJson(await getDocsTool(ctx, args)),
	);

	server.tool(
		"list_libraries",
		"List the available icon libraries and how many icons each has.",
		{},
		async () => asJson(await listLibrariesTool(ctx)),
	);

	return server;
}
