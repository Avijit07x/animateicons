/**
 * SupporterAvatar
 *
 * Single tile on the /sponsors page. Renders avatar (image overlay
 * for GitHub sponsors with initial as fallback below, plain initial
 * for BMC), name, optional support note, and a small source badge.
 * Wraps in <a> when the supporter has a public profile URL.
 *
 * The initial circle is always rendered - `SupporterAvatarImage`
 * stacks on top and hides itself if the request errors, so a deleted
 * or suspended GitHub account degrades to a clean letter avatar
 * rather than a broken-image icon.
 */

import { GitHub } from "@/components/icons/Github";
import { MoneyBag01Icon } from "@/icons/huge/money-bag-0-1-icon";
import { firstGrapheme } from "@/lib/utils/firstGrapheme";
import { cn } from "@/lib/utils";
import type { Supporter } from "@/lib/supporters/types";
import SupporterAvatarImage from "./SupporterAvatarImage";

type Props = {
	supporter: Supporter;
};

const sourceMeta = {
	bmc: {
		label: "Buy me a coffee",
		icon: <MoneyBag01Icon size={12} />,
		badge: "Coffee",
	},
	github: {
		label: "GitHub Sponsors",
		icon: <GitHub className="size-3" />,
		badge: "Sponsor",
	},
} as const;

const SupporterAvatar: React.FC<Props> = ({ supporter }) => {
	const initial = firstGrapheme(supporter.name);
	const { icon, label, badge } = sourceMeta[supporter.source];

	const tileClass = cn(
		"group bg-surface hover:bg-surfaceElevated relative flex flex-col gap-3 rounded-3xl p-4 transition-colors",
		"focus-visible:bg-surfaceElevated focus-visible:outline-none",
	);

	const inner = (
		<>
			<div className="flex items-center gap-2.5">
				<span
					aria-hidden="true"
					className="bg-primary/15 text-primary relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold"
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
				className="text-textMuted mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-medium"
				title={label}
			>
				{icon}
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
