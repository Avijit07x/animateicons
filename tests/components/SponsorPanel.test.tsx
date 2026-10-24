import SponsorPanel from "@/components/sponsor-cards/SponsorPanel";
import { act, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../axe";

type Props = ComponentProps<typeof SponsorPanel>;

const renderPanel = async (props: Partial<Props> = {}) => {
	const onToggleQr = vi.fn();
	let container!: HTMLElement;
	await act(async () => {
		({ container } = render(
			<SponsorPanel
				id="sponsor-panel"
				open
				landed
				qrOpen={false}
				onToggleQr={onToggleQr}
				stars={Promise.resolve(1447)}
				{...props}
			/>,
		));
	});
	return { onToggleQr, container };
};

describe("SponsorPanel", () => {
	it("tells visitors how many developers starred the project", async () => {
		await renderPanel();
		expect(
			(await screen.findByText(/Starred by/)).closest("div")?.textContent,
		).toBe("Starred by 1,447 developers on GitHub");
	});

	it("leaves the star line out when the count is unavailable", async () => {
		await renderPanel({ stars: Promise.resolve(null) });
		expect(screen.queryByText(/Starred by/)).toBeNull();
	});

	it("is a labelled dialog", async () => {
		await renderPanel();
		expect(
			screen.getByRole("dialog", { name: "Keep AnimateIcons free" }),
		).not.toHaveAttribute("inert");
	});

	it("stays out of reach while the stack is closed", async () => {
		const { container } = await renderPanel({ open: false });
		expect(container.querySelector("[role='dialog']")).toHaveAttribute("inert");
	});

	it("sends the main action to GitHub Sponsors in a new tab", async () => {
		await renderPanel();
		const link = screen.getByRole("link", { name: /Sponsor on GitHub/ });
		expect(link).toHaveAttribute(
			"href",
			"https://github.com/sponsors/avijit07x",
		);
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
	});

	it.each([
		["Tip via Buy Me a Coffee", "https://buymeacoffee.com/avijit07x"],
		["Tip via PayPal", "https://paypal.me/avijit07x"],
	])("links the %s chip to %s", async (label, href) => {
		await renderPanel();
		const link = screen.getByRole("link", { name: label });
		expect(link).toHaveAttribute("href", href);
		expect(link).toHaveAttribute("target", "_blank");
	});

	it("keeps the chips invisible until the flying cards land", async () => {
		const { container } = await renderPanel({ landed: false });
		container
			.querySelectorAll("[data-chip]")
			.forEach((chip) => expect(chip).toHaveClass("opacity-0"));
	});

	it("shows the chips once the flying cards land", async () => {
		const { container } = await renderPanel();
		container
			.querySelectorAll("[data-chip]")
			.forEach((chip) => expect(chip).not.toHaveClass("opacity-0"));
	});

	it("asks to open the UPI QR code from its chip", async () => {
		const { onToggleQr } = await renderPanel();
		const chip = screen.getByRole("button", { name: "Show UPI QR code" });
		expect(chip).toHaveAttribute("aria-expanded", "false");
		fireEvent.click(chip);
		expect(onToggleQr).toHaveBeenCalledOnce();
	});

	it("keeps the UPI details out of reach until the QR code is open", async () => {
		const { container } = await renderPanel();
		expect(container.querySelector("[data-reveal-inner]")).toHaveAttribute(
			"inert",
		);
	});

	it("shows the QR code and copies the UPI ID", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		});
		await renderPanel({ qrOpen: true });
		expect(
			screen.getByRole("button", { name: "Show UPI QR code" }),
		).toHaveAttribute("aria-expanded", "true");
		expect(
			screen.getByRole("img", { name: "UPI QR code for avijit07x@axl" }),
		).toBeInTheDocument();

		await act(async () => {
			fireEvent.click(screen.getByRole("button", { name: "Copy UPI ID" }));
		});
		expect(writeText).toHaveBeenCalledWith("avijit07x@axl");
		expect(await screen.findByText("Copied")).toBeInTheDocument();
	});

	it("has no accessibility violations when open", async () => {
		const { container } = await renderPanel({ qrOpen: true });
		await screen.findByText(/Starred by/);
		await expectNoA11yViolations(container);
	});
});
