"use client";

/**
 * PlaygroundSheet
 *
 * Container that opens when the user clicks any AnimateIcons tile —
 * lets them tweak that icon's size / duration / color / trigger mode
 * and copy a ready-to-paste JSX snippet.
 *
 * SRP: orchestration only — wires the IconConfig state, controls,
 * preview, and copy-snippet affordance into a shadcn Sheet. Each
 * concern lives in its own file. Styled with the AnimateIcons site's
 * semantic tokens (bg-bgDark, surface, text*) so the sheet matches the
 * gallery instead of looking like a default shadcn dialog.
 */

import { useMemo, useRef, useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { Button } from "@/components/ui/button";
import { CopyIcon, type CopyIconHandle } from "@/icons/lucide/copy-icon";
import handleHover from "@/utils/handleHover";
import PlaygroundControls from "./PlaygroundControls";
import PlaygroundPreview from "./PlaygroundPreview";
import { useIconConfig } from "./useIconConfig";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	icon: {
		name: string;
		Component: React.ElementType;
		componentName: string;
	} | null;
};

const buildSnippet = (
	componentName: string,
	opts: { size: number; duration: number; color: string },
): string =>
	`<${componentName}\n  size={${opts.size}}\n  duration={${opts.duration}}\n  color="${opts.color}"\n/>`;

const formatLabel = (name: string): string =>
	name
		.split("-")
		.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
		.join(" ");

const PlaygroundSheet: React.FC<Props> = ({ open, onOpenChange, icon }) => {
	const { config, update, reset } = useIconConfig();
	const [copied, setCopied] = useState(false);
	const copyRef = useRef<CopyIconHandle>(null);

	const snippet = useMemo(
		() =>
			icon
				? buildSnippet(icon.componentName, {
						size: config.size,
						duration: config.duration,
						color: config.color,
					})
				: "",
		[icon, config.size, config.duration, config.color],
	);

	const handleCopy = async () => {
		if (!snippet) return;
		await navigator.clipboard.writeText(snippet);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1500);
	};

	if (!icon) return null;

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="bg-bgDark border-border/50 text-textPrimary w-full overflow-y-auto p-0 sm:max-w-md">
				<SheetHeader className="border-border/40 border-b px-6 py-5">
					<SheetTitle className="text-textPrimary text-xl font-semibold">
						{formatLabel(icon.name)}
					</SheetTitle>
					<SheetDescription className="text-textSecondary text-sm">
						Tweak the icon, then copy a usage snippet.
					</SheetDescription>
				</SheetHeader>

				<div className="space-y-6 px-6 py-5">
					<PlaygroundPreview Icon={icon.Component} config={config} />

					<PlaygroundControls config={config} update={update} />

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-textSecondary text-xs font-medium tracking-wide uppercase">
								Snippet
							</span>
							<div className="flex items-center gap-2">
								<Button
									variant="ghost"
									size="xs"
									type="button"
									onClick={reset}
									className="hover:bg-surface dark:hover:bg-surface text-textMuted hover:text-textPrimary"
								>
									Reset
								</Button>
								<button
									type="button"
									onClick={handleCopy}
									onMouseEnter={(e) => handleHover(e, copyRef)}
									onMouseLeave={(e) => handleHover(e, copyRef)}
									className="group from-primary to-primary/85 ring-primary-foreground/15 relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-b px-3 py-1.5 text-xs font-semibold text-(--cta-text) shadow-[0_1px_0_rgba(255,255,255,0.18)_inset,0_8px_22px_-8px_color-mix(in_oklab,var(--color-primary)_55%,transparent)] ring-1 transition-all duration-200 ring-inset hover:shadow-[0_1px_0_rgba(255,255,255,0.22)_inset,0_12px_30px_-8px_color-mix(in_oklab,var(--color-primary)_70%,transparent)] hover:brightness-110 active:scale-[0.98]"
								>
									<span
										aria-hidden="true"
										className="pointer-events-none absolute inset-x-3 top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
									/>
									{copied ? (
										<CheckIcon />
									) : (
										<CopyIcon ref={copyRef} size={14} />
									)}
									{copied ? "Copied" : "Copy"}
								</button>
							</div>
						</div>
						<div className="border-border/60 relative overflow-hidden rounded-2xl border bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
							<span
								aria-hidden="true"
								className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
							/>
							<div className="border-border/40 text-textSecondary flex items-center justify-between border-b px-4 py-2 text-[11px] tracking-wide uppercase">
								<span>Usage</span>
								<span className="text-textMuted lowercase">tsx</span>
							</div>
							<pre className="text-textPrimary overflow-x-auto px-4 py-3 text-xs leading-relaxed">
								<code className="font-mono">{snippet}</code>
							</pre>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default PlaygroundSheet;
