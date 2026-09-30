import { fetchStars } from "@/lib/github/stars";
import Image from "next/image";
import Link from "next/link";
import CommandSearchTrigger from "./command-search/CommandSearchTrigger";
import NavbarActions from "./NavbarActions";

const Navbar = async () => {
	const stars = await fetchStars();
	return (
		<header className="bg-bgDark/70 sticky top-0 z-50 backdrop-blur-xl">
			<nav>
				<div className="mx-auto max-w-7xl px-6">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center">
							<Link href="/" className="flex items-center gap-2">
								<Image
									src="/logo.svg"
									alt="logo"
									width={40}
									height={40}
									priority
								/>
								<span className="text-lg font-semibold text-white max-sm:hidden">
									AnimateIcons
								</span>
							</Link>
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
