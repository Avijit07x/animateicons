"use client";

/**
 * Reusable copy-to-clipboard button used in the per-icon detail page's
 * install and usage code blocks. Same animation choreography as the
 * homepage NpmInstallTabs button: animated CopyIcon on idle, static
 * CheckIcon for ~1.4s after a successful copy, then revert.
 */

import { CheckIcon } from "@/components/icons/CheckIcon";
import { CopyIcon, type CopyIconHandle } from "@/icons/lucide/copy-icon";
import { cn } from "@/lib/utils";
import handleHover from "@/utils/handleHover";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

type Props = {
	value: string;
	label?: string;
	className?: string;
};

const CopyButton: React.FC<Props> = ({ value, label, className }) => {
	const [copied, setCopied] = useState(false);
	const ref = useRef<CopyIconHandle>(null);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value);
		} catch {
			// Clipboard can be blocked in iframes; the visual feedback still
			// fires so the demo behaves correctly.
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	};

	return (
		<button
			type="button"
			onClick={handleCopy}
			onMouseEnter={(e) => handleHover(e, ref)}
			onMouseLeave={(e) => handleHover(e, ref)}
			aria-label={copied ? "Copied" : (label ?? "Copy")}
			className={cn(
				"text-textSecondary hover:text-textPrimary inline-flex size-7 items-center justify-center rounded-md transition-colors hover:bg-white/[0.04]",
				className,
			)}
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

export default CopyButton;
