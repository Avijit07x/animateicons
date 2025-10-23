"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface DashboardIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface DashboardIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	duration?: number;
}

const TrashIcon = forwardRef<DashboardIconHandle, DashboardIconProps>(
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

		const iconVariants: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.03, 1],

				transition: { duration: 0.5 * duration, ease: "easeOut" },
			},
		};

		const lidBounce: Variants = {
			normal: { y: 0, rotate: 0, transformOrigin: "12px 6px" },
			animate: {
				rotate: [0, -10, 6, -3, 0],
				y: [0, -2, 0.5, 0],
				transition: {
					duration: 0.9 * duration,
					ease: "easeInOut",
					delay: 0.05,
				},
			},
		};

		const barSnap: Variants = {
			normal: { scaleX: 1, opacity: 1 },
			animate: {
				scaleX: [0.85, 1.08, 1],
				opacity: [0.9, 1, 1],
				transition: { duration: 0.45 * duration, ease: "easeOut", delay: 0.1 },
			},
		};

		const binSettle: Variants = {
			normal: { y: 0, scaleY: 1, transformOrigin: "50% 100%" },
			animate: {
				scaleY: [1, 0.97, 1],
				transition: { duration: 0.5 * duration, ease: "easeOut", delay: 0.2 },
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
					variants={iconVariants}
				>
					<motion.path
						d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
						variants={binSettle}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M3 6h18"
						variants={barSnap}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
						variants={lidBounce}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

TrashIcon.displayName = "TrashIcon";
export { TrashIcon };
