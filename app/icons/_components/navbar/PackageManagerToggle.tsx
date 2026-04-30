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
			className="bg-surfaceElevated border-border hidden h-9 items-center justify-center rounded-full border p-1 text-sm lg:flex"
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
							"relative z-10 flex items-center justify-center rounded-full px-3 py-1 select-none",
							active ? "text-white" : "text-textSecondary! hover:text-white",
						)}
					>
						{active && (
							<motion.span
								layoutId="package-manager-pill"
								className="bg-surface absolute inset-0 -z-10 rounded-full"
								transition={{
									type: "tween",
									duration: 0.22,
									ease: [0.4, 0, 0.2, 1],
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
