"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BookmarkCheckIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface BookmarkCheckIconProps extends HTMLMotionProps<"div"> {
	size?: number;
}

const BookmarkCheckIcon = forwardRef<
	BookmarkCheckIconHandle,
	BookmarkCheckIconProps
>(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
	const controls = useAnimation();
	const isControlled = useRef(false);

	useImperativeHandle(ref, () => {
		isControlled.current = true;
		return {
			startAnimation: () => controls.start("animate"),
			stopAnimation: () => controls.start("normal"),
		};
	});

	const handleEnter = useCallback(() => {
		if (!isControlled.current) controls.start("animate");
	}, [controls]);

	const handleLeave = useCallback(() => {
		if (!isControlled.current) controls.start("normal");
	}, [controls]);

	const bookmarkVariants: Variants = {
		normal: { scale: 1, y: 0 },
		animate: {
			scale: [1, 1.08, 0.96, 1],
			y: [0, -2, 0],
			transition: { duration: 1.2, ease: "easeInOut" },
		},
	};

	const checkVariants: Variants = {
		normal: { pathLength: 1, opacity: 1 },
		animate: {
			pathLength: [0, 1],
			opacity: 1,
			transition: { duration: 0.8, ease: "easeInOut" },
		},
	};

	return (
		<motion.div
			className={cn("inline-flex", className)}
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
				<motion.path d="m9 10 2 2 4-4" variants={checkVariants} />
			</motion.svg>
		</motion.div>
	);
});

BookmarkCheckIcon.displayName = "BookmarkCheckIcon";
export { BookmarkCheckIcon };
