import IconTile from "@/app/icons/_components/iconlist/IconTile";
import { DistributionProvider } from "@/app/icons/_contexts/DistributionContext";
import { PackageManagerProvider } from "@/app/icons/_contexts/PackageManagerContext";
import { PlaygroundProvider } from "@/app/icons/_contexts/PlaygroundContext";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ usePathname: () => "/icons/huge" }));
vi.mock("@/actions/getIconCode", () => ({ getIconCode: vi.fn() }));

const Icon = () => <svg data-testid="icon" />;

const item = {
	name: "heart-add",
	keywords: [],
	category: "all",
	addedAt: "2026-01-01",
	isNew: false,
	isUpdated: false,
} as never;

const setup = () =>
	render(
		<PlaygroundProvider>
			<DistributionProvider>
				<PackageManagerProvider>
					<IconTile item={item} getIcon={() => Icon} />
				</PackageManagerProvider>
			</DistributionProvider>
		</PlaygroundProvider>,
	);

describe("IconTile", () => {
	it("shows no actions until the pointer is on the tile", () => {
		setup();
		expect(
			screen.queryByRole("button", { name: /open heart-add/i }),
		).toBeNull();
	});

	it("reveals the actions on hover", () => {
		setup();
		fireEvent.mouseEnter(screen.getByRole("group", { name: "heart-add" }));
		expect(
			screen.getByRole("button", { name: /open heart-add/i }),
		).toBeTruthy();
	});

	it("reveals the actions when the pointer moves over a tile that never got a hover event", () => {
		setup();
		fireEvent.mouseMove(screen.getByRole("group", { name: "heart-add" }));
		expect(
			screen.getByRole("button", { name: /open heart-add/i }),
		).toBeTruthy();
	});

	it("copies the import for the chosen framework", async () => {
		const writeText = vi.fn(() => Promise.resolve());
		Object.defineProperty(navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		});
		localStorage.setItem("distribution", "vue");
		setup();
		fireEvent.mouseEnter(screen.getByRole("group", { name: "heart-add" }));
		fireEvent.click(screen.getByRole("button", { name: "Copy Vue import" }));
		await waitFor(() =>
			expect(writeText).toHaveBeenCalledWith(
				'import { HeartAddIcon } from "@animateicons/vue/huge";',
			),
		);
		localStorage.clear();
	});

	it("hides the actions again when the pointer leaves", async () => {
		setup();
		const tile = screen.getByRole("group", { name: "heart-add" });
		fireEvent.mouseMove(tile);
		fireEvent.mouseLeave(tile);
		await vi.waitFor(() =>
			expect(
				screen.queryByRole("button", { name: /open heart-add/i }),
			).toBeNull(),
		);
	});
});
