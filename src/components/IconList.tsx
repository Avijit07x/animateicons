import { ICON_LIST } from "@/Icons";
import { AnimatePresence, motion } from "motion/react";
import React from "react";
import IconsNotFound from "./IconsNotFound";
import IconTile from "./IconTile";

type Props = {
	query: string;
};

const IconList: React.FC<Props> = ({ query }) => {
	const filteredItems = ICON_LIST.filter((item) => {
		const searchText = query.toLowerCase().trim();

		const nameMatch = item.name.toLowerCase().includes(searchText);

		const keywordMatch = item.keywords?.some((keyword) =>
			keyword.toLowerCase().trim().includes(searchText),
		);

		return nameMatch || keywordMatch;
	});

	return (
		<>
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
							<IconTile key={i} item={item} />
						))}
					</motion.div>
				) : (
					<IconsNotFound />
				)}
			</AnimatePresence>
		</>
	);
};

export default IconList;
