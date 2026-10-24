import { execFileSync } from "node:child_process";
import type { IconChange, Library } from "./types";

const ICON_FILE = /^icons\/(lucide|huge)\/(.+)-icon\.tsx$/;

const git = (...args: string[]) =>
	execFileSync("git", args, { encoding: "utf8" });

const parseStatusLine = (line: string): IconChange[] => {
	const [index, worktree] = line;
	const status = line.slice(0, 2);
	const match = line.slice(3).split(" -> ").at(-1)?.match(ICON_FILE);
	if (!match || status.includes("D")) return [];
	return [
		{
			library: match[1] as Library,
			name: match[2],
			isNew: status === "??" || index === "A",
			staged: index !== " " && index !== "?",
			unstaged: worktree !== " ",
		},
	];
};

export const readIconChanges = (): IconChange[] =>
	git("status", "--porcelain", "--untracked-files=all", "--", "icons")
		.split("\n")
		.flatMap(parseStatusLine);

export const readBranch = (): string =>
	git("rev-parse", "--abbrev-ref", "HEAD").trim();
