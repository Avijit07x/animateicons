"use client";

import { PackageManagerLogo } from "@/components/icons/PackageLogos";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopy } from "@/hooks/useCopy";
import { useIconHover } from "@/hooks/useIconHover";
import { CheckIcon } from "@/icons/huge/check-icon";
import { ChevronDownIcon } from "@/icons/huge/chevron-down-icon";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { cn } from "@/lib/utils";
import {
	installCommandFor,
	type PackageManager,
	usePackageManager,
} from "../../_contexts/PackageManagerContext";

const MANAGERS: PackageManager[] = ["npm", "pnpm", "bun"];

const LAYER = "col-start-1 row-start-1 transition-opacity duration-200";
const GHOST =
	"cursor-pointer rounded-full hover:bg-transparent dark:hover:bg-transparent hover:text-textPrimary focus-visible:ring-0 focus-visible:text-textPrimary";

const InstallCommand: React.FC = () => {
	const { packageManager, setPackageManager } = usePackageManager();
	const { copied, copy } = useCopy();
	const { ref, hoverProps } = useIconHover();
	const command = `${installCommandFor(packageManager)} @animateicons/react`;
	const [tool, verb, pkg] = command.split(" ");
	const Icon = copied ? CheckIcon : CopyIcon;

	return (
		<div className="bg-surfaceElevated inline-flex h-9 items-center rounded-full p-1 font-mono text-[13px]">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						aria-label={`Package manager, ${packageManager}`}
						className={cn(
							GHOST,
							"group text-textMuted data-[state=open]:text-textPrimary h-7 gap-1.5 px-2 py-0 has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3.5",
						)}
					>
						<PackageManagerLogo pm={packageManager} />
						<ChevronDownIcon
							size={12}
							isAnimated={false}
							className="transition-transform duration-200 group-data-[state=open]:rotate-180"
						/>
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent
					align="start"
					sideOffset={8}
					className="bg-surfaceElevated text-textPrimary min-w-40 rounded-[14px] border-0 p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] data-[state=closed]:duration-150 data-[state=open]:duration-200"
				>
					<DropdownMenuRadioGroup
						value={packageManager}
						onValueChange={(value) =>
							setPackageManager(value as PackageManager)
						}
					>
						{MANAGERS.map((pm) => (
							<DropdownMenuRadioItem
								key={pm}
								value={pm}
								className="text-textSecondary focus:text-textPrimary data-[state=checked]:text-textPrimary gap-2.5 rounded-full px-3 py-2 text-[13px] focus:bg-white/8 [&_svg:not([class*='size-'])]:size-3.5"
							>
								<PackageManagerLogo pm={pm} />
								{pm}
							</DropdownMenuRadioItem>
						))}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			<span aria-hidden="true" className="mx-0.5 h-4 w-px bg-white/10" />

			<Button
				variant="ghost"
				onClick={() => copy(command)}
				aria-label={`Copy ${command}`}
				{...hoverProps}
				className={cn(
					GHOST,
					"group h-7 gap-2.5 px-2 py-0 font-mono text-[13px] [&_svg:not([class*='size-'])]:size-3.5",
				)}
			>
				<span className="grid text-left">
					<span className={cn(LAYER, copied && "opacity-0")}>
						<span className="text-primary">{tool}</span>{" "}
						<span className="text-textMuted">{verb}</span>{" "}
						<span className="text-textPrimary">{pkg}</span>
					</span>
					<span
						aria-hidden="true"
						className={cn(LAYER, "text-success", !copied && "opacity-0")}
					>
						Copied to clipboard
					</span>
				</span>

				<span aria-hidden="true" className="h-4 w-px bg-white/10" />

				<span
					className={cn(
						"grid place-items-center transition-colors",
						copied
							? "text-success"
							: "text-textMuted group-hover:text-textPrimary group-focus-visible:text-textPrimary",
					)}
				>
					<Icon ref={ref} size={14} />
				</span>
			</Button>
		</div>
	);
};

export default InstallCommand;
