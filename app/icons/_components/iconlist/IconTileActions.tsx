"use client";

import { getIconCode } from "@/actions/getIconCode";
import { V0Icon } from "@/components/icons/V0Icon";
import { CheckIcon, type CheckIconHandle } from "@/icons/huge/check-icon";
import { CopyIcon } from "@/icons/huge/copy-icon";
import { Loading01Icon } from "@/icons/huge/loading-0-1-icon";
import { PackageDeliveredIcon } from "@/icons/huge/package-delivered-icon";
import { TerminalIcon } from "@/icons/huge/terminal-icon";
import { useIconHover } from "@/npm/src/lib/use-icon-hover";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
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
	shadcnAddCommand,
	usePackageManager,
} from "../../_contexts/PackageManagerContext";
import IconAction from "./IconAction";

type Props = {
	tileId: string;
	library: IconLibrary;
	prefix: IconLibraryPrefix;
	name: string;
};

const codeCache = new Map<string, string>();

const pillVariants: Variants = {
	hidden: {
		backgroundColor: "rgba(255,255,255,0)",
		transition: { duration: 0.15 },
	},
	show: {
		backgroundColor: "rgba(255,255,255,0.08)",
		transition: { duration: 0.3, staggerChildren: 0.06, delayChildren: 0.04 },
	},
};

const triggerConfig = [
	{ icon: "install", trigger: "hover" },
	{ icon: "copyCode", trigger: "hover" },
	{ icon: "v0", trigger: "hover" },
] as const;

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

	const {
		icon: { install, copyCode, v0 },
		trigger,
	} = useIconHover({ trigger: triggerConfig });
	const checkRef = useRef<CheckIconHandle>(null);

	const copyInstallSnippet = async () => {
		const payload =
			distribution === "npm"
				? npmImportLine(name, library as "lucide" | "huge")
				: shadcnAddCommand(packageManager, prefix, name);

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
	const justCopied = isCopied || isCopiedCli;

	useEffect(() => {
		if (!justCopied) return;
		const id = requestAnimationFrame(() => checkRef.current?.startAnimation());
		return () => cancelAnimationFrame(id);
	}, [justCopied]);

	return (
		<motion.div
			initial="hidden"
			animate="show"
			exit="hidden"
			onClick={(e) => e.stopPropagation()}
			className="absolute inset-x-0 bottom-4 flex justify-center pointer-coarse:bottom-3"
		>
			<motion.div
				variants={pillVariants}
				className="flex items-center gap-0.5 rounded-full p-0.5 pointer-coarse:gap-1 pointer-coarse:p-1"
			>
				<IconAction
					tooltip={isNpm ? "copy npm import" : "copy shadcn/cli command"}
					ariaLabel={
						isCopiedCli
							? "Copied"
							: isNpm
								? "Copy npm import"
								: "Copy CLI Command"
					}
					triggerProps={trigger}
					onClick={copyInstallSnippet}
				>
					{isCopiedCli ? (
						<CheckIcon size={14} ref={checkRef} />
					) : isNpm ? (
						<PackageDeliveredIcon size={14} {...install} />
					) : (
						<TerminalIcon size={14} {...install} />
					)}
				</IconAction>

				<IconAction
					tooltip="copy code"
					ariaLabel={isCopied ? "Code Copied" : "Copy JSX Code"}
					triggerProps={trigger}
					onClick={copyToClipboard}
				>
					{isCopied ? (
						<CheckIcon size={14} ref={checkRef} />
					) : isLoading ? (
						<Loading01Icon size={14} className="animate-spin" />
					) : (
						<CopyIcon size={14} {...copyCode} />
					)}
				</IconAction>

				<IconAction
					as="link"
					tooltip="open in v0.dev"
					ariaLabel="Open in v0.dev"
					triggerProps={trigger}
					href={`https://v0.dev/chat/api/open?url=https://animateicons.in/r/${prefix}-${name}.json`}
				>
					<V0Icon size={15} {...v0} />
				</IconAction>
			</motion.div>
		</motion.div>
	);
};

export default IconTileActions;
