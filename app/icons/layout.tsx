import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/sidebar/AppSidebar";
import CategoryContextProvider from "./_contexts/CategoryContext";
import FontAwesomeTypeProvider from "./_contexts/FontAwesomeTypeContext";
import { IconSearchProvider } from "./_contexts/IconSearchContext";

type Props = {
	children: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
	return (
		<SidebarProvider>
			<CategoryContextProvider>
				<IconSearchProvider>
					<FontAwesomeTypeProvider>
						<div className="flex min-h-dvh w-full">
							<AppSidebar />
							{children}
						</div>
					</FontAwesomeTypeProvider>
				</IconSearchProvider>
			</CategoryContextProvider>
		</SidebarProvider>
	);
};

export default Layout;
