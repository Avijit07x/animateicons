import type { MetadataRoute } from "next";

/**
 * PWA manifest for AnimateIcons. Even though the site isn't a full PWA,
 * a valid manifest:
 *  - lets users add AnimateIcons to their mobile home screen
 *  - is consumed by Google's indexer to enrich SERP snippets and the
 *    "About this site" panel
 *  - sets the AnimateIcons brand color for Android browser chrome
 *
 * SRP: AnimateIcons app identity only. No content lives here.
 */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "AnimateIcons",
		short_name: "AnimateIcons",
		description:
			"Free, open-source animated SVG icons for React. Drop-in components built on motion/react.",
		start_url: "/",
		display: "standalone",
		background_color: "#0b0b0b",
		theme_color: "#0b0b0b",
		categories: ["developer", "productivity", "design"],
		icons: [
			{ src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
			{ src: "/og.png", sizes: "1200x630", type: "image/png" },
		],
	};
}
