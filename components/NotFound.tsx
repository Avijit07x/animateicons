"use client";

import IconLink from "@/components/IconLink";
import StatusPage from "@/components/StatusPage";
import { ArrowRight02Icon } from "@/icons/huge/arrow-right-0-2-icon";
import { Compass01Icon } from "@/icons/huge/compass-0-1-icon";

export default function NotFound() {
	return (
		<StatusPage
			icon={Compass01Icon}
			code="Error 404"
			title="This page moved"
			description="The link may be broken, or the page may no longer exist. Head home or browse the icons."
			actions={
				<>
					<IconLink
						href="/"
						icon={ArrowRight02Icon}
						variant="default"
						size="pill"
					>
						Go home
					</IconLink>
					<IconLink
						href="/icons/lucide"
						prefetch={false}
						icon={ArrowRight02Icon}
						variant="secondary"
						size="pill"
					>
						Browse icons
					</IconLink>
				</>
			}
		/>
	);
}
