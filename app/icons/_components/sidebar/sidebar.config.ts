import { BotIcon } from "@/icons/huge/bot-icon";
import { DownloadIcon } from "@/icons/huge/download-icon";
import { HeartIcon } from "@/icons/huge/heart-icon";
import { Home02Icon } from "@/icons/huge/home-0-2-icon";
import { Layout01Icon } from "@/icons/huge/layout-0-1-icon";
import { SendIcon } from "@/icons/huge/send-icon";
import { SidebarGroupConfig } from "./sidebar.types";

export const sidebarConfig: SidebarGroupConfig[] = [
	{
		label: "Navigation",
		items: [
			{ label: "Home", href: "/", icon: Home02Icon },
			{ label: "Installation", href: "/icons/docs", icon: DownloadIcon },
			{
				label: "Examples",
				href: "/icons/docs/examples/buttons",
				icon: Layout01Icon,
			},
			{ label: "MCP", href: "/icons/docs/mcp", icon: BotIcon },
			{
				label: "Supporters",
				href: "/sponsors",
				icon: HeartIcon,
				highlight: true,
			},
			{
				label: "Submit",
				href: "https://github.com/Avijit07x/animateicons?tab=contributing-ov-file#getting-started",
				target: "_blank",
				icon: SendIcon,
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
			},
		],
	},
];
