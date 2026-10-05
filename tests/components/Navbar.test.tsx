import { CommandSearchProvider } from "@/components/command-search/CommandSearchProvider";
import Navbar from "@/components/Navbar";
import { fetchStars } from "@/lib/github/stars";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../axe";

vi.mock("@/lib/github/stars", () => ({ fetchStars: vi.fn() }));
vi.mock("@/components/command-search/CommandSearch", () => ({
	default: () => null,
}));

const setup = async (stars: number | null) => {
	vi.mocked(fetchStars).mockResolvedValue(stars);
	return render(
		<CommandSearchProvider>{await Navbar()}</CommandSearchProvider>,
	);
};

describe("Navbar", () => {
	it("links the logo to the home page", async () => {
		await setup(null);
		expect(
			screen.getByRole("link", { name: "AnimateIcons" }).getAttribute("href"),
		).toBe("/");
	});

	it("links to the icon gallery and the docs", async () => {
		await setup(null);
		expect(
			screen.getByRole("link", { name: "Icons" }).getAttribute("href"),
		).toBe("/icons/lucide");
		expect(
			screen.getByRole("link", { name: "Docs" }).getAttribute("href"),
		).toBe("/icons/docs");
	});

	it("has a search button and a sponsor link", async () => {
		await setup(null);
		expect(screen.getByRole("button", { name: "Search icons" })).toBeTruthy();
		expect(
			screen.getByRole("link", { name: /sponsor/i }).getAttribute("href"),
		).toBe("/sponsors");
	});

	it("shows the star counter when the star count is known", async () => {
		await setup(1280);
		expect(screen.getByRole("link", { name: "GitHub" }).textContent).not.toBe(
			"",
		);
	});

	it("leaves the star counter out when the star count is unavailable", async () => {
		await setup(null);
		const github = screen.getByRole("link", { name: "GitHub" });
		expect(github.getAttribute("href")).toContain("github.com");
		expect(github.textContent).toBe("");
	});

	it.each([1280, null])(
		"has no accessibility violations when stars is %s",
		async (stars) => {
			const { container } = await setup(stars);
			await expectNoA11yViolations(container);
		},
	);
});
