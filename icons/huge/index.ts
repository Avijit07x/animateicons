import { ActivityIcon } from "./activity-icon";
import { BookmarkCheckIcon } from "./bookmark-check-icon";
import { BookmarkIcon } from "./bookmark-icon";
import { BookmarkMinusIcon } from "./bookmark-minus-icon";
import { BookmarkRemoveIcon } from "./bookmark-remove-icon";
import { CheckCheckIcon } from "./check-check-icon";
import { CheckIcon } from "./check-icon";
import { ChevronRightIcon } from "./chevron-right-icon";
import { Compass01Icon } from "./compass-0-1-icon";
import { Compass02Icon } from "./compass-0-2-icon";
import { CopyIcon } from "./copy-icon";
import { Dashboard01Icon } from "./dashboard-0-1-icon";
import { Dashboard02Icon } from "./dashboard-0-2-icon";
import { Dashboard03Icon } from "./dashboard-0-3-icon";
import { DiscordIcon } from "./discord-icon";
import { DownloadIcon } from "./download-icon";
import { EyeIcon } from "./eye-icon";
import { FacebookIcon } from "./facebook-icon";
import { FigmaIcon } from "./figma-icon";
import { GithubIcon } from "./github-icon";
import { HeartIcon } from "./heart-icon";
import { Loading01Icon } from "./loading-0-1-icon";
import { Loading02Icon } from "./loading-0-2-icon";
import { Menu01Icon } from "./menu-0-1-icon";
import { Menu02Icon } from "./menu-0-2-icon";
import { MousePointerClick01Icon } from "./mouse-pointer-click-0-1-icon";
import { NewTwitterIcon } from "./new-twitter-icon";
import { NotificationIcon } from "./notification-icon";
import { NotificationOffIcon } from "./notification-off-icon";
import { SearchIcon } from "./search-icon";
import { Settings01Icon } from "./settings-0-1-icon";
import { Settings02Icon } from "./settings-0-2-icon";
import { TwitterIcon } from "./twitter-icon";

