/**
 * SupporterWallSkeleton
 *
 * Suspense fallback for SupporterWall. Mirrors the explorer's layout
 * (tabs + grid) so the page doesn't reflow when supporters resolve.
 */

const SupporterWallSkeleton: React.FC = () => (
	<div className="space-y-6" aria-hidden="true">
		<div className="flex flex-wrap gap-2">
			{Array.from({ length: 3 }).map((_, i) => (
				<span
					key={i}
					className="border-border/60 bg-textMuted/5 h-9 w-32 animate-pulse rounded-full border"
				/>
			))}
		</div>

		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="border-border/60 flex flex-col gap-2.5 rounded-xl border bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-4"
				>
					<div className="flex items-center gap-2.5">
						<span className="bg-primary/10 size-9 shrink-0 animate-pulse rounded-full" />
						<span className="bg-textMuted/10 h-3 w-24 animate-pulse rounded" />
					</div>
					<span className="bg-textMuted/10 h-2.5 w-full animate-pulse rounded" />
					<span className="bg-textMuted/10 h-2.5 w-3/4 animate-pulse rounded" />
				</div>
			))}
		</div>
	</div>
);

export default SupporterWallSkeleton;
