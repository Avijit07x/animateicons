import IconTileSkeleton from "./IconTileSkeleton";

const IconListSkeleton: React.FC = () => {
	return (
		<div className="mt-5 grid w-full grid-cols-1 gap-4 px-6 pb-10 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			{Array.from({ length: 18 }).map((_, i) => (
				<IconTileSkeleton key={i} />
			))}
		</div>
	);
};

export default IconListSkeleton;
