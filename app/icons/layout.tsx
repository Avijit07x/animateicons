import ComposedProviders from "@/components/ComposedProviders";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./_components/sidebar/AppSidebar";
import CategoryContextProvider from "./_contexts/CategoryContext";
import { IconSearchProvider } from "./_contexts/IconSearchContext";
import { PackageManagerProvider } from "./_contexts/PackageManagerContext";
import { PlaygroundProvider } from "./_contexts/PlaygroundContext";

type Props = {
	children: React.ReactNode;
};

/**
 * Provider order for the AnimateIcons /icons gallery layout.
 * SidebarProvider is OUTERMOST so the sidebar can read its own state,
 * then category / search / package-manager / playground stack inward.
 * Adding a new AnimateIcons feature with its own context is now a
 * single-line change to this array.
 */
const PROVIDERS = [
	SidebarProvider,
	CategoryContextProvider,
	IconSearchProvider,
	PackageManagerProvider,
	PlaygroundProvider,
];

const Layout: React.FC<Props> = ({ children }) => {
	return (
		<ComposedProviders providers={PROVIDERS}>
			<div className="flex min-h-dvh w-full">
				<AppSidebar />
				{children}
			</div>
		</ComposedProviders>
	);
};

export default Layout;
