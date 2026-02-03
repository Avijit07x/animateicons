// sidebar.config.ts
import HugeIcon from "@/components/icons/HugeIcon";
import LucideIcon from "@/components/icons/LucideIcon";
import {
	BarChart3,
	BookOpen,
	Bot,
	Code,
	Database,
	Heart,
	Home,
	LayoutGrid,
	MoreHorizontal,
	Palette,
	Shield,
} from "lucide-react";
import { SidebarGroup } from "./sidebar.types";

export const SIDEBAR_CONFIG: SidebarGroup[] = [
	{
		label: "Navigation",
		items: [
			{ label: "Home", href: "/", icon: Home },
			{ label: "Favorites", href: "/favorites", icon: Heart },
			{ label: "Docs", href: "/icons/docs", icon: BookOpen },
		],
	},
	{
		label: "Icon Libraries",
		items: [
			{ label: "Lucide Icons", href: "/icons/lucide", icon: LucideIcon },
			{ label: "Huge Icons", href: "/icons/huge", icon: HugeIcon },
		],
	},
	{
		label: "Categories",
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
