"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const SignalIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
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

		const handleEnter = useCallback(() => {
			if (reduced) return;
			if (!isControlled.current) controls.start("animate");
		}, [controls, reduced]);

		const handleLeave = useCallback(() => {
			if (!isControlled.current) controls.start("normal");
		}, [controls]);

		const svgVariants: Variants = {
			normal: { scale: 1, rotate: 0 },
			animate: {
				scale: [1, 1.05, 1],
				transition: { duration: 1 * speed, ease: "easeInOut" },
			},
		};

		const dotVariants: Variants = {
			normal: { scale: 1, opacity: 0.8 },
			animate: {
				scale: [1, 1.3, 1],
				opacity: [0.5, 1, 0.8],
				transition: { duration: 0.5 * speed, ease: "easeInOut" },
			},
		};

		const barPulse = (delay: number): Variants => ({
			normal: { scaleY: 1, opacity: 0.9, transformOrigin: "center bottom" },
			animate: {
				scaleY: [1, 1.4, 0.95, 1],
				opacity: [0.8, 1, 0.85, 1],
				transition: {
					duration: 0.8 * speed,
					ease: "easeInOut",
					delay,
				},
			},
		});

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
					variants={svgVariants}
				>
					<motion.path
						d="M2 20h.01"
						variants={dotVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M7 20v-4"
						variants={barPulse(0.1)}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M12 20v-8"
						variants={barPulse(0.25)}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M17 20V8"
						variants={barPulse(0.4)}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M22 4v16"
						variants={barPulse(0.55)}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

SignalIcon.displayName = "SignalIcon";
const icon = withAnimatedIconWrapper(SignalIcon);
export { icon as SignalIcon };
