import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { CommandSearchProvider } from "@/components/command-search/CommandSearchProvider";
import JsonLd from "@/components/JsonLd";
import { AppBootLoader } from "@/components/loader/AppBootLoader";
import SkipLink from "@/components/SkipLink";
import Snow from "@/components/winter/Snow";
import { ICON_COUNT_LABELS } from "@/lib/icon-count.generated";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const SITE_DESCRIPTION = `${ICON_COUNT_LABELS.total} free, open source animated icons for React, Vue, Angular and plain JavaScript. Every animation is hand-crafted and tuned to feel smooth, and plays the same in every framework.`;

const SITE_TITLE = `AnimateIcons | ${ICON_COUNT_LABELS.total} Free Animated React Icons`;

export const viewport: Viewport = {
	colorScheme: "dark",
	themeColor: "#0b0b0b",
	width: "device-width",
	initialScale: 1,
};

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	applicationName: "AnimateIcons",
	authors: [{ name: "Avijit Dey", url: "https://github.com/Avijit07x" }],
	creator: "Avijit Dey",
	publisher: "AnimateIcons",
	category: "developer tools",
	formatDetection: { telephone: false, address: false, email: false },
	manifest: "/manifest.webmanifest",

	title: {
		default: SITE_TITLE,
		template: "%s | AnimateIcons",
	},
	description: SITE_DESCRIPTION,
	keywords: [
		"AnimateIcons",
		`${ICON_COUNT_LABELS.total} animated icons`,
		"lucide animated icons",
		"huge animated icons",
		"animated icon library",
		"animated svg icons",
		"animated react icons",
		"animated vue icons",
		"animated angular icons",
		"animated web component icons",
		"hand-crafted animated icons",
		"handmade animated icons",
		"free animated icons",
		"animated hover icons",
		"react icon library",
		"motion react icons",
		"shadcn icons",
		"open source",
	],

	openGraph: {
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		siteName: "AnimateIcons",
		locale: "en_US",
		type: "website",
		images: [
			{ url: "/og.png", width: 2400, height: 1260, alt: "AnimateIcons" },
		],
	},
	twitter: {
		card: "summary_large_image",
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		creator: "@avijit07x",
		images: [{ url: "/og.png", alt: "AnimateIcons" }],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true, "max-image-preview": "large" },
	},
	verification: {
		google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
	},
	alternates: {
		canonical: "/",
	},
};

const siteJsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "Organization",
			"@id": `${SITE_URL}#organization`,
			name: "AnimateIcons",
			url: SITE_URL,
			logo: `${SITE_URL}/logo.svg`,
			sameAs: ["https://github.com/Avijit07x/animateicons"],
		},
		{
			"@type": "WebSite",
			"@id": `${SITE_URL}#website`,
			url: SITE_URL,
			name: "AnimateIcons",
			description: SITE_DESCRIPTION,
			publisher: { "@id": `${SITE_URL}#organization` },
			potentialAction: {
				"@type": "SearchAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: `${SITE_URL}/icons/lucide?q={search_term_string}`,
				},
				"query-input": "required name=search_term_string",
			},
		},
	],
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body className={`${geistSans.variable} bg-bgDark antialiased`}>
				<SkipLink />
				<JsonLd data={siteJsonLd} />
				<CommandSearchProvider>{children}</CommandSearchProvider>
				<Snow />
				<AppBootLoader />
				<Analytics />
			</body>
		</html>
	);
}
