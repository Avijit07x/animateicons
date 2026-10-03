"use client";

import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import type { Variants } from "motion/react";
import {
	LazyMotion,
	domMin,
	m,
	useAnimation,
	useReducedMotion,
} from "motion/react";
import { forwardRef, useImperativeHandle } from "react";
import { LOGO_BLADES } from "./blades";

type Props = {
	size?: number;
	duration?: number;
	className?: string;
};

const Logo = forwardRef<IconHandle, Props>(
	({ size = 40, duration = 1, className }, ref) => {
		const controls = useAnimation();
		const reduced = useReducedMotion();

		useImperativeHandle(ref, () => ({
			startAnimation: () =>
				reduced ? controls.start("normal") : controls.start("animate"),
			stopAnimation: () => controls.start("normal"),
		}));

		const timing = (rank: number) => ({
			duration: 0.62 * duration,
			delay: 0.085 * rank * duration,
			times: [0, 0.4, 1],
			ease: "easeInOut" as const,
		});

		const bladeVariants = (rank: number): Variants => ({
			normal: { scale: 1 },
			animate: { scale: [1, 1.06, 1], transition: timing(rank) },
		});

		const flashVariants = (rank: number): Variants => ({
			normal: { opacity: 0 },
			animate: { opacity: [0, 0.75, 0], transition: timing(rank) },
		});

		return (
			<LazyMotion features={domMin} strict>
				<m.svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 1024 1024"
					aria-hidden="true"
					className={cn("shrink-0", className)}
					animate={controls}
					initial="normal"
				>
					{LOGO_BLADES.map((blade) => (
						<m.g
							key={blade.rank}
							variants={bladeVariants(blade.rank)}
							style={{
								transformBox: "view-box",
								originX: `${blade.cx}px`,
								originY: `${blade.cy}px`,
							}}
						>
							<path d={blade.d} transform={blade.transform} fill={blade.fill} />
							<m.path
								d={blade.d}
								transform={blade.transform}
								fill="#ffffff"
								variants={flashVariants(blade.rank)}
							/>
						</m.g>
					))}
				</m.svg>
			</LazyMotion>
		);
	},
);

Logo.displayName = "Logo";

export default Logo;
