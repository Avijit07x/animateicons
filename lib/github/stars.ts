import "server-only";

const REPO_API = "https://api.github.com/repos/Avijit07x/animateicons";
const REVALIDATE_SECONDS = 60 * 60;

type RepoResponse = {
	stargazers_count: number;
};

export const fetchStars = async (): Promise<number | null> => {
	try {
		const token = process.env.GITHUB_SPONSORS_TOKEN;
		const headers: HeadersInit = token
			? { Authorization: `Bearer ${token}` }
			: {};

		const res = await fetch(REPO_API, {
			headers,
			next: { revalidate: REVALIDATE_SECONDS, tags: ["github-stars"] },
		});

		if (!res.ok) {
			console.error(`[github] stars fetch failed: ${res.status}`);
			return null;
		}

		const data = (await res.json()) as RepoResponse;
		return typeof data.stargazers_count === "number"
			? data.stargazers_count
			: null;
	} catch (err) {
		console.error("[github] stars fetch threw:", err);
		return null;
	}
};
