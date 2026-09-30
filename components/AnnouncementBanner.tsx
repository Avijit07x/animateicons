"use client";

/**
 * AnnouncementBanner - site-wide announcement bar.
 *
 * Renders at the top of every page render. Dismissal is in-memory only:
 * if the user closes the banner, it stays closed for that page view, but
 * the next visit (refresh, navigation, new tab, tomorrow) shows it again.
 * No localStorage, no sessionStorage - every fresh mount re-shows the bar.
 *
 * If we want returning visitors to stop seeing it eventually, switch to
 * a server-issued flag (e.g. cookie or feature gate) rather than a
 * client-only persistence layer.
 */

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { Cancel01Icon } from "@/icons/huge/cancel-0-1-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import IconLink from "./IconLink";
import { useState } from "react";

const AnnouncementBanner: React.FC = () => {
	// Default to true so the banner appears immediately on every fresh mount
	// (page load, route change, tab open). Closing it just sets this to false
	// for the lifetime of the current page - no persistence.
	const [visible, setVisible] = useState(true);

	const dismiss = () => setVisible(false);

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
					className="overflow-hidden"
					role="region"
					aria-label="Site announcement"
				>
					<div className="border-border/60 mx-auto flex max-w-384 items-center justify-between gap-3 border-b px-4 py-2 text-xs sm:text-[13px] lg:px-6">
						<div className="flex min-w-0 items-center gap-3">
							<span
								aria-hidden="true"
								className="bg-primary shrink-0 rounded-full px-2.5 py-1 text-[10px] leading-none font-bold tracking-wide text-white uppercase"
							>
								New
							</span>
							<span className="text-textSecondary min-w-0 truncate">
								<span className="text-textPrimary font-medium">
									@animateicons/react
								</span>{" "}
								<span className="max-sm:hidden">
									is live on npm. All {ICON_COUNTS.total} icons in one install.
								</span>
								<span className="sm:hidden">is live on npm.</span>
							</span>
						</div>

						<div className="flex shrink-0 items-center gap-1">
							<IconLink
								href="https://www.npmjs.com/package/@animateicons/react"
								target="_blank"
								rel="noopener noreferrer"
								icon={ArrowRight02Icon}
								iconSize={13}
								className="bg-primary/12 text-primary hover:bg-primary/20 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-medium transition-colors"
							>
								View on npm
							</IconLink>
							<button
								type="button"
								onClick={dismiss}
								aria-label="Dismiss announcement"
								className="text-textSecondary hover:text-textPrimary grid size-7 place-items-center rounded-full transition-colors hover:bg-white/10"
							>
								<Cancel01Icon size={14} />
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default AnnouncementBanner;
