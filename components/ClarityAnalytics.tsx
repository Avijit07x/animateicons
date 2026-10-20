"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

const FIRST_INTERACTION = [
	"pointerdown",
	"pointermove",
	"keydown",
	"scroll",
	"touchstart",
] as const;

export function ClarityAnalytics() {
	useEffect(() => {
		if (!PROJECT_ID) return;
		const id = PROJECT_ID;
		const start = () => {
			stop();
			Clarity.init(id);
		};
		const stop = () => {
			for (const event of FIRST_INTERACTION) {
				window.removeEventListener(event, start);
			}
		};
		for (const event of FIRST_INTERACTION) {
			window.addEventListener(event, start, { once: true, passive: true });
		}
		return stop;
	}, []);
	return null;
}
