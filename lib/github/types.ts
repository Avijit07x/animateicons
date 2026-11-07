export type GhSponsorNode = {
	__typename: "User" | "Organization";
	login: string;
	name: string | null;
	avatarUrl: string;
	url: string;
};

export type GhSponsorsResponse = {
	data?: {
		user?: {
			sponsors: {
				totalCount: number;
				nodes: GhSponsorNode[];
			};
		};
	};
	errors?: Array<{ message: string }>;
};
