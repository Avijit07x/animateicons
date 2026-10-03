import { fetchStars } from "@/lib/github/stars";
import Link from "next/link";
import CommandSearchTrigger from "./command-search/CommandSearchTrigger";
import LogoLink from "./logo/LogoLink";
import NavbarActions from "./NavbarActions";

const Navbar = async () => {
	const stars = await fetchStars();
	return (
		<header className="bg-bgDark/70 sticky top-0 z-50 backdrop-blur-xl">
			<nav>
				<div className="mx-auto max-w-7xl px-6">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<LogoLink size={40} className="flex items-center gap-2">
								<span className="text-lg font-semibold text-white max-sm:hidden">
									AnimateIcons
								</span>
							</LogoLink>
						</div>

						<div className="flex items-center gap-2 text-sm">
							<Link
								href="/icons/lucide"
								prefetch={false}
								className="pill-link hidden md:flex"
							>
								Icons
							</Link>
							<Link
								href="/icons/docs"
								prefetch={false}
								className="pill-link hidden md:flex"
							>
								Docs
							</Link>
							<CommandSearchTrigger />
							<NavbarActions stars={stars} />
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
