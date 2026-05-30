import type { MetadataRoute } from "next";

/**
 * robots.txt - allow everyone, including AI crawlers and assistants.
 *
 * AnimateIcons now ships an MCP server and is meant to be discoverable by
 * AI coding tools (ChatGPT, Claude, Perplexity, etc.), so we no longer
 * block their user-agents. Search engines and link previewers were always
 * allowed; this simply opens the door to AI agents as well.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [{ userAgent: "*", allow: "/" }],
		sitemap: "https://animateicons.in/sitemap.xml",
	};
}
