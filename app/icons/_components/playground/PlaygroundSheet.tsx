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
								<Button
									size="xs"
									type="button"
									onClick={handleCopy}
									onMouseEnter={(e) => handleHover(e, copyRef)}
									onMouseLeave={(e) => handleHover(e, copyRef)}
									className="bg-primary hover:bg-primaryHover text-white"
								>
									{copied ? (
										<CheckIcon />
									) : (
										<CopyIcon ref={copyRef} size={14} />
									)}
									{copied ? "Copied" : "Copy"}
								</Button>
							</div>
						</div>
						<pre className="bg-surfaceElevated border-border/60 text-textPrimary overflow-x-auto rounded-lg border p-4 text-xs leading-relaxed">
							<code className="font-mono">{snippet}</code>
						</pre>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default PlaygroundSheet;
