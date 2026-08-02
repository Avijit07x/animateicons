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
export interface ListOrderedIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ListOrderedIconProps extends Omit<
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

const ListOrderedIcon = forwardRef<ListOrderedIconHandle, ListOrderedIconProps>(
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );

  const wipeVariants: Variants = {
   normal: { scaleX: 1, opacity: 1 },
   animate: (i: number) => ({
    scaleX: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.4 * duration,
     delay: (0.06 + i * 0.1) * duration,
     ease: [0.16, 1, 0.3, 1],
    },
   }),
  };

  const drawVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: (i: number) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.45 * duration,
     delay: (0.05 + i * 0.12) * duration,
     ease: [0.16, 1, 0.3, 1],
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
      <m.path
       d="M11 5h10"
       custom={0}
       variants={wipeVariants}
       style={{ transformBox: "view-box", originX: "11px", originY: "5px" }}
      />
      <m.path
       d="M11 12h10"
       custom={1}
       variants={wipeVariants}
       style={{ transformBox: "view-box", originX: "11px", originY: "12px" }}
      />
      <m.path
       d="M11 19h10"
       custom={2}
       variants={wipeVariants}
       style={{ transformBox: "view-box", originX: "11px", originY: "19px" }}
      />
      <m.path d="M4 4h1v5" custom={0} variants={drawVariants} />
      <m.path d="M4 9h2" custom={0} variants={drawVariants} />
      <m.path
       d="M6.5 20H3.4c0-1 2.6-1.925 2.6-3.5a1.5 1.5 0 0 0-2.6-1.02"
       custom={1}
       variants={drawVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ListOrderedIcon.displayName = "ListOrderedIcon";
export { ListOrderedIcon };
