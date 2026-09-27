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
export interface SirenIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SirenIconProps extends Omit<
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

const SirenIcon = forwardRef<SirenIconHandle, SirenIconProps>(
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

  const domeVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const rayVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [1, 0, 1.8, 1],
    opacity: [1, 0, 1, 1],
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
       variants={domeVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "20px" }}
      >
       <path d="M7 18v-6a5 5 0 1 1 10 0v6" />
       <path d="M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" />
       <path d="M12 12v6" />
      </m.g>
      <m.path
       d="M21 12h1"
       variants={rayVariants}
       custom={4}
       style={{ transformBox: "view-box", originX: "21.5px", originY: "12px" }}
      />
      <m.path
       d="M18.5 4.5 18 5"
       variants={rayVariants}
       custom={3}
       style={{
        transformBox: "view-box",
        originX: "18.25px",
        originY: "4.75px",
       }}
      />
      <m.path
       d="M2 12h1"
       variants={rayVariants}
       custom={0}
       style={{ transformBox: "view-box", originX: "2.5px", originY: "12px" }}
      />
      <m.path
       d="M12 2v1"
       variants={rayVariants}
       custom={2}
       style={{ transformBox: "view-box", originX: "12px", originY: "2.5px" }}
      />
      <m.path
       d="m4.929 4.929.707.707"
       variants={rayVariants}
       custom={1}
       style={{
        transformBox: "view-box",
        originX: "5.28px",
        originY: "5.28px",
       }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SirenIcon.displayName = "SirenIcon";
export { SirenIcon };
