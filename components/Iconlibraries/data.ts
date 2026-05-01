import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";
import { HugeIcons, LucideIcons } from "./PopularIcons";
import huge from "./assets/huge.png";
import lucide from "./assets/lucide.svg";

export const iconLibraries: IconLibraryCardData[] = [
	{
		id: "lucide",
		title: "Lucide Icons",
		description:
			"Minimal icons with precise motion, ideal for modern product interfaces.",
		count: LUCIDE_ICON_LIST.length,
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
		count: HUGE_ICON_LIST.length,
		img: {
			href: huge,
			className: "size-6 rounded",
		},
		icons: HugeIcons,
		href: "/icons/huge",
	},
];
