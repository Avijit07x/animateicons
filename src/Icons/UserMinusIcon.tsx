"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface UserMinusHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UserMinusProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const UserMinusIcon = forwardRef<UserMinusHandle, UserMinusProps>(
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
					delay: 0.2,
					ease: "easeInOut",
				},
			},
		};

		const headVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.5, 1.2, 1],
				opacity: [0, 1],
				transition: { duration: 0.6 * durationMultiplier, ease: "easeOut" },
			},
		};

		const minusVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [20, 0],
				opacity: [0.4, 1],
				transition: {
					duration: 0.5 * durationMultiplier,
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
					className="lucide lucide-user-minus-icon lucide-user-minus"
				>
					<motion.path
						d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
						strokeDasharray="40"
						strokeDashoffset="40"
						variants={bodyVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.circle
						cx="9"
						cy="7"
						r="4"
						variants={headVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.line
						x1="22"
						x2="16"
						y1="11"
						y2="11"
						strokeDasharray="20"
						strokeDashoffset="0"
						variants={minusVariants}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

UserMinusIcon.displayName = "UserMinusIcon";
export { UserMinusIcon };
