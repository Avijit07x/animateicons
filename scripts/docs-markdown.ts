import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import {
	MANAGERS,
	installCmd,
} from "../app/icons/_components/docs/install-commands";
import { docsNav } from "../app/icons/docs/_lib/nav";
import type { Docs } from "../core/src/docs";

const ROOT = process.cwd();
const SITE_URL = "https://animateicons.in";

type Scope = Record<string, unknown>;

function endOfStatement(source: string, start: number): number {
	let depth = 0;
	let quote = "";

	for (let i = start; i < source.length; i++) {
		const ch = source[i];

		if (quote) {
			if (ch === "\\") i++;
			else if (ch === quote) quote = "";
			continue;
		}

		if (ch === '"' || ch === "'" || ch === "`") quote = ch;
		else if ("{([".includes(ch)) depth++;
		else if ("})]".includes(ch)) depth--;
		else if (ch === ";" && depth === 0) return i + 1;
	}

	throw new Error("Unterminated import or export statement.");
}

function splitModule(source: string) {
	const statements: string[] = [];
	let pos = 0;

	for (;;) {
		const at = pos + (source.slice(pos).match(/^\s*/)?.[0].length ?? 0);
		if (!/^(import|export)\b/.test(source.slice(at))) break;

		const end = endOfStatement(source, at);
		statements.push(source.slice(at, end));
		pos = end;
	}

	return { statements, body: source.slice(pos) };
}

function resolveModule(specifier: string, from: string): string | null {
	const base = specifier.startsWith("@/")
		? path.join(ROOT, specifier.slice(2))
		: specifier.startsWith(".")
			? path.resolve(path.dirname(from), specifier)
			: null;
	if (!base) return null;

	const file = `${base}.ts`;
	return fs.existsSync(file) ? file : null;
}

async function loadImports(statements: string[], from: string) {
	const scope: Scope = {};

	for (const statement of statements) {
		const match = statement.match(
			/^import\s+([\s\S]+?)\s+from\s+["']([^"']+)["'];?$/,
		);
		if (!match) continue;

		const file = resolveModule(match[2], from);
		if (!file) continue;

		const mod = (await import(pathToFileURL(file).href)) as Scope;
		const clause = match[1];
		const named = clause.match(/\{([\s\S]*)\}/)?.[1] ?? "";

		for (const entry of named.split(",")) {
			const [name, alias = name] = entry.trim().split(/\s+as\s+/);
			if (name) scope[alias] = mod[name];
		}

		const fallback = clause.match(/^(\w+)/)?.[1];
		if (fallback) scope[fallback] = mod.default;
	}

	return scope;
}

function evaluateExports(statements: string[], scope: Scope): Scope {
	const exported = statements
		.filter((statement) => statement.startsWith("export"))
		.map((statement) => statement.replace(/^export\s+/, ""));
	const names = exported.flatMap((statement) =>
		[...statement.matchAll(/^const\s+(\w+)/g)].map((m) => m[1]),
	);

	const run = new Function(
		...Object.keys(scope),
		`${exported.join("\n")}\nreturn { ${names.join(", ")} };`,
	);

	return { ...scope, ...run(...Object.values(scope)) };
}

function fence(code: string, info: string): string {
	const body = code.replace(/\s+$/, "");
	const longest = Math.max(
		0,
		...(body.match(/`+/g) ?? []).map((m) => m.length),
	);
	const ticks = "`".repeat(Math.max(3, longest + 1));
	return `${ticks}${info}\n${body}\n${ticks}`;
}

function attribute(attrs: string, name: string, scope: Scope): unknown {
	const match = attrs.match(
		new RegExp(`\\b${name}=(?:"([^"]*)"|\\{(\\w+)\\})`),
	);
	if (!match) return undefined;
	return match[1] ?? scope[match[2]];
}

function capitalize(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1);
}

function convertBody(body: string, scope: Scope): string {
	const text = body
		.replace(/^[ \t]*<\/?(?:section|div)\b[^>]*>[ \t]*\n/gm, "")
		.replace(/^[ \t]*<InstallMethods\s*\/>[ \t]*\n/gm, "")
		.replace(/(?<!=)\{([A-Za-z_]\w*(?:\.\w+)*)\}/g, (whole, expression) => {
			const [root, ...rest] = (expression as string).split(".");
			if (!(root in scope)) return whole;
			return String(
				rest.reduce((value: any, key) => value?.[key], scope[root]),
			);
		})
		.replace(/<CodeBlock\s+([^>]*?)\s*\/>/g, (_, attrs: string) => {
			const lang = (attribute(attrs, "lang", scope) as string) ?? "tsx";
			const title = attribute(attrs, "title", scope) as string | undefined;
			const info = title ? `${lang} title="${title}"` : lang;
			return fence(attribute(attrs, "code", scope) as string, info);
		})
		.replace(/<CommandBlock\s+([^>]*?)\s*\/>/g, (_, attrs: string) => {
			const pkg = attribute(attrs, "pkg", scope) as string | undefined;
			const commands = pkg
				? Object.fromEntries(MANAGERS.map((m) => [m, installCmd[m](pkg)]))
				: (attribute(attrs, "commands", scope) as Record<string, string>);
			return Object.values(commands)
				.map((command) => `- \`${command}\``)
				.join("\n");
		})
		.replace(
			/<ExamplePreview\s+code=\{(\w+)\}\s*>[\s\S]*?<\/ExamplePreview>/g,
			(_, name: string) =>
				fence(scope[name] as string, 'tsx title="Example.tsx"'),
		)
		.replace(
			/<Callout(?:\s+type="(\w+)")?\s*>([\s\S]*?)<\/Callout>/g,
			(_, type: string = "note", inner: string) =>
				`> **${capitalize(type)}:** ${inner.trim().replace(/\s+/g, " ")}`,
		)
		.replace(/<Badge>([\s\S]*?)<\/Badge>/g, "**$1**")
		.replace(/<a\s+href="([^"]+)">([\s\S]*?)<\/a>/g, "[$2]($1)")
		.replace(/\]\(\//g, `](${SITE_URL}/`)
		.replace(/[ \t]+$/gm, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();

	return `${text}\n`;
}

function assertConverted(markdown: string, file: string) {
	const prose = markdown
		.replace(/^(`{3,})[^\n]*\n[\s\S]*?\n\1$/gm, "")
		.replace(/`[^`\n]*`/g, "");
	const leftover = prose.match(/<\/?[A-Za-z][\w.]*|^(?:import|export)\s/m);

	if (leftover) {
		throw new Error(
			`${path.relative(ROOT, file)}: "${leftover[0].trim()}" is not handled by scripts/docs-markdown.ts. Teach the converter about it.`,
		);
	}
}

export async function mdxToMarkdown(file: string) {
	const { statements, body } = splitModule(fs.readFileSync(file, "utf8"));
	const scope = evaluateExports(
		statements,
		await loadImports(statements, file),
	);
	const markdown = convertBody(body, scope);
	assertConverted(markdown, file);

	const { description } = scope.metadata as { description: string };
	return { description, markdown };
}

export async function buildDocs(): Promise<Docs> {
	const pages: Docs["pages"] = [];

	for (const group of docsNav) {
		for (const item of group.items) {
			const { description, markdown } = await mdxToMarkdown(
				path.join(ROOT, "app", item.href, "page.mdx"),
			);

			pages.push({
				slug: item.href.replace(/^\/icons\/docs\/?/, "") || "installation",
				title: item.title,
				description,
				group: group.title,
				url: `${SITE_URL}${item.href}`,
				content: markdown,
			});
		}
	}

	return { version: 1, total: pages.length, pages };
}
