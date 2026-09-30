const IconTileSkeleton: React.FC = () => (
	<div className="bg-surface flex h-38 w-full flex-col items-center justify-center gap-4 rounded-3xl p-3">
		<div className="size-12 animate-pulse rounded-full bg-white/8" />
		<div className="h-3.5 w-24 animate-pulse rounded-full bg-white/8" />
	</div>
);

export default IconTileSkeleton;
