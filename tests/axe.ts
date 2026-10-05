import axe from "axe-core";
import { expect } from "vitest";

export const expectNoA11yViolations = async (container: Element) => {
	const { violations } = await axe.run(container, {
		rules: {
			"color-contrast": { enabled: false },
			region: { enabled: false },
		},
	});
	expect(
		violations.map(({ id, help, nodes }) => ({
			id,
			help,
			targets: nodes.map((node) => node.target.join(" ")),
		})),
	).toEqual([]);
};
