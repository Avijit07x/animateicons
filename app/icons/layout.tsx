import React from "react";
import { SidebarProvider } from "../../components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import Navbar from "./_components/Navbar";

type Props = {
	children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
	return (
		<SidebarProvider>
			<div className="flex min-h-dvh w-full">
				<AppSidebar />

				{children}
			</div>
		</SidebarProvider>
	);
};

export default Layout;
