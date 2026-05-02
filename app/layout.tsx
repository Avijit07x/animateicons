import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { CommandSearchProvider } from "@/components/command-search/CommandSearchProvider";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const baseUrl = "https://animateicons.in";

/**
 * Single source of truth for the global description. Reused across the
 * canonical `description`, OG, and Twitter cards so we don't drift into
 * three slightly-different strings (the previous setup did exactly that).
 */
const SITE_DESCRIPTION =
	"Free, open-source animated SVG icons for React. Drop-in components built on motion/react with hover and imperative triggers, configurable size, color, and duration — installable via the shadcn CLI.";

const SITE_TITLE = "AnimateIcons | Free Animated React Icon Library";

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
		"animated svg icons",
		"animated react icons",
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

/**
 * Global structured data: Organization + WebSite with SearchAction.
 * The SearchAction lets Google render a sitelinks search box in SERPs
 * pointing at `/icons/lucide?q=...`.
 *
 * Inline (not a component) so it ships as a single static <script> tag
 * with zero runtime cost.
 */
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
				<Analytics />
			</body>
		</html>
	);
}
