"use client";

/**
 * DistributionToggle
 *
 * Sibling of PackageManagerToggle — lets the gallery user pick whether
 * "Copy" buttons across IconTiles should produce a shadcn install
 * command (default) or an `@animateicons/react` import line. Reads /
 * writes via DistributionContext, persisted in localStorage.
 *
 * Same visual treatment as PackageManagerToggle (pill segmented
 * control with a sliding background) so the pair feels like one unit.
 */

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
	type Distribution,
	useDistribution,
} from "../../_contexts/DistributionContext";

const OPTIONS: { value: Distribution; label: string }[] = [
	{ value: "shadcn", label: "shadcn" },
	{ value: "npm", label: "npm" },
];

const DistributionToggle: React.FC = () => {
	const { distribution, setDistribution } = useDistribution();

	return (
		<div
			role="radiogroup"
			aria-label="Distribution method"
			className={cn(
				"hidden h-9 items-center justify-center rounded-full p-1 text-sm lg:flex",
				"border-border/80 from-surface to-surfaceElevated border bg-gradient-to-b",
				"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)]",
				"backdrop-blur",
			)}
		>
			{OPTIONS.map(({ value, label }) => {
				const active = value === distribution;

				return (
					<button
						key={value}
						role="radio"
						aria-checked={active}
						onClick={() => setDistribution(value)}
						className={cn(
							"relative z-10 flex items-center justify-center rounded-full px-3 py-1 font-medium transition-colors select-none",
							active
								? "text-primary"
								: "text-textSecondary hover:text-textPrimary",
						)}
					>
						{active && (
							<motion.span
								layoutId="distribution-pill"
								className="ring-primary/30 absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent ring-1 ring-inset"
								transition={{
									type: "spring",
									stiffness: 380,
									damping: 32,
								}}
							/>
						)}
						{label}
					</button>
				);
			})}
		</div>
	);
};

export default DistributionToggle;
