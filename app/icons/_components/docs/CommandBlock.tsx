import { codeToHtml } from "shiki";
import CommandTabs from "./CommandTabs";

const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;
type Manager = (typeof MANAGERS)[number];

/** Install command per package manager for a given package name. */
const installCmd: Record<Manager, (pkg: string) => string> = {
	npm: (p) => `npm install ${p}`,
	pnpm: (p) => `pnpm add ${p}`,
	yarn: (p) => `yarn add ${p}`,
	bun: (p) => `bun add ${p}`,
};

type Props = {
	/** Install-style: derive `npm install` / `pnpm add` / … from a package. */
	pkg?: string;
	/** Or supply explicit commands per manager (e.g. dlx/npx variants). */
	commands?: Partial<Record<Manager, string>>;
	title?: string;
};

/**
 * Server half of the package-manager command block: highlights every manager's
 * command with Shiki, then hands them to CommandTabs for client-side switching.
 */
const CommandBlock = async ({ pkg, commands, title = "Terminal" }: Props) => {
	const map: Partial<Record<Manager, string>> = pkg
		? Object.fromEntries(MANAGERS.map((m) => [m, installCmd[m](pkg)]))
		: (commands ?? {});

	const items = await Promise.all(
		MANAGERS.filter((m) => map[m]).map(async (m) => ({
			manager: m,
			code: map[m] as string,
			html: await codeToHtml(map[m] as string, {
				lang: "bash",
				theme: "github-dark-default",
			}),
		})),
	);

	return <CommandTabs title={title} items={items} />;
};

export default CommandBlock;
