import { NextResponse } from "next/server";

type GithubRepoResponse = {
	stargazers_count: number;
};

type StarsApiResponse = {
	stars: number | null;
};

export async function GET(): Promise<NextResponse<StarsApiResponse>> {
	try {
		const res = await fetch(
			"https://api.github.com/repos/Avijit07x/animateicons",
			{
				headers: {},
				next: { revalidate: 3600 },
			},
		);

		if (!res.ok) {
			return NextResponse.json({ stars: null }, { status: res.status });
		}

		const data: GithubRepoResponse = await res.json();

		return NextResponse.json({ stars: data.stargazers_count });
	} catch (error) {
		console.error("Error fetching stars:", error);
		return NextResponse.json({ stars: null }, { status: 500 });
	}
}
