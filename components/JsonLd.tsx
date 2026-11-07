type Props = {
	data: Record<string, unknown> | Record<string, unknown>[];
};

const JsonLd: React.FC<Props> = ({ data }) => {
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
