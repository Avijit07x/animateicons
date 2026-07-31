"use client";

import Clarity from "@microsoft/clarity";
import { useEffect } from "react";

const PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

/**
 * Loads Microsoft Clarity on the client. No-op unless
 * NEXT_PUBLIC_CLARITY_PROJECT_ID is set, so it's safe to commit and only runs
 * where the env var is configured (e.g. Vercel production/preview).
 */
export function ClarityAnalytics() {
	useEffect(() => {
		if (PROJECT_ID) Clarity.init(PROJECT_ID);
	}, []);
	return null;
}
