import { Coffee02Icon } from "@/icons/huge/coffee-0-2-icon";
import { CreditCardIcon } from "@/icons/huge/credit-card-icon";
import { QrCode01Icon } from "@/icons/huge/qr-code-0-1-icon";
import type { Tip } from "./types";

export const GITHUB_SPONSORS_URL = "https://github.com/sponsors/avijit07x";

export const UPI_ID = "avijit07x@axl";

export const TIPS: Tip[] = [
	{
		kind: "link",
		name: "Buy me a coffee",
		note: "One-time tip",
		chip: "Coffee",
		icon: Coffee02Icon,
		color: "var(--color-warning)",
		face: "bg-surfaceActive text-textPrimary",
		href: "https://buymeacoffee.com/avijit07x",
		label: "Tip via Buy Me a Coffee",
	},
	{
		kind: "link",
		name: "PayPal",
		note: "Any amount",
		chip: "PayPal",
		icon: CreditCardIcon,
		color: "var(--color-success)",
		face: "bg-surfaceElevated text-textPrimary",
		href: "https://paypal.me/avijit07x",
		label: "Tip via PayPal",
	},
	{
		kind: "upi",
		name: "UPI",
		note: "For India",
		chip: "UPI",
		icon: QrCode01Icon,
		color: "var(--color-textPrimary)",
		face: "bg-surfaceHover text-textPrimary",
	},
];

export const STACK_SIZE = TIPS.length + 1;
