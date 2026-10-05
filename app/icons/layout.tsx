import ComposedProviders from "@/components/ComposedProviders";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import AppSidebar from "./_components/sidebar/AppSidebar";
import CategoryContextProvider from "./_contexts/CategoryContext";
import { DistributionProvider } from "./_contexts/DistributionContext";
import { PackageManagerProvider } from "./_contexts/PackageManagerContext";
import { PlaygroundProvider } from "./_contexts/PlaygroundContext";

type Props = {
	children: React.ReactNode;
};

const PROVIDERS = [
	SidebarProvider,
	CategoryContextProvider,
	PackageManagerProvider,
	DistributionProvider,
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
