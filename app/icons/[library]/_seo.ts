import type { Metadata } from "next";

const BASE_URL = "https://animateicons.in";

type LibraryKey = "lucide" | "huge";

type LibraryContent = {
	displayName: string;
	tagline: string;
	description: string;
	keywords: string[];
};

const CONTENT: Record<LibraryKey, LibraryContent> = {
	lucide: {
		displayName: "Lucide",
		tagline:
			"Animated Lucide icons for React, Vue, Angular and plain JS with smooth motion-driven micro-interactions.",
		description:
			"Animated Lucide icons for React, Vue, Angular and plain JavaScript. Hover and imperative triggers, with configurable size, color, and duration.",
		keywords: [
			"lucide animated icons",
			"animated lucide react",
			"lucide motion icons",
			"animated svg icons react",
		],
	},
	huge: {
		displayName: "Huge",
		tagline:
			"Animated Huge icons for React, Vue, Angular and plain JS. Bold, expressive SVG micro-interactions.",
		description:
			"Animated Huge icons for React, Vue, Angular and plain JavaScript. Bold, expressive SVG icons with hover and imperative triggers, fully customizable size, color, and timing.",
		keywords: [
			"huge animated icons",
			"animated huge react",
			"huge motion icons",
			"animated svg icons react",
		],
	},
};

export const isLibrary = (v: string): v is LibraryKey =>
	v === "lucide" || v === "huge";

export const buildLibraryMetadata = (library: LibraryKey): Metadata => {
	const c = CONTENT[library];
	const title = `${c.displayName} Animated Icons for React`;
	const url = `${BASE_URL}/icons/${library}`;

	return {
		title,
		description: c.description,
		keywords: c.keywords,
		openGraph: {
			title,
			description: c.tagline,
			url,
			siteName: "AnimateIcons",
			type: "website",
			images: ["/og.png"],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description: c.tagline,
			images: ["/og.png"],
		},
		alternates: {
			canonical: `/icons/${library}`,
		},
	};
};

export const buildLibraryJsonLd = (library: LibraryKey, iconCount: number) => {
	const c = CONTENT[library];
	const url = `${BASE_URL}/icons/${library}`;

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": `${url}#webpage`,
				url,
				name: `${c.displayName} Animated Icons for React`,
				description: c.description,
				isPartOf: { "@id": `${BASE_URL}#website` },
			},
			{
				"@type": "SoftwareSourceCode",
				name: `AnimateIcons - ${c.displayName}`,
				description: c.description,
				codeRepository: "https://github.com/Avijit07x/animateicons",
				programmingLanguage: "TypeScript",
				runtimePlatform: "React",
				license: "https://opensource.org/licenses/MIT",
				numberOfItems: iconCount,
			},
		],
	};
};
