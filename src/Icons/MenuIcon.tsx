"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const MenuIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
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
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					controls.start("animate");
				} else {
					onMouseEnter?.(e);
				}
			},
			[controls, onMouseEnter, reduced],
		);

		const handleLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e);
				}
			},
			[controls, onMouseLeave],
		);

		const lineVariants: Variants = {
			normal: { x: 0, opacity: 1 },
			animate: (i) => ({
				x: [0, i % 2 === 0 ? 4 : -4, 0],
				opacity: [1, 0.5, 1],
				transition: { duration: 0.4 * speed, delay: i * 0.1 },
			}),
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
				>
					<motion.path d="M4 12h16" variants={lineVariants} custom={0} />
					<motion.path d="M4 18h16" variants={lineVariants} custom={1} />
					<motion.path d="M4 6h16" variants={lineVariants} custom={2} />
				</motion.svg>
			</motion.div>
		);
	},
);

MenuIcon.displayName = "MenuIcon";
const icon = withAnimatedIconWrapper(MenuIcon);
export { icon as MenuIcon };
