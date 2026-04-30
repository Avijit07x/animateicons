"use client";

/**
 * PlaygroundPreview
 *
 * SRP: render the selected AnimateIcons icon at the user-configured
 * size / color / duration inside the playground sheet, and respond to
 * the configured trigger mode (hover / click / loop). Stateless beyond
 * the imperative ref into the AnimateIcons component.
 *
 * The dotted-grid backdrop is a CSS radial-gradient (no asset) so it
 * stays crisp at any preview size and themes with the AnimateIcons
 * surface tokens automatically.
 */

import { useEffect, useRef } from "react";
import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import type { IconConfig } from "./useIconConfig";

type Props = {
	Icon: React.ElementType;
	config: IconConfig;
};

const PlaygroundPreview: React.FC<Props> = ({ Icon, config }) => {
	const ref = useRef<IconHandle | null>(null);

	// Loop mode: poke the icon every (duration + buffer) so it re-runs.
	useEffect(() => {
		if (config.trigger !== "loop") {
			ref.current?.stopAnimation();
			return;
		}

		ref.current?.startAnimation();
		const id = window.setInterval(
			() => ref.current?.startAnimation(),
			Math.max(800, config.duration * 1000 + 400),
		);
		return () => window.clearInterval(id);
	}, [config.trigger, config.duration]);

	const handleClick = () => {
		if (config.trigger === "click") ref.current?.startAnimation();
	};

	return (
		<div
			role="img"
			aria-label="Icon preview"
			onClick={handleClick}
			onMouseEnter={(e) => config.trigger === "hover" && handleHover(e, ref)}
			onMouseLeave={(e) => config.trigger === "hover" && handleHover(e, ref)}
			className="bg-surface border-border/60 relative flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border"
			style={{
				backgroundImage:
					"radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
				backgroundSize: "16px 16px",
			}}
		>
			<span className="text-textMuted absolute top-3 left-3 font-mono text-[10px] tracking-wider uppercase">
				{config.size}px
			</span>
			<Icon
				ref={ref}
				size={config.size}
				duration={config.duration}
				color={config.color}
			/>
		</div>
	);
};

export default PlaygroundPreview;
