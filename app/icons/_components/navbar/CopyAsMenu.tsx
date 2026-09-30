"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "@/icons/huge/chevron-down-icon";
import { AnimatePresence, motion } from "motion/react";
import {
	type Distribution,
	useDistribution,
} from "../../_contexts/DistributionContext";
import {
	type PackageManager,
	usePackageManager,
} from "../../_contexts/PackageManagerContext";

const DISTRIBUTIONS: { value: Distribution; label: string }[] = [
	{ value: "shadcn", label: "shadcn" },
	{ value: "npm", label: "import" },
];

const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "bun"];

const LABEL = "text-textMuted px-3 py-1.5 text-xs font-medium";
const ITEM =
	"text-textSecondary focus:text-textPrimary data-[state=checked]:text-textPrimary rounded-full px-3 py-2 text-[13px] focus:bg-white/8";

const keepOpen = (event: Event) => event.preventDefault();

const CopyAsMenu: React.FC = () => {
	const { distribution, setDistribution } = useDistribution();
	const { packageManager, setPackageManager } = usePackageManager();
	const usesShadcn = distribution === "shadcn";
	const summary = usesShadcn ? `shadcn · ${packageManager}` : "import";

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					aria-label={`Copy as ${summary}`}
					className="bg-surfaceElevated hover:bg-surfaceActive data-[state=open]:bg-surfaceActive focus-visible:bg-surfaceActive inline-flex h-9 items-center gap-2 rounded-full pr-3 pl-4 text-xs transition-colors outline-none"
				>
					<span className="text-textMuted">Copy as</span>
					<span className="text-textPrimary font-medium">{summary}</span>
					<ChevronDownIcon size={14} className="text-textMuted" />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="start"
				sideOffset={8}
				className="bg-surfaceElevated text-textPrimary w-52 rounded-[14px] border-0 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
			>
				<DropdownMenuLabel className={LABEL}>Install with</DropdownMenuLabel>
				<DropdownMenuRadioGroup
					value={distribution}
					onValueChange={(value) => setDistribution(value as Distribution)}
				>
					{DISTRIBUTIONS.map(({ value, label }) => (
						<DropdownMenuRadioItem
							key={value}
							value={value}
							onSelect={keepOpen}
							className={ITEM}
						>
							{label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>

				<AnimatePresence initial={false}>
					{usesShadcn && (
						<motion.div
							key="package-manager"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
							className="overflow-hidden"
						>
							<DropdownMenuSeparator className="mx-1 bg-white/8" />
							<DropdownMenuLabel className={LABEL}>
								Package manager
							</DropdownMenuLabel>
							<DropdownMenuRadioGroup
								value={packageManager}
								onValueChange={(value) =>
									setPackageManager(value as PackageManager)
								}
							>
								{PACKAGE_MANAGERS.map((pm) => (
									<DropdownMenuRadioItem
										key={pm}
										value={pm}
										onSelect={keepOpen}
										className={ITEM}
									>
										{pm}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</motion.div>
					)}
				</AnimatePresence>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default CopyAsMenu;
