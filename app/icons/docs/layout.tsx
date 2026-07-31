import type React from "react";
import DocsContentHeader from "./_components/DocsContentHeader";
import DocsHelp from "./_components/DocsHelp";
import DocsNavbar from "./_components/DocsNavbar";
import DocsPager from "./_components/DocsPager";
import DocsRail from "./_components/DocsRail";
import DocsSidebar from "./_components/DocsSidebar";

/**
 * Docs shell — a shadcn-style three-column layout:
 *   left: section navigation · center: MDX content · right: "On This Page".
 *
 * The gallery's category AppSidebar hides itself on /icons/docs (see
 * AppSidebar), so this layout owns the full width and supplies its own
 * navbar + nav columns. Columns are sticky under the h-15 navbar.
 */
const DocsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="bg-bgDark text-textPrimary flex min-h-dvh w-full flex-1 flex-col">
			<DocsNavbar />

			<div className="mx-auto flex w-full max-w-360 items-start gap-6 px-4 sm:px-6 lg:gap-10 lg:px-8">
				<aside className="top-15 sticky hidden h-[calc(100dvh-3.75rem)] w-56 shrink-0 overflow-y-auto py-10 lg:block">
					<DocsSidebar />
				</aside>

				<main className="min-w-0 flex-1 py-8 lg:py-10">
					<details className="border-border/50 mb-6 rounded-lg border lg:hidden">
						<summary className="text-textPrimary cursor-pointer px-4 py-2.5 text-sm font-medium">
							Menu
						</summary>
						<div className="border-border/50 border-t px-4 py-3">
							<DocsSidebar />
						</div>
					</details>

					<div className="mx-auto max-w-3xl">
						<DocsContentHeader />
						<article className="docs-prose">{children}</article>
						<DocsPager />
						<DocsHelp />
					</div>
				</main>

				<aside className="top-15 sticky hidden h-[calc(100dvh-3.75rem)] w-56 shrink-0 overflow-y-auto py-10 xl:block">
					<DocsRail />
				</aside>
			</div>
		</div>
	);
};

export default DocsLayout;
