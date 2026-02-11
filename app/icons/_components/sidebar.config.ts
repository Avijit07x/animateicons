import {
	BarChart3,
	BookOpen,
	Bot,
	Code,
	Database,
	Home,
	LayoutGrid,
	MoreHorizontal,
	Palette,
	Send,
	Shield,
} from "lucide-react";
import { SidebarGroupConfig } from "./sidebar.types";

export const sidebarConfig: SidebarGroupConfig[] = [
	{
		label: "Navigation",
		items: [
			{ label: "Home", href: "/", icon: Home },
			{ label: "Docs", href: "/icons/docs", icon: BookOpen },
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
			{ label: "Lucide Icons", name: "lucide", href: "/icons/lucide" },
			{
				label: "Huge Icons",
				name: "huge",
				isActive: true,
				href: "/icons/huge",
			},
		],
	},
	{
		label: "Categories",
		scrollable: true,
		items: [
			{ label: "Layouts", icon: LayoutGrid },
			{ label: "Development", icon: Code },
			{ label: "Analytics", icon: BarChart3 },
			{ label: "AI & Automation", icon: Bot },
			{ label: "Database", icon: Database },
			{ label: "Design", icon: Palette },
			{ label: "Security", icon: Shield },
			{ label: "Others", icon: MoreHorizontal },
		],
	},
];
