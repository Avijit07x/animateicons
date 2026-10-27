import { motion } from "motion/react";
import React from "react";

const IconsNotFound: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center"
		>
			<h2 className="text-textPrimary text-xl font-semibold tracking-tight">
				No icons found<span className="text-primary">.</span>
			</h2>
			<p className="text-textSecondary mt-2 max-w-xs text-sm leading-relaxed">
				Nothing matches your search. Try a different or simpler keyword.
			</p>
		</motion.div>
	);
};

export default IconsNotFound;
