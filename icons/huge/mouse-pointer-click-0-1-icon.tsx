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
export interface MousePointerClick01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MousePointerClick01IconProps extends Omit<
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

const MousePointerClick01Icon = forwardRef<
 MousePointerClick01IconHandle,
 MousePointerClick01IconProps
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

  const pointerVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.88, 1.02, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const rayVariants: Variants = {
   normal: { opacity: 1, scale: 1 },
   animate: {
    opacity: [1, 0.2, 1],
    scale: [1, 1.35, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: 0.15 * duration,
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
       d="M9 4V2"
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "9px", originY: "9px" }}
      />
      <m.path
       d="M5 5L3.5 3.5"
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "9px", originY: "9px" }}
      />
      <m.path
       d="M4 9H2"
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "9px", originY: "9px" }}
      />
      <m.path
       d="M5 13L3.5 14.5"
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "9px", originY: "9px" }}
      />
      <m.path
       d="M14.5 3.5L13 5"
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "9px", originY: "9px" }}
      />
      <m.path
       d="M12.669 8.35811L17.6969 10.3256C20.5969 11.4604 22.0469 12.0277 21.9988 12.9278C21.9508 13.8278 20.4375 14.2405 17.4111 15.0659C16.5099 15.3117 16.0593 15.4346 15.7469 15.7469C15.4346 16.0593 15.3117 16.5099 15.0659 17.4111C14.2405 20.4375 13.8278 21.9508 12.9278 21.9988C12.0277 22.0469 11.4604 20.5969 10.3256 17.6969L8.35811 12.669C7.17004 9.63279 6.57601 8.1147 7.34535 7.34535C8.1147 6.57601 9.63279 7.17004 12.669 8.35811Z"
       variants={pointerVariants}
       style={{ transformBox: "view-box", originX: "9px", originY: "9px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MousePointerClick01Icon.displayName = "MousePointerClick01Icon";
export { MousePointerClick01Icon };
