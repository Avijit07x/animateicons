import type { Supporter } from "@/lib/supporters/types";
import type { BmcSupporterRaw } from "./types";

export const mapBmcSupporter = (raw: BmcSupporterRaw): Supporter => {
	const name = raw.supporter_name?.trim() || "Anonymous";
	const coffeePrice = Number(raw.support_coffee_price);
	const coffees = Number(raw.support_coffees);

	const amountRaw = coffees * coffeePrice;
	const amount = Number.isFinite(amountRaw) && amountRaw > 0 ? amountRaw : null;

	return {
		id: `bmc:${raw.support_id}`,
		source: "bmc",
		name,
		avatarUrl: null,
		message: raw.support_note?.trim() || null,
		amount,
		currency: raw.support_currency || null,
		createdAt: raw.support_created_on || null,
		url: null,
	};
};
