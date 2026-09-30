import NavbarActions from "@/components/NavbarActions";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { fetchStars } from "@/lib/github/stars";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CopyAsMenu from "./CopyAsMenu";
import SearchBar from "./SearchBar";

const Navbar: React.FC = async () => {
	const stars = await fetchStars();
	return (
		<div className="bg-bgDark/85 border-border/60 sticky top-0 z-50 h-14 w-full border-b backdrop-blur-md">
			<div className="mx-auto flex h-full max-w-384 items-center gap-4 px-4 lg:px-6">
				<div className="flex items-center gap-2 md:hidden">
					<SidebarTrigger className="hover:bg-surfaceElevated size-9 rounded-full bg-transparent text-white hover:text-white" />
					<Link href="/" className="flex items-center gap-2">
						<Image
							src={"/logo.svg"}
							alt="logo"
							width={40}
							height={40}
							loading="eager"
							className="max-md:size-9"
						/>
					</Link>
				</div>

				<div className="hidden w-72 shrink-0 md:block">
					<SearchBar />
				</div>

				<span
					aria-hidden="true"
					className="bg-border/60 hidden h-6 w-px lg:block"
				/>

				<div className="hidden lg:block">
					<CopyAsMenu />
				</div>

				<span
					aria-hidden="true"
					className="bg-border/60 ml-auto hidden h-6 w-px lg:block"
				/>

				<div className="flex items-center gap-1 text-sm max-lg:ml-auto">
					<NavbarActions stars={stars} />
				</div>
			</div>
		</div>
	);
};

export default Navbar;
