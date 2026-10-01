import InstallCommand from "@/app/icons/_components/navbar/InstallCommand";
import { PackageManagerProvider } from "@/app/icons/_contexts/PackageManagerContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const setup = () =>
	render(
		<PackageManagerProvider>
			<InstallCommand />
		</PackageManagerProvider>,
	);

describe("InstallCommand", () => {
	const writeText = vi.fn(() => Promise.resolve());

	beforeAll(() => {
		globalThis.ResizeObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {}
		};
	});

	beforeEach(() => {
		localStorage.clear();
		writeText.mockClear();
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		});
	});

	it("shows the npm install command by default", () => {
		setup();
		expect(
			screen.getByRole("button", { name: "Copy npm i @animateicons/react" }),
		).toBeTruthy();
	});

	it("follows the saved package manager", () => {
		localStorage.setItem("tab", "bun");
		setup();
		expect(
			screen.getByRole("button", { name: "Copy bun add @animateicons/react" }),
		).toBeTruthy();
	});

	it("copies the command", async () => {
		setup();
		fireEvent.click(
			screen.getByRole("button", { name: "Copy npm i @animateicons/react" }),
		);
		await waitFor(() =>
			expect(writeText).toHaveBeenCalledWith("npm i @animateicons/react"),
		);
	});

	it("lets the visitor pick a package manager from a menu", () => {
		setup();
		fireEvent.keyDown(
			screen.getByRole("button", { name: "Package manager, npm" }),
			{ key: "Enter" },
		);
		expect(
			screen.getAllByRole("menuitemradio").map((item) => item.textContent),
		).toEqual(["npm", "pnpm", "bun"]);
		fireEvent.click(screen.getByRole("menuitemradio", { name: "pnpm" }));
		expect(
			screen.getByRole("button", {
				name: "Copy pnpm add @animateicons/react",
				hidden: true,
			}),
		).toBeTruthy();
		expect(localStorage.getItem("tab")).toBe("pnpm");
	});
});
