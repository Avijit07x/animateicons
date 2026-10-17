# Inputs

Put an icon in the field's addon and play it on focus, so the icon reacts as the user starts typing. Here the trigger is `onFocus` / `onBlur` rather than hover.

## Search input

A leading icon in an `InputGroup` that plays when the field gains focus.

```tsx title="Example.tsx"
import { useRef } from "react"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group"
import { SearchIcon, type SearchIconHandle } from "@animateicons/react/huge"

export function SearchField() {
	const ref = useRef<SearchIconHandle>(null)

    return (
    	<InputGroup>
    		<InputGroupAddon>
    			<SearchIcon ref={ref} size={16} />
    		</InputGroupAddon>
    		<InputGroupInput
    			placeholder="Search icons..."
    			onFocus={() => ref.current?.startAnimation()}
    			onBlur={() => ref.current?.stopAnimation()}
    		/>
    	</InputGroup>
    )

}
```

---

Source: https://animateicons.in/icons/docs/examples/inputs
All AnimateIcons docs: https://animateicons.in/llms.txt
