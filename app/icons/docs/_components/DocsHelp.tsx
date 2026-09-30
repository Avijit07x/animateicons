import IconLink from "@/components/IconLink";
import { Bug01Icon } from "@/icons/huge/bug-0-1-icon";
import { TwitterIcon } from "@/icons/huge/twitter-icon";
import { NEW_ISSUE_URL, TWITTER_URL } from "../_lib/links";

const DocsHelp = () => (
	<div className="bg-surface mt-3 flex flex-col items-start justify-between gap-4 rounded-3xl p-5 sm:flex-row sm:items-center">
		<div>
			<p className="text-textPrimary text-sm font-semibold">Need a hand?</p>
			<p className="text-textMuted mt-1 text-sm">
				Open an issue on GitHub or reach out on Twitter, we&apos;re happy to
				help.
			</p>
		</div>
		<div className="flex shrink-0 gap-2">
			<IconLink
				href={NEW_ISSUE_URL}
				target="_blank"
				rel="noopener noreferrer"
				icon={Bug01Icon}
				variant="secondary"
				size="pill"
			>
				Open an issue
			</IconLink>
			<IconLink
				href={TWITTER_URL}
				target="_blank"
				rel="noopener noreferrer"
				icon={TwitterIcon}
				variant="secondary"
				size="pill"
			>
				Twitter
			</IconLink>
		</div>
	</div>
);

export default DocsHelp;
