"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface KeyHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface KeyProps extends HTMLMotionProps<"div"> {
	size?: number;
}

const KeyIcon = forwardRef<KeyHandle, KeyProps>(
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

		const ease = [0.16, 1, 0.3, 1] as const;

		const sequence: Variants = {
			normal: { scale: 1, rotate: 0, x: 0, y: 0 },
			animate: {
				scale: [1, 1.01, 1.01, 1],
				rotate: [0, -6, 0, 6, 0],
				x: [0, 0, 0, 0, 0],
				y: [0, 0, 0, 0, 0],
				transition: { duration: 0.9 * durationMultiplier, ease, times: [0, 0.25, 0.5, 0.75, 1] },
			},
		};

		const ringLock: Variants = {
			normal: { strokeDashoffset: 0, scale: 1, opacity: 1 },
			animate: {
				scale: [1, 0.98, 1, 1.02, 1],
				opacity: [1, 1, 1, 1, 1],
				transition: { duration: 0.9 * durationMultiplier, ease, times: [0, 0.25, 0.5, 0.75, 1] },
			},
		};

		const shaftSlide: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1, x: 0 },
			animate: {
				x: [0, -0.6, 0, 0.6, 0],
				opacity: [1, 1, 1, 1, 1],
				transition: { duration: 0.9 * durationMultiplier, ease, times: [0, 0.25, 0.5, 0.75, 1] },
			},
		};

		const headTurn: Variants = {
			normal: { x: 0, y: 0, rotate: 0, originX: 19, originY: 6 },
			animate: {
				rotate: [0, -18, 0, 18, 0],
				x: [0, -1, 0, 1, 0],
				y: [0, -0.4, 0, 0.4, 0],
				transition: {
					duration: 0.9 * durationMultiplier,
					ease,
					times: [0, 0.25, 0.5, 0.75, 1],
					delay: 0.04,
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
					className="lucide lucide-key-icon lucide-key"
				>
					<motion.g variants={sequence} initial="normal" animate={controls}>
						<motion.circle
							cx="7.5"
							cy="15.5"
							r="5.5"
							variants={ringLock}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="m21 2-9.6 9.6"
							variants={shaftSlide}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"
							variants={headTurn}
							initial="normal"
							animate={controls}
						/>
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

KeyIcon.displayName = "KeyIcon";
export { KeyIcon };
