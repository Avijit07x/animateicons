import type { Metadata } from "next";
import Footer from "../components/Footer";
import HeroSection from "../components/Hero";
import IconSearch from "../components/home/IconSearch";
import InUse from "../components/home/InUse";
import JsonLd from "../components/JsonLd";
import LaunchBanner from "../components/LaunchBanner";
import Libraries from "../components/home/Libraries";
import Playground from "../components/home/Playground";
import Navbar from "../components/Navbar";
import { MAIN_CONTENT_ID } from "../components/SkipLink";
import { SITE_URL } from "../lib/site";

export const metadata: Metadata = {
	alternates: {
		canonical: "/",
		types: { "text/markdown": "/index.md" },
	},
};

const homeJsonLd = {
	"@context": "https://schema.org",
	"@type": "WebPage",
	"@id": `${SITE_URL}#webpage`,
	url: SITE_URL,
	isPartOf: { "@id": `${SITE_URL}#website` },
	primaryImageOfPage: `${SITE_URL}/search-thumbnail.png`,
};

const page = () => {
	return (
		<>
			<JsonLd data={homeJsonLd} />
			<LaunchBanner className="max-w-7xl px-6" />
			<Navbar />
			<main id={MAIN_CONTENT_ID}>
				<div className="relative overflow-hidden">
					<HeroSection />
					<IconSearch />
					<Playground />
					<Libraries />
					<InUse />
				</div>
			</main>
			<Footer />
		</>
	);
};

export default page;
