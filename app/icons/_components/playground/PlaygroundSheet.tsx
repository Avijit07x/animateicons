"use client";

/**
 * PlaygroundSheet
 *
 * Slide-in side sheet that opens when a user clicks an icon tile in
 * the gallery. Shows:
 *   - live preview (hover-driven)
 *   - size / duration / color controls
 *   - install command (npm, copyable)
 *   - import + JSX usage snippet (copyable)
 *
 * Reuses `useIconConfig` + `PlaygroundControls` so the playground
 * primitives stay shared across surfaces. Hover is the only trigger
 * mode - click and loop modes were removed because they weren't
 * earning their place in the UI. Styled as a specimen sheet, like the
 * home page: a crop-marked preview plate and hairline panels.
 */

import SpecimenFrame from "@/components/home/SpecimenFrame";
import { CheckIcon } from "@/components/icons/CheckIcon";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { CopyIcon, type CopyIconHandle } from "@/icons/lucide/copy-icon";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { AnimatePresence, motion } from "motion/react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { usePlayground } from "../../_contexts/PlaygroundContext";
import HighlightedCode from "./HighlightedCode";
import PlaygroundControls from "./PlaygroundControls";
import { type IconConfig, useIconConfig } from "./useIconConfig";

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

const INSTALL_CMD = "npm i @animateicons/react";

/** Small reusable copy button - animated CopyIcon → CheckIcon swap. */
const CopyAction: React.FC<{ value: string; label: string }> = ({
	value,
	label,
}) => {
	const ref = useRef<CopyIconHandle>(null);
	const [copied, setCopied] = useState(false);

	const onClick = async () => {
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			// Silently fail - clipboard can be blocked in iframes.
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	};

	return (
		<button
			type="button"
			onClick={onClick}
			onMouseEnter={(e) => handleHover(e, ref)}
			onMouseLeave={(e) => handleHover(e, ref)}
			aria-label={copied ? "Copied" : label}
			className="text-textMuted hover:text-primary inline-flex size-7 items-center justify-center transition-colors"
		>
			<AnimatePresence mode="wait" initial={false}>
				{copied ? (
					<motion.span
						key="check"
						initial={{ scale: 0.4, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.4, opacity: 0 }}
						transition={{ type: "spring", stiffness: 600, damping: 25 }}
						className="text-primary inline-flex"
					>
						<CheckIcon className="size-3.5" />
					</motion.span>
				) : (
					<motion.span
						key="copy"
						initial={{ scale: 0.6, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.6, opacity: 0 }}
						transition={{ duration: 0.15 }}
						className="inline-flex"
					>
						<CopyIcon ref={ref} size={14} />
					</motion.span>
				)}
			</AnimatePresence>
		</button>
	);
};

/** Hairline panel with a mono label strip - the sheet's one card style. */
const Panel: React.FC<{
	label: string;
	action?: React.ReactNode;
	children: React.ReactNode;
}> = ({ label, action, children }) => (
	<div className="border-border/60 border">
		<div className="border-border/60 text-textMuted flex min-h-11 items-center justify-between gap-3 border-b px-4 py-2 font-mono text-[10px] tracking-widest uppercase">
			<span>{label}</span>
			{action}
		</div>
		{children}
	</div>
);

const PlaygroundSheet: React.FC = () => {
	const { icon, open, closePlayground } = usePlayground();
	const { config, update, reset } = useIconConfig();
	const iconRef = useRef<IconHandle | null>(null);

	const snippet = useMemo(
		() => (icon ? buildSnippet(icon.library, icon.componentName, config) : ""),
		[icon, config],
	);

	// Reset config every time a new icon opens so previous tweaks
	// don't leak across icons.
	useEffect(() => {
		if (open) reset();
	}, [open, icon?.name, reset]);

	// Auto-play once on open so the visitor sees motion immediately.
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
				<SheetHeader className="border-border/60 border-b px-6 py-5">
					<p className="text-textMuted font-mono text-[10px] tracking-[0.25em] uppercase">
						<span className="text-primary">{icon.library}</span> / Animated icon
					</p>
					<SheetTitle className="text-textPrimary text-xl font-semibold">
						{formatLabel(icon.name)}
					</SheetTitle>
					<SheetDescription className="text-textSecondary text-sm">
						Tweak the icon, then copy a usage snippet.
					</SheetDescription>
				</SheetHeader>

				<div className="space-y-5 px-6 py-6">
					<SpecimenFrame
						label={icon.library}
						index={`${config.size}px`}
						footLeft={icon.name}
						footRight="hover to play"
					>
						<div
							role="img"
							aria-label={`${icon.componentName} preview at ${config.size}px`}
							onMouseEnter={(e) => handleHover(e, iconRef)}
							onMouseLeave={(e) => handleHover(e, iconRef)}
							className="flex h-56 cursor-pointer items-center justify-center"
						>
							<Suspense fallback={null}>
								<IconComponent
									ref={iconRef}
									size={config.size}
									duration={config.duration}
									color={config.color}
								/>
							</Suspense>
						</div>
					</SpecimenFrame>

					<Panel label="Controls">
						<div className="p-4">
							<PlaygroundControls config={config} update={update} />
						</div>
					</Panel>

					<Panel
						label="Install"
						action={
							<CopyAction value={INSTALL_CMD} label="Copy install command" />
						}
					>
						<HighlightedCode code={INSTALL_CMD} lang="bash" />
					</Panel>

					<Panel
						label="Import & usage"
						action={<CopyAction value={snippet} label="Copy snippet" />}
					>
						<HighlightedCode code={snippet} lang="tsx" />
					</Panel>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default PlaygroundSheet;
