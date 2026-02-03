const IconTileSkeleton: React.FC = () => {
	return (
		<div className="bg-surfaceElevated border-border relative flex w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-md border p-4 text-sm shadow-lg">
			<div className="bg-surface size-10 animate-pulse rounded-xl" />

			<div className="bg-surface mt-1 h-4 w-24 animate-pulse rounded-xl" />

			<div className="mt-3 flex items-center justify-center gap-6">
				<div className="bg-surface size-6 animate-pulse rounded-md" />
				<div className="bg-surface size-6 animate-pulse rounded-md" />
				<div className="bg-surface size-6 animate-pulse rounded-md" />
			</div>
		</div>
	);
};

export default IconTileSkeleton;
