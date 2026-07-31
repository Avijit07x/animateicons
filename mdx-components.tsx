import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

/**
 * Map MDX elements (h1/h2/p/code/a/…) to themed components so docs pages
 * under app/icons/docs/ inherit the site's dark-surface tokens and a
 * consistent shadcn-style prose rhythm without per-page styling.
 *
 * Headings get slugified ids (so the "On This Page" TOC and #anchor links
 * work with zero rehype plugins) plus a hover-revealed `#` link.
 * Required by Next.js App Router MDX: https://nextjs.org/docs/app/guides/mdx
 */

const slugify = (node: ReactNode): string => {
	const text =
		typeof node === "string"
			? node
			: Array.isArray(node)
				? node.map((n) => (typeof n === "string" ? n : "")).join("")
				: "";
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
};

const Anchor: React.FC<{ id: string }> = ({ id }) => (
	<a
		href={`#${id}`}
		aria-label="Link to this section"
		className="text-textMuted hover:text-primary absolute -left-5 opacity-0 transition-opacity group-hover:opacity-100"
	>
		#
	</a>
);

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		h1: ({ children }) => (
			<h1 className="text-textPrimary mb-3 text-3xl font-bold tracking-tight">
				{children}
			</h1>
		),
		h2: ({ children }) => {
			const id = slugify(children);
			return (
				<h2
					id={id}
					className="text-textPrimary group border-border/40 relative mt-14 mb-4 scroll-mt-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0"
				>
					<Anchor id={id} />
					{children}
				</h2>
			);
		},
		h3: ({ children }) => {
			const id = slugify(children);
			return (
				<h3
					id={id}
					className="text-textPrimary group relative mt-8 mb-3 scroll-mt-20 text-lg font-semibold"
				>
					<Anchor id={id} />
					{children}
				</h3>
			);
		},
		h4: ({ children }) => (
			<h4
				id={slugify(children)}
				className="text-textPrimary mt-6 mb-2 scroll-mt-20 text-sm font-semibold"
			>
				{children}
			</h4>
		),
		p: ({ children }) => (
			<p className="text-textSecondary my-4 text-sm leading-7">{children}</p>
		),
		a: ({ href, children }) => (
			<a
				href={href}
				className="text-primary font-medium underline decoration-white/25 underline-offset-4 transition-colors hover:decoration-current"
				target={href?.startsWith("http") ? "_blank" : undefined}
				rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
			>
				{children}
			</a>
		),
		strong: ({ children }) => (
			<strong className="text-textPrimary font-semibold">{children}</strong>
		),
		code: ({ children }) => (
			<code className="bg-surface border-border/60 text-textPrimary rounded border px-1.5 py-0.5 font-mono text-[0.8125rem]">
				{children}
			</code>
		),
		pre: ({ children }) => (
			<pre className="bg-surface border-border/60 my-6 overflow-x-auto rounded-lg border p-4 text-sm [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0">
				{children}
			</pre>
		),
		ul: ({ children }) => (
			<ul className="text-textSecondary marker:text-textMuted my-4 ml-5 list-disc space-y-2 text-sm leading-7">
				{children}
			</ul>
		),
		ol: ({ children }) => (
			<ol className="text-textSecondary marker:text-textMuted my-4 ml-5 list-decimal space-y-2 text-sm leading-7">
				{children}
			</ol>
		),
		li: ({ children }) => <li className="pl-1">{children}</li>,
		blockquote: ({ children }) => (
			<blockquote className="border-primary/40 text-textSecondary my-6 border-l-2 pl-4 italic">
				{children}
			</blockquote>
		),
		table: ({ children }) => (
			<div className="border-border/60 my-6 overflow-x-auto rounded-lg border">
				<table className="w-full border-collapse text-sm">{children}</table>
			</div>
		),
		th: ({ children }) => (
			<th className="border-border/50 bg-surface text-textPrimary border-b px-4 py-2 text-left font-semibold">
				{children}
			</th>
		),
		td: ({ children }) => (
			<td className="border-border/40 text-textSecondary border-b px-4 py-2">
				{children}
			</td>
		),
		hr: () => <hr className="border-border/40 my-10" />,
		...components,
	};
}
