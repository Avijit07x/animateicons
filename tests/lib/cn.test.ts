import { cn } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn", () => {
	it("keeps the colour when it sits next to a project font size", () => {
		expect(cn("text-textMuted font-mono text-ui")).toBe(
			"text-textMuted font-mono text-ui",
		);
		expect(cn("text-textMuted text-2xs")).toBe("text-textMuted text-2xs");
	});

	it("keeps the font size when a colour comes later", () => {
		expect(cn("text-ui font-medium text-textPrimary")).toBe(
			"text-ui font-medium text-textPrimary",
		);
	});

	it("lets a later font size replace an earlier one", () => {
		expect(cn("text-sm text-ui")).toBe("text-ui");
		expect(cn("text-ui text-base")).toBe("text-base");
	});
});
