"use client";

/**
 * Row above each doc's content: breadcrumb on the left, "Open in AI"
 * dropdown on the right. Both derive from the current pathname + nav tree.
 */

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OpenInAI from "../../_components/docs/OpenInAI";
import { findDocPage } from "../_lib/nav";

const DocsContentHeader: React.FC = () => {
	const pathname = usePathname();
	const title = findDocPage(pathname)?.title ?? "Docs";

	return (
		<div className="mb-8 flex flex-wrap items-center justify-between gap-3">
			<nav
				aria-label="Breadcrumb"
				className="text-textSecondary flex items-center gap-1.5 text-sm"
			>
				<Link
					href="/icons/docs"
					className="hover:text-textPrimary transition-colors"
				>
					Docs
				</Link>
				<ChevronRight className="text-textMuted size-3.5" />
				<span className="text-textPrimary font-medium">{title}</span>
			</nav>

			<OpenInAI
				pageUrl={`https://animateicons.in${pathname}`}
				title={`AnimateIcons — ${title}`}
			/>
		</div>
	);
};

export default DocsContentHeader;
