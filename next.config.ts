import nextMdx from "@next/mdx";
import type { NextConfig } from "next";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	pageExtensions: ["ts", "tsx", "md", "mdx"],
	images: {
		// GitHub Sponsors avatars on /sponsors. Only needed for that page,
		// but the allowlist is global. Pathname locks us to avatar URLs so
		// we can't be tricked into proxying arbitrary GitHub user content.
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/u/**",
			},
		],
	},

	/**
	 * 301 www → apex so both hostnames don't double-count traffic and
	 * SEO signals consolidate on a single canonical origin.
	 */
	async redirects() {
		return [
			{
				source: "/:path*",
				has: [{ type: "host", value: "www.animateicons.in" }],
				destination: "https://animateicons.in/:path*",
				permanent: true,
			},
		];
	},

	/**
	 * Mark every preview deployment (`*.vercel.app`) as noindex so search
	 * engines drop cached preview URLs and stop crawling them. Apex
	 * domain is unaffected.
	 */
	async headers() {
		return [
			{
				source: "/:path*",
				has: [
					{
						type: "host",
						value: "(?<previewHost>.*\\.vercel\\.app)",
					},
				],
				headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
			},
		];
	},
};

export default withMdx(nextConfig);
