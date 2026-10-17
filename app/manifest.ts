import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "AnimateIcons",
		short_name: "AnimateIcons",
		description:
			"Free, open source and hand-crafted animated icons for React, Vue, Angular and plain JavaScript.",
		start_url: "/",
		display: "standalone",
		background_color: "#0b0b0b",
		theme_color: "#0b0b0b",
		categories: ["developer", "productivity", "design"],
		icons: [
			{ src: "/logo.svg", sizes: "any", type: "image/svg+xml" },
			{ src: "/og.png", sizes: "2400x1260", type: "image/png" },
		],
	};
}
