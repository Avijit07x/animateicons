import SkipLink, { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../axe";

describe("SkipLink", () => {
	it("points at the main content id", () => {
		render(<SkipLink />);
		expect(
			screen
				.getByRole("link", { name: "Skip to content" })
				.getAttribute("href"),
		).toBe(`#${MAIN_CONTENT_ID}`);
	});

	it("is the first link a keyboard user reaches", () => {
		render(
			<>
				<SkipLink />
				<a href="/other">Other</a>
			</>,
		);
		expect(screen.getAllByRole("link")[0]).toHaveTextContent("Skip to content");
	});

	it("has no accessibility violations", async () => {
		const { container } = render(
			<>
				<SkipLink />
				<main id={MAIN_CONTENT_ID}>Content</main>
			</>,
		);
		await expectNoA11yViolations(container);
	});
});
