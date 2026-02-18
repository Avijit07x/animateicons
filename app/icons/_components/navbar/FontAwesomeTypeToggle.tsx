"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
	useFontAwesomeType,
	type FontAwesomeType,
} from "../../_contexts/FontAwesomeTypeContext";

const OPTIONS: FontAwesomeType[] = ["regular", "solid"];

const FontAwesomeTypeToggle: React.FC = () => {
	const { iconType, setIconType } = useFontAwesomeType();

	return (
		<div className="bg-surfaceElevated border-border hidden h-9 items-center justify-center rounded-full border p-1 text-sm lg:flex">
			{OPTIONS.map((option) => {
				const active = option === iconType;

				return (
					<button
						key={option}
						onClick={() => setIconType(option)}
						className={cn(
							"relative z-10 flex items-center justify-center rounded-full px-3 py-1 capitalize select-none",
							active ? "text-white" : "text-textSecondary! hover:text-white",
						)}
					>
						{active && (
							<motion.span
								layoutId="fa-type-pill"
								className="bg-surface absolute inset-0 -z-10 rounded-full"
								transition={{
									type: "tween",
									duration: 0.22,
									ease: [0.4, 0, 0.2, 1],
								}}
							/>
						)}
						{option}
					</button>
				);
			})}
		</div>
	);
};

export default FontAwesomeTypeToggle;
