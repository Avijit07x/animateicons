import type { Distribution } from "../../_contexts/DistributionContext";
import type { IconConfig } from "./useIconConfig";

export const buildUsageSnippet = (
	distribution: Distribution,
	library: "lucide" | "huge",
	name: string,
	componentName: string,
	config: IconConfig,
): string => {
	const importFrom =
		distribution === "shadcn"
			? `@/components/ui/${name}-icon`
			: `@animateicons/react/${library}`;

	return `import { ${componentName} } from "${importFrom}";\n\n<${componentName}\n  size={${config.size}}\n  duration={${config.duration}}\n  color="${config.color}"\n/>`;
};
