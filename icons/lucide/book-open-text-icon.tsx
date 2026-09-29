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
export interface BookOpenTextIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BookOpenTextIconProps extends Omit<
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

const BookOpenTextIcon = forwardRef<
 BookOpenTextIconHandle,
 BookOpenTextIconProps
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

  const lineVariants: Variants = {
   normal: { scaleX: 1 },
   animate: (i: number) => ({
    scaleX: [1, 0.2, 1],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: i * 0.1 * duration,
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
      <path d="M12 5v16" />
      <m.path
       d="M6 9h2"
       custom={0}
       variants={lineVariants}
       style={{ transformBox: "view-box", originX: "6px", originY: "9px" }}
      />
      <m.path
       d="M6 13h2"
       custom={1}
       variants={lineVariants}
       style={{ transformBox: "view-box", originX: "6px", originY: "13px" }}
      />
      <m.path
       d="M16 9h2"
       custom={2}
       variants={lineVariants}
       style={{ transformBox: "view-box", originX: "16px", originY: "9px" }}
      />
      <m.path
       d="M16 13h2"
       custom={3}
       variants={lineVariants}
       style={{ transformBox: "view-box", originX: "16px", originY: "13px" }}
      />
      <path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BookOpenTextIcon.displayName = "BookOpenTextIcon";
export { BookOpenTextIcon };
