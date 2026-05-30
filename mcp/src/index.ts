import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer } from "./server";

async function main() {
	// ANIMATEICONS_REGISTRY lets advanced users / tests point at a staging
	// registry or a local directory; defaults to the live site.
	const server = createServer({
		registryBase: process.env.ANIMATEICONS_REGISTRY,
	});
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((err) => {
	console.error(err instanceof Error ? err.stack : String(err));
	process.exit(1);
});
