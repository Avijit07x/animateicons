import CopyAsMenu from "@/app/icons/_components/navbar/CopyAsMenu";
import { DistributionProvider } from "@/app/icons/_contexts/DistributionContext";
import { PackageManagerProvider } from "@/app/icons/_contexts/PackageManagerContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

const setup = () =>
	render(
		<DistributionProvider>
			<PackageManagerProvider>
				<CopyAsMenu />
			</PackageManagerProvider>
		</DistributionProvider>,
	);

const openMenu = () => {
	const trigger = screen.getByRole("button", { name: /copy as/i });
	fireEvent.keyDown(trigger, { key: "Enter" });
	return trigger;
};

describe("CopyAsMenu", () => {
	beforeAll(() => {
		globalThis.ResizeObserver = class {
			observe() {}
			unobserve() {}
			disconnect() {}
		};
	});

	beforeEach(() => {
		localStorage.clear();
	});

	it("shows the current choice on the button", () => {
		setup();
		expect(
			screen.getByRole("button", { name: "Copy as shadcn · npm" }),
		).toBeTruthy();
	});

	it("lists both install methods and the package managers for shadcn", () => {
		setup();
		openMenu();
		const radios = screen.getAllByRole("menuitemradio");
		expect(radios.map((r) => r.textContent)).toEqual([
			"shadcn",
			"import",
			"npm",
			"pnpm",
			"bun",
		]);
	});

	it("changes the package manager and keeps the menu open", () => {
		setup();
		openMenu();
		fireEvent.click(screen.getByRole("menuitemradio", { name: "pnpm" }));
		expect(
			screen.getByRole("button", {
				name: "Copy as shadcn · pnpm",
				hidden: true,
			}),
		).toBeTruthy();
		expect(screen.getAllByRole("menuitemradio")).toHaveLength(5);
	});

	it("drops the package managers when import is chosen", async () => {
		setup();
		openMenu();
		fireEvent.click(screen.getByRole("menuitemradio", { name: "import" }));
		expect(
			screen.getByRole("button", { name: "Copy as import", hidden: true }),
		).toBeTruthy();
		await waitFor(() =>
			expect(
				screen.getAllByRole("menuitemradio").map((r) => r.textContent),
			).toEqual(["shadcn", "import"]),
		);
	});

	it("brings the package managers back when shadcn is chosen again", async () => {
		setup();
		openMenu();
		fireEvent.click(screen.getByRole("menuitemradio", { name: "import" }));
		await waitFor(() =>
			expect(screen.getAllByRole("menuitemradio")).toHaveLength(2),
		);
		fireEvent.click(screen.getByRole("menuitemradio", { name: "shadcn" }));
		await waitFor(() =>
			expect(screen.getAllByRole("menuitemradio")).toHaveLength(5),
		);
	});
});
