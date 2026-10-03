import LogoLink from "@/components/logo/LogoLink";
import NavbarActions from "@/components/NavbarActions";
import { fetchStars } from "@/lib/github/stars";
import Link from "next/link";

const DocsNavbar = async () => {
	const stars = await fetchStars();

	return (
		<header className="bg-bgDark/85 border-border/60 sticky top-0 z-50 h-14 w-full border-b px-4 backdrop-blur-md lg:px-6">
			<div className="mx-auto flex h-full max-w-360 items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<LogoLink size={30} className="flex items-center gap-2.5">
						<span className="text-textPrimary hidden text-[15px] font-semibold sm:inline">
							AnimateIcons
						</span>
					</LogoLink>

					<nav className="flex items-center gap-1">
						<Link href="/icons/lucide" className="pill-link">
							Icons
						</Link>
						<Link
							href="/icons/docs"
							className="pill-link bg-surfaceElevated text-textPrimary"
						>
							Docs
						</Link>
					</nav>
				</div>

				<div className="flex items-center gap-1">
					<NavbarActions stars={stars} />
				</div>
			</div>
		</header>
	);
};

export default DocsNavbar;
