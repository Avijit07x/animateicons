import type { MetadataRoute } from "next";

/**
 * robots.txt — explicitly block aggressive AI crawlers to protect the
 * Vercel edge-request budget. These bots scrape every per-icon page +
 * its dynamic OG image, multiplying our 286 sitemap URLs into tens of
 * thousands of edge hits per month. They feed proprietary AI products
 * without driving any traffic back, so blocking is a clean trade.
 *
 * Real search engines (Google, Bing, DuckDuckGo, etc.) and link
 * previewers stay allowed via the trailing wildcard rule.
 */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			// OpenAI
			{ userAgent: "GPTBot", disallow: "/" },
			{ userAgent: "ChatGPT-User", disallow: "/" },
			{ userAgent: "OAI-SearchBot", disallow: "/" },
			// Anthropic
			{ userAgent: "ClaudeBot", disallow: "/" },
			{ userAgent: "Claude-Web", disallow: "/" },
			{ userAgent: "anthropic-ai", disallow: "/" },
			// Perplexity
			{ userAgent: "PerplexityBot", disallow: "/" },
			{ userAgent: "Perplexity-User", disallow: "/" },
			// Other AI / scrapers
			{ userAgent: "Bytespider", disallow: "/" },
			{ userAgent: "CCBot", disallow: "/" },
			{ userAgent: "Google-Extended", disallow: "/" },
			{ userAgent: "Applebot-Extended", disallow: "/" },
			{ userAgent: "FacebookBot", disallow: "/" },
			{ userAgent: "Meta-ExternalAgent", disallow: "/" },
			{ userAgent: "Meta-ExternalFetcher", disallow: "/" },
			{ userAgent: "Diffbot", disallow: "/" },
			{ userAgent: "Omgilibot", disallow: "/" },
			{ userAgent: "ImagesiftBot", disallow: "/" },
			// Real search engines + everything else
			{ userAgent: "*", allow: "/" },
		],
		sitemap: "https://animateicons.in/sitemap.xml",
	};
}
