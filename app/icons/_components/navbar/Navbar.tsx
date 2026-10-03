import LogoLink from "@/components/logo/LogoLink";
import NavbarActions from "@/components/NavbarActions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { fetchStars } from "@/lib/github/stars";
import React from "react";
import InstallCommand from "./InstallCommand";
import SearchBar from "./SearchBar";

const Navbar: React.FC = async () => {
	const stars = await fetchStars();
	return (
		<div className="bg-bgDark/85 border-border/60 sticky top-0 z-50 h-14 w-full border-b backdrop-blur-md">
			<div className="mx-auto flex h-full max-w-384 items-center gap-4 px-4 lg:px-6">
				<div className="flex items-center gap-2 md:hidden">
					<SidebarTrigger className="hover:bg-surfaceElevated size-9 rounded-full bg-transparent text-white hover:text-white" />
					<LogoLink
						size={40}
						className="flex items-center gap-2"
						logoClassName="max-md:size-9"
					/>
				</div>

				<div className="hidden w-72 shrink-0 md:block">
					<SearchBar />
				</div>

				<span
					aria-hidden="true"
					className="bg-border/60 hidden h-6 w-px xl:block"
				/>

				<div className="hidden xl:block">
					<InstallCommand />
				</div>

				<div className="ml-auto flex items-center gap-1 text-sm">
					<NavbarActions stars={stars} separated />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
