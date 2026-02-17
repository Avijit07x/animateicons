import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: true,
	},
	alternates: {
		canonical: "/icons/lucide",
	},
};

export default function Page() {
	redirect("/icons/lucide");
}
