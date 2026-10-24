import SponsorCards from "@/components/sponsor-cards/SponsorCards";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

const renderStack = async () => {
	await act(async () => {
		render(<SponsorCards stars={Promise.resolve(1447)} />);
	});
	return screen.getByRole("button", { name: "Sponsor AnimateIcons" });
};

describe("SponsorCards", () => {
	it("starts closed with the panel out of reach", async () => {
		const trigger = await renderStack();
		expect(trigger).toHaveAttribute("aria-expanded", "false");
		expect(
			document.getElementById(trigger.getAttribute("aria-controls") ?? ""),
		).toHaveAttribute("inert");
	});

	it("opens the panel and moves focus to its close button", async () => {
		const trigger = await renderStack();
		await act(async () => {
			fireEvent.click(trigger);
		});
		expect(trigger).toHaveAttribute("aria-expanded", "true");
		expect(
			screen.getByRole("dialog", { name: "Keep AnimateIcons free" }),
		).not.toHaveAttribute("inert");
		expect(document.activeElement).toBe(
			screen.getByRole("button", { name: "Close sponsor options" }),
		);
	});

	it("closes with Escape", async () => {
		const trigger = await renderStack();
		await act(async () => {
			fireEvent.click(trigger);
		});
		await act(async () => {
			fireEvent.keyDown(document, { key: "Escape" });
		});
		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	it("closes from the close button", async () => {
		const trigger = await renderStack();
		await act(async () => {
			fireEvent.click(trigger);
		});
		await act(async () => {
			fireEvent.click(
				screen.getByRole("button", { name: "Close sponsor options" }),
			);
		});
		expect(trigger).toHaveAttribute("aria-expanded", "false");
	});
});
