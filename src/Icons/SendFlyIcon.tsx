"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface SendFlyIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface SendFlyIconProps extends HTMLMotionProps<"div"> {
	size?: number;
}

const SendFlyIcon = forwardRef<SendFlyIconHandle, SendFlyIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
		const controls = useAnimation();
		const cloudControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						controls.start("normal");
						cloudControls.start("normal");
					} else {
						controls.start("fly");
						cloudControls.start("drift");
					}
				},
				stopAnimation: () => {
					controls.start("normal");
					cloudControls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					controls.start("fly");
					cloudControls.start("drift");
				} else {
					onMouseEnter?.(e as any);
				}
			},
			[controls, cloudControls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
					cloudControls.start("normal");
				} else {
					onMouseLeave?.(e as any);
				}
			},
			[controls, cloudControls, onMouseLeave],
		);

		const containerVariants: Variants = {
			normal: { scale: 1 },
			fly: { scale: 1.1, transition: { duration: 0.3 } },
		};

		const sendIconVariants: Variants = {
			normal: { 
				rotate: 0, 
				x: 0, 
				y: 0, 
				scale: 1,
				filter: "drop-shadow(0 0 0px rgba(59, 130, 246, 0))"
			},
			fly: {
				rotate: [0, -8, 5, -3, 0, 2, -1, 0],
				x: [0, 12, -4, 8, -2, 6, -1, 0],
				y: [0, -8, 4, -6, 2, -4, 1, 0],
				scale: [1, 1.15, 0.95, 1.1, 0.98, 1.05, 1],
				filter: [
					"drop-shadow(0 0 0px rgba(59, 130, 246, 0))",
					"drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
					"drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))",
					"drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))",
					"drop-shadow(0 0 0px rgba(59, 130, 246, 0))"
				],
				transition: {
					duration: 2.5,
					ease: "easeInOut",
					when: "beforeChildren",
					staggerChildren: 0.1,
					repeat: 0,
				},
			},
		};

		const pathDrawVariants: Variants = {
			normal: { 
				pathLength: 1, 
				opacity: 1,
				stroke: "currentColor"
			},
			fly: {
				pathLength: [0.3, 1, 0.8, 1],
				opacity: [0.7, 1, 0.9, 1],
				stroke: [
					"currentColor",
					"rgb(59, 130, 246)",
					"rgb(147, 197, 253)",
					"currentColor"
				],
				transition: { 
					duration: 1.8, 
					ease: "easeInOut", 
					repeat: 0 
				},
			},
		};

		const trailVariants: Variants = {
			normal: { 
				opacity: 0, 
				x: 0, 
				scaleX: 1, 
				originX: 1,
				stroke: "currentColor"
			},
			fly: {
				opacity: [0, 0.8, 0.6, 0.4, 0],
				x: [-6, -12, -18, -24, -30],
				scaleX: [0.5, 1.2, 1.5, 1.8, 0.3],
				stroke: [
					"currentColor",
					"rgb(59, 130, 246)",
					"rgb(147, 197, 253)",
					"rgb(219, 234, 254)",
					"transparent"
				],
				transition: { 
					duration: 1.2, 
					ease: "easeOut", 
					repeat: 0, 
					delay: 0.3 
				},
			},
		};

		const sparkleVariants: Variants = {
			normal: { opacity: 0, scale: 0 },
			fly: {
				opacity: [0, 1, 0.8, 0.4, 0],
				scale: [0, 1.5, 1, 0.5, 0],
				rotate: [0, 180, 360, 540, 720],
				transition: {
					duration: 1.5,
					ease: "easeOut",
					delay: 0.5,
				},
			},
		};

		const cloudVariants: Variants = {
			normal: { 
				x: 0, 
				opacity: 0.3,
				scale: 1
			},
			drift: {
				x: [0, 15, -5, 20, -8, 12, 0],
				opacity: [0.3, 0.7, 0.5, 0.8, 0.4, 0.6, 0.3],
				scale: [1, 1.1, 0.95, 1.05, 1],
				transition: {
					duration: 3,
					ease: "easeInOut",
					repeat: 0,
				},
			},
		};

		return (
			<motion.div
				className={cn("relative inline-flex items-center justify-center", className)}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				variants={containerVariants}
				animate={controls}
				initial="normal"
				{...props}
			>
				{/* Background Clouds */}
				<motion.svg
					className="absolute inset-0 pointer-events-none"
					xmlns="http://www.w3.org/2000/svg"
					width={size * 2.5}
					height={size * 2}
					viewBox="0 0 60 48"
					style={{ left: '-50%', top: '-25%' }}
					animate={cloudControls}
					initial="normal"
				>
					{/* Cloud 1 */}
					<motion.path
						d="M15 25c-3.5 0-6.5-3-6.5-6.5S11.5 12 15 12c1.5-3 4.5-5 8-5s6.5 2 8 5c3.5 0 6.5 3 6.5 6.5S34.5 25 31 25H15z"
						fill="rgba(156, 163, 175, 0.4)"
						variants={cloudVariants}
					/>
					{/* Cloud 2 */}
					<motion.path
						d="M45 30c-2.5 0-4.5-2-4.5-4.5S42.5 21 45 21c1-2 3-3.5 5.5-3.5s4.5 1.5 5.5 3.5c2.5 0 4.5 2 4.5 4.5S58.5 30 56 30H45z"
						fill="rgba(156, 163, 175, 0.3)"
						variants={cloudVariants}
						transition={{ delay: 0.5 }}
					/>
					{/* Cloud 3 */}
					<motion.path
						d="M8 35c-2 0-3.5-1.5-3.5-3.5S6 28 8 28c0.5-1.5 2-2.5 3.5-2.5s3 1 3.5 2.5c2 0 3.5 1.5 3.5 3.5S17 35 15 35H8z"
						fill="rgba(156, 163, 175, 0.2)"
						variants={cloudVariants}
						transition={{ delay: 1 }}
					/>
				</motion.svg>

				{/* Main Send Icon */}
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2.5"
					strokeLinecap="round"
					strokeLinejoin="round"
					animate={controls}
					initial="normal"
					variants={sendIconVariants}
					style={{ zIndex: 10 }}
				>
					<motion.path
						d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
						variants={pathDrawVariants}
						fill="none"
					/>
					<motion.path
						d="m21.854 2.147-10.94 10.939"
						variants={pathDrawVariants}
					/>
					
					{/* Enhanced Trail Lines */}
					<motion.line
						x1="4" y1="14" x2="9" y2="14"
						stroke="currentColor"
						strokeWidth="2.5"
						variants={trailVariants}
					/>
					<motion.line
						x1="2" y1="16" x2="7" y2="16"
						stroke="currentColor"
						strokeWidth="2"
						variants={trailVariants}
						transition={{ delay: 0.1 }}
					/>
					<motion.line
						x1="1" y1="18" x2="5" y2="18"
						stroke="currentColor"
						strokeWidth="1.5"
						variants={trailVariants}
						transition={{ delay: 0.2 }}
					/>

					{/* Sparkle Effects */}
					<motion.circle
						cx="18" cy="6" r="1"
						fill="rgb(59, 130, 246)"
						variants={sparkleVariants}
					/>
					<motion.circle
						cx="20" cy="8" r="0.5"
						fill="rgb(147, 197, 253)"
						variants={sparkleVariants}
						transition={{ delay: 0.7 }}
					/>
					<motion.circle
						cx="16" cy="4" r="0.8"
						fill="rgb(219, 234, 254)"
						variants={sparkleVariants}
						transition={{ delay: 0.9 }}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

SendFlyIcon.displayName = "SendFlyIcon";
export { SendFlyIcon };