import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const baseUrl = "https://animateicons.in";

export const metadata: Metadata = {
	metadataBase: new URL(baseUrl),

	title: {
		default: "AnimateIcons | Free Modern Animated React Icon Library",
		template: "%s | AnimateIcons",
	},

	description:
		"Free and open-source animated SVG icon library for React with smooth micro-interactions, easy customization, and lightweight performance.",
	keywords: [
		"AnimateIcons",
		"animated svg icons",
		"animated icons for react",
		"react animated icons",
		"react icon library",
		"svg icon animation",
		"animated svg react",
		"ui micro-interactions",
		"interactive icons",
		"icon hover animation",
		"lightweight icon library",
		"open source react icons",
		"free animated icons",
		"free svg icons react",
		"frontend ui animation",
		"ui animation library",
		"react ui icons",
		"react svg icons",
		"modern icon library",
		"web app icons",
		"dashboard icons react",
		"saas icons react",
		"admin panel icons react",
		"microinteraction icons",
		"animated ui icons",
		"motion based icons",
		"svg path animation icons",
		"react component icons",
		"icon animation on hover",
		"ui interaction icons",
		"clean ui icons",
		"developer friendly icons",
		"performance optimized icons",
		"lucide icons",
		"lucide animated icons",
		"lucide react icons",
		"shadcn icons",
		"shadcn animated icons",
		"shadcn ui icons",
		"lottie alternative icons",
		"animateicons.in",
	],

	openGraph: {
		title: "AnimateIcons – Modern Animated React Icon Library",
		description:
			"Free and open-source animated SVG icon library for React with smooth micro-interactions, easy customization, and lightweight performance.",
		url: "https://animateicons.in",
		siteName: "AnimateIcons",

		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AnimateIcons – Modern Animated React Icon Library",
		description:
			"Free and open-source animated SVG icon library for React with smooth micro-interactions, easy customization, and lightweight performance.",
	},
	robots: {
		index: true,
		follow: true,
		nocache: false,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	alternates: {
		canonical: "/",
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<meta
					name="google-site-verification"
					content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ""}
				/>
			</head>
			<body className={`${geistSans.variable} bg-bgDark antialiased`}>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
