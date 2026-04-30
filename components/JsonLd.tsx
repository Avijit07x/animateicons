/**
 * JsonLd
 *
 * SRP: render a single <script type="application/ld+json"> block for the
 * AnimateIcons site. Used by the root layout (Organization + WebSite +
 * SearchAction schemas) and the per-library page (SoftwareSourceCode
 * schema) so search engines can attach AnimateIcons icons to their
 * source repository, license, and runtime requirements.
 *
 * The payload is hardened against `</script>` injection — defensive
 * even though every payload here is build-time constant, so a future
 * field that pulls from user content stays safe.
 *
 * Server component — emitted as static markup, zero runtime cost.
 */

type Props = {
	data: Record<string, unknown> | Record<string, unknown>[];
};

const JsonLd: React.FC<Props> = ({ data }) => {
	// Escape `<` to prevent any nested string from breaking out of the
	// <script> tag. JSON spec allows the literal character, but in HTML
	// context it can prematurely close the tag.
	const json = JSON.stringify(data).replace(/</g, "\\u003c");

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: required for JSON-LD
			dangerouslySetInnerHTML={{ __html: json }}
		/>
	);
};

export default JsonLd;
