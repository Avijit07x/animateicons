/**
 * animateicons/icon-structure
 *
 * Every icon under icons/ must share ONE structure and animation flow so the
 * whole library behaves identically and stays regenerable. Reference shape:
 * icons/lucide/box-icon.tsx —
 *
 *   "use client"
 *   → forwardRef<…Handle, …Props>
 *   → useImperativeHandle(ref) exposing { startAnimation, stopAnimation }
 *   → hover flow wired through onMouseEnter / onMouseLeave
 *   → rendered inside <LazyMotion features={domMin}>
 *
 * Icon files also stay comment-free (they are template-generated).
 */

const REQUIRED = [
	"forwardRef",
	"useImperativeHandle",
	"LazyMotion",
	"domMin",
	"startAnimation",
	"stopAnimation",
	"onMouseEnter",
	"onMouseLeave",
];

/** @type {import("eslint").Rule.RuleModule} */
const rule = {
	meta: {
		type: "problem",
		docs: {
			description:
				"Enforce the shared AnimateIcons component structure and animation flow.",
		},
		schema: [],
		messages: {
			useClient: 'Icon must begin with the "use client" directive.',
			missing:
				"Icon is missing `{{name}}`. Every icon must follow the shared structure (see icons/lucide/box-icon.tsx): forwardRef + useImperativeHandle exposing startAnimation/stopAnimation + LazyMotion/domMin + onMouseEnter/onMouseLeave.",
			comment: "Icon files must not contain comments.",
		},
	},
	create(context) {
		const sourceCode = context.sourceCode ?? context.getSourceCode();
		const seen = new Set();
		return {
			Identifier: (n) => seen.add(n.name),
			JSXIdentifier: (n) => seen.add(n.name),
			"Program:exit"(node) {
				const first = node.body[0];
				const hasUseClient =
					first &&
					first.type === "ExpressionStatement" &&
					first.expression.type === "Literal" &&
					first.expression.value === "use client";
				if (!hasUseClient) {
					context.report({ node: first ?? node, messageId: "useClient" });
				}

				for (const name of REQUIRED) {
					if (!seen.has(name)) {
						context.report({ node, messageId: "missing", data: { name } });
					}
				}

				for (const comment of sourceCode.getAllComments()) {
					context.report({ node: comment, messageId: "comment" });
				}
			},
		};
	},
};

export default rule;
