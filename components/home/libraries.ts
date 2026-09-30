import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { LIBRARY_PREVIEWS } from "./showcase-icons";

export const LIBRARIES = [
	{
		id: "lucide",
		title: "Lucide",
		count: ICON_COUNTS.lucide,
		body: "Minimal, precise icons for modern product interfaces.",
		icons: LIBRARY_PREVIEWS.lucide,
	},
	{
		id: "huge",
		title: "Huge",
		count: ICON_COUNTS.huge,
		body: "Bold, expressive icons for dashboards and rich interfaces.",
		icons: LIBRARY_PREVIEWS.huge,
	},
];
