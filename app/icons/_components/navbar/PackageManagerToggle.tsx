"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
	type PackageManager,
	usePackageManager,
} from "../../_contexts/PackageManagerContext";

const OPTIONS: PackageManager[] = ["npm", "pnpm", "bun"];

const PackageManagerToggle: React.FC = () => {
	const { packageManager, setPackageManager } = usePackageManager();

	return (
		<div
			role="radiogroup"
			aria-label="Package manager"
			className={cn(
				"hidden h-9 items-center justify-center rounded-full p-1 text-sm lg:flex",
				"border-border/80 from-surface to-surfaceElevated border bg-gradient-to-b",
				"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_24px_-12px_rgba(0,0,0,0.6)]",
				"backdrop-blur",
			)}
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
							"relative z-10 flex items-center justify-center rounded-full px-3 py-1 font-medium transition-colors select-none",
							active
								? "text-primary"
								: "text-textSecondary hover:text-textPrimary",
						)}
					>
						{active && (
							<motion.span
								layoutId="package-manager-pill"
								className="ring-primary/30 absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent ring-1 ring-inset"
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
