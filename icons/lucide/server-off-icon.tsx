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
export interface ServerOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ServerOffIconProps extends Omit<
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

const ServerOffIcon = forwardRef<ServerOffIconHandle, ServerOffIconProps>(
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

  const unitVariants: Variants = {
   normal: { scaleY: 1 },
   animate: (i: number) => ({
    scaleY: [1, 0.92, 1.02, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
     delay: i * 0.15 * duration,
    },
   }),
  };

  const ledVariants: Variants = {
   normal: { opacity: 1, scale: 1 },
   animate: (i: number) => ({
    opacity: [1, 0.15, 1],
    scale: [1, 0.6, 1.2, 1],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: (0.1 + i * 0.15) * duration,
    },
   }),
  };

  const bodyVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.4, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const slashVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [31, 0],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
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
      <m.g variants={bodyVariants}>
       <m.g
        variants={unitVariants}
        custom={0}
        style={{ transformBox: "view-box", originX: "12px", originY: "6px" }}
       >
        <path d="M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" />
        <path d="M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z" />
       </m.g>
       <m.g
        variants={unitVariants}
        custom={1}
        style={{ transformBox: "view-box", originX: "12px", originY: "18px" }}
       >
        <path d="M22 17v-1a2 2 0 0 0-2-2h-1" />
        <path d="M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z" />
       </m.g>
       <m.path
        d="M6 18h.01"
        variants={ledVariants}
        custom={1}
        style={{ transformBox: "view-box", originX: "6px", originY: "18px" }}
       />
      </m.g>
      <m.path
       d="m2 2 20 20"
       strokeDasharray="30 200"
       strokeDashoffset="0"
       variants={slashVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ServerOffIcon.displayName = "ServerOffIcon";
export { ServerOffIcon };
