# Buttons & tooltips

Attach a ref to the icon and drive it from the control's hover, so the whole button or tooltip trigger is what plays the animation. This is the same ref API covered in the [React guide](https://animateicons.in/icons/docs/react#playing-it-yourself).

## Button

The button owns the hover, the icon just follows.

```tsx title="Example.tsx"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { DownloadIcon, type DownloadIconHandle } from "@animateicons/react/huge"

export function DownloadButton() {
	const ref = useRef<DownloadIconHandle>(null)

    return (
    	<Button
    		onMouseEnter={() => ref.current?.startAnimation()}
    		onMouseLeave={() => ref.current?.stopAnimation()}
    	>
    		<DownloadIcon ref={ref} size={16} />
    		Download
    	</Button>
    )

}
```

## Tooltip

An icon-only button with a tooltip. Hovering plays the icon and reveals the label at once.

```tsx title="Example.tsx"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { Delete02Icon, type Delete02IconHandle } from "@animateicons/react/huge"

export function DeleteButton() {
	const ref = useRef<Delete02IconHandle>(null)

    return (
    	<Tooltip>
    		<TooltipTrigger asChild>
    			<Button
    				variant="secondary"
    				size="icon"
    				aria-label="Delete"
    				onMouseEnter={() => ref.current?.startAnimation()}
    				onMouseLeave={() => ref.current?.stopAnimation()}
    			>
    				<Delete02Icon ref={ref} size={16} />
    			</Button>
    		</TooltipTrigger>
    		<TooltipContent>Delete</TooltipContent>
    	</Tooltip>
    )

}
```

---

Source: https://animateicons.in/icons/docs/examples/buttons
All AnimateIcons docs: https://animateicons.in/llms.txt
