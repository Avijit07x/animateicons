"use client";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
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
	const { ref: iconRef, triggerProps } = useIconHover();
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
	}, [open, icon, iconRef]);

	if (!icon) return null;

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (!next) closePlayground();
			}}
		>
			<SheetContent
				side="bottom"
				className="bg-bgDark border-border/60 inset-x-3 bottom-3 mx-auto max-h-[85dvh] max-w-4xl gap-0 overflow-hidden rounded-3xl border p-0 md:h-[32rem]"
			>
				<SheetHeader
					ref={headerRef}
					className="data-[scrolled=true]:border-border/60 shrink-0 gap-1 border-b border-transparent px-6 pt-5 pb-3 transition-colors"
				>
					<div className="flex items-center gap-2.5">
						<SheetTitle className="text-textPrimary text-lg font-semibold">
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
					className="grid min-h-0 flex-1 scrollbar-none grid-cols-1 gap-5 overflow-y-auto px-6 pt-3 pb-6 md:grid-cols-2 md:grid-rows-1 [&::-webkit-scrollbar]:hidden"
				>
					<div className="flex flex-col gap-5 md:min-h-0">
						<div className="relative flex flex-1 flex-col">
							<PlaygroundPreview
								Icon={icon.Component}
								componentName={icon.componentName}
								config={config}
								iconRef={iconRef}
								triggerProps={triggerProps}
								hint={false}
								className="h-auto min-h-44 flex-1"
							/>
							<div className="absolute inset-x-0 bottom-3">
								<PreviewActions
									iconRef={iconRef}
									onReset={reset}
									resetDisabled={isDefault}
								/>
							</div>
						</div>

						<PlaygroundControls config={config} update={update} />
					</div>

					<div className="flex flex-col gap-5 md:min-h-0">
						<InstallBlock prefix={icon.prefix} name={icon.name} />
						<CodeBlock
							label="Import & usage"
							code={snippet}
							lang="tsx"
							className="min-h-0 flex-1"
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default PlaygroundSheet;
