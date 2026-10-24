import type { Metadata } from "next";
import Footer from "@/components/Footer";
import LaunchBanner from "@/components/LaunchBanner";
import Navbar from "@/components/Navbar";
import {
	PRIVACY_SECTIONS,
	PRIVACY_SUMMARY,
	PRIVACY_UPDATED,
} from "@/components/privacy/sections";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";

export const metadata: Metadata = {
	title: "Privacy",
	description:
		"What AnimateIcons collects, why, and how to have it deleted. No accounts, no ads, no tracking cookies.",
	alternates: { canonical: "/privacy" },
	openGraph: {
		title: "Privacy | AnimateIcons",
		description: "What AnimateIcons collects, why, and how to have it deleted.",
		url: "/privacy",
	},
};

const PrivacyPage = () => {
	return (
		<>
			<LaunchBanner className="max-w-7xl px-6" />
			<Navbar />
			<main id={MAIN_CONTENT_ID} className="relative min-h-dvh">
				<article className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
					<h1 className="text-textPrimary text-3xl font-semibold tracking-tight sm:text-4xl">
						Privacy policy<span className="text-primary">.</span>
					</h1>
					<p className="text-textMuted mt-3 text-sm">
						Last updated {PRIVACY_UPDATED}
					</p>

					<p className="bg-surface text-textPrimary mt-8 rounded-3xl p-6 text-sm leading-relaxed sm:text-base">
						{PRIVACY_SUMMARY}
					</p>

					<div className="mt-12 flex flex-col gap-10">
						{PRIVACY_SECTIONS.map((section) => (
							<section key={section.title}>
								<h2 className="text-textPrimary text-lg font-semibold">
									{section.title}
								</h2>
								<div className="text-textSecondary mt-3 flex flex-col gap-3 text-sm leading-relaxed sm:text-base">
									{section.body}
								</div>
							</section>
						))}
					</div>
				</article>
			</main>
			<Footer />
		</>
	);
};

export default PrivacyPage;
