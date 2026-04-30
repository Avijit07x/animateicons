/**
 * SEO content + structured data for the AnimateIcons /icons/[library]
 * route (Lucide and Huge gallery pages).
 *
 * SRP: this module only declares per-library metadata content and
 * helpers. It does not render anything; the gallery page composes
 * Next's Metadata object and a JSON-LD <script> from these primitives.
 *
 * Why split it out:
 *  - The previous inline metadata repeated nearly identical strings
 *    across `description`, `openGraph.description`, and
 *    `twitter.description`, drifting out of sync.
 *  - Keeping AnimateIcons copy in one place means adding a future icon
 *    library (Phosphor, Tabler) is a one-entry-in-CONTENT change, not
 *    a copy-paste-and-edit fork of the page metadata.
 */

import type { Metadata } from "next";

const BASE_URL = "https://animateicons.in";

type LibraryKey = "lucide" | "huge";

type LibraryContent = {
	displayName: string;
	tagline: string; // 60–90 char hook for OG/Twitter
	description: string; // 140–160 char meta description
	keywords: string[];
};

const CONTENT: Record<LibraryKey, LibraryContent> = {
	lucide: {
		displayName: "Lucide",
		tagline:
			"Animated Lucide icons for React with smooth motion-driven micro-interactions.",
		description:
			"Animated Lucide icons for React. Drop-in components built on motion/react with hover and imperative triggers, configurable size, color, and duration.",
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
			"Animated Huge icons for React — bold, expressive SVG micro-interactions.",
		description:
			"Animated Huge icons for React. Bold, expressive SVG icons with hover and imperative animation triggers, fully customizable size, color, and timing.",
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

export const getLibraryContent = (library: LibraryKey): LibraryContent =>
	CONTENT[library];

/**
 * Build a Next.js Metadata object for an AnimateIcons library page.
 * Title and description are the canonical values; OG / Twitter reuse
 * them instead of drifting into three slightly-different strings.
 */
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

/**
 * Build a JSON-LD SoftwareSourceCode + WebPage payload for an
 * AnimateIcons library so search engines can render rich snippets and
 * link the gallery to the AnimateIcons site + GitHub repo.
 */
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
				name: `AnimateIcons — ${c.displayName}`,
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
