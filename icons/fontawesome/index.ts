import { BarsIcon } from "@/icons/fontawesome/bars-icon";
import { BellIcon } from "./bell-icon";
import { HouseIcon } from "@/icons/fontawesome/house-icon";
import { SearchIcon } from "./search-icon";
import { CloseIcon } from "@/icons/fontawesome/close-icon";

const ICON_LIST: IconListItem[] = [
 {
  name: "bell",
  icon: BellIcon,
  category: ["Alerts"],
  addedAt: "2026-02-18",
  keywords: ["bell", "notification", "alert"],
 },
 {
  name: "bars",
  icon: BarsIcon,
  category: ["Navigation"],
  addedAt: "2026-02-18",
  keywords: ["bars", "menu", "navigation"],
 },
 {
  name: "house",
  icon: HouseIcon,
  category: ["Navigation"],
  addedAt: "2026-02-18",
  keywords: ["house", "home", "navigation"],
 },
 {
  name: "search",
  icon: SearchIcon,
  category: ["Tools"],
  addedAt: "2026-02-18",
  keywords: ["search", "magnifier", "find", "explore", "query"],
 },
 {
  name: "close",
  icon: CloseIcon,
  category: ["Tools"],
  addedAt: "2026-02-18",
  keywords: ["close", "cancel", "exit", "dismiss", "clear"],
 },
];

const FONTAWESOME_ICON_COUNT = ICON_LIST.length;
export { FONTAWESOME_ICON_COUNT, ICON_LIST };
