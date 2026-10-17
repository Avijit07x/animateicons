import { angular } from "./angular";
import type { Framework } from "./types";
import { vanilla } from "./vanilla";
import { vue } from "./vue";

export const FRAMEWORKS: Framework[] = [vanilla, vue, angular];

export type { Framework, MountedFramework } from "./types";
