/**
 * SupporterAvatar
 *
 * Single tile on the /sponsors page. Renders avatar (image overlay
 * for GitHub sponsors with initial as fallback below, plain initial
 * for BMC), name, optional support note, and a small source badge.
 * Wraps in <a> when the supporter has a public profile URL.
 *
 * The initial circle is always rendered — `SupporterAvatarImage`
 * stacks on top and hides itself if the request errors, so a deleted
 * or suspended GitHub account degrades to a clean letter avatar
 * rather than a broken-image icon.
 */

import { GitHub } from "@/components/icons/Github";
import { firstGrapheme } from "@/lib/utils/firstGrapheme";
import { cn } from "@/lib/utils";
import type { Supporter } from "@/lib/supporters/types";
import { Coffee } from "lucide-react";
import SupporterAvatarImage from "./SupporterAvatarImage";

type Props = {
	supporter: Supporter;
};

const sourceMeta = {
	bmc: { label: "Buy me a coffee", Icon: Coffee, badge: "Coffee" },
	github: { label: "GitHub Sponsors", Icon: GitHub, badge: "Sponsor" },
} as const;

const SupporterAvatar: React.FC<Props> = ({ supporter }) => {
	const initial = firstGrapheme(supporter.name);
	const { Icon: SourceIcon, label, badge } = sourceMeta[supporter.source];

	const tileClass = cn(
		"group border-border/60 hover:border-primary/40 focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
		"relative flex flex-col gap-2.5 rounded-xl border p-4 transition-colors",
		"bg-gradient-to-b from-white/[0.03] to-white/[0.01]",
	);

	const inner = (
		<>
			<div className="flex items-center gap-2.5">
				<span
					aria-hidden="true"
					className="border-primary/30 bg-primary/15 text-primary relative inline-flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border text-sm font-semibold"
				>
					<span aria-hidden="true">{initial}</span>
					{supporter.avatarUrl && (
						<SupporterAvatarImage
							src={supporter.avatarUrl}
							alt={supporter.name}
						/>
					)}
				</span>
				<span className="text-textPrimary truncate text-sm font-semibold">
					{supporter.name}
				</span>
			</div>
			{supporter.message && (
				<p className="text-textSecondary line-clamp-3 text-xs leading-relaxed">
					&ldquo;{supporter.message}&rdquo;
				</p>
			)}
			<span
				className="text-textMuted mt-auto inline-flex items-center gap-1.5 text-[10px] font-medium tracking-wide uppercase"
				title={label}
			>
				<SourceIcon className="size-3" />
				{badge}
			</span>
		</>
	);

	if (supporter.url) {
		return (
			<a
				href={supporter.url}
				target="_blank"
				rel="noopener noreferrer"
				className={tileClass}
				aria-label={`${supporter.name} via ${label}`}
			>
				{inner}
			</a>
		);
	}

	return <div className={tileClass}>{inner}</div>;
};

export default SupporterAvatar;