const ICON_LIST: IconListItem[] = [
 {
  name: "menu-0-1",
  icon: Menu01Icon,
  addedAt: "2026-02-13",
  category: ["Layout", "Navigation, Maps, and POIs"],
  keywords: ["menu", "navigation", "options", "sidebar", "list"],
 },
 {
  name: "menu-0-2",
  icon: Menu02Icon,
  addedAt: "2026-02-13",
  category: ["Layout", "Navigation, Maps, and POIs"],
  keywords: ["menu", "navigation", "options", "sidebar", "list"],
 },
 {
  name: "dashboard-0-1",
  icon: Dashboard01Icon,
  addedAt: "2026-02-13",
  category: ["Layout"],
  keywords: ["dashboard", "layout", "grid", "panel", "widgets"],
 },
 {
  name: "dashboard-0-2",
  icon: Dashboard02Icon,
  addedAt: "2026-02-13",
  category: ["Layout"],
  keywords: ["dashboard", "layout", "grid", "panel", "widgets"],
 },
 {
  name: "dashboard-0-3",
  icon: Dashboard03Icon,
  addedAt: "2026-02-13",
  category: ["Layout"],
  keywords: ["dashboard", "layout", "grid", "panel", "widgets"],
 },
 {
  name: "eye",
  icon: EyeIcon,
  addedAt: "2026-02-13",
  keywords: ["eye", "show", "visible", "view", "watch", "preview"],
  category: ["Design"],
 },
 {
  name: "bookmark",
  icon: BookmarkIcon,
  addedAt: "2026-02-13",
  keywords: ["save", "favorite", "tag", "mark", "clip"],
  category: ["File icons"],
 },
 {
  name: "bookmark-check",
  icon: BookmarkCheckIcon,
  addedAt: "2026-02-13",
  category: ["File icons"],
  keywords: ["saved", "favorite", "done", "added", "clip"],
 },
 {
  name: "bookmark-minus",
  icon: BookmarkMinusIcon,
  addedAt: "2026-02-13",
  category: ["File icons"],
  keywords: ["saved", "favorite", "done", "added", "clip"],
 },
 {
  name: "bookmark-remove",
  icon: BookmarkRemoveIcon,
  addedAt: "2026-02-13",
  category: ["File icons"],
  keywords: ["unsave", "remove", "delete", "unmark", "cancel"],
 },
 {
  name: "loading-0-1",
  icon: Loading01Icon,
  addedAt: "2026-02-13",
  category: ["Layout"],
  keywords: ["loading", "loader", "wait", "busy", "progress", "spinner"],
 },
 {
  name: "loading-0-2",
  icon: Loading02Icon,
  addedAt: "2026-02-13",
  category: ["Layout"],
  keywords: ["loading", "loader", "wait", "busy", "progress", "spinner"],
 },
 {
  name: "copy",
  icon: CopyIcon,
  addedAt: "2026-02-13",
  keywords: ["duplicate", "clone"],
  category: ["Tools"],
 },
 {
  name: "download",
  icon: DownloadIcon,
  addedAt: "2026-02-13",
  keywords: ["export", "file", "save", "fetch", "get"],
  category: ["File icons"],
 },
 {
  name: "heart",
  icon: HeartIcon,
  addedAt: "2026-02-13",
  keywords: ["like", "love", "emotion", "favorite", "react"],
  category: ["Social", "Emoji"],
 },
 {
  name: "search",
  icon: SearchIcon,
  addedAt: "2026-02-13",
  keywords: ["find", "magnifier", "search", "explore", "query"],
  category: ["Tools"],
 },
 {
  name: "check",
  icon: CheckIcon,
  addedAt: "2026-02-13",
  keywords: ["check", "tick", "done", "confirm", "success", "ok"],
  category: ["Notification"],
 },
 {
  name: "check-check",
  icon: CheckCheckIcon,
  addedAt: "2026-02-13",
  keywords: ["check", "double", "done", "all", "success", "confirm"],
  category: ["Notification", "Communication"],
 },
 {
  name: "notification",
  icon: NotificationIcon,
  addedAt: "2026-02-13",
  category: ["Notification"],
  keywords: ["notification", "alarm", "alert", "reminder", "ring"],
 },
 {
  name: "notification-off",
  icon: NotificationOffIcon,
  addedAt: "2026-02-13",
  category: ["Notification"],
  keywords: ["notification", "alarm", "alert", "reminder", "ring"],
 },
 {
  name: "chevron-right",
  icon: ChevronRightIcon,
  addedAt: "2026-02-13",
  category: ["Arrows", "Navigation, Maps, and POIs"],
  keywords: ["next", "carat", "right", "forward", "continue"],
 },
 {
  name: "activity",
  icon: ActivityIcon,
  addedAt: "2026-02-13",
  category: ["Medical"],
  keywords: ["pulse", "motion", "health", "fitness", "monitor"],
 },
 {
  name: "compass-0-1",
  icon: Compass01Icon,
  addedAt: "2026-02-13",
  category: ["Navigation, Maps, and POIs"],
  keywords: ["direction", "navigation", "explore", "travel", "map"],
 },
 {
  name: "compass-0-2",
  icon: Compass02Icon,
  addedAt: "2026-02-13",
  category: ["Navigation, Maps, and POIs"],
  keywords: ["direction", "navigation", "explore", "travel", "map"],
 },
 {
  name: "mouse-pointer-click-0-1",
  icon: MousePointerClick01Icon,
  addedAt: "2026-02-13",
  category: ["Cursors"],
  keywords: ["click", "select"],
 },
 {
  name: "discord",
  icon: DiscordIcon,
  addedAt: "2026-02-13",
  category: ["Brands", "Connectivity"],
  keywords: ["discord", "chat", "community", "gaming", "social"],
 },
 {
  name: "facebook",
  icon: FacebookIcon,
  addedAt: "2026-02-13",
  category: ["Brands", "Connectivity"],
  keywords: ["social", "network", "friends", "meta", "community"],
 },
 {
  name: "new-twitter",
  icon: NewTwitterIcon,
  addedAt: "2026-02-13",
  category: ["Brands", "Connectivity"],
  keywords: ["social", "tweet", "post", "x", "network"],
 },
 {
  name: "twitter",
  icon: TwitterIcon,
  addedAt: "2026-02-13",
  category: ["Brands", "Connectivity"],
  keywords: ["social", "tweet", "post", "x", "network"],
 },
 {
  name: "figma",
  icon: FigmaIcon,
  addedAt: "2026-02-13",
  category: ["Brands"],
  keywords: ["design", "ui", "tool", "vector", "prototype"],
 },
 {
  name: "github",
  icon: GithubIcon,
  addedAt: "2026-02-13",
  category: ["Brands", "Coding & development"],
  keywords: ["code", "git", "repo", "version control", "social"],
 },
 {
  name: "settings-0-1",
  icon: Settings01Icon,
  addedAt: "2026-02-13",
  category: ["Accounts & access", "Tools"],
  keywords: ["settings", "configuration", "options", "preferences", "gear"],
 },
 {
  name: "settings-0-2",
  icon: Settings02Icon,
  addedAt: "2026-02-13",
  category: ["Accounts & access", "Tools"],
  keywords: ["settings", "configuration", "options", "preferences", "gear"],
 },
];

const ICON_COUNT = ICON_LIST.length;
export { ICON_COUNT, ICON_LIST };
