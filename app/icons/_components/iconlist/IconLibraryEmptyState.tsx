import Link from "next/link";
import React from "react";

const IconLibraryEmptyState: React.FC = () => {
	return (
		<div className="flex w-full flex-col">
			<main className="flex min-h-[calc(100dvh-3.75rem)] items-center justify-center px-6">
				<div className="flex max-w-md flex-col items-center gap-4 text-center">
					<p className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase">
						<span className="text-primary">Library</span> / Two systems
					</p>

					<h2 className="text-textPrimary text-2xl font-semibold tracking-tight sm:text-3xl">
						Choose an icon library<span className="text-primary">.</span>
					</h2>

					<p className="text-textSecondary text-sm leading-relaxed">
						Browse a collection of beautifully crafted animated icons with
						search, copy, and live preview.
					</p>

					<div className="mt-3 flex flex-wrap justify-center gap-3">
						<Link href="/icons/lucide" className="btn btn-primary">
							Browse Lucide
						</Link>
						<Link href="/icons/huge" className="btn btn-secondary">
							Browse Huge
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
};

export default IconLibraryEmptyState;
