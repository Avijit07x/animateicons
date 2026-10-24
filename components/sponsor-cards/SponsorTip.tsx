"use client";

import { HeartIcon } from "@/icons/huge/heart-icon";
import { m } from "motion/react";
import { tipVariants } from "./variants";

const SponsorTip: React.FC<{ visible: boolean }> = ({ visible }) => (
	<m.div
		aria-hidden="true"
		variants={tipVariants}
		initial="hide"
		animate={visible ? "show" : "hide"}
		className="bg-surfaceElevated text-textPrimary absolute right-12 bottom-9.75 z-10 flex h-7 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium whitespace-nowrap shadow-[0_8px_24px_-10px_rgb(0_0_0/0.9),inset_0_0_0_1px_rgb(255_255_255/0.06)]"
	>
		<HeartIcon size={13} color="var(--color-primary)" />
		Sponsor
	</m.div>
);

export default SponsorTip;
