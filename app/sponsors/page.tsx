import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SupporterWall from "@/components/sponsors/SupporterWall";
import SupporterWallSkeleton from "@/components/sponsors/SupporterWallSkeleton";

/**
 * /sponsors
 *
 * Wall of supporters pulled live from Buy Me a Coffee + GitHub Sponsors.
 * Statically rendered with ISR (revalidate=3600 inside the fetchers). The
 * page shell follows the home page's editorial "Motion Specimen" system.
 */

export const metadata: Metadata = {
	title: "Supporters",
	description:
		"The people keeping AnimateIcons online. Hosting bills, free icons, no ads - funded entirely by tips and GitHub Sponsors.",
	alternates: { canonical: "/sponsors" },
	openGraph: {
		title: "Supporters | AnimateIcons",
		description:
			"The people keeping AnimateIcons online. Funded entirely by tips and sponsors.",
		url: "/sponsors",
	},
};

const SponsorsPage = () => {
	return (
		<>
			<Navbar />
			<main className="relative min-h-dvh overflow-hidden">
				<div
					aria-hidden="true"
					className="bg-plus-grid pointer-events-none absolute inset-0"
				/>

				<section className="relative mx-auto max-w-6xl px-6 py-20 lg:py-28">
					<p className="text-textMuted font-mono text-[11px] tracking-[0.25em] uppercase">
						<span className="text-primary">Supporters</span> / Community funded
					</p>
					<h1 className="text-textPrimary mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
						Kept free by the community
						<span className="text-primary">.</span>
					</h1>
					<p className="text-textSecondary mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
						AnimateIcons is an independent, open-source library maintained
						without ads, paid tiers, or corporate backing. The contributors
						below directly fund hosting and ongoing development, keeping every
						icon free.
					</p>

					<div className="mt-14">
						<Suspense fallback={<SupporterWallSkeleton />}>
							<SupporterWall />
						</Suspense>
					</div>

					<div className="border-border/60 mt-16 border-t pt-10">
						<div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
							<div className="max-w-md">
								<p className="text-textMuted font-mono text-[11px] tracking-[0.2em] uppercase">
									Support the project
								</p>
								<p className="text-textSecondary mt-3 text-sm leading-relaxed">
									Both one-time contributions and recurring sponsorships are
									recognized above.
								</p>
							</div>
							<div className="flex flex-wrap gap-3">
								<Link
									href="https://www.buymeacoffee.com/avijit07x"
									target="_blank"
									rel="noopener noreferrer"
									className="group bg-primary hover:bg-primaryHover inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-(--cta-text) transition-colors"
								>
									Buy me a coffee
									<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</Link>
								<Link
									href="https://github.com/sponsors/Avijit07x"
									target="_blank"
									rel="noopener noreferrer"
									className="group border-border text-textPrimary hover:border-primary/50 hover:bg-surface inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
								>
									GitHub Sponsors
									<ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
								</Link>
							</div>
						</div>
					</div>

					<p className="text-textMuted mt-10 font-mono text-[10px] tracking-widest uppercase">
						Data refreshes hourly · anonymous tips not shown
					</p>
				</section>
			</main>
			<Footer />
		</>
	);
};

export default SponsorsPage;
