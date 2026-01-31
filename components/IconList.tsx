import { differenceInDays } from "date-fns";
import Fuse from "fuse.js";
import { AnimatePresence, motion } from "motion/react";
import React, { useMemo } from "react";
import { ICON_LIST } from "../icons/lucide";
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
		<AnimatePresence>
			{filteredItems.length > 0 ? (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.4 }}
					className="mt-5 grid w-full grid-cols-1 gap-4 pb-10 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
				>
					{filteredItems.map((item, i) => (
						<IconTile key={item.name ?? i} item={item} />
					))}
				</motion.div>
			) : (
				<IconsNotFound />
			)}
		</AnimatePresence>
	);
};

export default IconList;
