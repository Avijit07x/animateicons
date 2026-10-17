# Menus & navigation

Give each action its own ref so items animate independently on hover.

## Navbar

Three nav actions, one ref each, animating on their own hover.

```tsx title="Example.tsx"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import {
	NotificationIcon,
	Settings01Icon,
	UserIcon,
} from "@animateicons/react/huge"
import type { IconHandle } from "@animateicons/react"

export function Navbar() {
	// One shared type for every icon, no per-icon *IconHandle needed.
	const bell = useRef<IconHandle>(null)
	const settings = useRef<IconHandle>(null)
	const user = useRef<IconHandle>(null)

    return (
    	<nav className="flex items-center justify-between rounded-full bg-zinc-900 py-1.5 pr-2 pl-5">
    		<span className="text-sm font-semibold">Dashboard</span>
    		<div className="flex items-center gap-0.5">
    			<Button
    				variant="ghost"
    				size="icon"
    				onMouseEnter={() => bell.current?.startAnimation()}
    				onMouseLeave={() => bell.current?.stopAnimation()}
    			>
    				<NotificationIcon ref={bell} size={18} />
    			</Button>
    			<Button
    				variant="ghost"
    				size="icon"
    				onMouseEnter={() => settings.current?.startAnimation()}
    				onMouseLeave={() => settings.current?.stopAnimation()}
    			>
    				<Settings01Icon ref={settings} size={18} />
    			</Button>
    			<Button
    				variant="ghost"
    				size="icon"
    				onMouseEnter={() => user.current?.startAnimation()}
    				onMouseLeave={() => user.current?.stopAnimation()}
    			>
    				<UserIcon ref={user} size={18} />
    			</Button>
    		</div>
    	</nav>
    )

}
```

## Menu

The same per-item pattern in a vertical menu.

```tsx title="Example.tsx"
import { useRef } from "react"
import {
	UserIcon,
	Settings01Icon,
	Logout01Icon,
} from "@animateicons/react/huge"
import type { IconHandle } from "@animateicons/react"

export function AccountMenu() {
	const profile = useRef<IconHandle>(null)
	const settings = useRef<IconHandle>(null)
	const logout = useRef<IconHandle>(null)

    const item =
    	"flex w-full items-center gap-2.5 rounded-full px-3 py-2 text-sm"

    return (
    	<div className="w-56 rounded-3xl bg-zinc-900 p-1.5">
    		<button
    			className={item}
    			onMouseEnter={() => profile.current?.startAnimation()}
    			onMouseLeave={() => profile.current?.stopAnimation()}
    		>
    			<UserIcon ref={profile} size={16} />
    			Profile
    		</button>
    		<button
    			className={item}
    			onMouseEnter={() => settings.current?.startAnimation()}
    			onMouseLeave={() => settings.current?.stopAnimation()}
    		>
    			<Settings01Icon ref={settings} size={16} />
    			Settings
    		</button>
    		<button
    			className={item}
    			onMouseEnter={() => logout.current?.startAnimation()}
    			onMouseLeave={() => logout.current?.stopAnimation()}
    		>
    			<Logout01Icon ref={logout} size={16} />
    			Log out
    		</button>
    	</div>
    )

}
```

Repeating those two hover handlers on every item adds up. The [Hover helper](https://animateicons.in/icons/docs/examples/hover-helper) shows how to fold them into one reusable hook.

---

Source: https://animateicons.in/icons/docs/examples/navigation
All AnimateIcons docs: https://animateicons.in/llms.txt
