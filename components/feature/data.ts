import { BadgeCentIcon } from "@/icons/lucide/badge-cent-icon";
import { SettingsIcon } from "@/icons/lucide/settings-icon";
import { SparklesIcon } from "@/icons/lucide/sparkles-icon";
import { ZapIcon } from "@/icons/lucide/zap-icon";

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
