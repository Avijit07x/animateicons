"use client";

import { HeartIcon } from "@/icons/huge/heart-icon";
import { cn } from "@/lib/utils";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { LazyMotion, domAnimation } from "motion/react";
import ChipFace from "./ChipFace";
import CloseButton from "./CloseButton";
import { CARD_H, CARD_W } from "./geometry";
import SponsorPanel from "./SponsorPanel";
import SponsorScrim from "./SponsorScrim";
import SponsorTip from "./SponsorTip";
import StackCard from "./StackCard";
import { TIPS } from "./tips";
import { useSponsorCards } from "./useSponsorCards";

const ANCHOR_STYLE = {
	width: CARD_W,
	height: CARD_H,
	bottom: `calc(66dvh - ${CARD_H}px)`,
};

const SponsorCards: React.FC = () => {
	const {
		scope,
		stage,
		open,
		raised,
		geometry,
		landed,
		qrShift,
		panelId,
		closeRef,
		close,
		toggleQr,
		triggerProps,
	} = useSponsorCards();
	const { ref: heartRef, triggerProps: heartTrigger } = useIconHover();

	return (
		<LazyMotion features={domAnimation} strict>
			<SponsorScrim open={open} onClose={close} />

			<div
				ref={scope}
				className={cn(
					"pointer-events-none fixed inset-0 overflow-hidden",
					raised ? "z-70" : "z-45",
				)}
			>
				<div data-anchor style={ANCHOR_STYLE} className="absolute right-0">
					<button
						type="button"
						aria-label="Sponsor AnimateIcons"
						{...triggerProps}
						{...heartTrigger}
						className={cn(
							"absolute right-0 -bottom-2 z-10 h-48 w-12 cursor-pointer rounded-l-[14px] outline-none",
							!open && "pointer-events-auto",
						)}
					/>

					<StackCard
						index={0}
						name="Sponsor"
						note="Keep it free"
						faceClassName="bg-primary text-(--cta-text)"
						icon={<HeartIcon ref={heartRef} size={16} className="-ml-1.75" />}
						active={open}
					>
						<SponsorPanel
							id={panelId}
							open={open}
							landed={landed}
							qrOpen={qrShift > 0}
							onToggleQr={toggleQr}
						/>
					</StackCard>

					{TIPS.map((tip, k) => (
						<StackCard
							key={tip.name}
							index={k + 1}
							name={tip.name}
							note={tip.note}
							faceClassName={tip.face}
							hidden={landed}
						>
							<ChipFace tip={tip} />
						</StackCard>
					))}

					<SponsorTip visible={stage === "hover"} />

					<CloseButton
						ref={closeRef}
						open={open}
						bottom={geometry?.close ?? 0}
						lift={qrShift}
						onClose={close}
					/>
				</div>
			</div>
		</LazyMotion>
	);
};

export default SponsorCards;
