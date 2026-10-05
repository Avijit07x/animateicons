"use client";

import HugeIcon from "@/components/icons/HugeIcon";
import LucideIcon from "@/components/icons/LucideIcon";
import LogoLink from "@/components/logo/LogoLink";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import { ICON_META as HUGE_ICON_META } from "@/icons/huge/meta";
import { ICON_META as LUCIDE_ICON_META } from "@/icons/lucide/meta";
import { cn } from "@/lib/utils";
import { getCategories } from "@/utils/getCategories";
import { isIconNew } from "@/utils/isIconNew";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useCategory } from "../../_contexts/CategoryContext";
import SidebarNavItem from "./SidebarNavItem";
import { sidebarConfig } from "./sidebar.config";

const libraryIconMap: Record<string, React.FC<{ className?: string }>> = {
	"Lucide Icons": LucideIcon,
	"Huge Icons": HugeIcon,
};

const NO_NEW_ICONS: Record<string, number> = {};

let newCountByLibrary: Record<string, number> | null = null;

const subscribeNever = () => () => {};

const getNewCountByLibrary = () => {
	newCountByLibrary ??= {
		lucide: LUCIDE_ICON_META.filter((icon) => isIconNew(icon.addedAt)).length,
		huge: HUGE_ICON_META.filter((icon) => isIconNew(icon.addedAt)).length,
	};
	return newCountByLibrary;
};

const getServerNewCountByLibrary = () => NO_NEW_ICONS;

const GROUP_LABEL =
	"text-textMuted h-7 px-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase";

const isHrefActive = (pathname: string | null, href?: string) => {
	if (!href || !pathname) return false;
	if (/^https?:\/\//.test(href)) return false;
	if (href === "/") return pathname === "/";
	return pathname === href || pathname.startsWith(`${href}/`);
};

const CategoryButton: React.FC<{
	label: string;
	count: number;
	isActive: boolean;
	onSelect: () => void;
}> = ({ label, count, isActive, onSelect }) => (
	<SidebarMenuItem>
		<SidebarMenuButton
			variant="dark"
			isActive={isActive}
			className="h-9 justify-between gap-3 px-3 text-[13px]"
			onClick={onSelect}
		>
			<span className="truncate">{label}</span>
			<span
				className={cn(
					"rounded-full px-1.5 py-px text-[10px] font-medium tabular-nums transition-colors",
					isActive ? "bg-primary/15 text-primary" : "text-textMuted bg-white/6",
				)}
			>
				{count}
			</span>
		</SidebarMenuButton>
	</SidebarMenuItem>
);

const AppSidebar: React.FC = () => {
	const { library } = useIconLibrary();
	const { category, setCategory } = useCategory();
	const router = useRouter();
	const pathname = usePathname();
	const icons = library === "huge" ? HUGE_ICON_META : LUCIDE_ICON_META;

	const categories = React.useMemo(() => getCategories(icons), [icons]);
	const newCounts = React.useSyncExternalStore(
		subscribeNever,
		getNewCountByLibrary,
		getServerNewCountByLibrary,
	);

	if (pathname?.startsWith("/icons/docs")) return null;

	const navGroup = sidebarConfig.find((g) => g.label === "Navigation");
	const activeNavHref = (navGroup?.items ?? [])
		.map((i) => i.href)
		.filter((h): h is string => isHrefActive(pathname, h))
		.sort((a, b) => b.length - a.length)[0];

	const handleCategory = (cat: string) => {
		if (!library) router.replace("lucide");
		setCategory(cat);
	};

	return (
		<Sidebar className="bg-bgDark text-textPrimary border-border/60!">
			<SidebarHeader className="bg-bgDark border-border/60 h-14 shrink-0 flex-row items-center gap-0 border-b px-4 py-0">
				<LogoLink
					size={30}
					className="flex items-center gap-2.5"
					logoClassName="max-md:size-10"
				>
					<span className="text-[15px] font-semibold text-white">
						AnimateIcons
					</span>
				</LogoLink>
			</SidebarHeader>

			<SidebarContent className="bg-bgDark gap-1 overscroll-contain px-2">
				{sidebarConfig.map((group) => (
					<SidebarGroup key={group.label} className="px-0 py-2">
						<SidebarGroupLabel className={GROUP_LABEL}>
							{group.label}
						</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu className="gap-0.5">
								{group.items.map((item) => (
									<SidebarNavItem
										key={item.label}
										item={item}
										LibraryIcon={libraryIconMap[item.label]}
										newCount={item.name ? newCounts[item.name] : 0}
										isActive={
											group.label === "Navigation"
												? !!item.href && item.href === activeNavHref
												: item.name === library
										}
									/>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}

				<SidebarGroup className="flex min-h-0 flex-1 flex-col px-0 py-2">
					<SidebarGroupLabel className={cn(GROUP_LABEL, "shrink-0")}>
						Categories
					</SidebarGroupLabel>
					<SidebarGroupContent className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden">
						<SidebarMenu className="gap-0.5">
							<CategoryButton
								label="All"
								count={icons.length}
								isActive={category === "all"}
								onSelect={() => handleCategory("all")}
							/>
							{categories.map((cat) => (
								<CategoryButton
									key={cat.name}
									label={cat.name}
									count={cat.count}
									isActive={category === cat.name}
									onSelect={() => handleCategory(cat.name)}
								/>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default AppSidebar;
