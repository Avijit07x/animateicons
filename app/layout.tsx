import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { ClarityAnalytics } from "@/components/ClarityAnalytics";
import { Geist } from "next/font/google";
import { CommandSearchProvider } from "@/components/command-search/CommandSearchProvider";
import JsonLd from "@/components/JsonLd";
import { AppBootLoader } from "@/components/loader/AppBootLoader";
import Snow from "@/components/winter/Snow";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const baseUrl = "https://animateicons.in";

const SITE_DESCRIPTION = `${ICON_COUNTS.total}+ free, open-source, hand-crafted animated SVG icons for React, built on Lucide and Motion. Add them with the shadcn CLI or npm, and make them move on hover, focus, or with your code.`;

const SITE_TITLE = `AnimateIcons | ${ICON_COUNTS.total}+ Free Animated React Icons`;

export const viewport: Viewport = {
	colorScheme: "dark",
	themeColor: "#0b0b0b",
	width: "device-width",
	initialScale: 1,
};

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),
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
		`${ICON_COUNTS.total}+ animated icons`,
		"lucide animated icons",
		"huge animated icons",
		"animated icon library",
		"animated svg icons",
		"animated react icons",
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
		url: baseUrl,
		siteName: "AnimateIcons",
		locale: "en_US",
		type: "website",
		images: [{ url: "/og.png", width: 1200, height: 630, alt: "AnimateIcons" }],
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
			"@id": `${baseUrl}#organization`,
			name: "AnimateIcons",
			url: baseUrl,
			logo: `${baseUrl}/logo.svg`,
			sameAs: ["https://github.com/Avijit07x/animateicons"],
		},
		{
			"@type": "WebSite",
			"@id": `${baseUrl}#website`,
			url: baseUrl,
			name: "AnimateIcons",
			description: SITE_DESCRIPTION,
			publisher: { "@id": `${baseUrl}#organization` },
			potentialAction: {
				"@type": "SearchAction",
				target: {
					"@type": "EntryPoint",
					urlTemplate: `${baseUrl}/icons/lucide?q={search_term_string}`,
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
				<JsonLd data={siteJsonLd} />
				<CommandSearchProvider>{children}</CommandSearchProvider>
				<Snow />
				<AppBootLoader />
				<Analytics />
				<ClarityAnalytics />
			</body>
		</html>
	);
}
