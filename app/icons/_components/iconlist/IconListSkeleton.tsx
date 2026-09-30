import { ICON_GRID_CLASS } from "./iconGrid";
import IconTileSkeleton from "./IconTileSkeleton";

const IconListSkeleton: React.FC = () => {
	return (
		<div className={ICON_GRID_CLASS}>
			{Array.from({ length: 30 }).map((_, i) => (
				<IconTileSkeleton key={i} />
			))}
		</div>
	);
};

export default IconListSkeleton;
