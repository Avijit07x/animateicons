"use client";

/**
 * Route-level error boundary for the AnimateIcons /icons/* gallery.
 *
 * SRP: catch render-time exceptions from any descendant (an
 * AnimateIcons component bug, a motion/react regression, a malformed
 * search-param state) so the failure is isolated to the gallery route
 * instead of crashing the whole AnimateIcons shell.
 *
 * Next.js conventions:
 *  - Must be a Client Component (`"use client"`).
 *  - Receives `error` (with optional `digest` for log correlation) and
 *    a `reset()` callback that re-renders the gallery segment.
 */

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

type Props = {
	error: Error & { digest?: string };
	reset: () => void;
};

const IconsError: React.FC<Props> = ({ error, reset }) => {
	useEffect(() => {
		// Surface to the console (and any wired-up error reporter) so
		// silent UX failures still leave a trail.
		console.error("[icons] route error", {
			message: error.message,
			digest: error.digest,
		});
	}, [error]);

	return (
		<div className="flex min-h-[60dvh] w-full items-center justify-center px-4 py-16">
			<div className="bg-surfaceElevated border-border/60 max-w-md space-y-4 rounded-2xl border p-6 text-center">
				<h2 className="text-textPrimary text-lg font-semibold">
					Something broke loading icons
				</h2>
				<p className="text-textSecondary text-sm">
					We logged the error. Try again, and if it keeps happening let us know
					on GitHub.
				</p>
				{error.digest ? (
					<p className="text-textMuted font-mono text-xs">
						ref: {error.digest}
					</p>
				) : null}
				<div className="flex flex-wrap justify-center gap-2 pt-2">
					<Button onClick={reset} size="sm">
						Try again
					</Button>
					<Button asChild variant="outline" size="sm">
						<Link href="/">Back home</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default IconsError;
