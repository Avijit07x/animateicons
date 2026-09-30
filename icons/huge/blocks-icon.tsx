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
export interface BlocksIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BlocksIconProps extends Omit<
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

const BlocksIcon = forwardRef<BlocksIconHandle, BlocksIconProps>(
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

  const baseVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.9, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

  const dropVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -3.5, 0.6, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
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
       d="M4.85195 20.7716C5.40326 21 6.10218 21 7.5 21C8.89782 21 9.59674 21 10.1481 20.7716C10.8831 20.4672 11.4672 19.8831 11.7716 19.1481C12 18.5967 12 17.8978 12 16.5C12 15.1022 12 14.4033 11.7716 13.8519C11.4672 13.1169 10.8831 12.5328 10.1481 12.2284C9.59674 12 8.89782 12 7.5 12C6.10218 12 5.40326 12 4.85195 12.2284C4.11687 12.5328 3.53284 13.1169 3.22836 13.8519C3 14.4033 3 15.1022 3 16.5C3 17.8978 3 18.5967 3.22836 19.1481C3.53284 19.8831 4.11687 20.4672 4.85195 20.7716Z"
       variants={baseVariants(0.3)}
       style={{ transformBox: "view-box", originX: "7.5px", originY: "16.5px" }}
      />
      <m.path
       d="M13.8519 20.7716C14.4033 21 15.1022 21 16.5 21C17.8978 21 18.5967 21 19.1481 20.7716C19.8831 20.4672 20.4672 19.8831 20.7716 19.1481C21 18.5967 21 17.8978 21 16.5C21 15.1022 21 14.4033 20.7716 13.8519C20.4672 13.1169 19.8831 12.5328 19.1481 12.2284C18.5967 12 17.8978 12 16.5 12C15.1022 12 14.4033 12 13.8519 12.2284C13.1169 12.5328 12.5328 13.1169 12.2284 13.8519C12 14.4033 12 15.1022 12 16.5C12 17.8978 12 18.5967 12.2284 19.1481C12.5328 19.8831 13.1169 20.4672 13.8519 20.7716Z"
       variants={baseVariants(0.36)}
       style={{
        transformBox: "view-box",
        originX: "16.5px",
        originY: "16.5px",
       }}
      />
      <m.path
       d="M9.35195 11.7716C9.90326 12 10.6022 12 12 12C13.3978 12 14.0967 12 14.6481 11.7716C15.3831 11.4672 15.9672 10.8831 16.2716 10.1481C16.5 9.59674 16.5 8.89782 16.5 7.5C16.5 6.10218 16.5 5.40326 16.2716 4.85195C15.9672 4.11687 15.3831 3.53284 14.6481 3.22836C14.0967 3 13.3978 3 12 3C10.6022 3 9.90326 3 9.35195 3.22836C8.61687 3.53284 8.03284 4.11687 7.72836 4.85195C7.5 5.40326 7.5 6.10218 7.5 7.5C7.5 8.89782 7.5 9.59674 7.72836 10.1481C8.03284 10.8831 8.61687 11.4672 9.35195 11.7716Z"
       variants={dropVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BlocksIcon.displayName = "BlocksIcon";
export { BlocksIcon };
