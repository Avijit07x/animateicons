"use client";

import { useLitItems } from "@/hooks/useLitItems";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import { scatter } from "@/utils/scatter";
import { useReducedMotion } from "motion/react";
import {
	Suspense,
	useMemo,
	type ComponentType,
	type CSSProperties,
	type Ref,
} from "react";

type Item = {
	name: string;
	Icon: ComponentType<{ size?: number; ref?: Ref<IconHandle> }>;
};

type Props = {
	items: readonly Item[];
	cols: number;
	rows: number;
	iconSize?: number;
	thinOnPhone?: boolean;
	className?: string;
};

const NEAR_PX = 64;
const IDLE_EVERY_MS = 900;

const FloatingIcons: React.FC<Props> = ({
	items,
	cols,
	rows,
	iconSize = 40,
	thinOnPhone = false,
	className,
}) => {
	const reduced = useReducedMotion();
	const points = useMemo(
		() => scatter(items.length, cols, rows),
		[items.length, cols, rows],
	);
	const { fieldRef, setItem, setIcon } = useLitItems({
		count: items.length,
		idleEveryMs: IDLE_EVERY_MS,
		reach: NEAR_PX,
		enabled: !reduced,
	});

	return (
		<div
			ref={fieldRef}
			aria-hidden="true"
			className={cn("absolute inset-0", className)}
		>
			{items.map(({ name, Icon }, i) => {
				const { left, top, bob, delay, thinned } = points[i];
				return (
					<div
						key={name}
						ref={setItem(i)}
						style={{ left: `${left}%`, top: `${top}%` }}
						className={cn(
							"group absolute -translate-x-1/2 -translate-y-1/2",
							thinOnPhone && thinned && "max-sm:hidden",
						)}
					>
						<div
							className="hero-bob"
							style={
								{
									"--bob": `${bob}s`,
									"--bob-delay": `${delay}s`,
								} as CSSProperties
							}
						>
							<div
								style={{ width: iconSize, height: iconSize }}
								className="text-textMuted/60 group-data-lit:text-primary flex items-center justify-center transition-colors duration-300"
							>
								<Suspense fallback={null}>
									<Icon ref={setIcon(i)} size={iconSize} />
								</Suspense>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default FloatingIcons;
