"use client";

import { FrameworkLogo } from "@/components/icons/FrameworkLogos";
import { ChevronDownIcon } from "@/icons/huge/chevron-down-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "motion/react";
import { Popover, Portal } from "radix-ui";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
	FRAMEWORK_LABELS,
	FRAMEWORKS,
	frameworkOf,
	packageFor,
	useDistribution,
	withFramework,
} from "../../_contexts/DistributionContext";
import {
	installCommandFor,
	type PackageManager,
	usePackageManager,
} from "../../_contexts/PackageManagerContext";
import CopyIconButton from "../playground/CopyIconButton";

const MANAGERS: PackageManager[] = ["npm", "pnpm", "bun"];
const TOKEN_COLORS = ["text-primary", "text-textMuted", "text-textPrimary"];
const TYPE_MS = 22;

const useTypewriter = (text: string) => {
	const reduced = useReducedMotion();
	const [progress, setProgress] = useState({ text: "", count: 0 });

	useEffect(() => {
		if (reduced) return;
		let count = 0;
		const id = window.setInterval(() => {
			count += 1;
			setProgress({ text, count });
			if (count >= text.length) window.clearInterval(id);
		}, TYPE_MS);
		return () => window.clearInterval(id);
	}, [text, reduced]);

	if (reduced) return text.length;
	return progress.text === text ? progress.count : 0;
};

const TypedCommand: React.FC<{ command: string }> = ({ command }) => {
	const typed = useTypewriter(command);
	const done = typed >= command.length;
	const parts = command.split(/(?= )/);

	return (
		<>
			<p className="mt-2.5 font-mono text-[13px] leading-5.5 whitespace-nowrap">
				<span className="sr-only">{command}</span>
				<span aria-hidden="true">
					<span className="text-textMuted mr-2.5 select-none">$</span>
					{parts.map((part, i) => {
						const start = parts.slice(0, i).join("").length;
						return (
							<span key={i} className={TOKEN_COLORS[i]}>
								{part.slice(0, Math.max(0, typed - start))}
							</span>
						);
					})}
					<span className="bg-primary ml-0.5 inline-block h-3.75 w-1.75 translate-y-0.75 animate-pulse" />
				</span>
			</p>
			<p
				className={cn(
					"text-success/85 mt-0.5 font-mono text-xs leading-5 transition-[opacity,translate] duration-300",
					done ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
				)}
			>
				✓ {ICON_COUNTS.total} animated icons ready
			</p>
		</>
	);
};

const FrameworkTabs: React.FC = () => {
	const { distribution, setDistribution } = useDistribution();
	const framework = frameworkOf(distribution);
	const groupRef = useRef<HTMLDivElement>(null);
	const lineRef = useRef<HTMLSpanElement>(null);

	useLayoutEffect(() => {
		const tab = groupRef.current?.querySelector<HTMLElement>(
			'[aria-pressed="true"]',
		);
		const line = lineRef.current;
		if (!tab || !line) return;
		line.style.width = `${tab.offsetWidth - 20}px`;
		line.style.transform = `translateX(${tab.offsetLeft + 10}px)`;
	}, [framework]);

	return (
		<div
			ref={groupRef}
			role="group"
			aria-label="Framework"
			className="relative flex gap-0.5 border-b border-white/7 px-3"
		>
			{FRAMEWORKS.map((value) => {
				const active = value === framework;
				return (
					<button
						key={value}
						type="button"
						aria-pressed={active}
						onClick={() => setDistribution(withFramework(distribution, value))}
						className={cn(
							"inline-flex h-11 cursor-pointer items-center gap-1.75 px-2.5 text-[13px] font-medium transition-colors [&_svg]:size-3.5",
							active
								? "text-textPrimary"
								: "text-textMuted hover:text-textSecondary",
						)}
					>
						<FrameworkLogo framework={value} />
						{FRAMEWORK_LABELS[value]}
					</button>
				);
			})}
			<span
				ref={lineRef}
				aria-hidden="true"
				className="bg-primary absolute -bottom-px left-0 h-0.5 w-0 rounded-full transition-[transform,width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
			/>
		</div>
	);
};

const InstallCommand: React.FC = () => {
	const { distribution } = useDistribution();
	const { packageManager, setPackageManager } = usePackageManager();
	const [open, setOpen] = useState(false);
	const pkg = packageFor(distribution);
	const command = `${installCommandFor(packageManager)} ${pkg}`;

	return (
		<Popover.Root modal open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				<button
					type="button"
					aria-label={`Install ${pkg}`}
					className="group bg-surfaceElevated hover:bg-surfaceActive data-[state=open]:bg-surfaceActive focus-visible:ring-primary/60 inline-flex h-9.5 cursor-pointer items-center gap-2.5 rounded-full pr-3 pl-1.25 whitespace-nowrap inset-ring inset-ring-white/4 transition-colors outline-none focus-visible:ring-2"
				>
					<span
						key={distribution}
						className="animate-in fade-in zoom-in-75 grid size-7 place-items-center rounded-full bg-white/8 inset-ring inset-ring-white/6 duration-300 [&_svg]:size-3.5"
					>
						<FrameworkLogo framework={frameworkOf(distribution)} />
					</span>
					<span className="text-textPrimary text-[13.5px] font-medium">
						Install
					</span>
					<span
						key={pkg}
						className="animate-in fade-in slide-in-from-bottom-1 text-textMuted font-mono text-[12.5px] duration-300"
					>
						{pkg}
					</span>
					<ChevronDownIcon
						size={12}
						isAnimated={false}
						className="text-textMuted transition-transform duration-300 group-data-[state=open]:rotate-180"
					/>
				</button>
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					align="start"
					sideOffset={10}
					aria-label="Install"
					className="bg-surfaceHover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-top-2 z-50 w-100 origin-(--radix-popover-content-transform-origin) overflow-hidden rounded-[22px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.95)] inset-ring inset-ring-white/6 outline-none"
				>
					<FrameworkTabs />

					<div className="bg-bgDark m-2 rounded-[14px] pt-2 pr-2 pb-3.5 pl-3.5">
						<div className="flex items-center justify-between">
							<div
								role="group"
								aria-label="Package manager"
								className="-ml-1.5 flex gap-0.5"
							>
								{MANAGERS.map((pm) => (
									<button
										key={pm}
										type="button"
										aria-pressed={pm === packageManager}
										onClick={() => setPackageManager(pm)}
										className={cn(
											"h-6.5 cursor-pointer rounded-full px-2.5 font-mono text-xs transition-colors",
											pm === packageManager
												? "text-textPrimary bg-white/7"
												: "text-textMuted hover:text-textSecondary",
										)}
									>
										{pm}
									</button>
								))}
							</div>
							<CopyIconButton text={command} label="Copy install command" />
						</div>

						<TypedCommand command={command} />
					</div>
				</Popover.Content>
			</Popover.Portal>

			<Portal.Root>
				<div
					aria-hidden="true"
					className={cn(
						"pointer-events-none fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
						open ? "opacity-100" : "opacity-0",
					)}
				/>
			</Portal.Root>
		</Popover.Root>
	);
};

export default InstallCommand;
