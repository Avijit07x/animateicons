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
export interface Apple01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Apple01IconProps extends Omit<
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

const Apple01Icon = forwardRef<Apple01IconHandle, Apple01IconProps>(
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

  const squashVariants: Variants = {
   normal: { scaleY: 1, scaleX: 1 },
   animate: {
    scaleY: [1, 0.88, 1.02, 1],
    scaleX: [1, 1.06, 0.98, 1],
    transition: {
     duration: 0.55 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const leafVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -10, 22, -9, 0],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
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
      <m.g
       variants={squashVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "21px" }}
      >
       <path d="M8 5C5.23858 5 3 8.0139 3 11.0278C3 14.544 3.5 17.0556 5.5 20.0695C7.02044 22.1062 9.05026 22.6168 11.2139 21.1903C11.6757 20.8859 12.3243 20.8859 12.7861 21.1903C14.9497 22.6168 16.9796 22.1062 18.5 20.0695C20.5 17.0556 21 14.544 21 11.0278C21 8.0139 18.7614 5 16 5C14.5746 5 13.2885 5.7849 12.3777 6.63254C12.166 6.82949 11.834 6.82949 11.6223 6.63254C10.7115 5.7849 9.42542 5 8 5Z" />
       <path d="M6 12C6 10.3665 6.82273 8.73298 8 8" />
       <m.path
        d="M12 6C12 4.66667 12.6 2 15 2"
        variants={leafVariants}
        style={{ transformBox: "view-box", originX: "12px", originY: "6px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Apple01Icon.displayName = "Apple01Icon";
export { Apple01Icon };
