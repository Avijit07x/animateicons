import ComposedProviders from "@/components/ComposedProviders";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { Suspense } from "react";
import AppSidebar from "./_components/sidebar/AppSidebar";
import CategoryContextProvider from "./_contexts/CategoryContext";
import { DistributionProvider } from "./_contexts/DistributionContext";
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
 */
const PROVIDERS = [
	SidebarProvider,
	CategoryContextProvider,
	IconSearchProvider,
	PackageManagerProvider,
	DistributionProvider,
	PlaygroundProvider,
];

/**
 * IconSearchProvider calls `useSearchParams()` to drive the
 * URL-synced AnimateIcons gallery search. Next.js requires that hook
 * to live below a Suspense boundary, otherwise the entire
 * /icons/[library] route opts out of static prerender (and the Vercel
 * build aborts with `missing-suspense-with-csr-bailout`).
 *
 * Wrapping the whole provider tree gives Next a place to draw the
 * line: the AnimateIcons gallery shell prerenders up to this fallback
 * and the dynamic, search-aware contents hydrate on the client.
 */
const Layout: React.FC<Props> = ({ children }) => {
	return (
		<Suspense fallback={null}>
			<ComposedProviders providers={PROVIDERS}>
				<div className="flex min-h-dvh w-full">
					<AppSidebar />
					{children}
				</div>
			</ComposedProviders>
		</Suspense>
	);
};

export default Layout;
