"use client";

import { cn } from "@/lib/utils";
import { Fragment } from "react";
import ScrollFade from "./ScrollFade";

type Lang = "tsx" | "bash";

type Token = { type: TokenType; value: string };

type TokenType =
	| "comment"
	| "string"
	| "keyword"
	| "tag"
	| "attr"
	| "number"
	| "punct"
	| "text";

const COLORS: Record<TokenType, string> = {
	comment: "#8b949e",
	string: "#a5d6ff",
	keyword: "#ff7b72",
	tag: "#d2a8ff",
	attr: "#79c0ff",
	number: "#79c0ff",
	punct: "#c9d1d9",
	text: "#c9d1d9",
};

const TSX_KEYWORDS = new Set([
	"import",
	"from",
	"export",
	"default",
	"const",
	"let",
	"var",
	"function",
	"return",
	"if",
	"else",
	"true",
	"false",
	"null",
	"undefined",
	"new",
	"as",
	"type",
	"interface",
]);

const tokenizeTsx = (src: string): Token[] => {
	const out: Token[] = [];
	let i = 0;
	while (i < src.length) {
		const rest = src.slice(i);

		const m1 = rest.match(/^\/\/[^\n]*/);
		if (m1) {
			out.push({ type: "comment", value: m1[0] });
			i += m1[0].length;
			continue;
		}

		const m2 = rest.match(/^"([^"\\]|\\.)*"|^'([^'\\]|\\.)*'/);
		if (m2) {
			out.push({ type: "string", value: m2[0] });
			i += m2[0].length;
			continue;
		}

		const m3 = rest.match(/^<\/?([A-Z][A-Za-z0-9]*)/);
		if (m3) {
			out.push({ type: "punct", value: rest.startsWith("</") ? "</" : "<" });
			out.push({ type: "tag", value: m3[1] });
			i += m3[0].length;
			continue;
		}

		const m4 = rest.match(/^([a-z][A-Za-z0-9-]*)(?==)/);
		if (m4) {
			out.push({ type: "attr", value: m4[1] });
			i += m4[1].length;
			continue;
		}

		const m5 = rest.match(/^\d+(\.\d+)?/);
		if (m5) {
			out.push({ type: "number", value: m5[0] });
			i += m5[0].length;
			continue;
		}

		const m6 = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
		if (m6) {
			const word = m6[0];
			out.push({
				type: TSX_KEYWORDS.has(word) ? "keyword" : "text",
				value: word,
			});
			i += word.length;
			continue;
		}

		out.push({ type: "punct", value: src[i] });
		i++;
	}
	return out;
};

const tokenizeBash = (src: string): Token[] => {
	const tokens: Token[] = [];
	const parts = src.split(/(\s+)/);
	let isFirst = true;
	for (const part of parts) {
		if (/^\s+$/.test(part)) {
			tokens.push({ type: "punct", value: part });
			continue;
		}
		if (isFirst && /^(npm|pnpm|yarn|bun|bunx|npx)$/.test(part)) {
			tokens.push({ type: "keyword", value: part });
			isFirst = false;
			continue;
		}
		if (part.startsWith("-")) {
			tokens.push({ type: "comment", value: part });
			continue;
		}
		tokens.push({ type: "string", value: part });
		isFirst = false;
	}
	return tokens;
};

type Props = {
	code: string;
	lang?: Lang;
	className?: string;
	wrap?: boolean;
};

const TEXT = "font-mono text-xs leading-relaxed";

const HighlightedCode: React.FC<Props> = ({
	code,
	lang = "tsx",
	className,
	wrap = true,
}) => {
	const tokens = lang === "bash" ? tokenizeBash(code) : tokenizeTsx(code);
	const body = (
		<code>
			{tokens.map((tok, i) => (
				<Fragment key={i}>
					<span style={{ color: COLORS[tok.type] }}>{tok.value}</span>
				</Fragment>
			))}
		</code>
	);

	if (!wrap) {
		return (
			<ScrollFade className={cn("mx-4 my-3", className)}>
				<pre className={`${TEXT} whitespace-pre`}>{body}</pre>
			</ScrollFade>
		);
	}

	return (
		<pre
			className={`px-4 py-3 ${TEXT} break-words whitespace-pre-wrap ${className ?? ""}`}
		>
			{body}
		</pre>
	);
};

export default HighlightedCode;
