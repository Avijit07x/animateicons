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
import Image from "next/image";
import Link from "next/link";
import React from "react";
type Props = {};

const AppSidebar: React.FC<Props> = () => {
	return (
		<Sidebar className="text-textPrimary bg-surface border-border/50 border-r">
			<SidebarHeader className="bg-bgDark px-4 py-3 text-sm font-semibold text-[var(--color-primary)]">
				<Link href="/" className="flex items-center gap-2">
					<Image
						src={"/logo.svg"}
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
				{/* Navigation */}
				<SidebarGroup>
					<SidebarGroupLabel className="text-xs text-[var(--color-textMuted)]">
						Navigation
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link href="/">Home</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link href="/favorites">Favorites</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link href="/icons/docs">Docs</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Icon Libraries */}
				<SidebarGroup>
					<SidebarGroupLabel className="text-xs text-[var(--color-textMuted)]">
						Icon Libraries
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link href="/icons/lucide">Lucide Icons</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuButton asChild variant="dark">
									<Link href="/icons/huge">Huge Icons</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Categories */}
				<SidebarGroup className="flex-1 overflow-y-auto">
					<SidebarGroupLabel className="text-xs text-[var(--color-textMuted)]">
						Categories
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{[
								"Framework",
								"Devtool",
								"Analytics",
								"AI",
								"Database",
								"Design",
								"Security",
								"Other",
							].map((item) => (
								<SidebarMenuItem key={item}>
									<SidebarMenuButton variant="dark">{item}</SidebarMenuButton>
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
