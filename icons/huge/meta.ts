import { lazy } from "react";
import type { ComponentType } from "react";

const ICON_META: IconMeta[] = [
 {
  name: "menu-0-1",
  addedAt: "2026-02-16",
  category: ["Layout", "Navigation, Maps, and POIs"],
  keywords: ["menu", "navigation", "options", "sidebar", "list"],
 },
 {
  name: "menu-0-2",
  addedAt: "2026-02-16",
  category: ["Layout", "Navigation, Maps, and POIs"],
  keywords: ["menu", "navigation", "options", "sidebar", "list"],
 },
 {
  name: "dashboard-0-1",
  addedAt: "2026-02-16",
  category: ["Layout"],
  keywords: ["dashboard", "layout", "grid", "panel", "widgets"],
 },
 {
  name: "dashboard-0-2",
  addedAt: "2026-02-16",
  category: ["Layout"],
  keywords: ["dashboard", "layout", "grid", "panel", "widgets"],
 },
 {
  name: "dashboard-0-3",
  addedAt: "2026-02-16",
  category: ["Layout"],
  keywords: ["dashboard", "layout", "grid", "panel", "widgets"],
 },
 {
  name: "eye",
  addedAt: "2026-02-16",
  category: ["Design"],
  keywords: ["eye", "show", "visible", "view", "watch", "preview", "open"],
 },
 {
  name: "bookmark",
  addedAt: "2026-02-16",
  category: ["File icons"],
  keywords: ["save", "favorite", "tag", "mark", "clip"],
 },
 {
  name: "bookmark-check",
  addedAt: "2026-02-16",
  category: ["File icons"],
  keywords: ["saved", "favorite", "done", "added", "clip"],
 },
 {
  name: "bookmark-minus",
  addedAt: "2026-02-16",
  category: ["File icons"],
  keywords: ["saved", "favorite", "done", "added", "clip"],
 },
 {
  name: "bookmark-remove",
  addedAt: "2026-02-16",
  category: ["File icons"],
  keywords: ["unsave", "remove", "delete", "unmark", "cancel"],
 },
 {
  name: "loading-0-1",
  addedAt: "2026-02-16",
  category: ["Layout"],
  keywords: ["loading", "loader", "wait", "busy", "progress", "spinner"],
 },
 {
  name: "loading-0-2",
  addedAt: "2026-02-16",
  category: ["Layout"],
  keywords: ["loading", "loader", "wait", "busy", "progress", "spinner"],
 },
 {
  name: "copy",
  addedAt: "2026-02-16",
  category: ["Tools"],
  keywords: ["duplicate", "clone"],
 },
 {
  name: "download",
  addedAt: "2026-02-16",
  category: ["File icons"],
  keywords: ["export", "file", "save", "fetch", "get"],
 },
 {
  name: "heart",
  addedAt: "2026-02-16",
  category: ["Social", "Emoji"],
  keywords: ["like", "love", "emotion", "favorite", "react"],
 },
 {
  name: "search",
  addedAt: "2026-02-16",
  category: ["Tools"],
  keywords: ["find", "magnifier", "search", "explore", "query"],
 },
 {
  name: "check",
  addedAt: "2026-02-16",
  category: ["Notification"],
  keywords: ["check", "tick", "done", "confirm", "success", "ok"],
 },
 {
  name: "check-check",
  addedAt: "2026-02-16",
  category: ["Notification", "Communication"],
  keywords: ["check", "double", "done", "all", "success", "confirm"],
 },
 {
  name: "notification",
  addedAt: "2026-02-16",
  category: ["Notification"],
  keywords: ["notification", "alarm", "alert", "reminder", "ring"],
 },
 {
  name: "notification-off",
  addedAt: "2026-02-16",
  category: ["Notification"],
  keywords: ["notification", "alarm", "alert", "reminder", "ring"],
 },
 {
  name: "chevron-right",
  addedAt: "2026-02-16",
  category: ["Arrows", "Navigation, Maps, and POIs"],
  keywords: ["next", "carat", "right", "forward", "continue"],
 },
 {
  name: "activity",
  addedAt: "2026-02-16",
  category: ["Medical"],
  keywords: ["pulse", "motion", "health", "fitness", "monitor"],
 },
 {
  name: "compass-0-1",
  addedAt: "2026-02-16",
  category: ["Navigation, Maps, and POIs"],
  keywords: ["direction", "navigation", "explore", "travel", "map"],
 },
 {
  name: "compass-0-2",
  addedAt: "2026-02-16",
  category: ["Navigation, Maps, and POIs"],
  keywords: ["direction", "navigation", "explore", "travel", "map"],
 },
 {
  name: "mouse-pointer-click-0-1",
  addedAt: "2026-02-16",
  category: ["Cursors"],
  keywords: ["click", "select"],
 },
 {
  name: "discord",
  addedAt: "2026-02-16",
  category: ["Brands", "Connectivity"],
  keywords: ["discord", "chat", "community", "gaming", "social"],
 },
 {
  name: "facebook",
  addedAt: "2026-02-16",
  category: ["Brands", "Connectivity"],
  keywords: ["social", "network", "friends", "meta", "community"],
 },
 {
  name: "new-twitter",
  addedAt: "2026-02-16",
  category: ["Brands", "Connectivity"],
  keywords: ["social", "tweet", "post", "x", "network"],
 },
 {
  name: "twitter",
  addedAt: "2026-02-16",
  category: ["Brands", "Connectivity"],
  keywords: ["social", "tweet", "post", "x", "network"],
 },
 {
  name: "figma",
  addedAt: "2026-02-16",
  category: ["Brands"],
  keywords: ["design", "ui", "tool", "vector", "prototype"],
 },
 {
  name: "github",
  addedAt: "2026-02-16",
  category: ["Brands", "Coding & development"],
  keywords: ["code", "git", "repo", "version control", "social"],
 },
 {
  name: "settings-0-1",
  addedAt: "2026-02-16",
  category: ["Accounts & access", "Tools"],
  keywords: ["settings", "configuration", "options", "preferences", "gear"],
 },
 {
  name: "settings-0-2",
  addedAt: "2026-02-16",
  category: ["Accounts & access", "Tools"],
  keywords: ["settings", "configuration", "options", "preferences", "gear"],
 },
];

