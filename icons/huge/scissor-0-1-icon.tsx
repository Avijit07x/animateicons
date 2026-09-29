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
export interface Scissor01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Scissor01IconProps extends Omit<
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

const Scissor01Icon = forwardRef<Scissor01IconHandle, Scissor01IconProps>(
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

  const upperVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -24, 4, -24, 0],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.25, 0.5, 0.75, 1],
    },
   },
  };

  const lowerVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, 24, -4, 24, 0],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.25, 0.5, 0.75, 1],
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
      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" />
      <m.g
       variants={upperVariants}
       style={{ transformBox: "view-box", originX: "10.6px", originY: "12px" }}
      >
       <path d="M10.6 12L7 9" />
       <path d="M10.6 12L13.4949 14.3865" />
       <path d="M16 15.5C16 16.3284 15.3284 17 14.5 17C13.6716 17 13 16.3284 13 15.5C13 14.6716 13.6716 14 14.5 14C15.3284 14 16 14.6716 16 15.5Z" />
      </m.g>
      <m.g
       variants={lowerVariants}
       style={{ transformBox: "view-box", originX: "10.6px", originY: "12px" }}
      >
       <path d="M10.6 12L7 15" />
       <path d="M13.4368 9.55807L10.6 12" />
       <path d="M16 8.5C16 9.32843 15.3284 10 14.5 10C13.6716 10 13 9.32843 13 8.5C13 7.67157 13.6716 7 14.5 7C15.3284 7 16 7.67157 16 8.5Z" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Scissor01Icon.displayName = "Scissor01Icon";
export { Scissor01Icon };
