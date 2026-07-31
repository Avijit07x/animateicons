"use client";

/**
 * Previous / next footer links, driven by the flattened nav order. When a
 * page has no previous or next (first / last), the empty slot falls back to a
 * "Browse icons" card so the row always stays balanced.
 */

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsPages } from "../_lib/nav";

const cardClass =
	"border-border/60 hover:border-border hover:bg-surface group flex flex-col gap-1 rounded-lg border px-4 py-3 transition-colors";

const gallery = { title: "Browse icons", href: "/icons/lucide" };

type Dir = "prev" | "next";

const PagerCard: React.FC<{
	page: { title: string; href: string };
	dir: Dir;
	fallback?: boolean;
}> = ({ page, dir, fallback }) => (
	<Link
		href={page.href}
		className={cn(cardClass, dir === "prev" ? "items-start" : "items-end text-right")}
	>
		<span className="text-textMuted flex items-center gap-1 text-xs">
			{dir === "prev" ? (
				<>
					<ChevronLeft className="size-3.5" /> {fallback ? "Explore" : "Previous"}
				</>
			) : (
				<>
					{fallback ? "Explore" : "Next"} <ChevronRight className="size-3.5" />
				</>
			)}
		</span>
		<span className="text-textPrimary group-hover:text-primary text-sm font-medium transition-colors">
			{page.title}
		</span>
	</Link>
);

const DocsPager: React.FC = () => {
	const pathname = usePathname();
	const idx = docsPages.findIndex((p) => p.href === pathname);
	if (idx === -1) return null;

	const prev = docsPages[idx - 1];
	const next = docsPages[idx + 1];

	return (
		<nav className="border-border/40 mt-16 grid grid-cols-2 gap-4 border-t pt-6">
			<PagerCard page={prev ?? gallery} dir="prev" fallback={!prev} />
			<PagerCard page={next ?? gallery} dir="next" fallback={!next} />
		</nav>
	);
};

export default DocsPager;
