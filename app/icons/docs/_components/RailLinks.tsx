"use client";

/**
 * Below the "On This Page" TOC: a Contribute block (edit this page / report an
 * issue) and a Community block (star on GitHub + socials). Fills the otherwise
 * empty right rail on short pages. The edit link is derived from the pathname.
 */

import { GitHub } from "@/components/icons/Github";
import { CircleDot, Linkedin, SquarePen, Star, Twitter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LINKEDIN_URL,
	NEW_ISSUE_URL,
	REPO_URL,
	TWITTER_URL,
	editUrl,
} from "../_lib/links";

const RailLinks: React.FC<{ stars: number | null }> = ({ stars }) => {
	const pathname = usePathname();

	return (
		<div className="space-y-6 text-sm">
			<div className="space-y-2">
				<p className="text-textPrimary font-medium">Contribute</p>
				<Link
					href={editUrl(pathname)}
					target="_blank"
					className="text-textSecondary hover:text-textPrimary flex items-center gap-2 transition-colors"
				>
					<SquarePen className="size-3.5" /> Edit this page
				</Link>
				<Link
					href={NEW_ISSUE_URL}
					target="_blank"
					className="text-textSecondary hover:text-textPrimary flex items-center gap-2 transition-colors"
				>
					<CircleDot className="size-3.5" /> Report an issue
				</Link>
			</div>

			<div className="space-y-2">
				<p className="text-textPrimary font-medium">Community</p>
				<Link
					href={REPO_URL}
					target="_blank"
					className="group border-border/60 hover:border-primary/50 hover:bg-surface flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors"
				>
					<GitHub className="size-4 shrink-0" />
					<span className="text-textPrimary text-sm font-medium">
						Star on GitHub
					</span>
					{stars !== null && (
						<span className="text-textMuted ml-auto flex items-center gap-1 text-xs">
							<Star className="size-3 fill-amber-400 text-amber-400" />
							{stars.toLocaleString()}
						</span>
					)}
				</Link>
				<div className="flex items-center gap-1">
					<Link
						href={TWITTER_URL}
						target="_blank"
						aria-label="Twitter"
						className="text-textMuted hover:text-textPrimary flex size-8 items-center justify-center rounded-md transition-colors hover:bg-white/5"
					>
						<Twitter className="size-4" />
					</Link>
					<Link
						href={LINKEDIN_URL}
						target="_blank"
						aria-label="LinkedIn"
						className="text-textMuted hover:text-textPrimary flex size-8 items-center justify-center rounded-md transition-colors hover:bg-white/5"
					>
						<Linkedin className="size-4" />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default RailLinks;
