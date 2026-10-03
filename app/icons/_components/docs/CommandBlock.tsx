import { codeToHtml } from "shiki";
import CommandTabs from "./CommandTabs";
import { MANAGERS, installCmd, type Manager } from "./install-commands";

type Props = {
	pkg?: string;
	commands?: Partial<Record<Manager, string>>;
	title?: string;
};

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
