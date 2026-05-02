"use client";

/**
 * IconDetailPlayground
 *
 * Inline playground panel for the per-icon detail page. Two columns
 * on desktop: live preview on the left, controls on the right; stacks
 * on mobile. Below the panel: a live snippet block that reflects the
 * user's current size / color / duration choices, with a copy button.
 *
 * Reuses the same useIconConfig hook + PlaygroundControls primitive
 * the playground sheet uses, so the controls behave identically. The
 * preview here is its own implementation rather than the sheet's
 * PlaygroundPreview because the sheet version is sized for a
 * 64px-tall thumbnail; this one fills the page panel.
 */

import {
	useIconConfig,
	type IconConfig,
} from "@/app/icons/_components/playground/useIconConfig";
import PlaygroundControls from "@/app/icons/_components/playground/PlaygroundControls";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { CopyIcon, type CopyIconHandle } from "@/icons/lucide/copy-icon";
import { cn } from "@/lib/utils";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
	Icon: React.ElementType;
	componentName: string;
	library: "lucide" | "huge";
};

const buildSnippet = (componentName: string, config: IconConfig): string =>
	`<${componentName}\n  size={${config.size}}\n  duration={${config.duration}}\n  color="${config.color}"\n/>`;

const IconDetailPlayground: React.FC<Props> = ({
	Icon,
	componentName,
	library,
}) => {
	const { config, update, reset } = useIconConfig();
	const iconRef = useRef<IconHandle | null>(null);
	const copyRef = useRef<CopyIconHandle>(null);
	const [copied, setCopied] = useState(false);

	const IconComponent = Icon as React.ComponentType<{
		size?: number;
		duration?: number;
		color?: string;
		ref?: React.Ref<IconHandle>;
	}>;

	const snippet = useMemo(
		() => buildSnippet(componentName, config),
		[componentName, config],
	);

	// Loop trigger: poll the icon's startAnimation on a duration-aware
	// interval. Same pattern the playground sheet uses.
	useEffect(() => {
		if (config.trigger !== "loop") {
			iconRef.current?.stopAnimation();
			return;
		}
		iconRef.current?.startAnimation();
		const id = window.setInterval(
			() => iconRef.current?.startAnimation(),
			Math.max(800, config.duration * 1000 + 400),
		);
		return () => window.clearInterval(id);
	}, [config.trigger, config.duration]);

	// Auto-play once on mount so visitors landing from search instantly
	// see the icon move without having to hover.
	useEffect(() => {
		const t = window.setTimeout(() => iconRef.current?.startAnimation(), 220);
		return () => window.clearTimeout(t);
	}, []);

	const handlePreviewClick = () => {
		if (config.trigger === "click") iconRef.current?.startAnimation();
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(snippet);
		} catch {
			// Clipboard blocked in iframes / restricted contexts; visual
			// feedback still fires.
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	};

	return (
		<div className="space-y-4">
			<div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
				{/* Preview */}
				<div
					role="img"
					aria-label={`${componentName} preview at ${config.size}px`}
					onClick={handlePreviewClick}
					onMouseEnter={(e) =>
						config.trigger === "hover" && handleHover(e, iconRef)
					}
					onMouseLeave={(e) =>
						config.trigger === "hover" && handleHover(e, iconRef)
					}
					className={cn(
						"relative flex h-72 cursor-pointer items-center justify-center overflow-hidden rounded-2xl",
						"border-border/60 border bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
						"shadow-[0_8px_24px_-12px_rgba(0,0,0,0.6)]",
					)}
					style={{
						backgroundImage:
							"radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
						backgroundSize: "16px 16px",
					}}
				>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
					/>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-0"
						style={{
							backgroundImage:
								"radial-gradient(circle at center, color-mix(in oklab, var(--color-primary) 10%, transparent), transparent 55%)",
						}}
					/>
					<span className="text-textMuted absolute top-3 left-4 font-mono text-[10px] tracking-wider uppercase">
						{library} · {config.size}px
					</span>
					<IconComponent
						ref={iconRef}
						size={config.size}
						duration={config.duration}
						color={config.color}
					/>
				</div>

				{/* Controls */}
				<div
					className={cn(
						"relative overflow-hidden rounded-2xl p-5",
						"border-border/60 border bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
					)}
				>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
					/>
					<PlaygroundControls config={config} update={update} />
				</div>
			</div>

			{/* Live snippet */}
			<div
				className={cn(
					"relative overflow-hidden rounded-2xl",
					"border-border/60 border bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
				)}
			>
				<span
					aria-hidden="true"
					className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
				/>
				<div className="border-border/40 text-textSecondary flex items-center justify-between gap-3 border-b px-4 py-2 text-[11px] tracking-wide uppercase">
					<span>Snippet</span>
					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={reset}
							className="text-textMuted hover:text-textPrimary rounded px-2 py-0.5 normal-case transition-colors"
						>
							Reset
						</button>
						<button
							type="button"
							onClick={handleCopy}
							onMouseEnter={(e) => handleHover(e, copyRef)}
							onMouseLeave={(e) => handleHover(e, copyRef)}
							aria-label={copied ? "Copied" : "Copy snippet"}
							className="text-textSecondary hover:text-textPrimary inline-flex size-7 items-center justify-center rounded-md transition-colors hover:bg-white/[0.04]"
						>
							<AnimatePresence mode="wait" initial={false}>
								{copied ? (
									<motion.span
										key="check"
										initial={{ scale: 0.4, opacity: 0 }}
										animate={{ scale: 1, opacity: 1 }}
										exit={{ scale: 0.4, opacity: 0 }}
										transition={{
											type: "spring",
											stiffness: 600,
											damping: 25,
										}}
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
										<CopyIcon ref={copyRef} size={14} />
									</motion.span>
								)}
							</AnimatePresence>
						</button>
					</div>
				</div>
				<pre className="text-textPrimary overflow-x-auto px-4 py-3 font-mono text-xs leading-relaxed sm:text-sm">
					<code>{snippet}</code>
				</pre>
			</div>
		</div>
	);
};

export default IconDetailPlayground;
