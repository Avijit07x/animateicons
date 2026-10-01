"use client";

import CopyButton from "@/components/home/CopyButton";
import {
	PackageManagerLogo,
	ShadcnLogo,
} from "@/components/icons/PackageLogos";
import { PackageDeliveredIcon } from "@/icons/huge/package-delivered-icon";
import { cn } from "@/lib/utils";
import {
	type Distribution,
	useDistribution,
} from "../../_contexts/DistributionContext";
import {
	installCommandFor,
	type PackageManager,
	shadcnAddCommand,
	usePackageManager,
} from "../../_contexts/PackageManagerContext";
import HighlightedCode from "./HighlightedCode";

type Option<T extends string> = {
	value: T;
	label: string;
	icon: React.ReactNode;
};

const METHODS: Option<Distribution>[] = [
	{
		value: "npm",
		label: "npm package",
		icon: <PackageDeliveredIcon size={14} isAnimated={false} />,
	},
	{ value: "shadcn", label: "shadcn", icon: <ShadcnLogo /> },
];

const MANAGERS: Option<PackageManager>[] = [
	{ value: "npm", label: "npm", icon: <PackageManagerLogo pm="npm" /> },
	{ value: "pnpm", label: "pnpm", icon: <PackageManagerLogo pm="pnpm" /> },
	{ value: "bun", label: "bun", icon: <PackageManagerLogo pm="bun" /> },
];

const OPTION =
	"inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

type ToggleProps<T extends string> = {
	label: string;
	value: T;
	options: Option<T>[];
	onChange: (value: T) => void;
	className?: string;
	optionClassName?: string;
};

const Toggle = <T extends string>({
	label,
	value,
	options,
	onChange,
	className,
	optionClassName,
}: ToggleProps<T>) => (
	<div role="group" aria-label={label} className={cn("flex gap-1", className)}>
		{options.map((option) => (
			<button
				key={option.value}
				type="button"
				aria-pressed={value === option.value}
				onClick={() => onChange(option.value)}
				className={cn(
					OPTION,
					value === option.value
						? "text-textPrimary bg-white/10"
						: "text-textMuted hover:text-textPrimary",
					optionClassName,
				)}
			>
				{option.icon}
				{option.label}
			</button>
		))}
	</div>
);

type Props = {
	prefix: IconLibraryPrefix;
	name: string;
};

const InstallBlock: React.FC<Props> = ({ prefix, name }) => {
	const { distribution, setDistribution } = useDistribution();
	const { packageManager, setPackageManager } = usePackageManager();

	const command =
		distribution === "shadcn"
			? shadcnAddCommand(packageManager, prefix, name)
			: `${installCommandFor(packageManager)} @animateicons/react`;

	return (
		<div>
			<p className="text-textMuted mb-2 text-sm">Install</p>

			<Toggle
				label="Install with"
				value={distribution}
				options={METHODS}
				onChange={setDistribution}
				className="bg-surfaceElevated mb-3 rounded-full p-1"
				optionClassName="flex-1 px-3 py-1.5 text-sm [&_svg:not([class*='size-'])]:size-3.5"
			/>

			<div className="bg-surfaceElevated overflow-hidden rounded-3xl">
				<div className="flex flex-wrap items-center justify-between gap-2 px-3 pt-3">
					<Toggle
						label="Package manager"
						value={packageManager}
						options={MANAGERS}
						onChange={setPackageManager}
						optionClassName="px-2.5 py-1 text-xs [&_svg:not([class*='size-'])]:size-3.5"
					/>
					<CopyButton text={command} className="w-24 py-1 text-xs" />
				</div>
				<HighlightedCode
					key={command}
					code={command}
					lang="bash"
					wrap={false}
				/>
				<p className="text-textMuted px-4 pb-3.5 text-xs">
					The copy button on each icon card follows this choice.
				</p>
			</div>
		</div>
	);
};

export default InstallBlock;
