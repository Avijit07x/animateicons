import NavbarActions from "@/components/NavbarActions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import PackageManagerToggle from "./PackageManagerToggle";
import SearchBar from "./SearchBar";

type Props = {};

const Navbar: React.FC<Props> = () => {
	return (
		<div className="border-border/50 bg-bgDark sticky top-0 z-50 h-15 w-full border-b px-4 py-3 lg:px-6">
			<div className="mx-auto flex max-w-384 items-center justify-between">
				<div className="flex items-center justify-center gap-2 md:hidden">
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

				<div className="hidden items-center justify-center gap-4 md:flex">
					<SearchBar />

					<PackageManagerToggle />
				</div>

				<div className="flex items-center gap-2 text-sm">
					<NavbarActions />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
