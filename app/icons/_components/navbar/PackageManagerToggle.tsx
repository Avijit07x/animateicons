"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useDistribution } from "../../_contexts/DistributionContext";
import {
	type PackageManager,
	usePackageManager,
} from "../../_contexts/PackageManagerContext";

const OPTIONS: PackageManager[] = ["npm", "pnpm", "bun"];

const PackageManagerToggle: React.FC = () => {
	const { packageManager, setPackageManager } = usePackageManager();
	const { distribution } = useDistribution();

	if (distribution !== "shadcn") return null;

	return (
		<div
			role="radiogroup"
			aria-label="Package manager"
			className="border-border/70 ml-1 flex items-center gap-0.5 border-l pl-2 text-sm"
		>
			{OPTIONS.map((pm) => {
				const active = pm === packageManager;

				return (
					<button
						key={pm}
						role="radio"
						aria-checked={active}
						onClick={() => setPackageManager(pm)}
						className={cn(
							"relative z-10 flex items-center justify-center rounded-sm px-2.5 py-1 font-medium transition-colors select-none",
							active ? "text-primary" : "text-textMuted hover:text-textPrimary",
						)}
					>
						{active && (
							<motion.span
								layoutId="package-manager-pill"
								className="absolute inset-0 -z-10 rounded-sm bg-white/10"
								transition={{
									type: "spring",
									stiffness: 380,
									damping: 32,
								}}
							/>
						)}
						{pm}
					</button>
				);
			})}
		</div>
	);
};

export default PackageManagerToggle;
