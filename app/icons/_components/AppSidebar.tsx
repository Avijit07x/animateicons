"use client";

import HugeIcon from "@/components/icons/HugeIcon";
import LucideIcon from "@/components/icons/LucideIcon";

import { useIconLibrary } from "@/hooks/useIconLibrary";
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
import { sidebarConfig } from "./sidebar.config";

const libraryIconMap: Record<string, React.ReactNode> = {
	"Lucide Icons": <LucideIcon className="size-4" />,
	"Huge Icons": <HugeIcon className="size-4" />,
};

const AppSidebar: React.FC = () => {
	const { library } = useIconLibrary();

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
												isActive={isLibraryActive(item.name)}
												className="gap-2"
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
			</SidebarContent>
		</Sidebar>
	);
};

export default AppSidebar;
