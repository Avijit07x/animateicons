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

	const open = () =>
		fireEvent.click(screen.getByRole("button", { name: /^Install/ }));

	it("shows the React package by default", () => {
		setup();
		expect(
			screen.getByRole("button", { name: "Install @animateicons/react" }),
		).toBeTruthy();
	});

	it("follows the chosen framework", () => {
		localStorage.setItem("distribution", "angular");
		setup();
		expect(
			screen.getByRole("button", { name: "Install @animateicons/angular" }),
		).toBeTruthy();
	});

	it("opens a panel with the command for the saved package manager", () => {
		localStorage.setItem("tab", "bun");
		setup();
		open();
		expect(screen.getByText("bun add @animateicons/react")).toBeTruthy();
		expect(
			screen
				.getByRole("button", { name: "React" })
				.getAttribute("aria-pressed"),
		).toBe("true");
	});

	it("switches the framework from the tabs", () => {
		setup();
		open();
		fireEvent.click(screen.getByRole("button", { name: "Vue" }));
		expect(screen.getByText("npm i @animateicons/vue")).toBeTruthy();
		expect(localStorage.getItem("distribution")).toBe("vue");
	});

	it("switches the package manager", () => {
		setup();
		open();
		fireEvent.click(screen.getByRole("button", { name: "pnpm" }));
		expect(screen.getByText("pnpm add @animateicons/react")).toBeTruthy();
		expect(localStorage.getItem("tab")).toBe("pnpm");
	});

	it("copies the command", async () => {
		setup();
		open();
		fireEvent.click(
			screen.getByRole("button", { name: "Copy install command" }),
		);
		await waitFor(() =>
			expect(writeText).toHaveBeenCalledWith("npm i @animateicons/react"),
		);
	});

	it("keeps shadcn when React is picked again", () => {
		localStorage.setItem("distribution", "shadcn");
		setup();
		open();
		fireEvent.click(screen.getByRole("button", { name: "React" }));
		expect(localStorage.getItem("distribution")).toBe("shadcn");
	});
});
