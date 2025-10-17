"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface UserRoundXHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UserRoundXProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const UserRoundXIcon = forwardRef<UserRoundXHandle, UserRoundXProps>(
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
				strokeDashoffset: [60, 0],
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

		const crossGroupVariants: Variants = {
			normal: { scale: 1, rotate: 0, opacity: 1 },
			animate: {
				scale: [1, 1.3, 1],
				rotate: [0, -10, 10, 0],
				opacity: 1,
				transition: {
					duration: 0.6 * durationMultiplier,
					ease: "easeInOut" as const,
				},
			},
		};

		const crossLineVariants: Variants = {
			normal: { strokeDashoffset: 0 },
			animate: {
				strokeDashoffset: [20, 0],
				transition: {
					duration: 0.5 * durationMultiplier,
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
					className="lucide lucide-user-round-x-icon lucide-user-round-x"
				>
					<motion.path
						d="M2 21a8 8 0 0 1 11.873-7"
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
					<motion.g
						variants={crossGroupVariants}
						initial="normal"
						animate={controls}
					>
						<motion.path
							d="m17 17 5 5"
							strokeDasharray="20"
							strokeDashoffset="20"
							variants={crossLineVariants}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="m22 17-5 5"
							strokeDasharray="20"
							strokeDashoffset="20"
							variants={crossLineVariants}
							initial="normal"
							animate={controls}
						/>
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

UserRoundXIcon.displayName = "UserRoundXIcon";
export { UserRoundXIcon };
