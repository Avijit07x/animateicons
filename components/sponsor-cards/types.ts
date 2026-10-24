import type { IconHandle } from "@/types/icon";
import type { ComponentType, Ref } from "react";

type SponsorIcon = ComponentType<{
	size?: number;
	color?: string;
	className?: string;
	ref?: Ref<IconHandle>;
}>;

type TipBase = {
	name: string;
	note: string;
	chip: string;
	icon: SponsorIcon;
	color: string;
	face: string;
};

type LinkTip = TipBase & {
	kind: "link";
	href: string;
	label: string;
};

export type Tip = LinkTip | (TipBase & { kind: "upi" });

export type Stage = "enter" | "rest" | "hover" | "open" | "closed";

type Target = { x: number; y: number; w: number; h: number };

export type Geometry = {
	panelH: number;
	panel: { x: number; y: number };
	chips: Target[];
	close: number;
};
