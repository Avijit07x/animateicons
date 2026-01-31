import { differenceInDays } from "date-fns";
import Fuse from "fuse.js";
import { AnimatePresence } from "motion/react";
import React, { useMemo } from "react";
import { ICON_LIST } from "../../../icons/lucide";
import IconsNotFound from "./IconsNotFound";
import IconTile from "./IconTile";

type Props = {
	query: string;
};

const IconList: React.FC<Props> = ({ query }) => {
	const fuse = useMemo(
		() =>
			new Fuse(ICON_LIST, {
				keys: [
					{ name: "name", weight: 0.7 },
					{ name: "keywords", weight: 0.3 },
				],
				threshold: 0.2,
				ignoreLocation: true,
				minMatchCharLength: 2,
			}),
		[],
	);

	const filteredItems = useMemo(() => {
		const items = query.trim()
			? fuse.search(query).map((r) => r.item)
			: ICON_LIST;

		const withNewFlag = items.map((item) => ({
			item,
			isNew: differenceInDays(new Date(), new Date(item.addedAt)) <= 3,
		}));

		withNewFlag.sort((a, b) => Number(b.isNew) - Number(a.isNew));

		return withNewFlag.map((entry) => entry.item);
	}, [query, fuse]);

	return (
		<AnimatePresence mode="popLayout">
			{filteredItems.length > 0 ? (
				<div className="mt-5 grid w-full grid-cols-1 gap-4 px-6 pb-10 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
					{filteredItems.map((item, i) => (
						<IconTile key={item.name ?? i} item={item} />
					))}
				</div>
			) : (
				<IconsNotFound />
			)}
		</AnimatePresence>
	);
};

export default IconList;
