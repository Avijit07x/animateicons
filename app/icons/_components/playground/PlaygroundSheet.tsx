"use client";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { IconHandle } from "@/types/icon";
import { useEffect, useMemo, useRef } from "react";
import { useDistribution } from "../../_contexts/DistributionContext";
import { usePlayground } from "../../_contexts/PlaygroundContext";
import CodeBlock from "./CodeBlock";
import InstallBlock from "./InstallBlock";
import PlaygroundControls from "./PlaygroundControls";
import PlaygroundPreview from "./PlaygroundPreview";
import PreviewActions from "./PreviewActions";
import { buildUsageSnippet } from "./snippet";
import { useIconConfig } from "./useIconConfig";

const formatLabel = (name: string): string =>
	name
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(" ");

const PlaygroundSheet: React.FC = () => {
	const { icon, open, closePlayground } = usePlayground();
	const { config, update, reset, isDefault } = useIconConfig();
	const { distribution } = useDistribution();
	const iconRef = useRef<IconHandle | null>(null);
	const headerRef = useRef<HTMLDivElement>(null);

	const snippet = useMemo(
		() =>
			icon
				? buildUsageSnippet(
						distribution,
						icon.library,
						icon.name,
						icon.componentName,
						config,
					)
				: "",
		[icon, config, distribution],
	);

	useEffect(() => {
		if (open) reset();
	}, [open, icon?.name, reset]);

	useEffect(() => {
		if (!open || !icon) return;
		const t = window.setTimeout(() => iconRef.current?.startAnimation(), 220);
		return () => window.clearTimeout(t);
	}, [open, icon]);

	if (!icon) return null;

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (!next) closePlayground();
			}}
		>
			<SheetContent className="bg-bgDark border-border/60 w-full overflow-hidden p-0 sm:max-w-md">
				<SheetHeader
					ref={headerRef}
					className="data-[scrolled=true]:border-border/60 shrink-0 gap-1.5 border-b border-transparent px-6 pt-6 pb-4 transition-colors"
				>
					<div className="flex items-center gap-2.5">
						<SheetTitle className="text-textPrimary text-xl font-semibold">
							{formatLabel(icon.name)}
						</SheetTitle>
						<span className="bg-surfaceElevated text-textSecondary rounded-full px-2.5 py-0.5 text-xs font-medium capitalize">
							{icon.library}
						</span>
					</div>
					<SheetDescription className="text-textSecondary text-sm">
						Tweak the icon, then copy a usage snippet.
					</SheetDescription>
				</SheetHeader>

				<div
					onScroll={(e) => {
						headerRef.current?.setAttribute(
							"data-scrolled",
							String(e.currentTarget.scrollTop > 0),
						);
					}}
					className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 pt-4 pb-8"
				>
					<PlaygroundPreview
						Icon={icon.Component}
						componentName={icon.componentName}
						config={config}
						iconRef={iconRef}
					/>

					<PreviewActions
						iconRef={iconRef}
						onReset={reset}
						resetDisabled={isDefault}
					/>

					<PlaygroundControls config={config} update={update} />

					<InstallBlock prefix={icon.prefix} name={icon.name} />
					<CodeBlock label="Import & usage" code={snippet} lang="tsx" />
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default PlaygroundSheet;
