"use client";

/**
 * "On This Page" — scroll-spy table of contents. Lists sections (h2) with
 * their sub-steps (h3/h4) indented beneath, and highlights the section in
 * view.
 *
 * Active section = the last heading past the trigger line, with a
 * bottom-of-page guard so the final short section still lights up (the
 * IntersectionObserver band can't scroll a trailing heading into view).
 * Duplicate ids (e.g. "3. Import and use" under two sections) are made
 * unique on the DOM node so their anchor links still resolve. Re-scans on
 * route change since the docs layout persists across App Router navigations.
 */

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface TocHeading {
	id: string;
	text: string;
	level: number;
}

const indent: Record<number, string> = { 2: "pl-4", 3: "pl-8", 4: "pl-8" };

const TableOfContents: React.FC = () => {
	const pathname = usePathname();
	const [headings, setHeadings] = useState<TocHeading[]>([]);
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		const nodes = Array.from(
			document.querySelectorAll<HTMLElement>(
				".docs-prose h2, .docs-prose h3, .docs-prose h4",
			),
		).filter((el) => el.id);

		const seen = new Set<string>();
		for (const el of nodes) {
			let id = el.id;
			for (let n = 1; seen.has(id); n++) id = `${el.id}-${n}`;
			if (id !== el.id) el.id = id;
			seen.add(id);
		}

		// Building the TOC requires scanning the post-render DOM for sibling
		// MDX headings (and de-duping their ids) - there's no render-time
		// source for that, so this setState genuinely belongs in an effect.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setHeadings(
			nodes.map((el) => ({
				id: el.id,
				// Skip the hover `#` anchor mdx-components prepends, else the
				// label reads "#npm package" instead of "npm package".
				text: Array.from(el.childNodes)
					.filter((n) => !(n instanceof HTMLElement && n.tagName === "A"))
					.map((n) => n.textContent)
					.join("")
					.trim(),
				level: Number(el.tagName[1]),
			})),
		);

		const onScroll = () => {
			const atBottom =
				window.innerHeight + window.scrollY >=
				document.documentElement.scrollHeight - 2;
			if (atBottom) {
				setActiveId(nodes[nodes.length - 1]?.id ?? "");
				return;
			}
			let current = nodes[0]?.id ?? "";
			for (const n of nodes) {
				if (n.getBoundingClientRect().top <= 100) current = n.id;
				else break;
			}
			setActiveId(current);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		window.addEventListener("resize", onScroll);
		return () => {
			window.removeEventListener("scroll", onScroll);
			window.removeEventListener("resize", onScroll);
		};
	}, [pathname]);

	if (headings.length === 0) return null;

	return (
		<nav aria-label="On this page" className="text-sm">
			<p className="text-textPrimary mb-3 font-medium">On This Page</p>
			<ul className="border-border/50 space-y-0.5 border-l">
				{headings.map((h) => (
					<li key={h.id}>
						<a
							href={`#${h.id}`}
							className={cn(
								"-ml-px block border-l py-1 transition-colors",
								indent[h.level] ?? "pl-8",
								h.level > 2 && "text-[0.8125rem]",
								activeId === h.id
									? "border-primary text-primary"
									: "text-textSecondary hover:text-textPrimary border-transparent",
							)}
						>
							{h.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default TableOfContents;
