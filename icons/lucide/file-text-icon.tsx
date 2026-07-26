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

export interface FileTextIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FileTextIconProps extends Omit<
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

const FileTextIcon = forwardRef<FileTextIconHandle, FileTextIconProps>(
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
  const lineControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   lineControls.start("write");
  }, [lineControls, reduced]);

  const stop = useCallback(() => {
   lineControls.start("rest");
  }, [lineControls]);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: start,
    stopAnimation: stop,
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) start();
    else onMouseEnter?.(e as any);
   },
   [isAnimated, reduced, start, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) stop();
    else onMouseLeave?.(e);
   },
   [stop, onMouseLeave],
  );

  const lineVariants = (i: number): Variants => ({
   rest: { pathLength: 1, opacity: 1 },
   write: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.9 * duration,
     ease: [0.16, 1, 0.3, 1],
     delay: i * 0.12 * duration,
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
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
     >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <m.path
       d="M10 9H8"
       animate={lineControls}
       initial="rest"
       variants={lineVariants(0)}
       style={{ transformBox: "fill-box", transformOrigin: "left center" }}
      />
      <m.path
       d="M16 13H8"
       animate={lineControls}
       initial="rest"
       variants={lineVariants(1)}
       style={{ transformBox: "fill-box", transformOrigin: "left center" }}
      />
      <m.path
       d="M16 17H8"
       animate={lineControls}
       initial="rest"
       variants={lineVariants(2)}
       style={{ transformBox: "fill-box", transformOrigin: "left center" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FileTextIcon.displayName = "FileTextIcon";
export { FileTextIcon };
