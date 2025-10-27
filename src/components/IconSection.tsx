"use client";

import { ICON_COUNT } from "@/Icons";
import { motion } from "motion/react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import IconList from "./IconList";

const IconSection = () => {
	const [query, setQuery] = useState<string>("");
	const [debouncedQuery] = useDebounce(query, 200);

	return (
		<div className="min-h-80 w-full">
			<motion.input
				type="text"
				className="bg-primary/10 border-primary/20 focus:ring-primary/50 relative mt-5 w-full rounded-md border px-4 py-2 text-sm text-white shadow-lg placeholder:text-zinc-300 focus:ring-1 focus:outline-none"
				placeholder={`Search ${ICON_COUNT} icons...`}
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
			<IconList query={debouncedQuery} />
		</div>
	);
};

export default IconSection;
