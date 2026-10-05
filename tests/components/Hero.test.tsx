import HeroSection from "@/components/Hero";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock } from "vitest";
import { expectNoA11yViolations } from "../axe";
import { mockClipboard } from "../clipboard";

const NPM = "npm install @animateicons/react";
const SHADCN = "npx shadcn@latest add @animateicons/lu-x";

describe("Hero", () => {
	let writeText: Mock;

	beforeEach(() => {
		writeText = mockClipboard();
	});

	it("has one main heading", () => {
		render(<HeroSection />);
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			/Make Every\s*Icon\s*Move\s*with AnimateIcons/,
		);
	});

	it("shows the npm install command first", () => {
		render(<HeroSection />);
		expect(screen.getByRole("code").textContent).toContain(NPM);
	});

	it("copies the npm install command", async () => {
		render(<HeroSection />);
		fireEvent.click(
			screen.getByRole("button", { name: "Copy install command" }),
		);
		await waitFor(() => expect(writeText).toHaveBeenCalledWith(NPM));
	});

	it("switches to the shadcn command and copies that one", async () => {
		render(<HeroSection />);
		fireEvent.click(
			screen.getByRole("button", { name: "Show shadcn install command" }),
		);
		expect(screen.getByRole("code").textContent).toContain(SHADCN);
		fireEvent.click(
			screen.getByRole("button", { name: "Copy install command" }),
		);
		await waitFor(() => expect(writeText).toHaveBeenCalledWith(SHADCN));
	});

	it("links to the gallery and the docs", () => {
		render(<HeroSection />);
		expect(
			screen
				.getByRole("link", { name: `Browse ${ICON_COUNTS.total} icons` })
				.getAttribute("href"),
		).toBe("/icons/lucide");
		expect(
			screen.getByRole("link", { name: "Documentation" }).getAttribute("href"),
		).toBe("/icons/docs");
	});

	it("has no accessibility violations", async () => {
		const { container } = render(<HeroSection />);
		await expectNoA11yViolations(container);
	});
});
