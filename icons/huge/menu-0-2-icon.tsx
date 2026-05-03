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
export interface Menu02IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Menu02IconProps extends Omit<
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

const Menu02Icon = forwardRef<Menu02IconHandle, Menu02IconProps>(
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
   normal: { x: 0 },
   animate: {
    x: 6,
    transition: {
     type: "spring",
     stiffness: 300,
     damping: 18,
     delay: 0,
     duration: 0.4 * duration,
    },
   },
  };

  const middleVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: 10,
    transition: {
     type: "spring",
     stiffness: 300,
     damping: 18,
     delay: 0.05 * duration,
     duration: 0.4 * duration,
    },
   },
  };

  const bottomVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: 6,
    transition: {
     type: "spring",
     stiffness: 300,
     damping: 18,
     delay: 0.1 * duration,
     duration: 0.4 * duration,
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
      initial="normal"
      animate={controls}
     >
      <m.path
       d="M20 5L4 5"
       variants={topVariants}
       style={{ transformOrigin: "right center" }}
      />

      <m.path
       d="M20 12L10 12"
       variants={middleVariants}
       style={{ transformOrigin: "right center" }}
      />

      <m.path
       d="M20 19L4 19"
       variants={bottomVariants}
       style={{ transformOrigin: "right center" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Menu02Icon.displayName = "Menu02Icon";
export { Menu02Icon };
