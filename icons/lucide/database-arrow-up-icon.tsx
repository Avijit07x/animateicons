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
export interface DatabaseArrowUpIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface DatabaseArrowUpIconProps extends Omit<
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

const DatabaseArrowUpIcon = forwardRef<
 DatabaseArrowUpIconHandle,
 DatabaseArrowUpIconProps
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

  const recordVariants: Variants = {
   normal: { y: 0, opacity: 0 },
   animate: {
    y: [-11, 0, 0.6, 0],
    opacity: [0, 1, 1, 0, 0],
    transition: {
     y: {
      duration: 0.8 * duration,
      times: [0, 0.4, 0.5, 1],
      ease: ["easeIn", "easeOut", "easeInOut"],
     },
     opacity: {
      duration: 0.8 * duration,
      times: [0, 0.1, 0.4, 0.5, 1],
      ease: "easeInOut",
     },
    },
   },
  };

  const lidVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, 0, 1, -0.3, 0],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.58, 0.8, 1],
    },
   },
  };

  const ringVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, 0, 1.4, -0.35, 0],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.45, 0.63, 0.84, 1],
    },
   },
  };

  const bodyVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 1, 0.96, 1.01, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.6, 0.82, 1],
    },
   },
  };

  const arrowVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -1, 0.3, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
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
      <m.ellipse cx="12" cy="5" rx="4" ry="1.3" variants={recordVariants} />
      <m.ellipse cx="12" cy="5" rx="9" ry="3" variants={lidVariants} />
      <m.g
       variants={bodyVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "22px" }}
      >
       <path d="M21 12.536V5" />
       <path d="M3 5V19A9 3 0 0 0 13.318 21.968" />
      </m.g>
      <m.path d="M3 12A9 3 0 0 0 14.457 14.886" variants={ringVariants} />
      <m.g variants={arrowVariants}>
       <path d="M19 22v-6" />
       <path d="m22 19-3-3-3 3" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

DatabaseArrowUpIcon.displayName = "DatabaseArrowUpIcon";
export { DatabaseArrowUpIcon };
