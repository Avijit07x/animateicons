"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const ContactRoundIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
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

		const rectVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [100, 0],
				opacity: [0.3, 1],
				transition: { duration: 0.8 * speed, ease: "easeInOut" },
			},
		};

		const circleVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.5, 1.2, 1],
				opacity: [0, 1],
				transition: {
					duration: 0.6 * speed,
					delay: 0.3,
					ease: "easeOut",
				},
			},
		};

		const lineVariants: Variants = {
			normal: { x: 0, opacity: 1 },
			animate: {
				x: [-10, 0],
				opacity: [0, 1],
				transition: {
					duration: 0.4 * speed,
					ease: "easeOut",
					delay: 0.6,
				},
			},
		};

		const curveVariants: Variants = {
			normal: { opacity: 1, strokeDashoffset: 0 },
			animate: {
				strokeDashoffset: [30, 0],
				opacity: [0, 1],
				transition: {
					duration: 0.6 * speed,
					delay: 0.5,
					ease: "easeInOut",
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
					className="lucide lucide-contact-round-icon lucide-contact-round"
				>
					<motion.path
						d="M16 2v2"
						variants={lineVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M17.915 22a6 6 0 0 0-12 0"
						strokeDasharray="30"
						strokeDashoffset="0"
						variants={curveVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.path
						d="M8 2v2"
						variants={lineVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.circle
						cx="12"
						cy="12"
						r="4"
						variants={circleVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.rect
						x="3"
						y="4"
						width="18"
						height="18"
						rx="2"
						strokeDasharray="100"
						strokeDashoffset="0"
						variants={rectVariants}
						initial="normal"
						animate={controls}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

ContactRoundIcon.displayName = "ContactRoundIcon";
const icon = withAnimatedIconWrapper(ContactRoundIcon);
export { icon as ContactRoundIcon };
