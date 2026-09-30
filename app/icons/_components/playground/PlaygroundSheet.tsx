"use client";

import CopyButton from "@/components/home/CopyButton";
import IconButton from "@/components/IconButton";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { PlayIcon } from "@/icons/huge/play-icon";
import { Refresh01Icon } from "@/icons/huge/refresh-0-1-icon";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { usePlayground } from "../../_contexts/PlaygroundContext";
import HighlightedCode from "./HighlightedCode";
import PlaygroundControls from "./PlaygroundControls";
import { type IconConfig, useIconConfig } from "./useIconConfig";

const INSTALL_CMD = "npm i @animateicons/react";

const buildSnippet = (
	library: "lucide" | "huge",
	componentName: string,
	config: IconConfig,
): string =>
	`import { ${componentName} } from "@animateicons/react/${library}";\n\n<${componentName}\n  size={${config.size}}\n  duration={${config.duration}}\n  color="${config.color}"\n/>`;

const formatLabel = (name: string): string =>
	name
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(" ");

const CodeBlock: React.FC<{
	label: string;
	code: string;
	lang: "tsx" | "bash";
}> = ({ label, code, lang }) => (
	<div>
		<div className="mb-2 flex items-center justify-between gap-3">
			<p className="text-textMuted text-sm">{label}</p>
			<CopyButton text={code} className="w-24 py-1 text-xs" />
		</div>
		<div className="bg-surfaceElevated overflow-hidden rounded-3xl">
			<HighlightedCode code={code} lang={lang} />
		</div>
	</div>
);

const PlaygroundSheet: React.FC = () => {
	const { icon, open, closePlayground } = usePlayground();
	const { config, update, reset, isDefault } = useIconConfig();
	const iconRef = useRef<IconHandle | null>(null);

	const snippet = useMemo(
		() => (icon ? buildSnippet(icon.library, icon.componentName, config) : ""),
		[icon, config],
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

	const IconComponent = icon.Component as React.ComponentType<{
		size?: number;
		duration?: number;
		color?: string;
		ref?: React.Ref<IconHandle>;
	}>;

	return (
		<Sheet
			open={open}
			onOpenChange={(next) => {
				if (!next) closePlayground();
			}}
		>
			<SheetContent className="bg-bgDark border-border/60 w-full overflow-y-auto p-0 sm:max-w-md">
				<SheetHeader className="gap-1.5 px-6 pt-6 pb-2">
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

				<div className="space-y-6 px-6 pt-2 pb-8">
					<div
						role="img"
						aria-label={`${icon.componentName} preview at ${config.size}px`}
						onMouseEnter={(e) => handleHover(e, iconRef)}
						onMouseLeave={(e) => handleHover(e, iconRef)}
						className="bg-surface relative flex h-60 cursor-pointer items-center justify-center overflow-hidden rounded-3xl"
					>
						<div
							aria-hidden="true"
							className="bg-plus-grid pointer-events-none absolute inset-0 [--plus-mask:radial-gradient(circle_at_50%_50%,#000_8%,transparent_70%)]"
						/>
						<Suspense fallback={null}>
							<IconComponent
								ref={iconRef}
								size={config.size}
								duration={config.duration}
								color={config.color}
							/>
						</Suspense>
						<span className="bg-surfaceElevated text-textMuted absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs">
							Hover to play
						</span>
					</div>

					<div className="flex items-center justify-center gap-2">
						<IconButton
							icon={PlayIcon}
							onClick={() => iconRef.current?.startAnimation()}
							variant="secondary"
							size="pill"
						>
							Replay
						</IconButton>
						<IconButton
							icon={Refresh01Icon}
							onClick={reset}
							disabled={isDefault}
							variant="secondary"
							size="pill"
						>
							Reset
						</IconButton>
					</div>

					<PlaygroundControls config={config} update={update} />

					<CodeBlock label="Install" code={INSTALL_CMD} lang="bash" />
					<CodeBlock label="Import & usage" code={snippet} lang="tsx" />
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default PlaygroundSheet;
