import Image from "next/image";
import Link from "next/link";
import NavbarActions from "./NavbarActions";
import { Separator } from "./ui/separator";

const Navbar = () => {
	return (
		<header className="sticky top-0 z-50">
			<nav className="bg-bgDark backdrop-blur-3xl">
				<div className="mx-auto max-w-7xl px-3 pt-1 md:px-6 lg:px-8">
					<div className="flex h-14 items-center justify-between">
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
								className="hover:text-primaryHover hover:bg-surface text-textPrimary hidden items-center gap-2 rounded-md px-2.5 py-1.5 text-sm font-medium md:flex"
							>
								Icons
							</Link>
							<Separator orientation="vertical" className="hidden md:flex h-4! w-1" />
							<NavbarActions />
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
