import type { Metadata } from "next";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import IconLink from "@/components/IconLink";
import Navbar from "@/components/Navbar";
import { ArrowUpRight01Icon } from "@/icons/huge/arrow-up-right-0-1-icon";
import SponsorsHeader from "@/components/sponsors/SponsorsHeader";
import SupporterWall from "@/components/sponsors/SupporterWall";
import SupporterWallSkeleton from "@/components/sponsors/SupporterWallSkeleton";

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

				<section className="relative mx-auto max-w-5xl px-6 py-16 lg:py-24">
					<SponsorsHeader />

					<div className="mt-14">
						<Suspense fallback={<SupporterWallSkeleton />}>
							<SupporterWall />
						</Suspense>
					</div>

					<div className="mt-16 flex flex-col items-center gap-5 text-center">
						<p className="text-textSecondary max-w-md text-sm leading-relaxed">
							Both one-time contributions and recurring sponsorships are
							recognized above.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<IconLink
								href="https://www.buymeacoffee.com/avijit07x"
								target="_blank"
								rel="noopener noreferrer"
								icon={ArrowUpRight01Icon}
								variant="default"
								size="pill"
							>
								Buy me a coffee
							</IconLink>
							<IconLink
								href="https://github.com/sponsors/Avijit07x"
								target="_blank"
								rel="noopener noreferrer"
								icon={ArrowUpRight01Icon}
								variant="secondary"
								size="pill"
							>
								GitHub Sponsors
							</IconLink>
						</div>
						<p className="text-textMuted text-xs">
							Data refreshes hourly. Anonymous tips are not shown.
						</p>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
};

export default SponsorsPage;