const ICON_COUNT = ICON_META.length;

const iconLoaders: Record<string, () => Promise<ComponentType<any>>> = {
 "menu-0-1": () => import("./menu-0-1-icon").then((m) => m.Menu01Icon),
 "menu-0-2": () => import("./menu-0-2-icon").then((m) => m.Menu02Icon),
 "dashboard-0-1": () =>
  import("./dashboard-0-1-icon").then((m) => m.Dashboard01Icon),
 "dashboard-0-2": () =>
  import("./dashboard-0-2-icon").then((m) => m.Dashboard02Icon),
 "dashboard-0-3": () =>
  import("./dashboard-0-3-icon").then((m) => m.Dashboard03Icon),
 eye: () => import("./eye-icon").then((m) => m.EyeIcon),
 bookmark: () => import("./bookmark-icon").then((m) => m.BookmarkIcon),
 "bookmark-check": () =>
  import("./bookmark-check-icon").then((m) => m.BookmarkCheckIcon),
 "bookmark-minus": () =>
  import("./bookmark-minus-icon").then((m) => m.BookmarkMinusIcon),
 "bookmark-remove": () =>
  import("./bookmark-remove-icon").then((m) => m.BookmarkRemoveIcon),
 "loading-0-1": () => import("./loading-0-1-icon").then((m) => m.Loading01Icon),
 "loading-0-2": () => import("./loading-0-2-icon").then((m) => m.Loading02Icon),
 copy: () => import("./copy-icon").then((m) => m.CopyIcon),
 download: () => import("./download-icon").then((m) => m.DownloadIcon),
 heart: () => import("./heart-icon").then((m) => m.HeartIcon),
 search: () => import("./search-icon").then((m) => m.SearchIcon),
 check: () => import("./check-icon").then((m) => m.CheckIcon),
 "check-check": () =>
  import("./check-check-icon").then((m) => m.CheckCheckIcon),
 notification: () =>
  import("./notification-icon").then((m) => m.NotificationIcon),
 "notification-off": () =>
  import("./notification-off-icon").then((m) => m.NotificationOffIcon),
 "chevron-right": () =>
  import("./chevron-right-icon").then((m) => m.ChevronRightIcon),
 activity: () => import("./activity-icon").then((m) => m.ActivityIcon),
 "compass-0-1": () => import("./compass-0-1-icon").then((m) => m.Compass01Icon),
 "compass-0-2": () => import("./compass-0-2-icon").then((m) => m.Compass02Icon),
 "mouse-pointer-click-0-1": () =>
  import("./mouse-pointer-click-0-1-icon").then(
   (m) => m.MousePointerClick01Icon,
  ),
 discord: () => import("./discord-icon").then((m) => m.DiscordIcon),
 facebook: () => import("./facebook-icon").then((m) => m.FacebookIcon),
 "new-twitter": () =>
  import("./new-twitter-icon").then((m) => m.NewTwitterIcon),
 twitter: () => import("./twitter-icon").then((m) => m.TwitterIcon),
 figma: () => import("./figma-icon").then((m) => m.FigmaIcon),
 github: () => import("./github-icon").then((m) => m.GithubIcon),
 "settings-0-1": () =>
  import("./settings-0-1-icon").then((m) => m.Settings01Icon),
 "settings-0-2": () =>
  import("./settings-0-2-icon").then((m) => m.Settings02Icon),
};

const cache = new Map<string, ComponentType<any>>();

// Returns a cached React.lazy component for an icon name. Must be rendered
// inside a <Suspense> boundary. Refs (the animation handle) attach once the
// chunk resolves.
function getIcon(name: string): ComponentType<any> {
 let comp = cache.get(name);
 if (!comp) {
  const loader = iconLoaders[name];
  comp = lazy(() => loader().then((C) => ({ default: C })));
  cache.set(name, comp);
 }
 return comp;
}

export { ICON_COUNT, ICON_META, iconLoaders, getIcon };
