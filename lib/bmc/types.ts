/**
 * Buy Me a Coffee — typed contracts for the developers API.
 *
 * Raw shape mirrors what BMC returns from `/api/v1/supporters`. The
 * normalized `Supporter` is what our components actually consume —
 * snake_case stays out of the UI layer.
 *
 * Reference: https://developers.buymeacoffee.com/
 */

export type BmcSupporterRaw = {
	support_id: number;
	supporter_name: string | null;
	support_note: string | null;
	support_coffees: number;
	support_coffee_price: string;
	support_currency: string;
	support_created_on: string;
	support_visibility: 0 | 1;
};

export type BmcSupportersResponse = {
	current_page: number;
	data: BmcSupporterRaw[];
	last_page: number;
	total: number;
};

export type Supporter = {
	id: number;
	name: string;
	message: string | null;
	amount: number;
	currency: string;
	createdAt: string;
};
