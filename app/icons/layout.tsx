import React from "react";
import { SidebarProvider } from "../../components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";

type Props = {
	children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
	return (
		<SidebarProvider>
			<div className="flex min-h-svh w-full">
				<AppSidebar />
				<main className="flex-1 overflow-y-auto px-6 py-3">{children}</main>
			</div>
		</SidebarProvider>
	);
};

export default Layout;
