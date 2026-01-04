import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: "https://animateicons.in",
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 1,
		},
	];
}
