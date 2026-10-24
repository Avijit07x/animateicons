import { useAnimate, useReducedMotion } from "motion/react";
import {
	useEffect,
	useEffectEvent,
	useId,
	useRef,
	useState,
	type FocusEvent,
	type PointerEvent,
} from "react";
import {
	CLOSE_DURATION,
	LANDED_AFTER,
	RETURN_AFTER,
	collectParts,
	playClose,
	playEnter,
	playOpen,
	playQr,
	playReturn,
	playSpread,
	type Run,
} from "./choreography";
import { measure } from "./geometry";
import type { Geometry, Stage } from "./types";

export const useSponsorCards = () => {
	const [scope, animate] = useAnimate<HTMLDivElement>();
	const reduce = useReducedMotion();
	const [stage, setStage] = useState<Stage>("enter");
	const [geometry, setGeometry] = useState<Geometry | null>(null);
	const [landed, setLanded] = useState(false);
	const [qrShift, setQrShift] = useState(0);
	const panelId = useId();
	const triggerRef = useRef<HTMLButtonElement>(null);
	const closeRef = useRef<HTMLButtonElement>(null);
	const open = stage === "open";
	const closing = stage === "closed";

	const run: Run = (target, keyframes, options) => {
		animate(target, keyframes, reduce ? { duration: 0 } : options);
	};
	const parts = () => collectParts(scope.current);

	const show = () => {
		const current = parts();
		const next = measure(current.anchor, current.content, current.chips);
		setGeometry(next);
		setLanded(false);
		setQrShift(0);
		setStage("open");
		playOpen(run, current, next);
	};

	const close = () => {
		setLanded(false);
		setQrShift(0);
		setStage("closed");
		playClose(run, parts());
	};

	const toggleQr = () => {
		if (!geometry) return;
		const current = parts();
		const extra = qrShift ? 0 : current.revealInner.scrollHeight;
		setQrShift(extra);
		playQr(run, current, geometry, extra);
	};

	const spread = (on: boolean) => {
		if (open || closing) return;
		setStage(on ? "hover" : "rest");
		playSpread(run, parts(), on);
	};

	const enter = useEffectEvent(() => playEnter(run, parts()));
	const land = useEffectEvent(() => setLanded(true));
	const returnCards = useEffectEvent(() => playReturn(run, parts()));
	const onEscape = useEffectEvent(close);

	const settle = useEffectEvent(() => {
		const trigger = triggerRef.current;
		if (!trigger) return;
		trigger.focus({ preventScroll: true });
		const hovered = trigger.matches(":hover, :focus-visible");
		setStage(hovered ? "hover" : "rest");
		if (hovered) playSpread(run, parts(), true);
	});

	useEffect(() => {
		enter();
	}, []);

	useEffect(() => {
		if (!open) return;
		closeRef.current?.focus({ preventScroll: true });
		const timer = setTimeout(land, reduce ? 0 : LANDED_AFTER * 1000);
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onEscape();
		};
		document.addEventListener("keydown", onKeyDown);
		return () => {
			clearTimeout(timer);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open, reduce]);

	useEffect(() => {
		if (!closing) return;
		const back = setTimeout(returnCards, reduce ? 0 : RETURN_AFTER * 1000);
		const done = setTimeout(settle, reduce ? 0 : CLOSE_DURATION * 1000);
		return () => {
			clearTimeout(back);
			clearTimeout(done);
		};
	}, [closing, reduce]);

	const triggerProps = {
		ref: triggerRef,
		"aria-expanded": open,
		"aria-controls": panelId,
		onClick: open ? close : show,
		onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => {
			if (event.pointerType === "mouse") spread(true);
		},
		onPointerLeave: (event: PointerEvent<HTMLButtonElement>) => {
			if (event.pointerType === "mouse") spread(false);
		},
		onFocus: (event: FocusEvent<HTMLButtonElement>) => {
			if (event.currentTarget.matches(":focus-visible")) spread(true);
		},
		onBlur: () => spread(false),
	};

	return {
		scope,
		stage,
		open,
		raised: open || closing,
		geometry,
		landed,
		qrShift,
		panelId,
		closeRef,
		close,
		toggleQr,
		triggerProps,
	};
};
