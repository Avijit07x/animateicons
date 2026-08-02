import { ICON_COUNT as HUGE_ICON_COUNT } from "@/icons/huge/meta";
import { ICON_COUNT as LUCIDE_ICON_COUNT } from "@/icons/lucide/meta";
import { HugeIcons, LucideIcons } from "./PopularIcons";
import huge from "./assets/huge.png";
import lucide from "./assets/lucide.svg";

export const iconLibraries: IconLibraryCardData[] = [
	{
		id: "lucide",
		title: "Lucide Icons",
		description:
			"Minimal icons with precise motion, ideal for modern product interfaces.",
		count: LUCIDE_ICON_COUNT,
		img: {
			href: lucide,
			className: "size-6 rounded",
		},
		icons: LucideIcons,
		href: "/icons/lucide",
	},
	{
		id: "huge",
		title: "Huge Icons",
		description:
			"Bold and expressive icons designed for dashboards and rich interfaces.",
		count: HUGE_ICON_COUNT,
		img: {
			href: huge,
			className: "size-6 rounded",
		},
		icons: HugeIcons,
		href: "/icons/huge",
	},
];
