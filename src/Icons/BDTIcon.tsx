"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BDTIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface BDTIconProps extends HTMLMotionProps<"div"> {
	size?: number;
}

const BDTIcon = forwardRef<BDTIconHandle, BDTIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
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

		const svgVariants: Variants = {
			normal: { 
				scale: 1, 
				rotate: 0, 
				y: 0,
				filter: "drop-shadow(0 0 0px currentColor)"
			},
			animate: {
				scale: [1, 1.08, 1.02, 1],
				rotate: [0, -3, 3, -1, 0],
				y: [0, -2, 1, 0],
				filter: [
					"drop-shadow(0 0 0px currentColor)",
					"drop-shadow(0 2px 8px rgba(59, 130, 246, 0.3))",
					"drop-shadow(0 1px 4px rgba(59, 130, 246, 0.2))",
					"drop-shadow(0 0 0px currentColor)"
				],
				transition: { 
					duration: 1.4, 
					ease: "easeInOut",
					times: [0, 0.3, 0.7, 1]
				},
			},
		};

		// Break down the BDT symbol path into logical segments for sequential animation
		const topCurveVariants: Variants = {
			normal: { 
				pathLength: 1, 
				opacity: 1,
				strokeDasharray: "0 0"
			},
			animate: {
				pathLength: [0, 1],
				opacity: [0.6, 1],
				strokeDasharray: ["0 100", "100 0"],
				transition: { 
					duration: 0.7, 
					ease: "easeOut", 
					delay: 0.1 
				},
			},
		};

		const verticalStrokeVariants: Variants = {
			normal: { 
				pathLength: 1, 
				opacity: 1,
				strokeDasharray: "0 0"
			},
			animate: {
				pathLength: [0, 1],
				opacity: [0.7, 1],
				strokeDasharray: ["0 80", "80 0"],
				transition: { 
					duration: 0.6, 
					ease: "easeOut", 
					delay: 0.25 
				},
			},
		};

		const horizontalLineVariants: Variants = {
			normal: { 
				pathLength: 1, 
				opacity: 1,
				strokeDasharray: "0 0"
			},
			animate: {
				pathLength: [0, 1],
				opacity: [0.8, 1],
				strokeDasharray: ["0 60", "60 0"],
				transition: { 
					duration: 0.5, 
					ease: "easeOut", 
					delay: 0.4 
				},
			},
		};

		const bottomCurveVariants: Variants = {
			normal: { 
				pathLength: 1, 
				opacity: 1,
				strokeDasharray: "0 0"
			},
			animate: {
				pathLength: [0, 1],
				opacity: [0.8, 1],
				strokeDasharray: ["0 90", "90 0"],
				transition: { 
					duration: 0.65, 
					ease: "easeOut", 
					delay: 0.55 
				},
			},
		};

		// Shimmer effect for the completed icon
		const shimmerVariants: Variants = {
			normal: {
				opacity: 0,
				x: -100,
			},
			animate: {
				opacity: [0, 0.8, 0],
				x: [-100, 100],
				transition: {
					duration: 0.8,
					ease: "easeInOut",
					delay: 1.2,
				},
			},
		};

		return (
			<motion.div
				className={cn("inline-flex items-center justify-center relative", className)}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				{...props}
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 640 640"
					fill="none"
					stroke="currentColor"
					strokeWidth="24"
					strokeLinecap="round"
					strokeLinejoin="round"
					animate={controls}
					initial="normal"
					variants={svgVariants}
					className="relative overflow-visible"
				>
					{/* Background path with low opacity */}
					<g opacity={0.25}>
						<path d="M164 96.3C146.4 94.1 130.4 106.5 128.3 124C126.2 141.5 138.5 157.6 156 159.8L163.9 160.8C179.9 162.8 191.9 176.4 191.9 192.6L191.9 224.1L151.9 224.1C138.6 224.1 127.9 234.8 127.9 248.1C127.9 261.4 138.6 272.1 151.9 272.1L191.9 272.1L191.9 448.1C191.9 501.1 234.9 544.1 287.9 544.1L319.9 544.1C425.9 544.1 511.9 458.1 511.9 352.1L511.9 320.1C511.9 267.1 468.9 224.1 415.9 224.1L399.9 224.1C382.2 224.1 367.9 238.4 367.9 256.1C367.9 273.8 382.2 288.1 399.9 288.1L415.9 288.1C433.6 288.1 447.9 302.4 447.9 320.1L447.9 352.1C447.9 422.8 390.6 480.1 319.9 480.1L287.9 480.1C270.2 480.1 255.9 465.8 255.9 448.1L255.9 272.1L295.9 272.1C309.2 272.1 319.9 261.4 319.9 248.1C319.9 234.8 309.2 224.1 295.9 224.1L255.9 224.1L255.9 192.6C256 144.1 220 103.2 171.9 97.2L164 96.2z" />
					</g>

					{/* Animated path segments */}
					{/* Top curve */}
					<motion.path
						d="M164 96.3C146.4 94.1 130.4 106.5 128.3 124C126.2 141.5 138.5 157.6 156 159.8L163.9 160.8C179.9 162.8 191.9 176.4 191.9 192.6"
						variants={topCurveVariants}
						initial="normal"
						animate={controls}
					/>

					{/* Vertical line down */}
					<motion.path
						d="M191.9 192.6L191.9 448.1"
						variants={verticalStrokeVariants}
						initial="normal"
						animate={controls}
					/>

					{/* Horizontal line */}
					<motion.path
						d="M151.9 224.1L295.9 224.1M151.9 272.1L295.9 272.1"
						variants={horizontalLineVariants}
						initial="normal"
						animate={controls}
					/>

					{/* Bottom curve and connection */}
					<motion.path
						d="M191.9 448.1C191.9 501.1 234.9 544.1 287.9 544.1L319.9 544.1C425.9 544.1 511.9 458.1 511.9 352.1L511.9 320.1C511.9 267.1 468.9 224.1 415.9 224.1L399.9 224.1M399.9 288.1L415.9 288.1C433.6 288.1 447.9 302.4 447.9 320.1L447.9 352.1C447.9 422.8 390.6 480.1 319.9 480.1L287.9 480.1C270.2 480.1 255.9 465.8 255.9 448.1L255.9 272.1"
						variants={bottomCurveVariants}
						initial="normal"
						animate={controls}
					/>

					{/* Shimmer effect */}
					<motion.rect
						x="0"
						y="0"
						width="20"
						height="640"
						fill="url(#shimmer)"
						variants={shimmerVariants}
						initial="normal"
						animate={controls}
					/>

					<defs>
						<linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
							<stop offset="0%" stopColor="transparent" />
							<stop offset="50%" stopColor="currentColor" stopOpacity="0.6" />
							<stop offset="100%" stopColor="transparent" />
						</linearGradient>
					</defs>
				</motion.svg>
			</motion.div>
		);
	},
);

BDTIcon.displayName = "BDTIcon";
export { BDTIcon };