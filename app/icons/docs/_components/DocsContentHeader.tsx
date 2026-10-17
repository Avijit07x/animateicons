"use client";

import { FrameworkLogo } from "@/components/icons/FrameworkLogos";
import { ChevronRightIcon } from "@/icons/huge/chevron-right-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OpenInAI from "../../_components/docs/OpenInAI";
import { docMarkdownPath, findDocPage } from "../_lib/nav";

const DocsContentHeader: React.FC = () => {
	const pathname = usePathname();
	const page = findDocPage(pathname);
	const title = page?.title ?? "Docs";

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
				<span className="text-textPrimary flex items-center gap-1.5 font-medium">
					{page?.framework && (
						<FrameworkLogo framework={page.framework} className="size-3.5" />
					)}
					{title}
				</span>
			</nav>

			<OpenInAI
				pageUrl={`https://animateicons.in${pathname}`}
				markdownUrl={`https://animateicons.in${docMarkdownPath(page?.href ?? "/icons/docs")}`}
				title={title}
			/>
		</div>
	);
};

export default DocsContentHeader;
