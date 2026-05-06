/**
 * Supporter — unified shape that the UI consumes, regardless of
 * source. BMC and GitHub Sponsors both normalize into this so
 * SupporterAvatar / SupporterWall don't have to branch on source.
 */

export type SupporterSource = "bmc" | "github";

export type Supporter = {
	/** Globally unique id, prefixed by source: "bmc:123" or "github:avijit". */
	id: string;
	source: SupporterSource;
	name: string;
	avatarUrl: string | null;
	/** Free-text note (BMC only — GitHub doesn't expose sponsor messages). */
	message: string | null;
	/** USD-equivalent amount (BMC only). */
	amount: number | null;
	currency: string | null;
	/** ISO timestamp when the support was made (BMC only). */
	createdAt: string | null;
	/** Outbound link — GitHub profile or BMC profile. */
	url: string | null;
};
