import { iconNameToComponent } from "@/utils/iconNameToComponent";
import { describe, expect, it } from "vitest";

describe("iconNameToComponent", () => {
	it("turns a kebab-case name into the component name", () => {
		expect(iconNameToComponent("bell-ring")).toBe("BellRingIcon");
	});

	it("keeps numeric parts", () => {
		expect(iconNameToComponent("home-0-1")).toBe("Home01Icon");
	});

	it("handles a single word", () => {
		expect(iconNameToComponent("heart")).toBe("HeartIcon");
	});
});
