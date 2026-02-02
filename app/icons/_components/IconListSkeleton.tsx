import IconTileSkeleton from "./IconTileSkeleton";

const IconListSkeleton: React.FC = () => {
	return (
		<div className="576:grid-cols-2 900:grid-cols-3 mt-5 grid w-full grid-cols-1 gap-4 px-6 pb-10 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
			{Array.from({ length: 30 }).map((_, i) => (
				<IconTileSkeleton key={i} />
			))}
		</div>
	);
};

export default IconListSkeleton;
