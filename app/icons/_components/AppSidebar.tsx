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

type Props = {};

const AppSidebar: React.FC<Props> = () => {
	return (
		<Sidebar className="border-border/50 bg-surface text-textPrimary border-r">
			<SidebarHeader className="border-border/50 bg-bgDark text-primary border-b px-4 py-3 text-sm font-semibold">
				<Link href="/" className="flex items-center gap-2">
					<Image
						src="/logo.svg"
						alt="logo"
						width={35}
						height={35}
						loading="eager"
						className="-ml-0.5 max-md:size-10"
					/>
					<span className="font-semibold text-white max-sm:hidden">
						AnimateIcons
					</span>
				</Link>
			</SidebarHeader>

			<SidebarContent className="bg-bgDark gap-2">
				<SidebarGroup>
					<SidebarGroupLabel className="text-textMuted text-xs">
						Navigation
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link href="/" className="flex items-center gap-2">
										<Home className="size-4" />
										Home
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link href="/favorites" className="flex items-center gap-2">
										<Heart className="size-4" />
										Favorites
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link href="/icons/docs" className="flex items-center gap-2">
										<BookOpen className="size-4" />
										Docs
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel className="text-textMuted text-xs">
						Icon Libraries
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link
										href="/icons/lucide"
										className="flex items-center gap-2"
									>
										<LucideIcon className="size-4" />
										Lucide Icons
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link href="/icons/huge" className="flex items-center gap-2">
										<HugeIcon className="size-4" />
										Huge Icons
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup className="flex-1 overflow-y-auto">
					<SidebarGroupLabel className="text-textMuted text-xs">
						Categories
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{[
								{ label: "Layouts", icon: LayoutGrid },
								{ label: "Development", icon: Code },
								{ label: "Analytics", icon: BarChart3 },
								{ label: "AI & Automation", icon: Bot },
								{ label: "Database", icon: Database },
								{ label: "Design", icon: Palette },
								{ label: "Security", icon: Shield },
								{ label: "Others", icon: MoreHorizontal },
							].map(({ label, icon: Icon }) => (
								<SidebarMenuItem key={label}>
									<SidebarMenuButton variant="dark" className="gap-2">
										<Icon className="size-4" />
										{label}
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
