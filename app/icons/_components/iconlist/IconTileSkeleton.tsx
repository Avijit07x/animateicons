/**
 * IconTileSkeleton
 *
 * Loading placeholder for one AnimateIcons tile. Mirrors the live
 * IconTile dimensions so the `next/dynamic` handoff doesn't shift the
 * gallery layout when IconList resolves. Match these classes whenever
 * IconTile changes its outer container, icon button, name line, or
 * action row:
 *
 *   live AnimateIcons tile: gap-2 p-4 rounded-xl
 *   icon button:            size-12 rounded-xl
 *   icon (decorative):      roughly 23px (≈ size-6)
 *   name line:              text-sm (≈ h-4)
 *   action row:             mt-2 size-6 buttons, gap-6, three of them
 */
const IconTileSkeleton: React.FC = () => {
	return (
		<div className="border-border/70 bg-surface/40 relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-4 text-sm">
			{/* Icon button area - matches IconTile's size-12 rounded-xl click target. */}
			<div className="size-12 animate-pulse rounded-xl bg-white/8" />

			{/* Icon name line. */}
			<div className="mt-1 h-4 w-24 animate-pulse rounded bg-white/8" />

			{/* Action row - three size-6 buttons gap-6, mt-2. */}
			<div className="mt-2 flex items-center justify-center gap-6">
				<div className="size-6 animate-pulse rounded-md bg-white/8" />
				<div className="size-6 animate-pulse rounded-md bg-white/8" />
				<div className="size-6 animate-pulse rounded-md bg-white/8" />
			</div>
		</div>
	);
};

export default IconTileSkeleton;
