"use client";

import IconButton from "@/components/IconButton";
import IconLink from "@/components/IconLink";
import StatusPage from "@/components/StatusPage";
import { Alert02Icon } from "@/icons/huge/alert-0-2-icon";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { Refresh01Icon } from "@/icons/huge/refresh-0-1-icon";
import { useEffect } from "react";

type Props = {
	error: Error & { digest?: string };
	reset: () => void;
};

const ErrorPage: React.FC<Props> = ({ error, reset }) => {
	useEffect(() => {
		console.error("[app] route error", {
			message: error.message,
			digest: error.digest,
		});
	}, [error]);

	return (
		<StatusPage
			icon={Alert02Icon}
			code={error.digest ? `Error 500, ref ${error.digest}` : "Error 500"}
			title="Something went wrong"
			description="An unexpected error stopped this page from loading. Try again, or head back home."
			actions={
				<>
					<IconButton
						icon={Refresh01Icon}
						variant="default"
						size="pill"
						onClick={reset}
					>
						Try again
					</IconButton>
					<IconLink
						href="/"
						icon={ArrowRight02Icon}
						variant="secondary"
						size="pill"
					>
						Go home
					</IconLink>
				</>
			}
		>
			{process.env.NODE_ENV === "development" && (
				<div className="bg-surfaceElevated w-full rounded-xl px-4 py-3 text-left">
					<p className="text-textMuted text-xs font-medium">Debug</p>
					<p className="text-textSecondary mt-1 font-mono text-xs break-all">
						{error.message}
					</p>
				</div>
			)}
		</StatusPage>
	);
};

export default ErrorPage;
