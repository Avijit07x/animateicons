"use client";

/**
 * DistributionToggle
 *
 * Sibling of PackageManagerToggle - lets the gallery user pick whether
 * "Copy" buttons across IconTiles should produce a shadcn install
 * command (default) or an `@animateicons/react` import line. Reads /
 * writes via DistributionContext, persisted in localStorage.
 *
 * Renders as bare segments - the gallery navbar wraps this and
 * PackageManagerToggle in one labelled "copy as" shell.
 */

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
	type Distribution,
	useDistribution,
} from "../../_contexts/DistributionContext";

const OPTIONS: { value: Distribution; label: string }[] = [
	{ value: "shadcn", label: "shadcn" },
	{ value: "npm", label: "import" },
];

const DistributionToggle: React.FC = () => {
	const { distribution, setDistribution } = useDistribution();

	return (
		<div
			role="radiogroup"
			aria-label="Distribution method"
			className="flex items-center gap-0.5 text-sm"
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
							"relative z-10 flex items-center justify-center rounded-sm px-2.5 py-1 font-medium transition-colors select-none",
							active ? "text-primary" : "text-textMuted hover:text-textPrimary",
						)}
					>
						{active && (
							<motion.span
								layoutId="distribution-pill"
								className="absolute inset-0 -z-10 rounded-sm bg-white/10"
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
