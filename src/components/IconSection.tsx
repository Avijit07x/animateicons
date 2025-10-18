"use client";

import { Icon_List } from "@/Icons";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import IconsNotFound from "./IconsNotFound";
import IconTile from "./IconTile";

const IconSection = () => {
	const [query, setQuery] = useState("");

	const filteredItems = Icon_List.filter((item) => {
		const searchText = query.toLowerCase().trim();

		const nameMatch = item.name.toLowerCase().includes(searchText);

		const keywordMatch = item.keywords?.some((keyword: string) =>
			keyword.toLowerCase().trim().includes(searchText),
		);

		return nameMatch || keywordMatch;
	});

	return (
		<div className="min-h-80 w-full">
			<motion.input
				type="text"
				className="bg-primary/10 border-primary/20 focus:ring-primary/50 relative mt-5 w-full rounded-md border px-4 py-2 text-sm text-white shadow-lg placeholder:text-zinc-300 focus:ring-1 focus:outline-none"
				placeholder={`Search ${Icon_List.length} icons...`}
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			/>
			<motion.div
				initial={{ opacity: 0, scale: 0.6 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					duration: 1.5,
					delay: 2,
					repeat: Infinity,
					repeatType: "reverse",
				}}
				className="bg-accent/5 absolute top-1/2 left-1/2 h-64 w-64 rounded-full blur-3xl"
			/>
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
		</div>
	);
};

export default IconSection;
