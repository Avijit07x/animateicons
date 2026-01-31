"use client";
import { motion } from "motion/react";
import React from "react";

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
	<motion.svg
		className={className || "h-5 w-5 text-green-500"}
		viewBox="0 0 20 20"
		fill="none"
		stroke="currentColor"
		strokeWidth={2.2}
		strokeLinecap="round"
		strokeLinejoin="round"
		initial="hidden"
		animate="visible"
		variants={{
			hidden: { pathLength: 0, opacity: 0 },
			visible: {
				pathLength: 1,
				opacity: 1,
				transition: {
					pathLength: { type: "spring", duration: 0.5, bounce: 0 },
					opacity: { duration: 0.2 },
				},
			},
		}}
	>
		<motion.path
			d="M5 11.5L9 15L15 7"
			variants={{
				hidden: { pathLength: 0 },
				visible: { pathLength: 1 },
			}}
			transition={{
				duration: 0.5,
				ease: "easeInOut",
			}}
			stroke="currentColor"
			fill="none"
			strokeWidth={2.2}
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</motion.svg>
);
