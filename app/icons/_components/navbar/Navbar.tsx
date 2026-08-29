import NavbarActions from "@/components/NavbarActions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { fetchStars } from "@/lib/github/stars";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DistributionToggle from "./DistributionToggle";
import PackageManagerToggle from "./PackageManagerToggle";
import SearchBar from "./SearchBar";

const Navbar: React.FC = async () => {
	const stars = await fetchStars();
	return (
		<div className="border-border/50 bg-bgDark sticky top-0 z-50 h-15 w-full border-b">
			<div className="mx-auto flex h-full max-w-384 items-stretch">
				<div className="flex items-center justify-center gap-2 px-4 md:hidden">
					<SidebarTrigger className="bg-bgDark text-white hover:bg-transparent hover:text-white" />
					<Link href="/" className="flex items-center gap-2">
						<Image
							src={"/logo.svg"}
							alt="logo"
							width={40}
							height={40}
							loading="eager"
							className="-ml-0.5 max-md:size-9"
						/>
					</Link>
				</div>

				<div className="border-border/50 hidden w-80 items-center border-r pr-4 pl-3 md:flex">
					<SearchBar />
				</div>

				<div className="border-border/50 hidden items-center gap-3 border-r px-5 lg:flex">
					<span className="text-textMuted font-mono text-[10px] tracking-[0.18em] uppercase">
						Copy as
					</span>
					<DistributionToggle />
					<PackageManagerToggle />
				</div>

				<div className="ml-auto flex items-center gap-2 px-4 text-sm lg:px-6">
					<NavbarActions stars={stars} />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
