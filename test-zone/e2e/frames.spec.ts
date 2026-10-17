import { expect, test } from "@playwright/test";
import type { TestZoneReport } from "../src/app";

const RUN_TIMEOUT = 10 * 60 * 1000;

const passes = [
	{ size: 64, duration: 1, reducedMotion: "no-preference" },
	{ size: 24, duration: 2, reducedMotion: "no-preference" },
	{ size: 64, duration: 1, reducedMotion: "reduce" },
] as const;

for (const { size, duration, reducedMotion } of passes) {
	test(`every framework matches React at ${size}px, ${duration}x speed, reduced motion ${reducedMotion}`, async ({
		page,
	}, testInfo) => {
		test.setTimeout(RUN_TIMEOUT + 60_000);
		await page.emulateMedia({ reducedMotion });
		await page.goto(`/?library=all&size=${size}&duration=${duration}&run=1`);
		await expect(page.locator("html")).toHaveAttribute("data-status", "done", {
			timeout: RUN_TIMEOUT,
		});
		const report = (await page.evaluate(
			() => window.testZoneReport,
		)) as TestZoneReport;
		await testInfo.attach("report", {
			body: JSON.stringify(report, null, "\t"),
			contentType: "application/json",
		});
		expect(report.total).toBeGreaterThan(0);
		expect(
			report.failures,
			report.failures
				.map(
					({ key, framework, detail }) => `${key} in ${framework}: ${detail}`,
				)
				.join("\n"),
		).toEqual([]);
	});
}
