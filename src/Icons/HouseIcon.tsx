"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface HouseHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface HouseProps extends HTMLMotionProps<"div"> {
	size?: number;
	duration?: number;
}

const HouseIcon = forwardRef<HouseHandle, HouseProps>(
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

		const houseOutlineVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [100, 0],
				opacity: [0.35, 1],
				transition: {
					duration: 0.8 * duration,
					ease: "easeInOut" as const,
				},
			},
		};

		const doorVariants: Variants = {
			normal: { scaleY: 1, opacity: 1 },
			animate: {
				scaleY: [0.6, 1.15, 1],
				opacity: [0, 1],
				transition: {
					duration: 0.5 * duration,
					delay: 0.45,
					ease: "easeOut" as const,
				},
			},
		};

		const smokeVariants: Variants = {
			normal: { opacity: 0, y: 0, scale: 0.8 },
			animate: {
				opacity: [0, 0.7, 0],
				y: [-2, -6, -10],
				scale: [0.8, 1, 1.1],
				transition: {
					duration: 1.1 * duration,
					delay: 0.3,
					ease: "easeInOut" as const,
				},
			},
		};

		const wiggleVariants: Variants = {
			normal: { rotate: 0, scale: 1 },
			animate: {
				rotate: [0, -1.5, 1.5, 0],
				scale: [1, 1.02, 1],
				transition: {
					duration: 0.6 * duration,
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
					className="lucide lucide-house-icon lucide-house"
				>
					<motion.g
						variants={wiggleVariants}
						initial="normal"
						animate={controls}
					>
						<motion.path
							d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
							strokeDasharray="100"
							strokeDashoffset="100"
							variants={houseOutlineVariants}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
							variants={doorVariants}
							initial="normal"
							animate={controls}
						/>
					</motion.g>

					<motion.g
						variants={smokeVariants}
						initial="normal"
						animate={controls}
					>
						<motion.circle cx="16.5" cy="6" r="0.8" />
						<motion.circle cx="17.5" cy="4.5" r="0.6" />
						<motion.circle cx="18.3" cy="3.2" r="0.45" />
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

HouseIcon.displayName = "HouseIcon";
export { HouseIcon };
