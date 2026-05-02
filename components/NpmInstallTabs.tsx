"use client";

/**
 * NpmInstallTabs
 *
 * Client island that swaps between npm / pnpm / bun install commands
 * inside the NpmSection install card. NpmSection is a server component
 * (it awaits shiki on the server), so we pre-render shiki HTML for all
 * three package managers on the server and pass them in as a map.
 *
 * Visual: same premium glass pill toggle vocabulary used by Hero
 * CmdSection and the gallery navbar — gradient outer pill, motion
 * layoutId active state with ring-primary/30, text-primary active label.
 */

import { CheckIcon } from "@/components/icons/CheckIcon";
import { CopyIcon, type CopyIconHandle } from "@/icons/lucide/copy-icon";
import { cn } from "@/lib/utils";
import handleHover from "@/utils/handleHover";
import { motion } from "motion/react";
import { useRef, useState } from "react";

type PackageManager = "npm" | "pnpm" | "bun";

const OPTIONS: PackageManager[] = ["npm", "pnpm", "bun"];

type Props = {
	/** Pre-rendered shiki HTML keyed by package manager. */
	highlightedByPm: Record<PackageManager, string>;
	/** Raw command strings keyed by package manager — used for clipboard copy. */
	commandsByPm: Record<PackageManager, string>;
};

const SHIKI_RESET = "[&_pre]:m-0! [&_pre]:bg-transparent! [&_pre]:p-0!";

const NpmInstallTabs: React.FC<Props> = ({ highlightedByPm, commandsByPm }) => {
	const [pm, setPm] = useState<PackageManager>("pnpm");
	const [copied, setCopied] = useState(false);
	const copyRef = useRef<CopyIconHandle>(null);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(commandsByPm[pm]);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {
			// Clipboard can be blocked in some browsers / iframes — silent fail
			// is fine here; the visual snippet is still selectable as a fallback.
		}
	};

	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-2xl",
				"border-border/60 border",
				"bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
			)}
		>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-4 top-px h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
			/>

			<div className="border-border/40 text-textSecondary flex items-center justify-between gap-2 border-b px-3 py-2 text-[10px] tracking-wide uppercase sm:px-4 sm:text-[11px]">
				<span>Install</span>

				<div
					role="tablist"
					aria-label="Package manager"
					className={cn(
						"inline-flex rounded-full p-0.5 text-[11px] normal-case",
						"border-border/80 from-surface to-surfaceElevated border bg-gradient-to-b",
						"shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_6px_18px_-12px_rgba(0,0,0,0.6)]",
						"backdrop-blur",
					)}
				>
					{OPTIONS.map((opt) => {
						const active = pm === opt;
						return (
							<button
								key={opt}
								role="tab"
								type="button"
								aria-selected={active}
								onClick={() => setPm(opt)}
								className={cn(
									"relative inline-flex items-center rounded-full px-2.5 py-0.5 font-medium transition-colors",
									active
										? "text-primary"
										: "text-textSecondary hover:text-textPrimary",
								)}
							>
								{active && (
									<motion.span
										layoutId="npm-install-pm-pill"
										className="ring-primary/30 absolute inset-0 -z-10 rounded-full bg-gradient-to-b from-white/[0.06] to-transparent ring-1 ring-inset"
										transition={{
											type: "spring",
											stiffness: 380,
											damping: 32,
										}}
									/>
								)}
								{opt}
							</button>
						);
					})}
				</div>
			</div>

			<div className="relative">
				<div
					className={`overflow-x-auto px-3 py-3 pr-10 text-xs sm:px-4 sm:pr-12 sm:text-sm ${SHIKI_RESET}`}
					dangerouslySetInnerHTML={{ __html: highlightedByPm[pm] }}
				/>
				<button
					type="button"
					onClick={handleCopy}
					onMouseEnter={(e) => handleHover(e, copyRef)}
					onMouseLeave={(e) => handleHover(e, copyRef)}
					aria-label={copied ? "Copied" : `Copy ${pm} install command`}
					className={cn(
						"absolute top-1.5 right-1.5 inline-flex size-7 items-center justify-center rounded-md transition-colors",
						"text-textSecondary hover:text-textPrimary hover:bg-white/[0.04]",
						"ring-border/0 hover:ring-border/60 ring-1 ring-inset",
					)}
				>
					{copied ? (
						<CheckIcon className="size-3.5" />
					) : (
						<CopyIcon ref={copyRef} size={14} />
					)}
				</button>
			</div>
		</div>
	);
};

export default NpmInstallTabs;
