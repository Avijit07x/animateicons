import nextMdx from "@next/mdx";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
});

const PAGE_EXTENSIONS = ["ts", "tsx", "md", "mdx"];

const nextConfig: NextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/u/**",
			},
		],
	},

	async redirects() {
		return [
			{
				source: "/:path*",
				has: [{ type: "host", value: "www.animateicons.in" }],
				destination: "https://animateicons.in/:path*",
				permanent: true,
			},
			{
				source: "/icons/docs/usage",
				destination: "/icons/docs/react",
				permanent: true,
			},
		];
	},

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

const config = (phase: string): NextConfig =>
	withMdx({
		...nextConfig,
		pageExtensions:
			phase === PHASE_DEVELOPMENT_SERVER
				? ["dev.tsx", ...PAGE_EXTENSIONS]
				: PAGE_EXTENSIONS,
	});

export default config;
