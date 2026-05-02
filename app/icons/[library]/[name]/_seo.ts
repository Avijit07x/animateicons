/**
 * Per-icon metadata + JSON-LD helpers for /icons/[library]/[name].
 *
 * Mirrors the library-level _seo.ts pattern: this module declares the
 * data, the page composes Next's Metadata object and a CreativeWork
 * structured-data payload from it. Keeps SEO copy in one place per
 * surface so descriptions don't drift between OG, Twitter, and the
 * raw <meta> tag.
 */

import type { Metadata } from "next";

const BASE_URL = "https://animateicons.in";

type LibraryKey = "lucide" | "huge";

type IconSeoInput = {
	library: LibraryKey;
	name: string;
	componentName: string;
	keywords: string[];
};

const titleCase = (s: string) =>
	s
		.split("-")
		.map((p) => p.charAt(0).toUpperCase() + p.slice(1))
		.join(" ");

export const buildIconMetadata = ({
	library,
	name,
	componentName,
	keywords,
}: IconSeoInput): Metadata => {
	const display = titleCase(name);
	const libDisplay = library === "lucide" ? "Lucide" : "Huge";
	const url = `${BASE_URL}/icons/${library}/${name}`;

	const title = `${componentName} — Animated ${libDisplay} icon for React`;
	const description = `${display} animated icon for React. Drop-in component with hover and imperative animation triggers, configurable size, color, and duration. Available via @animateicons/react and the shadcn CLI.`;

	return {
		title,
		description,
		keywords: [
			`${name} icon`,
			`${name} animated icon`,
			`animated ${name} react`,
			`${componentName}`,
			...keywords,
			`${libDisplay} animated icons`,
		],
		// Note: `images` is intentionally omitted here so Next.js picks
		// up the per-icon `opengraph-image.tsx` co-located in this route.
		// Setting `images` explicitly would override the dynamic OG.
		openGraph: {
			title,
			description,
			url,
			siteName: "AnimateIcons",
			type: "article",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
		},
		alternates: {
			canonical: `/icons/${library}/${name}`,
		},
	};
};

export const buildIconJsonLd = ({
	library,
	name,
	componentName,
	keywords,
}: IconSeoInput) => {
	const display = titleCase(name);
	const url = `${BASE_URL}/icons/${library}/${name}`;

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": `${url}#webpage`,
				url,
				name: `${componentName} animated icon`,
				description: `${display} animated icon for React, part of the AnimateIcons library.`,
				isPartOf: { "@id": `${BASE_URL}#website` },
			},
			{
				"@type": "CreativeWork",
				name: componentName,
				description: `${display} animated icon for React.`,
				url,
				keywords: keywords.join(", "),
				license: "https://opensource.org/licenses/MIT",
				creator: {
					"@type": "Person",
					name: "Avijit Dey",
					url: "https://github.com/Avijit07x",
				},
				isPartOf: { "@id": `${BASE_URL}#website` },
			},
		],
	};
};
