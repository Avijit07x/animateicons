import { beforeAll, describe, expect, it, vi } from "vitest";
import {
	extractIcons,
	type ExtractedIcon,
	type IconSource,
} from "../../scripts/icon-data/extract";
import { loadIconExtractor } from "../../scripts/icon-data/load";

vi.mock("motion/react", () => import("../../scripts/icon-data/recorder"));

type IconModule = Record<string, unknown>;

const iconModules = import.meta.glob("../../icons/*/*-icon.tsx") as Record<
	string,
	() => Promise<IconModule>
>;

const toPascalCase = (name: string) =>
	name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");

async function loadSources(): Promise<IconSource[]> {
	return Promise.all(
		Object.entries(iconModules).map(async ([file, load]) => {
			const [, library, name] =
				/icons\/(lucide|huge)\/(.+)-icon\.tsx$/.exec(file) ?? [];
			const exportName = toPascalCase(name);
			const iconModule = await load();
			return {
				library: library as IconSource["library"],
				name,
				exportName,
				component: iconModule[`${exportName}Icon`] as IconSource["component"],
			};
		}),
	);
}

let icons: ExtractedIcon[] = [];
let errors: string[] = [];
let sourceCount = 0;

const find = (key: string) =>
	icons.find(({ library, name }) => `${library}/${name}` === key);

beforeAll(async () => {
	const sources = await loadSources();
	sourceCount = sources.length;
	({ icons, errors } = extractIcons(sources));
}, 120_000);

describe("icon data for the other frameworks", () => {
	it("turns every React icon into data the player can replay", () => {
		expect(errors).toEqual([]);
		expect(icons).toHaveLength(sourceCount);
		expect(sourceCount).toBeGreaterThan(1000);
	});

	it("copies the shapes and motion that React renders", () => {
		const bell = find("lucide/bell")?.data;
		expect(bell?.style).toEqual({ transformOrigin: "top center" });
		expect(bell?.normal).toEqual({ rotate: 0 });
		expect(bell?.animate).toEqual({
			rotate: [0, -12, 10.2, -6, 3, 0],
			transition: { duration: 1.1, ease: "easeInOut" },
		});
		expect(bell?.children?.[0]).toMatchObject({
			tag: "path",
			attrs: { d: "M10.268 21a2 2 0 0 0 3.464 0" },
		});
	});

	it("leaves parts that React never moves at rest", () => {
		const thumbsDown = find("lucide/thumbs-down");
		expect(thumbsDown?.stillParts).toHaveLength(2);
		const stem = thumbsDown?.data.children?.[0];
		expect(stem?.normal).toBeDefined();
		expect(stem?.animate).toBeUndefined();
	});

	it("names the data after the icon in PascalCase", () => {
		expect(find("huge/arrow-up-right-0-1")?.exportName).toBe("ArrowUpRight01");
	});

	it("gives the same data through the bundle the generator uses", async () => {
		const extractor = await loadIconExtractor();
		const bundled = extractor.extractIcons(extractor.sources);
		expect(bundled.errors).toEqual([]);
		expect(bundled.icons).toHaveLength(icons.length);
		const bundledBell = bundled.icons.find(
			({ library, name }) => library === "lucide" && name === "bell",
		);
		expect(bundledBell?.data).toEqual(find("lucide/bell")?.data);
	}, 60_000);
});
