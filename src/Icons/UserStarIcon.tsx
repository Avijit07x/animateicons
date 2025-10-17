"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface UserStarHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UserStarProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const UserStarIcon = forwardRef<UserStarHandle, UserStarProps>(
	(
		{
			onMouseEnter,
			onMouseLeave,
			className,
			size = 28,
			durationMultiplier = 1,
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

		const bodyVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [40, 0],
				opacity: [0.3, 1],
				transition: {
					duration: 0.7 * durationMultiplier,
					ease: "easeInOut" as const,
				},
			},
		};

		const headVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.6, 1.2, 1],
				opacity: [0, 1],
				transition: {
					duration: 0.6 * durationMultiplier,
					ease: "easeOut" as const,
				},
			},
		};

		const starVariants: Variants = {
			normal: { scale: 1, rotate: 0, opacity: 1 },
			animate: {
				scale: [1, 1.3, 0.9, 1.15, 1],
				rotate: [0, -15, 15, -10, 0],
				opacity: [0.4, 1],
				transition: {
					duration: 1 * durationMultiplier,
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
					className="lucide lucide-user-star-icon lucide-user-star"
				>
					<motion.path
						d="M8 15H7a4 4 0 0 0-4 4v2"
						strokeDasharray="40"
						strokeDashoffset="40"
						variants={bodyVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.circle
						cx="10"
						cy="7"
						r="4"
						variants={headVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"
						variants={starVariants}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

UserStarIcon.displayName = "UserStarIcon";
export { UserStarIcon };
