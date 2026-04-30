import nextMdx from "@next/mdx";
import type { NextConfig } from "next";

const withMdx = nextMdx({
	extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMdx(nextConfig);
