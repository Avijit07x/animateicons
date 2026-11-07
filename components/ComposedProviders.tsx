type ProviderComponent = React.FC<{ children: React.ReactNode }>;

type Props = {
	providers: ProviderComponent[];
	children: React.ReactNode;
};

const ComposedProviders: React.FC<Props> = ({ providers, children }) => {
	return providers.reduceRight<React.ReactNode>(
		(tree, Provider) => <Provider>{tree}</Provider>,
		children,
	);
};

export default ComposedProviders;
