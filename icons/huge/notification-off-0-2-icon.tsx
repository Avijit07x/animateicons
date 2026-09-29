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
export interface NotificationOff02IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface NotificationOff02IconProps extends Omit<
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

const NotificationOff02Icon = forwardRef<
 NotificationOff02IconHandle,
 NotificationOff02IconProps
>(
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

  const bodyVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.4, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const slashVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [30, 0],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
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
      <m.g variants={bodyVariants}>
       <path d="M18 18H3.5" />
       <path d="M13.5 20C13.5 20.8284 12.8284 21.5 12 21.5M10.5 20C10.5 20.8284 11.1716 21.5 12 21.5M12 21.5V20" />
       <path d="M5 18V9.5C5 8.20839 5.34981 6.99849 5.95987 5.95987M19 15V9.5C19 5.63401 15.866 2.5 12 2.5C10.4497 2.5 9.01706 3.00399 7.85707 3.85707" />
      </m.g>
      <m.path
       d="M2 2L22 22"
       strokeDasharray="30"
       strokeDashoffset="0"
       variants={slashVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

NotificationOff02Icon.displayName = "NotificationOff02Icon";
export { NotificationOff02Icon };
