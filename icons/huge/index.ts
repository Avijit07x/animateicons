import { BellIcon } from "./bell-icon";
import { BookmarkIcon } from "./bookmark-icon";
import { CheckCheckIcon } from "./check-check-icon";
import { CheckIcon } from "./check-icon";
import { ChevronRightIcon } from "./chevron-right-icon";
import { CopyIcon } from "./copy-icon";
import { DownloadIcon } from "./download-icon";
import { EyeIcon } from "./eye-icon";
import { HeartIcon } from "./heart-icon";
import { SearchIcon } from "./search-icon";

const ICON_LIST: IconListItem[] = [
 {
  name: "eye",
  addedAt: "2025-11-12",
  icon: EyeIcon,
  keywords: ["eye", "show", "visible", "view", "watch", "preview"],
  category: ["Design"],
 },
 {
  name: "bookmark",
  icon: BookmarkIcon,
  addedAt: "2025-12-17",
  keywords: ["save", "favorite", "tag", "mark", "clip"],
  category: ["File icons"],
 },
 {
  name: "copy",
  icon: CopyIcon,
  addedAt: "2025-08-20",
  keywords: ["duplicate", "clone"],
  category: ["Tools"],
 },
 {
  name: "download",
  icon: DownloadIcon,
  addedAt: "2025-09-25",
  keywords: ["export", "file", "save", "fetch", "get"],
  category: ["File icons"],
 },
 {
  name: "heart",
  icon: HeartIcon,
  addedAt: "2025-12-30",
  keywords: ["like", "love", "emotion", "favorite", "react"],
  category: ["Social", "Emoji"],
 },
 {
  name: "search",
  icon: SearchIcon,
  addedAt: "2025-12-08",
  keywords: ["find", "magnifier", "search", "explore", "query"],
  category: ["Tools"],
 },
 {
  name: "check",
  icon: CheckIcon,
  addedAt: "2025-09-18",
  keywords: ["check", "tick", "done", "confirm", "success", "ok"],
  category: ["Notification"],
 },
 {
  name: "check-check",
  icon: CheckCheckIcon,
  addedAt: "2025-09-30",
  keywords: ["check", "double", "done", "all", "success", "confirm"],
  category: ["Notification", "Communication"],
 },
 {
  name: "bell",
  icon: BellIcon,
  addedAt: "2025-10-09",
  keywords: ["notification", "alarm", "alert", "reminder", "ring"],
  category: ["Notification"],
 },
 {
  name: "chevron-right",
  icon: ChevronRightIcon,
  addedAt: "2025-09-08",
  keywords: ["next", "carat", "right", "forward", "continue"],
  category: ["Arrows", "Navigation, Maps, and POIs"],
 },
];

const ICON_COUNT = ICON_LIST.length;
export { ICON_COUNT, ICON_LIST };
