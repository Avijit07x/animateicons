"use client";

/**
 * AnnouncementBanner — site-wide announcement bar.
 *
 * Renders at the top of every page render. Dismissal is in-memory only:
 * if the user closes the banner, it stays closed for that page view, but
 * the next visit (refresh, navigation, new tab, tomorrow) shows it again.
 * No localStorage, no sessionStorage — every fresh mount re-shows the bar.
 *
 * If we want returning visitors to stop seeing it eventually, switch to
 * a server-issued flag (e.g. cookie or feature gate) rather than a
 * client-only persistence layer.
 */

import { ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const AnnouncementBanner: React.FC = () => {
	// Default to true so the banner appears immediately on every fresh mount
	// (page load, route change, tab open). Closing it just sets this to false
	// for the lifetime of the current page — no persistence.
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
					className="border-border/50 bg-primary/5 border-b backdrop-blur"
					role="region"
					aria-label="Site announcement"
				>
					<div className="mx-auto flex max-w-384 items-center justify-between gap-3 px-4 py-2.5 text-xs sm:text-sm lg:px-6">
						<div className="text-textPrimary flex min-w-0 items-center gap-2">
							<span
								aria-hidden="true"
								className="bg-primary hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide text-(--cta-text) uppercase sm:inline-flex"
							>
								New
							</span>
							<span className="truncate">
								<span className="font-medium">@animateicons/react</span>{" "}
								<span className="text-textSecondary">
									is live on npm. All 281 icons in one install.
								</span>
							</span>
						</div>

						<div className="flex shrink-0 items-center gap-1">
							<Link
								href="https://www.npmjs.com/package/@animateicons/react"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary hover:text-primary/80 inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium transition-colors"
							>
								View on npm
								<ArrowRight className="size-3.5" aria-hidden="true" />
							</Link>
							<button
								type="button"
								onClick={dismiss}
								aria-label="Dismiss announcement"
								className="text-textSecondary hover:text-textPrimary hover:bg-surfaceHover rounded-full p-1 transition-colors"
							>
								<X className="size-3.5" aria-hidden="true" />
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default AnnouncementBanner;
