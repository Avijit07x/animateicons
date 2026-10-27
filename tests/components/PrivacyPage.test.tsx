import PrivacyPage from "@/app/privacy/page";
import { PRIVACY_SECTIONS } from "@/components/privacy/sections";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/LaunchBanner", () => ({ default: () => null }));

describe("Privacy page", () => {
	it("gives every section its own heading", () => {
		render(<PrivacyPage />);
		expect(
			screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
		).toEqual(PRIVACY_SECTIONS.map((section) => section.title));
	});

	it("says the site has no forms", () => {
		render(<PrivacyPage />);
		expect(screen.getByText(/no forms/)).toBeInTheDocument();
		expect(screen.queryByText(/Request an icon/)).toBeNull();
	});

	it("explains how long old icon requests are kept", () => {
		render(<PrivacyPage />);
		expect(screen.getByText(/up to 12 months/)).toBeInTheDocument();
	});

	it("sends data questions to X", () => {
		render(<PrivacyPage />);
		expect(screen.getByRole("link", { name: "@avijit07x" })).toHaveAttribute(
			"href",
			"https://x.com/avijit07x",
		);
	});
});
