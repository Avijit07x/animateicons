import { motion } from "motion/react";
import React from "react";

const IconsNotFound: React.FC = () => {
	return (
		<div className="flex h-full w-full items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 24, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.45, ease: "easeOut" }}
				className="border-border/50 bg-surfaceElevated mx-auto mt-12 flex flex-col items-center gap-2 rounded-lg border px-6 py-6 text-center shadow-lg backdrop-blur md:min-w-sm"
			>
				<h2 className="text-textPrimary text-sm font-semibold tracking-wide">
					No icons found
				</h2>

				<p className="text-muted-foreground text-xs leading-relaxed">
					No results match your search.
					<br />
					Try using different or simpler keywords.
				</p>
			</motion.div>
		</div>
	);
};

export default IconsNotFound;
