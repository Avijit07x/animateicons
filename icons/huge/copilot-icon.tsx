"use client";

import { cn } from "@/lib/utils";
import type { Variants } from "motion/react";
import {
 LazyMotion,
 domMin,
 m,
 useAnimation,
 useReducedMotion,
} from "motion/react";
import {
 forwardRef,
 useCallback,
 useImperativeHandle,
 useRef,
 type HTMLAttributes,
} from "react";
export interface CopilotIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CopilotIconProps extends Omit<
 HTMLAttributes<HTMLDivElement>,
 | "color"
 | "onDrag"
 | "onDragStart"
 | "onDragEnd"
 | "onAnimationStart"
 | "onAnimationEnd"
 | "onAnimationIteration"
> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
 color?: string;
}

const CopilotIcon = forwardRef<CopilotIconHandle, CopilotIconProps>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 1,
   isAnimated = true,
   color,
   ...props
  },
  ref,
 ) => {
  const controls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () =>
     reduced ? controls.start("normal") : controls.start("animate"),
    stopAnimation: () => controls.start("normal"),
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) controls.start("animate");
    else onMouseEnter?.(e as any);
   },
   [controls, reduced, isAnimated, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const topVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -2.5, 0.5, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const bottomVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, 2.5, -0.5, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  return (
   <LazyMotion features={domMin} strict>
    <m.div
     className={cn("inline-flex items-center justify-center", className)}
     onMouseEnter={handleEnter}
     onMouseLeave={handleLeave}
     {...props}
     style={{ color, ...props.style }}
    >
     <m.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={controls}
      initial="normal"
     >
      <m.path
       d="M13.8461 4C14.6683 4 15.3801 4.62364 15.5584 5.50016L15.7715 6.54763C16.0037 7.68837 16.93 8.5 18 8.5H11.3827M11.3827 8.5L10.3116 13.2894C9.98567 14.5945 8.90024 15.5 7.66156 15.5H4.83224C3.62479 15.5 2.74786 14.246 3.06556 12.9738L4.44552 6.94753C4.88008 5.20729 6.32731 4 7.97888 4H13.8461C13.0551 4 12.362 4.57821 12.1539 5.41168L11.3827 8.5Z"
       variants={topVariants}
      />
      <m.path
       d="M10.1539 20C9.33175 20 8.61992 19.3764 8.44158 18.4998L8.22845 17.4524C7.99635 16.3116 7.06995 15.5 6 15.5L12.6173 15.5M12.6173 15.5L13.6884 10.7106C14.0143 9.40546 15.0998 8.5 16.3384 8.5L19.1678 8.5C20.3752 8.5 21.2521 9.75395 20.9344 11.0262L19.5545 17.0525C19.1199 18.7927 17.6727 20 16.0211 20L10.1539 20C10.9449 20 11.638 19.4218 11.8461 18.5883L12.6173 15.5Z"
       variants={bottomVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CopilotIcon.displayName = "CopilotIcon";
export { CopilotIcon };
