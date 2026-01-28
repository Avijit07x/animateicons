import { BadgeCentIcon } from "@/Icons/lucide/BadgeCentIcon";
import { SettingsIcon } from "@/Icons/lucide/SettingsIcon";
import { SparklesIcon } from "@/Icons/lucide/SparklesIcon";
import { ZapIcon } from "@/Icons/lucide/ZapIcon";

export const featureList: FeatureItem[] = [
	{
		id: "precision",
		title: "Precision animations",
		description:
			"Each icon is animated at path level, not just transforms. Motion feels intentional and physical.",
		Icon: BadgeCentIcon,
	},
	{
		id: "interactive",
		title: "Interaction first",
		description:
			"Icons respond to hover, focus, and programmatic triggers without extra wiring.",
		Icon: SparklesIcon,
	},
	{
		id: "control",
		title: "Full control",
		description:
			"Trigger animations manually or automatically. Works with hover, scroll, or global states.",
		Icon: SettingsIcon,
	},
	{
		id: "performance",
		title: "Built for performance",
		description:
			"Uses lightweight motion primitives and respects reduced motion preferences.",
		Icon: ZapIcon,
	},
];
