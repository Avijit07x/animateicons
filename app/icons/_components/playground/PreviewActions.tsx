"use client";

import IconButton from "@/components/IconButton";
import { PlayIcon } from "@/icons/huge/play-icon";
import { Refresh01Icon } from "@/icons/huge/refresh-0-1-icon";
import type { IconHandle } from "@/types/icon";

type Props = {
	iconRef: React.RefObject<IconHandle | null>;
	onReset: () => void;
	resetDisabled: boolean;
};

const PreviewActions: React.FC<Props> = ({
	iconRef,
	onReset,
	resetDisabled,
}) => (
	<div className="flex items-center justify-center gap-2">
		<IconButton
			icon={PlayIcon}
			onClick={() => iconRef.current?.startAnimation()}
			variant="secondary"
			size="pill"
		>
			Replay
		</IconButton>
		<IconButton
			icon={Refresh01Icon}
			onClick={onReset}
			disabled={resetDisabled}
			variant="secondary"
			size="pill"
		>
			Reset
		</IconButton>
	</div>
);

export default PreviewActions;
