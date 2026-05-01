"use client";

/**
 * IconTileActions
 *
 * SRP: render the three action buttons (Copy CLI / Copy JSX code /
 * Open in v0.dev) under one AnimateIcons tile. Owns the side-effect
 * handlers (clipboard writes, fetch the icon's source via the
 * getIconCode server action) and subscribes to IconTileContext via
 * narrow selector hooks.
 *
 * Why this exists as its own component:
 *  - IconTile renders 248 instances on /icons/lucide. With React.memo
 *    on IconTile, parent re-renders don't propagate.
 *  - But useContext does propagate — any IconTile that calls
 *    useContext re-renders on context changes, busting the memo
 *    benefit and forcing all 248 AnimateIcons SVGs to re-render every
 *    time someone clicks "Copy code".
 *  - By isolating the context reads into THIS small component,
 *    IconTile stays fully memoized: only the tiny actions row
 *    re-renders when copy/load state changes, and the heavy
 *    AnimateIcons component (with its motion variants) stays
 *    untouched.
 */

import { getIconCode } from "@/actions/getIconCode";
import { CheckIcon } from "@/components/icons/CheckIcon";
import { V0Icon, type V0IconHandle } from "@/components/icons/V0Icon";
import { CopyIcon, type CopyIconHandle } from "@/icons/lucide/copy-icon";
import {
	PackageOpenIcon,
	type PackageOpenIconHandle,
} from "@/icons/lucide/package-open-icon";
import {
	TerminalIcon,
	type TerminalIconHandle,
} from "@/icons/lucide/terminal-icon";
import { Loader } from "lucide-react";
import { useRef } from "react";
import {
	npmImportLine,
	useDistribution,
} from "../../_contexts/DistributionContext";
import {
	useIconTileDispatch,
	useIsCopiedCli,
	useIsCopiedCode,
	useIsLoading,
} from "../../_contexts/IconTileContext";
import {
	cliCommandFor,
	usePackageManager,
} from "../../_contexts/PackageManagerContext";
import IconAction from "./IconAction";

type Props = {
	tileId: string;
	library: IconLibrary;
	prefix: IconLibraryPrefix;
	name: string;
};

/**
 * In-memory cache of fetched AnimateIcons source strings shared across
 * every action row in the gallery — first "Copy code" click hits the
 * server action, subsequent clicks (any tile, any tab on this page)
 * hit the Map.
 */
const codeCache = new Map<string, string>();

const IconTileActions: React.FC<Props> = ({
	tileId,
	library,
	prefix,
	name,
}) => {
	const isCopied = useIsCopiedCode(tileId);
	const isCopiedCli = useIsCopiedCli(tileId);
	const isLoading = useIsLoading(tileId);
	const { setCopiedCodeId, setCopiedCliId, setLoadingId } =
		useIconTileDispatch();
	const { packageManager } = usePackageManager();
	const { distribution } = useDistribution();

	const cliRef = useRef<TerminalIconHandle>(null);
	const npmRef = useRef<PackageOpenIconHandle>(null);
	const codeRef = useRef<CopyIconHandle>(null);
	const v0Ref = useRef<V0IconHandle>(null);

	const copyInstallSnippet = async () => {
		const payload =
			distribution === "npm"
				? npmImportLine(name, library as "lucide" | "huge")
				: `${cliCommandFor(packageManager)} shadcn@latest add https://animateicons.in/r/${prefix}-${name}.json`;

		await navigator.clipboard.writeText(payload);
		setCopiedCliId(tileId);
		window.setTimeout(() => setCopiedCliId(null), 1500);
	};

	const copyToClipboard = async () => {
		let code = codeCache.get(tileId);

		if (!code) {
			setLoadingId(tileId);
			const fetched = await getIconCode(name, library);
			if (fetched) {
				code = fetched;
				codeCache.set(tileId, code);
			}
			setLoadingId(null);
		}

		if (code) {
			await navigator.clipboard.writeText(code);
			setCopiedCodeId(tileId);
			window.setTimeout(() => setCopiedCodeId(null), 1500);
		}
	};

	const isNpm = distribution === "npm";

	return (
		<div className="mt-2 flex items-center justify-center gap-6">
			<IconAction
				tooltip={isNpm ? "copy npm import" : "copy shadcn/cli command"}
				ariaLabel={
					isCopiedCli
						? "Copied"
						: isNpm
							? "Copy npm import"
							: "Copy CLI Command"
				}
				iconRef={isNpm ? npmRef : cliRef}
				onClick={copyInstallSnippet}
			>
				{isCopiedCli ? (
					<CheckIcon />
				) : isNpm ? (
					<PackageOpenIcon size={18} ref={npmRef} />
				) : (
					<TerminalIcon size={18} ref={cliRef} />
				)}
			</IconAction>

			<IconAction
				tooltip="copy code"
				ariaLabel={isCopied ? "Code Copied" : "Copy JSX Code"}
				iconRef={codeRef}
				onClick={copyToClipboard}
			>
				{isCopied ? (
					<CheckIcon />
				) : isLoading ? (
					<Loader size={17} className="animate-spin" />
				) : (
					<CopyIcon size={17} ref={codeRef} />
				)}
			</IconAction>

			<IconAction
				as="link"
				tooltip="open in v0.dev"
				ariaLabel="Open in v0.dev"
				iconRef={v0Ref}
				href={`https://v0.dev/chat/api/open?url=https://animateicons.in/r/${prefix}-${name}.json`}
			>
				<V0Icon size={22} ref={v0Ref} />
			</IconAction>
		</div>
	);
};

export default IconTileActions;
