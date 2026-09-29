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
export interface PodcastIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PodcastIconProps extends Omit<
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

const PodcastIcon = forwardRef<PodcastIconHandle, PodcastIconProps>(
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

  const micVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.12, 0.97, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const waveVariants = (peak: number, delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, peak, 0.98, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
     delay: delay * duration,
    },
   },
  });

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
      <path d="M12 17v4" />
      <path d="M9 21h6" />
      <m.rect
       x="10"
       y="9"
       width="4"
       height="8"
       rx="2"
       variants={micVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "13px" }}
      />
      <m.g
       variants={waveVariants(1.15, 0.1)}
       style={{ transformBox: "view-box", originX: "12px", originY: "11px" }}
      >
       <path d="M18 11a6 6 0 00-3-5.197" />
       <path d="M6 11a6 6 0 013-5.197" />
      </m.g>
      <m.g
       variants={waveVariants(1.08, 0.2)}
       style={{ transformBox: "view-box", originX: "12px", originY: "11px" }}
      >
       <path d="M2 11a10 10 0 015-8.662" />
       <path d="M22 11a10 10 0 00-5-8.662" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PodcastIcon.displayName = "PodcastIcon";
export { PodcastIcon };
