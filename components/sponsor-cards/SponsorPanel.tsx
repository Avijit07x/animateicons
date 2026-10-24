"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpRight01Icon } from "@/icons/huge/arrow-up-right-0-1-icon";
import { HeartIcon } from "@/icons/huge/heart-icon";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { Suspense, useId } from "react";
import { PANEL_W } from "./geometry";
import StarProof from "./StarProof";
import TipChip from "./TipChip";
import { GITHUB_SPONSORS_URL, TIPS } from "./tips";
import UpiQr from "./UpiQr";

const PRIMARY_ICONS = [
	{ icon: "heart", trigger: "hover" },
	{ icon: "arrow", trigger: "hover" },
] as const;

const ICON_TOTAL = ICON_COUNTS.total.toLocaleString("en-US");

type Props = {
	id: string;
	open: boolean;
	landed: boolean;
	qrOpen: boolean;
	onToggleQr: () => void;
	stars: Promise<number | null>;
};

const SponsorPanel: React.FC<Props> = ({
	id,
	open,
	landed,
	qrOpen,
	onToggleQr,
	stars,
}) => {
	const titleId = useId();
	const { icon, trigger } = useIconHover({ trigger: PRIMARY_ICONS });

	return (
		<div
			data-content
			id={id}
			role="dialog"
			aria-labelledby={titleId}
			inert={!open}
			style={{ width: PANEL_W }}
			className="absolute top-0 left-0 opacity-0 [filter:blur(0px)]"
		>
			<div className="px-4.5 pt-4.5 pb-4">
				<Suspense fallback={null}>
					<StarProof stars={stars} />
				</Suspense>
				<h2
					data-item
					id={titleId}
					className="text-textPrimary text-[17px] font-semibold tracking-[-0.005em]"
				>
					Keep AnimateIcons free
				</h2>
				<p data-item className="text-textSecondary mt-1.5 text-[13px]">
					{ICON_TOTAL} icons, no ads, no paywall. Your support pays for hosting
					and new icons.
				</p>
				<Button data-item asChild size="pill" className="mt-4 h-10.5 w-full">
					<a
						href={GITHUB_SPONSORS_URL}
						target="_blank"
						rel="noopener noreferrer"
						{...trigger}
					>
						<HeartIcon {...icon.heart} size={16} />
						Sponsor on GitHub
						<ArrowUpRight01Icon {...icon.arrow} size={14} />
					</a>
				</Button>
			</div>
			<hr data-item className="border-white/6" />
			<div className="px-4.5 pt-3 pb-3.5">
				<p data-item className="text-textMuted mb-2 text-xs">
					Or send a one-time tip
				</p>
				<div className="flex gap-1.5">
					{TIPS.map((tip) => (
						<TipChip
							key={tip.name}
							tip={tip}
							visible={landed}
							expanded={tip.kind === "upi" && qrOpen}
							onToggle={onToggleQr}
						/>
					))}
				</div>
				<UpiQr open={qrOpen} />
			</div>
		</div>
	);
};

export default SponsorPanel;
