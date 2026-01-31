type AnimatableHandle = {
	startAnimation: () => void;
	stopAnimation: () => void;
};

const handleHover = <T extends AnimatableHandle>(
	e: React.MouseEvent,
	ref: React.RefObject<T | null>,
) => {
	if (e.type === "mouseenter") {
		ref.current?.startAnimation();
	}

	if (e.type === "mouseleave") {
		ref.current?.stopAnimation();
	}
};

export default handleHover;
