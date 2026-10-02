"use client";

import CodeBlock from "@/app/icons/_components/playground/CodeBlock";
import InstallBlock from "@/app/icons/_components/playground/InstallBlock";
import PlaygroundControls from "@/app/icons/_components/playground/PlaygroundControls";
import PlaygroundPreview from "@/app/icons/_components/playground/PlaygroundPreview";
import PreviewActions from "@/app/icons/_components/playground/PreviewActions";
import { buildUsageSnippet } from "@/app/icons/_components/playground/snippet";
import { useIconConfig } from "@/app/icons/_components/playground/useIconConfig";
import { useDistribution } from "@/app/icons/_contexts/DistributionContext";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import { useEffect, useMemo } from "react";

type Props = {
	Icon: React.ElementType;
	componentName: string;
	library: "lucide" | "huge";
	prefix: IconLibraryPrefix;
	name: string;
};

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => <p className="text-textMuted mb-2 text-sm">{children}</p>;

const IconDetailPlayground: React.FC<Props> = ({
	Icon,
	componentName,
	library,
	prefix,
	name,
}) => {
	const { config, update, reset, isDefault } = useIconConfig();
	const { distribution } = useDistribution();
	const { ref: iconRef, triggerProps } = useIconHover();

	const snippet = useMemo(
		() => buildUsageSnippet(distribution, library, name, componentName, config),
		[distribution, library, name, componentName, config],
	);

	useEffect(() => {
		const t = window.setTimeout(() => iconRef.current?.startAnimation(), 220);
		return () => window.clearTimeout(t);
	}, [iconRef]);

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			<div className="flex flex-col gap-6">
				<div className="flex flex-1 flex-col">
					<SectionLabel>Preview</SectionLabel>
					<div className="relative flex flex-1 flex-col">
						<PlaygroundPreview
							Icon={Icon}
							componentName={componentName}
							config={config}
							iconRef={iconRef}
							triggerProps={triggerProps}
							hint={false}
							className="min-h-60 flex-1"
						/>
						<div className="absolute inset-x-0 bottom-4">
							<PreviewActions
								iconRef={iconRef}
								onReset={reset}
								resetDisabled={isDefault}
							/>
						</div>
					</div>
				</div>

				<div>
					<SectionLabel>Customize</SectionLabel>
					<div className="bg-surface rounded-3xl p-6">
						<PlaygroundControls config={config} update={update} />
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-6">
				<InstallBlock prefix={prefix} name={name} />
				<CodeBlock
					label="Import & usage"
					code={snippet}
					lang="tsx"
					footer="Attach a ref to call startAnimation() and stopAnimation()."
					className="flex-1"
				/>
			</div>
		</div>
	);
};

export default IconDetailPlayground;
