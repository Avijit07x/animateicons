/**
 * GitHub Sponsors — raw GraphQL response shapes.
 *
 * The `sponsors` connection on a User node returns a union of User and
 * Organization. We collapse both via inline fragments at query time
 * and just keep the fields we actually render.
 */

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
