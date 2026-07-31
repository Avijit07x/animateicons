import NavbarActions from "@/components/NavbarActions";
import { fetchStars } from "@/lib/github/stars";
import Image from "next/image";
import Link from "next/link";

/**
 * Slim header for the docs shell — logo, top-nav links, sponsor + GitHub.
 * No icon search here: the gallery's search filters an icon grid that docs
 * pages don't render, so instead we link to the gallery ("Icons").
 */
const DocsNavbar = async () => {
	const stars = await fetchStars();

	return (
		<header className="border-border/50 bg-bgDark sticky top-0 z-50 h-15 w-full border-b px-4 py-3 lg:px-6">
			<div className="mx-auto flex h-full max-w-360 items-center justify-between gap-4">
				<div className="flex items-center gap-6">
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/logo.svg"
							alt="AnimateIcons"
							width={34}
							height={34}
							loading="eager"
							className="-ml-0.5"
						/>
						<span className="text-textPrimary hidden text-sm font-semibold sm:inline">
							AnimateIcons
						</span>
					</Link>

					<nav className="flex items-center gap-5 text-sm">
						<Link
							href="/icons/lucide"
							className="text-textSecondary hover:text-textPrimary transition-colors"
						>
							Icons
						</Link>
						<Link href="/icons/docs" className="text-textPrimary font-medium">
							Docs
						</Link>
					</nav>
				</div>

				<div className="flex items-center gap-2 sm:gap-3">
					<NavbarActions stars={stars} />
				</div>
			</div>
		</header>
	);
};

export default DocsNavbar;
