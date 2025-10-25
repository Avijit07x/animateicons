import { motion } from "motion/react";
import React from "react";

const IconsNotFound: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="mx-auto mt-10 w-fit rounded-md bg-red-500/10 p-4 text-center text-red-500"
		>
			<h2 className="text-sm">No icons found</h2>
			<p className="text-xs">
				We couldn't find any icons matching your search. <br /> Try different
				keywords.
			</p>
		</motion.div>
	);
};

export default IconsNotFound;
