import type { IconHandle } from "@/types/icon";
import handleHover from "@/utils/handleHover";
import { useRef, type MouseEvent } from "react";

export const useIconHover = <T extends IconHandle = IconHandle>() => {
	const ref = useRef<T | null>(null);
	const hoverProps = {
		onMouseEnter: (e: MouseEvent) => handleHover(e, ref),
		onMouseLeave: (e: MouseEvent) => handleHover(e, ref),
	};
	return { ref, hoverProps };
};
