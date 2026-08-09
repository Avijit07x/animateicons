"use client";

import HugeIcon from "@/components/icons/HugeIcon";
import LucideIcon from "@/components/icons/LucideIcon";
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
import { getCategories } from "@/utils/getCategories";
import { isIconNew } from "@/utils/isIconNew";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useCategory } from "../../_contexts/CategoryContext";
import { sidebarConfig } from "./sidebar.config";

const libraryIconMap: Record<string, React.FC<{ className?: string }>> = {
	"Lucide Icons": LucideIcon,
	"Huge Icons": HugeIcon,
};

const AppSidebar: React.FC = () => {
	const { library } = useIconLibrary();
	const { category, setCategory } = useCategory();
	const router = useRouter();
	const pathname = usePathname();
	const icons = library === "huge" ? HUGE_ICON_META : LUCIDE_ICON_META;

	const categories = React.useMemo(() => getCategories(icons), [icons]);
	const totalCount = icons.length;

	// New-icon count per library, keyed by the library `name` used in the
	// sidebar config, so the chip sits beside its library regardless of which
	// one is active.
	const newCountByLibrary = React.useMemo<Record<string, number>>(
		() => ({
			lucide: LUCIDE_ICON_META.filter((icon) => isIconNew(icon.addedAt)).length,
			huge: HUGE_ICON_META.filter((icon) => isIconNew(icon.addedAt)).length,
		}),
		[],
	);

	// ponytail: docs render their own shell (app/icons/docs/layout.tsx), so the
	// gallery's category sidebar steps aside on /icons/docs routes.
	if (pathname?.startsWith("/icons/docs")) return null;

	const isLibraryActive = (name?: string) => {
		if (!name) return false;
		return name === library;
	};

	/** Match a Navigation item's href against the current pathname.
	 *  Exact match for "/" so it doesn't light up everywhere; prefix
	 *  match for nested routes like /sponsors → /sponsors/* . External
	 *  hrefs (http/https) never highlight. */
	const isHrefActive = (href?: string): boolean => {
		if (!href || !pathname) return false;
		if (/^https?:\/\//.test(href)) return false;
		if (href === "/") return pathname === "/";
		return pathname === href || pathname.startsWith(`${href}/`);
	};

	/** Only the most specific (longest) matching Navigation href highlights,
	 *  so /icons/docs/mcp lights up "MCP" - not also "Installation"
	 *  (/icons/docs), which is a prefix of it. */
	const activeNavHref = (
		sidebarConfig.find((g) => g.label === "Navigation")?.items ?? []
	)
		.map((i) => i.href)
		.filter((h): h is string => isHrefActive(h))
		.sort((a, b) => b.length - a.length)[0];

	const handleCategory = (cat: string) => {
		if (library) {
			setCategory(cat);
		} else {
			router.replace("lucide");
			setCategory(cat);
		}
	};

	return (
		<Sidebar className="border-border/50! bg-surface text-textPrimary border-r">
			<SidebarHeader className="border-border/50! bg-bgDark text-primary border-b px-4 py-3 text-sm font-semibold">
				<Link href="/" className="flex items-center gap-2">
					<Image
						src="/logo.svg"
						alt="logo"
						width={35}
						height={35}
						loading="eager"
						className="-ml-0.5 max-md:size-10"
					/>
					<span className="font-semibold text-white">AnimateIcons</span>
				</Link>
			</SidebarHeader>

			<SidebarContent className="bg-bgDark gap-3 overscroll-contain">
				{sidebarConfig.map((group) => (
					<SidebarGroup
						key={group.label}
						className={
							group.scrollable
								? "flex-1 overflow-y-auto overscroll-contain"
								: ""
						}
					>
						<SidebarGroupLabel className="text-textMuted font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
							{group.label}
						</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu className="gap-1">
								{group.items.map((item) => {
									const Icon = item.icon;
									const LibraryIcon = libraryIconMap[item.label];
									const highlight = item.highlight === true;

									const content = (
										<>
											{LibraryIcon ? (
												<LibraryIcon
													className={`size-4 ${isLibraryActive(item.name) ? "text-primary" : ""}`}
												/>
											) : (
												Icon && (
													<Icon
														className={
															highlight
																? "size-4 fill-pink-500/20 text-pink-500"
																: "size-4"
														}
													/>
												)
											)}

											<span className="flex items-center gap-2">
												{item.label}
												{item.name && newCountByLibrary[item.name] > 0 && (
													<span className="bg-primary/12 text-primary border-primary/25 rounded-sm border px-1.5 py-px text-[9px] font-semibold tracking-wide uppercase">
														{newCountByLibrary[item.name]} New
													</span>
												)}
											</span>
										</>
									);

									return (
										<SidebarMenuItem key={item.label}>
											<SidebarMenuButton
												asChild={!!item.href}
												variant="dark"
												isActive={
													group.label === "Categories"
														? category === item.label
														: group.label === "Navigation"
															? !!item.href && item.href === activeNavHref
															: isLibraryActive(item.name)
												}
												className="gap-2"
												onClick={() => {
													if (group.label === "Categories") {
														setCategory(item.label);
													}
												}}
											>
												{item.href ? (
													<Link
														href={item.href}
														className="flex items-center gap-2"
														target={item.target && item.target}
													>
														{content}
													</Link>
												) : (
													<span className="flex items-center gap-2">
														{content}
													</span>
												)}
											</SidebarMenuButton>
										</SidebarMenuItem>
									);
								})}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}

				<SidebarGroup className="flex min-h-0 flex-1 flex-col">
					<SidebarGroupLabel className="text-textMuted shrink-0 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
						Categories
					</SidebarGroupLabel>
					<SidebarGroupContent className="min-h-0 flex-1 scrollbar-gutter-stable overflow-y-scroll overscroll-contain">
						<SidebarMenu className="gap-1">
							<SidebarMenuItem key="all">
								<SidebarMenuButton
									variant="dark"
									isActive={category === "all"}
									className="justify-between gap-2"
									onClick={() => handleCategory("all")}
								>
									<span className="flex items-center gap-2">All</span>
									<span className="text-textSecondary rounded-md bg-white/6 px-1.5 py-0.5 text-[11px] font-medium tabular-nums">
										{totalCount}
									</span>
								</SidebarMenuButton>
							</SidebarMenuItem>

							{categories.map((cat) => (
								<SidebarMenuItem key={cat.name}>
									<SidebarMenuButton
										variant="dark"
										isActive={category === cat.name}
										className="justify-between gap-2"
										onClick={() => handleCategory(cat.name)}
									>
										<span className="flex items-center gap-2">{cat.name}</span>
										<span className="text-textSecondary rounded-md bg-white/6 px-1.5 py-0.5 text-[11px] font-medium tabular-nums">
											{cat.count}
										</span>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default AppSidebar;
