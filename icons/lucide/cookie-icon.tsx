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
export interface CookieIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CookieIconProps extends Omit<
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

const CookieIcon = forwardRef<CookieIconHandle, CookieIconProps>(
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

  const cookieVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -12, 8, -4, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const chipVariants: Variants = {
   normal: { scale: 1 },
   animate: (i: number) => ({
    scale: [1, 0, 1.6, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeOut",
     times: [0, 0.2, 0.6, 1],
     delay: i * 0.08 * duration,
    },
   }),
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
       variants={cookieVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
       <m.path
        d="M8.5 8.5v.01"
        variants={chipVariants}
        custom={0}
        style={{ transformBox: "view-box", originX: "8.5px", originY: "8.5px" }}
       />
       <m.path
        d="M16 15.5v.01"
        variants={chipVariants}
        custom={3}
        style={{ transformBox: "view-box", originX: "16px", originY: "15.5px" }}
       />
       <m.path
        d="M12 12v.01"
        variants={chipVariants}
        custom={1}
        style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
       />
       <m.path
        d="M11 17v.01"
        variants={chipVariants}
        custom={4}
        style={{ transformBox: "view-box", originX: "11px", originY: "17px" }}
       />
       <m.path
        d="M7 14v.01"
        variants={chipVariants}
        custom={2}
        style={{ transformBox: "view-box", originX: "7px", originY: "14px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CookieIcon.displayName = "CookieIcon";
export { CookieIcon };
