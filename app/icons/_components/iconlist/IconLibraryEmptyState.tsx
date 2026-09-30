import IconLink from "@/components/IconLink";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import React from "react";

const IconLibraryEmptyState: React.FC = () => {
	return (
		<div className="flex w-full flex-col">
			<main className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center px-6">
				<div className="flex max-w-md flex-col items-center gap-4 text-center">
					<h2 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
						Choose an icon library<span className="text-primary">.</span>
					</h2>

					<p className="text-textSecondary text-sm leading-relaxed sm:text-base">
						Browse a collection of beautifully crafted animated icons with
						search, copy, and live preview.
					</p>

					<div className="mt-3 flex flex-wrap justify-center gap-3">
						<IconLink
							href="/icons/lucide"
							icon={ArrowRight02Icon}
							variant="default"
							size="pill"
						>
							Browse Lucide
						</IconLink>
						<IconLink
							href="/icons/huge"
							icon={ArrowRight02Icon}
							variant="secondary"
							size="pill"
						>
							Browse Huge
						</IconLink>
					</div>
				</div>
			</main>
		</div>
	);
};

export default IconLibraryEmptyState;
