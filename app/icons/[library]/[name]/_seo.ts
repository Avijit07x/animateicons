import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

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
	const url = `${SITE_URL}/icons/${library}/${name}`;

	const title = `${componentName} - Animated ${libDisplay} icon for React`;
	const description = `${display} animated icon for React, Vue, Angular and plain JavaScript. Hover and imperative animation triggers, with configurable size, color, and duration. Install it with npm or the shadcn CLI.`;

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
	const url = `${SITE_URL}/icons/${library}/${name}`;

	return {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebPage",
				"@id": `${url}#webpage`,
				url,
				name: `${componentName} animated icon`,
				description: `${display} animated icon for React, Vue, Angular and plain JavaScript, part of the AnimateIcons library.`,
				isPartOf: { "@id": `${SITE_URL}#website` },
			},
			{
				"@type": "CreativeWork",
				name: componentName,
				description: `${display} animated icon for React, Vue, Angular and plain JavaScript.`,
				url,
				keywords: keywords.join(", "),
				license: "https://opensource.org/licenses/MIT",
				creator: {
					"@type": "Person",
					name: "Avijit Dey",
					url: "https://github.com/Avijit07x",
				},
				isPartOf: { "@id": `${SITE_URL}#website` },
			},
		],
	};
};
