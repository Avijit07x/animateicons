"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BookmarkXIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface BookmarkXIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const BookmarkXIcon = forwardRef<BookmarkXIconHandle, BookmarkXIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, durationMultiplier = 1, ...props }, ref) => {
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

		const bookmarkVariants: Variants = {
			normal: { rotate: 0, scale: 1 },
			animate: {
				rotate: [0, -4, 4, -2, 0],
				scale: [1, 1.05, 0.95, 1],
				transition: { duration: 1 * durationMultiplier, ease: "easeInOut" },
			},
		};

		const xLineVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0.8, 1],
				transition: { duration: 0.6 * durationMultiplier, ease: "easeInOut" },
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
					animate={controls}
					initial="normal"
					variants={bookmarkVariants}
				>
					<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
					<motion.path d="m14.5 7.5-5 5" variants={xLineVariants} />
					<motion.path d="m9.5 7.5 5 5" variants={xLineVariants} />
				</motion.svg>
			</motion.div>
		);
	},
);

BookmarkXIcon.displayName = "BookmarkXIcon";
export { BookmarkXIcon };
