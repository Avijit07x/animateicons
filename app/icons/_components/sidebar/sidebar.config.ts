import { Home, Package, Send } from "lucide-react";
import { SidebarGroupConfig } from "./sidebar.types";

export const sidebarConfig: SidebarGroupConfig[] = [
	{
		label: "Navigation",
		items: [
			{ label: "Home", href: "/", icon: Home },
			{ label: "Installation", href: "/icons/docs", icon: Package },
			{
				label: "Submit",
				href: "https://github.com/Avijit07x/animateicons?tab=contributing-ov-file#getting-started",
				target: "_blank",
				icon: Send,
			},
		],
	},
	{
		label: "Icon Libraries",
		items: [
			{
				label: "Lucide Icons",
				name: "lucide",
				href: "/icons/lucide",
			},
			{
				label: "Huge Icons",
				name: "huge",
				href: "/icons/huge",
				isBeta: true,
			},
		],
	},
];
