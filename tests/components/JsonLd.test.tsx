/**
 * Tests for the JsonLd component — emits the AnimateIcons site's
 * structured-data <script> blocks (Organization + WebSite +
 * SearchAction + per-library SoftwareSourceCode).
 */

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import JsonLd from "@/components/JsonLd";

describe("JsonLd", () => {
	it("emits a script tag with application/ld+json type", () => {
		const { container } = render(<JsonLd data={{ "@type": "WebSite" }} />);
		const script = container.querySelector(
			'script[type="application/ld+json"]',
		);
		expect(script).not.toBeNull();
	});

	it("serializes the data argument", () => {
		const { container } = render(
			<JsonLd data={{ "@type": "WebSite", name: "Demo" }} />,
		);
		const script = container.querySelector("script");
		expect(script?.innerHTML).toContain('"name":"Demo"');
		expect(script?.innerHTML).toContain('"@type":"WebSite"');
	});

	it("escapes < to prevent script-tag breakout", () => {
		const { container } = render(
			<JsonLd data={{ payload: "</script><script>alert(1)</script>" }} />,
		);
		const script = container.querySelector("script");
		// `<` must be escaped as < so the inner content can't terminate
		// the surrounding <script> tag.
		expect(script?.innerHTML).not.toContain("</script>");
		expect(script?.innerHTML).toContain("\\u003c");
	});

	it("accepts an array payload (for @graph-style schemas)", () => {
		const { container } = render(
			<JsonLd data={[{ "@type": "Organization" }, { "@type": "WebSite" }]} />,
		);
		const script = container.querySelector("script");
		expect(script?.innerHTML).toContain("Organization");
		expect(script?.innerHTML).toContain("WebSite");
	});
});
