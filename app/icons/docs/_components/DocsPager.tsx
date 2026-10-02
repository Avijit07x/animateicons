"use client";

import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { ChevronLeftIcon } from "@/icons/huge/chevron-left-icon";
import { ChevronRightIcon } from "@/icons/huge/chevron-right-icon";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsPages } from "../_lib/nav";

const gallery = { title: "Browse icons", href: "/icons/lucide" };

type Dir = "prev" | "next";

const PagerCard: React.FC<{
	page: { title: string; href: string };
	dir: Dir;
	fallback?: boolean;
}> = ({ page, dir, fallback }) => {
	const { ref, triggerProps } = useIconHover();
	const Chevron = dir === "prev" ? ChevronLeftIcon : ChevronRightIcon;
	const caption = fallback ? "Explore" : dir === "prev" ? "Previous" : "Next";

	return (
		<Link
			href={page.href}
			{...triggerProps}
			className={cn(
				"bg-surface hover:bg-surfaceElevated group flex flex-col gap-1 rounded-3xl px-5 py-4 transition-colors",
				dir === "prev" ? "items-start" : "items-end text-right",
			)}
		>
			<span className="text-textMuted flex items-center gap-1 text-xs">
				{dir === "prev" && <Chevron ref={ref} size={14} />}
				{caption}
				{dir === "next" && <Chevron ref={ref} size={14} />}
			</span>
			<span className="text-textPrimary group-hover:text-primary text-sm font-medium transition-colors">
				{page.title}
			</span>
		</Link>
	);
};

const DocsPager: React.FC = () => {
	const pathname = usePathname();
	const idx = docsPages.findIndex((p) => p.href === pathname);
	if (idx === -1) return null;

	const prev = docsPages[idx - 1];
	const next = docsPages[idx + 1];

	return (
		<nav className="mt-16 grid grid-cols-2 gap-3">
			<PagerCard page={prev ?? gallery} dir="prev" fallback={!prev} />
			<PagerCard page={next ?? gallery} dir="next" fallback={!next} />
		</nav>
	);
};

export default DocsPager;
