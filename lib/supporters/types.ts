export type SupporterSource = "bmc" | "github";

export type Supporter = {
	id: string;
	source: SupporterSource;
	name: string;
	avatarUrl: string | null;
	message: string | null;
	amount: number | null;
	currency: string | null;
	createdAt: string | null;
	url: string | null;
};
