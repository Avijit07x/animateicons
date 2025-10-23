"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CodeHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface CodeProps extends HTMLMotionProps<"div"> {
	size?: number;
	duration?: number;
}

const CodeIcon = forwardRef<CodeHandle, CodeProps>(
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

		const ease = [0.11, 0.99, 0.24, 1] as const;

		const groupScale: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.03, 1],
				rotate: [0, -0.5, 0],
				transition: { duration: 0.8 * duration, ease },
			},
		};

		const drawRight: Variants = {
			normal: { strokeDasharray: "0 1", strokeDashoffset: 0 },
			animate: {
				strokeDasharray: 32,
				strokeDashoffset: [32, 0],
				transition: { duration: 1.8 * duration, ease, delay: 0.12 },
			},
		};

		const drawLeft: Variants = {
			normal: { strokeDasharray: "0 1", strokeDashoffset: 0 },
			animate: {
				strokeDasharray: 32,
				strokeDashoffset: [32, 0],
				transition: { duration: 1.8 * duration, ease, delay: 0.28 },
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
					className="lucide lucide-code-icon lucide-code"
				>
					<motion.g variants={groupScale} initial="normal" animate={controls}>
						<motion.path
							d="m16 18 6-6-6-6"
							variants={drawRight}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="m8 6-6 6 6 6"
							variants={drawLeft}
							initial="normal"
							animate={controls}
						/>
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

CodeIcon.displayName = "CodeIcon";
export { CodeIcon };
