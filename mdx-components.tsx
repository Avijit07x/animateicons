import type { MDXComponents } from "mdx/types";

/**
 * Map MDX elements (h1/h2/p/code/a/etc.) to themed React components so
 * AnimateIcons docs pages inherit the site's dark surface tokens
 * without per-page styling. Required by Next.js 16's App Router MDX
 * integration: https://nextjs.org/docs/app/guides/mdx
 *
 * SRP: tag → component mapping only. AnimateIcons doc content lives in
 * the .mdx files under app/icons/docs/.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		h1: ({ children }) => (
			<h1 className="text-textPrimary text-2xl font-semibold">{children}</h1>
		),
		h2: ({ children, id }) => (
			<h2 id={id} className="text-textPrimary scroll-mt-20 text-xl font-medium">
				{children}
			</h2>
		),
		h3: ({ children, id }) => (
			<h3 id={id} className="text-textPrimary scroll-mt-20 text-lg font-medium">
				{children}
			</h3>
		),
		p: ({ children }) => (
			<p className="text-textSecondary max-w-2xl text-sm leading-relaxed">
				{children}
			</p>
		),
		a: ({ href, children }) => (
			<a
				href={href}
				className="text-textPrimary underline underline-offset-4"
				target={href?.startsWith("http") ? "_blank" : undefined}
				rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
			>
				{children}
			</a>
		),
		code: ({ children }) => (
			<code className="bg-surface rounded px-1.5 py-0.5 font-mono text-xs">
				{children}
			</code>
		),
		ul: ({ children }) => (
			<ul className="text-textSecondary ml-5 list-disc space-y-1 text-sm">
				{children}
			</ul>
		),
		ol: ({ children }) => (
			<ol className="text-textSecondary ml-5 list-decimal space-y-1 text-sm">
				{children}
			</ol>
		),
		hr: () => <hr className="border-border/40 my-10" />,
		...components,
	};
}
