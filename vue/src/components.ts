import {
	attachIcon,
	HOST_STYLE,
	restingAttributes,
	type IconControls,
	type IconData,
	type IconNode,
	type MountedIcon,
} from "@animateicons/vanilla";
import {
	defineComponent,
	h,
	onBeforeUnmount,
	onMounted,
	shallowRef,
	useId,
	watch,
	type DefineComponent,
	type PropType,
	type VNode,
} from "vue";

const iconProps = {
	size: { type: Number, default: 24 },
	color: { type: String, default: undefined },
	duration: { type: Number, default: 1 },
	isAnimated: { type: Boolean, default: true },
} as const;

interface IconProps {
	size: number;
	color?: string;
	duration: number;
	isAnimated: boolean;
}

const renderNode = (
	node: IconNode,
	idScope: string,
	rootProps?: Record<string, unknown>,
): VNode =>
	h(
		node.tag,
		{
			...restingAttributes(node, rootProps !== undefined, idScope),
			...rootProps,
		},
		node.children?.map((child) => renderNode(child, idScope)),
	);

function createIconController(getIcon: () => IconData, props: IconProps) {
	const host = shallowRef<HTMLElement>();
	const idScope = useId();
	let mounted: MountedIcon | undefined;

	const attach = () => {
		mounted?.destroy();
		mounted = undefined;
		const svg = host.value?.firstElementChild;
		if (!host.value || !(svg instanceof SVGSVGElement)) return;
		mounted = attachIcon(host.value, svg, getIcon(), {
			duration: props.duration,
			isAnimated: props.isAnimated,
		});
	};

	onMounted(attach);
	watch(
		() => [getIcon(), props.size, props.duration, props.isAnimated],
		attach,
		{ flush: "post" },
	);
	onBeforeUnmount(() => {
		mounted?.destroy();
		mounted = undefined;
	});

	const renderIcon = () => {
		const icon = getIcon();
		return h(
			"span",
			{ ref: host, style: { ...HOST_STYLE, color: props.color } },
			[
				renderNode(icon, idScope, {
					key: `${icon.library}/${icon.name}`,
					width: props.size,
					height: props.size,
				}),
			],
		);
	};

	return {
		startAnimation: () => mounted?.startAnimation(),
		stopAnimation: () => mounted?.stopAnimation(),
		renderIcon,
	};
}

const animateIconsProps = {
	icon: { type: Object as PropType<IconData>, required: true },
	...iconProps,
} as const;

export type IconComponent = DefineComponent<typeof iconProps, IconControls>;

export type AnimateIconsComponent = DefineComponent<
	typeof animateIconsProps,
	IconControls
>;

const setupIcon = (
	getIcon: () => IconData,
	props: IconProps,
	expose: (exposed: IconControls) => void,
) => {
	const { renderIcon, ...controls } = createIconController(getIcon, props);
	expose(controls);
	return renderIcon;
};

const toPascalCase = (name: string) =>
	name
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("");

export const AnimateIcons = defineComponent({
	name: "AnimateIcons",
	props: animateIconsProps,
	setup: (props, { expose }) => setupIcon(() => props.icon, props, expose),
}) as AnimateIconsComponent;

export const defineIcon = (icon: IconData): IconComponent =>
	defineComponent({
		name: `${toPascalCase(icon.name)}Icon`,
		props: iconProps,
		setup: (props, { expose }) => setupIcon(() => icon, props, expose),
	}) as IconComponent;
