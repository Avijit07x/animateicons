import Playground from "@/components/home/Playground";
import { PLAYGROUND_NAMES } from "@/components/home/showcase-icons";
import { iconNameToComponent } from "@/utils/iconNameToComponent";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock } from "vitest";
import { expectNoA11yViolations } from "../axe";
import { mockClipboard } from "../clipboard";

const [FIRST, SECOND] = PLAYGROUND_NAMES;
const usage = (name: string, size = 112, color = "#f45b48", duration = 1) =>
	`<${iconNameToComponent(name)} size={${size}} color="${color}" duration={${duration}} />`;

const code = () => screen.getByRole("code").textContent;
const resetButton = () => screen.getByRole("button", { name: "Reset" });

describe("Playground", () => {
	let writeText: Mock;

	beforeEach(() => {
		writeText = mockClipboard();
	});

	it("starts with the first icon and the default settings", () => {
		render(<Playground />);
		expect(code()).toBe(usage(FIRST));
		expect(
			screen.getByRole("button", { name: FIRST }).getAttribute("aria-pressed"),
		).toBe("true");
		expect(resetButton()).toBeDisabled();
	});

	it("switches the snippet to the icon that was picked", () => {
		render(<Playground />);
		fireEvent.click(screen.getByRole("button", { name: SECOND }));
		expect(code()).toBe(usage(SECOND));
		expect(
			screen.getByRole("button", { name: SECOND }).getAttribute("aria-pressed"),
		).toBe("true");
		expect(
			screen.getByRole("button", { name: FIRST }).getAttribute("aria-pressed"),
		).toBe("false");
	});

	it("writes the size, color and duration into the snippet", () => {
		render(<Playground />);
		fireEvent.change(screen.getByLabelText(/^size/i), {
			target: { value: "64" },
		});
		fireEvent.change(screen.getByLabelText(/^duration/i), {
			target: { value: "1.5" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Use #38bdf8" }));
		expect(code()).toBe(usage(FIRST, 64, "#38bdf8", 1.5));
	});

	it("resets the settings and disables the reset button again", () => {
		render(<Playground />);
		fireEvent.change(screen.getByLabelText(/^size/i), {
			target: { value: "64" },
		});
		expect(resetButton()).toBeEnabled();
		fireEvent.click(resetButton());
		expect(code()).toBe(usage(FIRST));
		expect(resetButton()).toBeDisabled();
	});

	it("copies the import line together with the snippet", async () => {
		render(<Playground />);
		fireEvent.click(screen.getByRole("button", { name: "Copy code" }));
		await waitFor(() =>
			expect(writeText).toHaveBeenCalledWith(
				`import { ${iconNameToComponent(FIRST)} } from "@animateicons/react/huge";\n\n${usage(FIRST)}`,
			),
		);
	});

	it("has no accessibility violations", async () => {
		const { container } = render(<Playground />);
		await expectNoA11yViolations(container);
	});
});
