"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type PackageManager = "npm" | "pnpm" | "bun";

const OPTIONS: PackageManager[] = ["npm", "pnpm", "bun"];
const STORAGE_KEY = "tab";

const PackageManagerToggle: React.FC = () => {
	const [value, setValue] = useState<PackageManager>("npm");

	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY) as PackageManager | null;
		if (saved && OPTIONS.includes(saved)) {
			setValue(saved);
		}
	}, []);

	const onChange = (pm: PackageManager) => {
		setValue(pm);
		localStorage.setItem(STORAGE_KEY, pm);
	};

	return (
		<div className="bg-surfaceElevated border-border inline-flex h-9 items-center rounded-full border p-1 text-sm">
			{OPTIONS.map((pm) => {
				const active = pm === value;

				return (
					<button
						key={pm}
						onClick={() => onChange(pm)}
						className={cn(
							"relative z-10 flex items-center justify-center rounded-full px-3 py-1",
							active ? "text-white" : "text-textMuted hover:text-white",
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
