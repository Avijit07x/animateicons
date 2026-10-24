import nextMdx from "@next/mdx";
import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
	reactCompiler: true,
	pageExtensions: ["ts", "tsx", "md", "mdx"],
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
	withMdx(
		phase === PHASE_DEVELOPMENT_SERVER
			? {
					...nextConfig,
					pageExtensions: ["dev.tsx", ...(nextConfig.pageExtensions ?? [])],
				}
			: nextConfig,
	);

export default config;
