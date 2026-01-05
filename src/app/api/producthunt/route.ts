import { NextResponse } from "next/server";

type ProductHuntResponse = {
	data: {
		post: {
			votesCount: number;
		};
	};
};

export async function GET(): Promise<NextResponse> {
	const res = await fetch("https://api.producthunt.com/v2/api/graphql", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${process.env.PRODUCT_HUNT_ACCESS_TOKEN}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			query: `
				{
					post(slug: "animateicons") {
						votesCount
					}
				}
			`,
		}),
		next: {
			revalidate: 60 * 60 * 5,
		},
	});

	const json = (await res.json()) as ProductHuntResponse;

	return NextResponse.json({
		votes: json.data.post.votesCount,
	});
}
