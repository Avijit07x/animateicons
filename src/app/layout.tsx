import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ogImg from "./og.png";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "AnimateIcons – Modern Animated React Icon Library",
	description:
		"Seamless, animated icons for React—make your interface stand out with beautifully smooth motion and easy customization. Built to help you create engaging experiences without the hassle.",
	keywords: [
		"Animated Icons",
		"Animatedicons",
		"React Icons",
		"animate icons",
		"React Motion Icons",
		"Framer Motion Icons",
		"React Animation Library",
		"Motion UI",
		"Interactive Icons",
		"Customizable Icons",
		"React Components",
		"SVG Animated Icons",
		"AnimateIcons",
		"UI Animation Library",
		"Microinteractions",
		"Website Icons",
		"App Icons",
		"Lottie Alternatives",
		"Animated SVG",
		"UI/UX Animated Elements",
		"Frontend Animation",
		"JavaScript Animated Icons",
		"React SVG Animation",
		"Lightweight Icon Library",
		"Animated UI Kit",
		"animateicons",
		"animate icons",
		"react animate",
		"animatedicons",
		"animated icon",
		"animatedicon",
		"lucide icons",
		"lucide animated",
		"lucide animatedicons",
		"shadcn",
		"shadcn icons",
		"shadcn animated icons",
		"icon hover animation",
		"animateicons.in",
	],
	openGraph: {
		title: "AnimateIcons – Modern Animated React Icon Library",
		description:
			"Seamless, animated icons for React—make your interface stand out with beautifully smooth motion and easy customization. Built to help you create engaging experiences without the hassle.",
		url: "https://animateicons.in",
		siteName: "AnimateIcons",
		images: [
			{
				url: ogImg.src,
				width: ogImg.width,
				height: ogImg.height,
				alt: "AnimateIcons OG Banner",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "AnimateIcons – Modern Animated React Icon Library",
		description:
			"Seamless, animated icons for React—make your interface stand out with beautifully smooth motion and easy customization. Built to help you create engaging experiences without the hassle.",
		images: [
			{
				url: ogImg.src,
				width: ogImg.width,
				height: ogImg.height,
				alt: "AnimateIcons OG Banner",
			},
		],
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
		canonical: "https://animateicons.in",
	},
};

export default function RootLayout({
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
			<body
				className={`${geistMono.variable} ${geistSans.variable} antialiased`}
			>
				{children}
				<Analytics />
			</body>
		</html>
	);
}
