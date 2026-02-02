import React from "react";
import Navbar from "./Navbar";

type Props = {};

const IconLibraryEmptyState: React.FC<Props> = () => {
	return (
		<div className="flex w-full flex-col">
			<Navbar />
			<main className="flex min-h-[calc(100dvh-3.75rem)] items-center justify-center px-6">
				<div className="flex max-w-md flex-col items-center gap-4 text-center">
					<div className="border-border bg-surfaceElevated text-textMuted rounded-full border px-4 py-1 text-xs">
						Icon Library
					</div>

					<h2 className="text-textPrimary text-lg font-semibold">
						Choose an icon library
					</h2>

					<p className="text-textMuted text-sm">
						Browse a collection of beautifully crafted icons with search, copy,
						and preview support.
					</p>

					<div className="mt-2 flex gap-3">
						<a
							href="/icons/lucide"
							className="rounded-md bg-(--cta-bg) px-4 py-2 text-sm font-medium text-(--cta-text) transition hover:opacity-90"
						>
							Browse Lucide Icons
						</a>

						<a
							href="/icons/huge"
							className="border-border bg-surface text-textPrimary hover:bg-surfaceElevated rounded-md border px-4 py-2 text-sm font-medium transition"
						>
							Browse Huge Icons
						</a>
					</div>
				</div>
			</main>
		</div>
	);
};

export default IconLibraryEmptyState;
