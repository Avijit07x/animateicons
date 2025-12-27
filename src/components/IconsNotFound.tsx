import { motion } from "motion/react";
import React from "react";

const IconsNotFound: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 24, scale: 0.98 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ duration: 0.45, ease: "easeOut" }}
			className="border-primary/20 bg-primary/10 mx-auto mt-12 flex max-w-sm flex-col items-center gap-2 rounded-lg border px-6 py-6 text-center shadow-lg backdrop-blur"
		>
			<h2 className="text-zinc-300 text-sm font-semibold tracking-wide">
				No icons found
			</h2>

			<p className="text-muted-foreground text-xs leading-relaxed">
				No results match your search.
				<br />
				Try using different or simpler keywords.
			</p>
		</motion.div>
	);
};

export default IconsNotFound;
