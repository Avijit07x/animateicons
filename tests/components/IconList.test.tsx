import IconList from "@/app/icons/_components/iconlist/IconList";
import CategoryContextProvider from "@/app/icons/_contexts/CategoryContext";
import { DistributionProvider } from "@/app/icons/_contexts/DistributionContext";
import { IconSearchProvider } from "@/app/icons/_contexts/IconSearchContext";
import { PackageManagerProvider } from "@/app/icons/_contexts/PackageManagerContext";
import { PlaygroundProvider } from "@/app/icons/_contexts/PlaygroundContext";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { expectNoA11yViolations } from "../axe";

const mocks = vi.hoisted(() => {
	const icons = [
		{
			name: "heart",
			keywords: ["love", "like"],
			category: ["Social"],
			addedAt: "2020-01-01",
		},
		{
			name: "bell",
			keywords: ["alert"],
			category: ["Social"],
			addedAt: "2020-01-01",
		},
		{
			name: "folder",
			keywords: ["files"],
			category: ["Files"],
			addedAt: "2020-01-01",
		},
	];
	return {
		icons,
		nav: { pathname: "/icons/huge", params: new URLSearchParams() },
	};
});

vi.mock("next/navigation", () => ({
	useRouter: () => ({ replace: vi.fn() }),
	usePathname: () => mocks.nav.pathname,
	useSearchParams: () => mocks.nav.params,
}));
vi.mock("@/actions/getIconCode", () => ({ getIconCode: vi.fn() }));
vi.mock("@/icons/huge/meta", () => ({ ICON_META: mocks.icons }));
vi.mock("@/icons/huge", () => ({
	ICON_LIST: mocks.icons.map(({ name }) => ({ name, icon: () => null })),
}));

const setup = () =>
	render(
		<CategoryContextProvider>
			<IconSearchProvider>
				<PlaygroundProvider>
					<DistributionProvider>
						<PackageManagerProvider>
							<IconList />
						</PackageManagerProvider>
					</DistributionProvider>
				</PlaygroundProvider>
			</IconSearchProvider>
		</CategoryContextProvider>,
	);

const findGrid = () => screen.findByRole("group", { name: "Icons" });

describe("IconList", () => {
	beforeEach(() => {
		mocks.nav.pathname = "/icons/huge";
		mocks.nav.params = new URLSearchParams();
	});

	it("shows no icon grid until the library has loaded", async () => {
		setup();
		expect(screen.queryByRole("group", { name: "Icons" })).toBeNull();
		await findGrid();
	});

	it("labels the grid and puts one tile per icon inside it", async () => {
		setup();
		const grid = await findGrid();
		for (const { name } of mocks.icons) {
			expect(within(grid).getByRole("group", { name })).toBeTruthy();
		}
		expect(within(grid).getAllByRole("group")).toHaveLength(mocks.icons.length);
	});

	it("keeps only the icons that match the search in the address", async () => {
		mocks.nav.params = new URLSearchParams("q=heart");
		setup();
		const grid = await findGrid();
		expect(within(grid).getByRole("group", { name: "heart" })).toBeTruthy();
		expect(within(grid).queryByRole("group", { name: "bell" })).toBeNull();
		expect(within(grid).queryByRole("group", { name: "folder" })).toBeNull();
	});

	it("says so when nothing matches the search", async () => {
		mocks.nav.params = new URLSearchParams("q=zzzzzzzz");
		setup();
		expect(
			await screen.findByRole("heading", { name: /no icons found/i }),
		).toBeTruthy();
		expect(screen.queryByRole("group", { name: "Icons" })).toBeNull();
	});

	it("asks for a library when the address has none", () => {
		mocks.nav.pathname = "/icons";
		setup();
		expect(
			screen.getByRole("heading", { name: /choose an icon library/i }),
		).toBeTruthy();
	});

	it("has no accessibility violations", async () => {
		const { container } = setup();
		await findGrid();
		await expectNoA11yViolations(container);
	});
});
