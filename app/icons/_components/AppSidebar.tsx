"use client";

import HugeIcon from "@/components/icons/HugeIcon";
import LucideIcon from "@/components/icons/LucideIcon";
import { useIconLibrary } from "@/hooks/useIconLibrary";
import { ICON_LIST as HUGE_ICON_LIST } from "@/icons/huge";
import { ICON_LIST as LUCIDE_ICON_LIST } from "@/icons/lucide";
import { getCategories } from "@/utils/getCategories";
import Image from "next/image";
import Link from "next/link";
import React from "react";
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
} from "../../../components/ui/sidebar";
import { useCategory } from "../_contexts/CategoryContext";
import { sidebarConfig } from "./sidebar.config";

const libraryIconMap: Record<string, React.ReactNode> = {
	"Lucide Icons": <LucideIcon className="size-4" />,
	"Huge Icons": <HugeIcon className="size-4" />,
};

const AppSidebar: React.FC = () => {
	const { library } = useIconLibrary();
	const { category, setCategory } = useCategory();
	const icons = library === "lucide" ? LUCIDE_ICON_LIST : HUGE_ICON_LIST;

	const categories = React.useMemo(() => getCategories(icons), [icons]);
	const totalCount = icons.length;

	const isLibraryActive = (name?: string) => {
		if (!name) return false;
		return name === library;
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

			<SidebarContent className="bg-bgDark gap-2">
				{sidebarConfig.map((group) => (
					<SidebarGroup
						key={group.label}
						className={group.scrollable ? "flex-1 overflow-y-auto" : ""}
					>
						<SidebarGroupLabel className="text-textMuted text-xs">
							{group.label}
						</SidebarGroupLabel>

						<SidebarGroupContent>
							<SidebarMenu className="gap-[0.563rem]">
								{group.items.map((item) => {
									const Icon = item.icon;
									const customIcon = libraryIconMap[item.label];

									const content = (
										<>
											{customIcon
												? customIcon
												: Icon && <Icon className="size-4" />}
											{item.label}
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
				<SidebarGroup className="flex-1 overflow-y-auto">
					<SidebarGroupLabel className="text-textMuted text-xs">
						Categories
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu className="gap-[0.563rem]">
							<SidebarMenuItem key="all">
								<SidebarMenuButton
									variant="dark"
									isActive={category === "all"}
									className="justify-between gap-2"
									onClick={() => setCategory("all")}
								>
									<span className="flex items-center gap-2">All</span>
									<span className="text-muted-foreground text-xs">
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
										onClick={() => setCategory(cat.name)}
									>
										<span className="flex items-center gap-2">{cat.name}</span>
										<span className="text-muted-foreground text-xs">
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
