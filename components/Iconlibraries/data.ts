import { FontAwesomeIcons, HugeIcons, LucideIcons } from "./PopularIcons";
import fontawesome from "./assets/fontawesome.png";
import huge from "./assets/huge.png";
import lucide from "./assets/lucide.svg";

export const iconLibraries: IconLibraryCardData[] = [
	{
		id: "lucide",
		title: "Lucide Icons",
		description:
			"Minimal icons with precise motion, ideal for modern product interfaces.",
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
		img: {
			href: huge,
			className: "size-6 rounded",
		},
		icons: HugeIcons,
		href: "/icons/huge",
	},
	{
		id: "fontawesome",
		title: "FontAwesome",
		description:
			"Professional icon library with Solid, Regular and Pro styles. Animated for modern interfaces.",
		img: {
			href: fontawesome,
			className: "size-6 rounded",
		},
		icons: FontAwesomeIcons,
		href: "/icons/fontawesome",
	},
];
