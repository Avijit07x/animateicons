import React from "react";
import { SidebarProvider } from "../../components/ui/sidebar";
import AppSidebar from "./_components/AppSidebar";
import CategoryContextProvider from "./_contexts/CategoryContext";
import { IconSearchProvider } from "./_contexts/IconSearchContext";

type Props = {
	children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
	return (
		<SidebarProvider>
			<CategoryContextProvider>
				<IconSearchProvider>
					<div className="flex min-h-dvh w-full">
						<AppSidebar />
						{children}
					</div>
				</IconSearchProvider>
			</CategoryContextProvider>
		</SidebarProvider>
	);
};

export default Layout;
