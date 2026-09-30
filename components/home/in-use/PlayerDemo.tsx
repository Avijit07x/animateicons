"use client";

import IconButton from "@/components/IconButton";
import { Backward01Icon } from "@/icons/huge/backward-0-1-icon";
import { Forward01Icon } from "@/icons/huge/forward-0-1-icon";
import { PauseIcon } from "@/icons/huge/pause-icon";
import { PlayIcon } from "@/icons/huge/play-icon";
import { useState } from "react";

const PlayerDemo: React.FC = () => {
	const [playing, setPlaying] = useState(false);

	return (
		<div className="flex items-center gap-2">
			<IconButton
				icon={Backward01Icon}
				iconSize={22}
				aria-label="Previous"
				className="text-textSecondary hover:text-textPrimary grid size-11 place-items-center rounded-full transition-colors"
			/>
			<IconButton
				icon={playing ? PauseIcon : PlayIcon}
				iconSize={24}
				aria-label={playing ? "Pause" : "Play"}
				onClick={() => setPlaying((v) => !v)}
				className="bg-primary ring-primary/25 hover:ring-primary/40 grid size-14 place-items-center rounded-full text-white ring-4 transition hover:scale-105"
			/>
			<IconButton
				icon={Forward01Icon}
				iconSize={22}
				aria-label="Next"
				className="text-textSecondary hover:text-textPrimary grid size-11 place-items-center rounded-full transition-colors"
			/>
		</div>
	);
};

export default PlayerDemo;
