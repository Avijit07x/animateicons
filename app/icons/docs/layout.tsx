import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import type React from "react";
import DocsContentHeader from "./_components/DocsContentHeader";
import DocsHelp from "./_components/DocsHelp";
import DocsNavbar from "./_components/DocsNavbar";
import DocsPager from "./_components/DocsPager";
import DocsRail from "./_components/DocsRail";
import DocsSidebar from "./_components/DocsSidebar";

const DocsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="bg-bgDark text-textPrimary flex min-h-dvh w-full flex-1 flex-col">
			<DocsNavbar />

			<div className="mx-auto flex w-full max-w-360 items-start gap-6 px-4 sm:px-6 lg:gap-10 lg:px-8">
				<aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto py-10 lg:block">
					<DocsSidebar />
				</aside>

				<main id={MAIN_CONTENT_ID} className="min-w-0 flex-1 py-8 lg:py-10">
					<details className="bg-surface mb-6 rounded-3xl lg:hidden">
						<summary className="text-textPrimary cursor-pointer px-4 py-3 text-sm font-medium">
							Menu
						</summary>
						<div className="px-4 pb-4">
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

				<aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto py-10 xl:block">
					<DocsRail />
				</aside>
			</div>
		</div>
	);
};

export default DocsLayout;
