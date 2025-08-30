"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface UserRoundPenHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UserRoundPenProps extends HTMLMotionProps<"div"> {
	size?: number;
}

const UserRoundPenIcon = forwardRef<UserRoundPenHandle, UserRoundPenProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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

		const bodyVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [60, 0],
				opacity: [0.3, 1],
				transition: { duration: 0.7, delay: 0.2, ease: "easeInOut" },
			},
		};

		const headVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.6, 1.2, 1],
				opacity: [0, 1],
				transition: { duration: 0.6, ease: "easeOut" },
			},
		};

		const penVariants: Variants = {
			normal: { rotate: 0, x: 0, y: 0, opacity: 1 },
			animate: {
				rotate: [-10, -5, -12, -6, -10],
				x: [0, 2, -2, 1, 0],
				y: [0, 2, -1, 1, 0],
				transition: {
					duration: 1.2,
					repeat: 1,
					ease: "easeInOut",
					delay: 0.6,
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
					className="lucide lucide-user-round-pen-icon lucide-user-round-pen"
				>
					<motion.path
						d="M2 21a8 8 0 0 1 10.821-7.487"
						strokeDasharray="60"
						strokeDashoffset="60"
						variants={bodyVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.circle
						cx="10"
						cy="8"
						r="5"
						variants={headVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
						variants={penVariants}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

UserRoundPenIcon.displayName = "UserRoundPenIcon";
export { UserRoundPenIcon };
