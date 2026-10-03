import assert from "node:assert/strict";

export const expectError = (
	run: () => unknown,
	type: ErrorConstructor,
	message: string,
): void => {
	let caught: unknown;
	try {
		run();
	} catch (error) {
		caught = error;
	}
	assert.ok(
		caught instanceof type,
		`expected a ${type.name}, got ${String(caught)}`,
	);
	assert.equal((caught as Error).message, message);
};

export const expectErrorEach = (
	cases: readonly (readonly [unknown, string])[],
	run: (bad: unknown) => unknown,
	type: ErrorConstructor,
	message: (shown: string) => string,
): void => {
	for (const [bad, shown] of cases) {
		expectError(() => run(bad), type, message(shown));
	}
};
