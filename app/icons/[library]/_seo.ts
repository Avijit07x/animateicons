import type { Metadata } from "next";
import { ICON_COUNT_LABELS } from "@/lib/icon-count.generated";
import { SITE_URL } from "@/lib/site";

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
		description: `${ICON_COUNT_LABELS.lucide} free, open source animated Lucide icons for React, Vue, Angular and plain JavaScript. Every animation is hand-crafted and tuned to feel smooth, and plays the same in every framework.`,
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
		description: `${ICON_COUNT_LABELS.huge} free, open source animated Huge icons for React, Vue, Angular and plain JavaScript. Every animation is hand-crafted and tuned to feel smooth, and plays the same in every framework.`,
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
	const url = `${SITE_URL}/icons/${library}`;

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
	const url = `${SITE_URL}/icons/${library}`;

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": `${url}#webpage`,
				url,
				name: `${c.displayName} Animated Icons for React`,
				description: c.description,
				isPartOf: { "@id": `${SITE_URL}#website` },
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
