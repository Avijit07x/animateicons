import fs from "node:fs";
import path from "node:path";

import { buildDocs } from "./docs-markdown";

async function main() {
	console.log("📚 Generating docs.json...\n");

	const docs = await buildDocs();

	fs.writeFileSync(
		path.join(process.cwd(), "public", "r", "docs.json"),
		JSON.stringify(docs, null, 2),
		"utf8",
	);

	console.log(`✅ Docs generated: ${docs.total} pages.`);
	console.log("Written: public/r/docs.json\n");
}

main().catch((error) => {
	console.error("❌ Docs generation failed:", error);
	process.exit(1);
});
