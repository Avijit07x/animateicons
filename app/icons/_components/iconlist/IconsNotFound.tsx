import { motion } from "motion/react";
import React from "react";

const IconsNotFound: React.FC = () => {
	return (
		<div className="flex h-full w-full items-center justify-center px-4">
			<motion.div
				initial={{ opacity: 0, y: 24, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.45, ease: "easeOut" }}
				className="border-border/60 bg-surface/50 mx-auto mt-12 flex flex-col items-center gap-2.5 rounded-xl border px-8 py-8 text-center md:min-w-sm"
			>
				<p className="text-textMuted font-mono text-[10px] tracking-[0.2em] uppercase">
					<span className="text-primary">No match</span> / Search
				</p>
				<h2 className="text-textPrimary text-base font-semibold">
					No icons found
				</h2>
				<p className="text-textSecondary text-xs leading-relaxed">
					No results match your search. Try different or simpler keywords.
				</p>
			</motion.div>
		</div>
	);
};

export default IconsNotFound;
