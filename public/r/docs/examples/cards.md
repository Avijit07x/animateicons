# Cards & feedback

Play the icon on the container's hover so the whole surface is the trigger. Good for feature tiles and status messages where the icon carries the meaning.

## Feature card

Put the icon in a rounded tile and play it on card hover to draw attention.

```tsx title="Example.tsx"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { SparklesIcon, type SparklesIconHandle } from "@animateicons/react/huge"

export function FeatureCard() {
	const ref = useRef<SparklesIconHandle>(null)

    return (
    	<div
    		onMouseEnter={() => ref.current?.startAnimation()}
    		onMouseLeave={() => ref.current?.stopAnimation()}
    		className="rounded-3xl bg-zinc-900 p-5"
    	>
    		<div className="bg-primary/10 text-primary mb-3 flex size-11 items-center justify-center rounded-full">
    			<SparklesIcon ref={ref} size={20} />
    		</div>
    		<p className="font-semibold">Smart suggestions</p>
    		<p className="text-muted-foreground mt-1 text-sm">
    			Get AI-powered icon recommendations as you type.
    		</p>
    		<Button size="sm" variant="secondary" className="mt-4">
    			Learn more
    		</Button>
    	</div>
    )

}
```

## Status banner

A success banner whose check plays on hover, reinforcing the confirmation.

```tsx title="Example.tsx"
import { useRef } from "react"
import {
	CheckmarkCircle01Icon,
	type CheckmarkCircle01IconHandle,
} from "@animateicons/react/huge"

export function SavedBanner() {
	const ref = useRef<CheckmarkCircle01IconHandle>(null)

    return (
    	<div
    		onMouseEnter={() => ref.current?.startAnimation()}
    		onMouseLeave={() => ref.current?.stopAnimation()}
    		className="flex items-center gap-3 rounded-3xl bg-emerald-500/10 px-4 py-3"
    	>
    		<CheckmarkCircle01Icon ref={ref} size={18} className="text-emerald-400" />
    		<p className="text-sm">Your changes have been saved.</p>
    	</div>
    )

}
```

---

Source: https://animateicons.in/icons/docs/examples/cards
All AnimateIcons docs: https://animateicons.in/llms.txt
