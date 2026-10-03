export const MANAGERS = ["npm", "pnpm", "yarn", "bun"] as const;

export type Manager = (typeof MANAGERS)[number];

export const installCmd: Record<Manager, (pkg: string) => string> = {
	npm: (p) => `npm install ${p}`,
	pnpm: (p) => `pnpm add ${p}`,
	yarn: (p) => `yarn add ${p}`,
	bun: (p) => `bun add ${p}`,
};
