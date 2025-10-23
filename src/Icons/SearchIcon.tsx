"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface SearchHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface SearchProps extends HTMLMotionProps<"div"> {
	size?: number;
	duration?: number;
}

const SearchIcon = forwardRef<SearchHandle, SearchProps>(
	(
		{
			onMouseEnter,
			onMouseLeave,
			className,
			size = 28,
			duration = 1,
			...props
		},
		ref,
	) => {
		const controls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () =>
					reduced ? controls.start("normal") : controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) controls.start("animate");
				else onMouseEnter?.(e as any);
			},
			[controls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) controls.start("normal");
				else onMouseLeave?.(e as any);
			},
			[controls, onMouseLeave],
		);

		const circleVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1, scale: 1 },
			animate: {
				strokeDashoffset: [50, 0],
				opacity: [0.3, 1],
				scale: [1, 1.1, 1],
				transition: {
					duration: 0.8 * duration,
					ease: "easeInOut" as const,
				},
			},
		};

		const handleVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [20, 0],
				opacity: [0, 1],
				transition: {
					duration: 0.6 * duration,
					delay: 0.3,
					ease: "easeInOut" as const,
				},
			},
		};

		const groupVariants: Variants = {
			normal: { rotate: 0, scale: 1 },
			animate: {
				rotate: [0, 5, -5, 0],
				scale: [1, 1.05, 1],
				transition: {
					duration: 1 * duration,
					ease: "easeInOut" as const,
				},
			},
		};

		return (
			<motion.div
				className={cn("inline-flex items-center justify-center", className)}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				{...props}
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="lucide lucide-search-icon lucide-search"
				>
					<motion.g
						variants={groupVariants}
						initial="normal"
						animate={controls}
					>
						<motion.circle
							cx="11"
							cy="11"
							r="8"
							strokeDasharray="50"
							strokeDashoffset="50"
							variants={circleVariants}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="m21 21-4.34-4.34"
							strokeDasharray="20"
							strokeDashoffset="20"
							variants={handleVariants}
							initial="normal"
							animate={controls}
						/>
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

SearchIcon.displayName = "SearchIcon";
export { SearchIcon };
