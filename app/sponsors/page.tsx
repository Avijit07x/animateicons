import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Heart } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SupporterWall from "@/components/sponsors/SupporterWall";
import SupporterWallSkeleton from "@/components/sponsors/SupporterWallSkeleton";

/**
 * /sponsors
 *
 * Wall of supporters pulled live from Buy Me a Coffee + GitHub
 * Sponsors. Statically rendered with ISR (revalidate=3600 inside the
 * fetchers), so Vercel serves a CDN cache hit and refreshes hourly.
 * The tab filter is a small client island; the rest is server-side.
 */

export const metadata: Metadata = {
	title: "Supporters",
	description:
		"The people keeping AnimateIcons online. Hosting bills, free icons, no ads — funded entirely by tips and GitHub Sponsors.",
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
				<section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
					<div className="space-y-4">
						<div className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
							<Heart className="size-3.5" /> Open source · Community funded
						</div>
						<h1 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
							Project supporters
						</h1>
						<p className="text-textSecondary max-w-2xl text-sm leading-relaxed sm:text-base">
							AnimateIcons is an independent, open-source library maintained
							without ads, paid tiers, or corporate backing. The contributors
							below directly fund hosting and ongoing development, keeping every
							icon free for the community.
						</p>
					</div>

					<div className="mt-10">
						<Suspense fallback={<SupporterWallSkeleton />}>
							<SupporterWall />
						</Suspense>
					</div>

					<div className="border-border/60 mt-12 rounded-2xl border bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-6 sm:p-8">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="space-y-1">
								<p className="text-textPrimary text-base font-semibold">
									Support the project
								</p>
								<p className="text-textSecondary text-sm">
									Both one-time contributions and recurring sponsorships are
									recognized below.
								</p>
							</div>
							<div className="flex flex-wrap gap-2">
								<Link
									href="https://www.buymeacoffee.com/avijit07x"
									target="_blank"
									rel="noopener noreferrer"
									className="border-primary/40 bg-primary/15 text-primary hover:bg-primary/25 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
								>
									Buy me a coffee
									<ArrowRight className="size-3.5" />
								</Link>
								<Link
									href="https://github.com/sponsors/Avijit07x"
									target="_blank"
									rel="noopener noreferrer"
									className="border-border/60 hover:border-primary/40 text-textPrimary inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors"
								>
									GitHub Sponsors
									<ArrowRight className="size-3.5" />
								</Link>
							</div>
						</div>
					</div>

					<p className="text-textMuted mt-8 text-center text-xs">
						Data refreshes hourly. Anonymous and privacy-hidden tips
						aren&apos;t shown.
					</p>
				</section>
			</main>
			<Footer />
		</>
	);
};

export default SponsorsPage;
