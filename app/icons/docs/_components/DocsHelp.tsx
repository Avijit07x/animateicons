import { CircleDot, Twitter } from "lucide-react";
import Link from "next/link";
import { NEW_ISSUE_URL, TWITTER_URL } from "../_lib/links";

/**
 * Footer help band below the pager: gives short pages a clear ending and a
 * path to support instead of trailing off into empty space.
 */
const DocsHelp = () => (
	<div className="border-border/60 bg-surface/40 mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border p-5 sm:flex-row sm:items-center">
		<div>
			<p className="text-textPrimary text-sm font-semibold">Need a hand?</p>
			<p className="text-textMuted mt-1 text-sm">
				Open an issue on GitHub or reach out on Twitter, we&apos;re happy to
				help.
			</p>
		</div>
		<div className="flex shrink-0 gap-2">
			<Link
				href={NEW_ISSUE_URL}
				target="_blank"
				className="border-border/60 bg-bgDark text-textPrimary hover:border-primary/50 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
			>
				<CircleDot className="size-3.5" /> Open an issue
			</Link>
			<Link
				href={TWITTER_URL}
				target="_blank"
				className="border-border/60 bg-bgDark text-textPrimary hover:border-primary/50 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors"
			>
				<Twitter className="size-3.5" /> Twitter
			</Link>
		</div>
	</div>
);

export default DocsHelp;
