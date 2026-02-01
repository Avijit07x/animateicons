import React from "react";
import { SidebarProvider } from "../../components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import { IconSearchProvider } from "./_context/IconSearchContext";

type Props = {
	children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
	return (
		<SidebarProvider>
			<IconSearchProvider>
				<div className="flex min-h-dvh w-full">
					<AppSidebar />

					{children}
				</div>
			</IconSearchProvider>
		</SidebarProvider>
	);
};

export default Layout;
