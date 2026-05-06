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
};

export default withMdx(nextConfig);
