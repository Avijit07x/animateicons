"use client";

import { FrameworkLogo } from "@/components/icons/FrameworkLogos";
import { ShadcnLogo } from "@/components/icons/PackageLogos";
import { PackageDeliveredIcon } from "@/icons/huge/package-delivered-icon";
import { cn } from "@/lib/utils";
import {
	type Distribution,
	FRAMEWORK_LABELS,
	FRAMEWORKS,
	type Framework,
	frameworkOf,
	packageFor,
	useDistribution,
	withFramework,
} from "../../_contexts/DistributionContext";
import {
	installCommandFor,
	type PackageManager,
	shadcnAddCommand,
	usePackageManager,
} from "../../_contexts/PackageManagerContext";
import CopyIconButton from "./CopyIconButton";
import HighlightedCode from "./HighlightedCode";

type Option<T extends string> = {
	value: T;
	label: string;
	icon?: React.ReactNode;
};

const FRAMEWORK_OPTIONS: Option<Framework>[] = FRAMEWORKS.map((value) => ({
	value,
	label: FRAMEWORK_LABELS[value],
	icon: <FrameworkLogo framework={value} />,
}));

const METHODS: Option<Distribution>[] = [
	{
		value: "npm",
		label: "npm package",
		icon: <PackageDeliveredIcon size={14} isAnimated={false} />,
	},
	{ value: "shadcn", label: "shadcn", icon: <ShadcnLogo /> },
];

const MANAGERS: Option<PackageManager>[] = (
	["npm", "pnpm", "bun"] as const
).map((value) => ({ value, label: value }));

type SegmentedProps<T extends string> = {
	label: string;
	value: T;
	options: Option<T>[];
	onChange: (value: T) => void;
	compact?: boolean;
};

const Segmented = <T extends string>({
	label,
	value,
	options,
	onChange,
	compact = false,
}: SegmentedProps<T>) => (
	<div role="group" aria-label={label} className="flex items-center">
		{options.map((option) => {
			const active = value === option.value;
			return (
				<button
					key={option.value}
					type="button"
					aria-pressed={active}
					aria-label={compact ? option.label : undefined}
					title={compact && !active ? option.label : undefined}
					onClick={() => onChange(option.value)}
					className={cn(
						"inline-flex h-7 cursor-pointer items-center justify-center rounded-full text-xs font-medium whitespace-nowrap transition-colors [&_svg]:size-3.5 [&_svg]:shrink-0",
						compact ? "px-1.75" : "gap-1.5 px-2.5",
						active
							? "bg-surfaceElevated text-textPrimary"
							: "text-textMuted hover:text-textSecondary",
					)}
				>
					{option.icon}
					{compact ? (
						<span
							aria-hidden="true"
							className={cn(
								"grid transition-[grid-template-columns,opacity] duration-300 ease-out motion-reduce:transition-none",
								active
									? "grid-cols-[1fr] opacity-100"
									: "grid-cols-[0fr] opacity-0",
							)}
						>
							<span className="overflow-hidden">
								<span className="pr-1 pl-1.5">{option.label}</span>
							</span>
						</span>
					) : (
						option.label
					)}
				</button>
			);
		})}
	</div>
);

type Props = {
	prefix: IconLibraryPrefix;
	name: string;
};

const InstallBlock: React.FC<Props> = ({ prefix, name }) => {
	const { distribution, setDistribution } = useDistribution();
	const { packageManager, setPackageManager } = usePackageManager();
	const framework = frameworkOf(distribution);

	const command =
		distribution === "shadcn"
			? shadcnAddCommand(packageManager, prefix, name)
			: `${installCommandFor(packageManager)} ${packageFor(distribution)}`;

	return (
		<div>
			<div className="mb-2 flex items-center justify-between gap-2">
				<p className="text-textMuted text-sm">Install</p>
				<Segmented
					label="Framework"
					value={framework}
					options={FRAMEWORK_OPTIONS}
					onChange={(next) =>
						setDistribution(withFramework(distribution, next))
					}
					compact
				/>
			</div>

			<div className="bg-surface rounded-[22px] p-2">
				<div className="flex items-center justify-between gap-2 pb-2">
					<Segmented
						label="Package manager"
						value={packageManager}
						options={MANAGERS}
						onChange={setPackageManager}
					/>
					{framework === "react" && (
						<Segmented
							label="Install with"
							value={distribution}
							options={METHODS}
							onChange={setDistribution}
						/>
					)}
				</div>

				<div className="bg-bgDark flex items-center rounded-[14px] pr-1.5 pl-4">
					<span
						aria-hidden="true"
						className="text-textMuted font-mono text-xs select-none"
					>
						$
					</span>
					<HighlightedCode
						key={command}
						code={command}
						lang="bash"
						wrap={false}
						className="my-3 mr-2 ml-2 min-w-0 flex-1"
					/>
					<CopyIconButton text={command} label="Copy install command" />
				</div>
			</div>
		</div>
	);
};

export default InstallBlock;
