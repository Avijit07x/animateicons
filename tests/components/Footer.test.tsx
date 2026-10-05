import Footer from "@/components/Footer";
import { ICON_COUNTS } from "@/lib/icon-count.generated";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectNoA11yViolations } from "../axe";

const footerNav = () =>
	within(screen.getByRole("navigation", { name: "Footer" }));

describe("Footer", () => {
	it.each([
		["Lucide", "/icons/lucide"],
		["Huge", "/icons/huge"],
		["Docs", "/icons/docs"],
		["shadcn", "/icons/docs/shadcn"],
		["CLI", "/icons/docs/cli"],
		["MCP", "/icons/docs/mcp"],
		["Supporters", "/sponsors"],
	])("links %s to %s in the same tab", (label, href) => {
		render(<Footer />);
		const link = footerNav().getByRole("link", { name: label });
		expect(link.getAttribute("href")).toBe(href);
		expect(link.getAttribute("target")).toBeNull();
	});

	it.each([
		["GitHub", "https://github.com/Avijit07x/animateicons"],
		["npm", "https://www.npmjs.com/package/@animateicons/react"],
		["Twitter", "https://twitter.com/avijit07x"],
	])("opens %s in a new tab without leaking the opener", (label, href) => {
		render(<Footer />);
		const link = footerNav().getByRole("link", { name: label });
		expect(link.getAttribute("href")).toBe(href);
		expect(link.getAttribute("target")).toBe("_blank");
		expect(link.getAttribute("rel")).toBe("noopener noreferrer");
	});

	it("invites people to browse the full icon set", () => {
		render(<Footer />);
		expect(
			screen
				.getByRole("link", { name: `Browse ${ICON_COUNTS.total} icons` })
				.getAttribute("href"),
		).toBe("/icons/lucide");
	});

	it("credits the author and the license", () => {
		render(<Footer />);
		expect(
			screen.getByText(/free and open source under the mit license/i),
		).toBeTruthy();
		expect(
			screen.getByRole("link", { name: "Avijit Dey" }).getAttribute("href"),
		).toBe("https://github.com/avijit07x");
	});

	it("has no accessibility violations", async () => {
		const { container } = render(<Footer />);
		await expectNoA11yViolations(container);
	});
});
