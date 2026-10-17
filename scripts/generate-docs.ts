import fs from "node:fs";
import path from "node:path";

import { buildDocs, llmsFull, llmsIndex, pageMarkdown } from "./docs-markdown";

const PUBLIC = path.join(process.cwd(), "public");

async function main() {
	console.log("📚 Generating docs.json, markdown pages and llms.txt...\n");

	const docs = await buildDocs();

	fs.writeFileSync(
		path.join(PUBLIC, "r", "docs.json"),
		JSON.stringify(docs, null, 2),
		"utf8",
	);

	const pagesDir = path.join(PUBLIC, "r", "docs");
	fs.rmSync(pagesDir, { recursive: true, force: true });
	for (const page of docs.pages) {
		const file = path.join(pagesDir, `${page.slug}.md`);
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, pageMarkdown(page), "utf8");
	}

	fs.writeFileSync(path.join(PUBLIC, "llms.txt"), llmsIndex(docs), "utf8");
	fs.writeFileSync(path.join(PUBLIC, "llms-full.txt"), llmsFull(docs), "utf8");

	console.log(`✅ Docs generated: ${docs.total} pages.`);
	console.log(
		"Written: public/r/docs.json, public/r/docs/*.md, public/llms.txt, public/llms-full.txt\n",
	);
}

main().catch((error) => {
	console.error("❌ Docs generation failed:", error);
	process.exit(1);
});
