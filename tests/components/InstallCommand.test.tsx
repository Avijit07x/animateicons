import InstallCommand from "@/app/icons/_components/navbar/InstallCommand";
import { DistributionProvider } from "@/app/icons/_contexts/DistributionContext";
import { PackageManagerProvider } from "@/app/icons/_contexts/PackageManagerContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const setup = () =>
	render(
		<DistributionProvider>
			<PackageManagerProvider>
				<InstallCommand />
			</PackageManagerProvider>
		</DistributionProvider>,
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

	it("follows the chosen framework", () => {
		localStorage.setItem("distribution", "angular");
		localStorage.setItem("tab", "pnpm");
		setup();
		expect(
			screen.getByRole("button", {
				name: "Copy pnpm add @animateicons/angular",
			}),
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
