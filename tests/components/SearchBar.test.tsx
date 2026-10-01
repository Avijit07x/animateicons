import SearchBar from "@/app/icons/_components/navbar/SearchBar";
import { IconSearchProvider } from "@/app/icons/_contexts/IconSearchContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: vi.fn() }),
	usePathname: () => "/icons/huge",
	useSearchParams: () => new URLSearchParams(),
}));

const setup = () => {
	render(
		<IconSearchProvider>
			<SearchBar />
		</IconSearchProvider>,
	);
	return screen.getByRole("textbox") as HTMLInputElement;
};

const hint = (label: string) => screen.getByText(label).parentElement;

describe("SearchBar", () => {
	it("shows the Ctrl and K hints while idle", () => {
		setup();
		expect(hint("Ctrl")?.getAttribute("aria-hidden")).toBe("false");
		expect(hint("K")?.getAttribute("aria-hidden")).toBe("false");
		expect(hint("ESC")?.getAttribute("aria-hidden")).toBe("true");
	});

	it("swaps the hints for Esc on focus and back on blur", async () => {
		const input = setup();

		fireEvent.focus(input);
		expect(hint("ESC")?.getAttribute("aria-hidden")).toBe("false");
		expect(hint("Ctrl")?.getAttribute("aria-hidden")).toBe("true");
		expect(hint("K")?.getAttribute("aria-hidden")).toBe("true");
		await waitFor(() =>
			expect(screen.getByText("ESC").style.opacity).toBe("1"),
		);
		await waitFor(() =>
			expect(screen.getByText("Ctrl").style.opacity).toBe("0"),
		);

		fireEvent.blur(input);
		expect(hint("Ctrl")?.getAttribute("aria-hidden")).toBe("false");
		expect(hint("K")?.getAttribute("aria-hidden")).toBe("false");
		expect(hint("ESC")?.getAttribute("aria-hidden")).toBe("true");
		await waitFor(() =>
			expect(screen.getByText("Ctrl").style.opacity).toBe("1"),
		);
		await waitFor(() =>
			expect(screen.getByText("ESC").style.opacity).toBe("0"),
		);
	});

	it("focuses the input on Ctrl+K", () => {
		const input = setup();
		fireEvent.keyDown(window, { key: "k", ctrlKey: true });
		expect(document.activeElement).toBe(input);
	});

	it("clears the query and blurs the input on Escape", () => {
		const input = setup();
		input.focus();
		fireEvent.change(input, { target: { value: "bell" } });
		expect(input.value).toBe("bell");

		fireEvent.keyDown(window, { key: "Escape" });
		expect(input.value).toBe("");
		expect(document.activeElement).not.toBe(input);
	});
});
