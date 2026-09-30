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

const IconsError: React.FC<Props> = ({ error, reset }) => {
	useEffect(() => {
		console.error("[icons] route error", {
			message: error.message,
			digest: error.digest,
		});
	}, [error]);

	return (
		<StatusPage
			icon={Alert02Icon}
			code={
				error.digest ? `Gallery error, ref ${error.digest}` : "Gallery error"
			}
			title="Could not load icons"
			description="Something broke while loading the gallery. Try again, or head back home."
			fullScreen={false}
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
		/>
	);
};

export default IconsError;
