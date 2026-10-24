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
export interface HouseCogIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface HouseCogIconProps extends Omit<
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

const HouseCogIcon = forwardRef<HouseCogIconHandle, HouseCogIconProps>(
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

  const houseVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.8, 1.06, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.75, 1],
    },
   },
  };

  const doorVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [15, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.45 * duration,
      ease: "easeOut",
      delay: 0.35 * duration,
     },
     opacity: { duration: 0.25 * duration, delay: 0.35 * duration },
    },
   },
  };

  const cogVariants: Variants = {
   normal: { rotate: 0, transition: { duration: 0 } },
   animate: {
    rotate: [0, 360],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
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
       variants={houseVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "21px" }}
      >
       <path d="M10.584 21H5a2 2 0 01-2-2v-9a2 2 0 01.709-1.527l7-6a2 2 0 012.582 0l7 6A2 2 0 0121 10.001v.583" />
       <m.path
        d="M14 12H10a1 1 0 00-1 1v8"
        strokeDasharray="15"
        strokeDashoffset="0"
        variants={doorVariants}
       />
      </m.g>
      <m.g
       variants={cogVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "18px" }}
      >
       <circle cx="18" cy="18" r="3" />
       <path d="m14.305 19.53.923-.382" />
       <path d="m15.229 16.852-.924-.383" />
       <path d="m16.852 15.228-.383-.923" />
       <path d="m16.852 20.773-.383.924" />
       <path d="m19.148 15.228.383-.923" />
       <path d="m19.53 21.697-.382-.924" />
       <path d="m20.773 16.852.922-.383" />
       <path d="m20.773 19.148.922.383" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

HouseCogIcon.displayName = "HouseCogIcon";
export { HouseCogIcon };
