"use client";

import { ChevronRightIcon } from "@/icons/huge/chevron-right-icon";
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
				<ChevronRightIcon size={14} className="text-textMuted" />
				<span className="text-textPrimary font-medium">{title}</span>
			</nav>

			<OpenInAI
				pageUrl={`https://animateicons.in${pathname}`}
				title={`AnimateIcons - ${title}`}
			/>
		</div>
	);
};

export default DocsContentHeader;
