import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import React from "react";

type Props = {
	children: React.ReactNode;
};

const layout: React.FC<Props> = ({ children }) => {
	return (
		<div className="mx-auto max-w-7xl!">
			<SidebarProvider>
				<AppSidebar />
				<SidebarTrigger />
				{children}
			</SidebarProvider>
		</div>
	);
};

export default layout;

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
	return (
		<Sidebar className="border-0">
			<SidebarHeader />
			<SidebarContent className="bg-bgDark! border-0">
				<SidebarGroup />
				<SidebarGroup />
			</SidebarContent>
		</Sidebar>
	);
}
