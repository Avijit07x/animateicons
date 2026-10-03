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

export interface FileCodeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FileCodeIconProps extends Omit<
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

const FileCodeIcon = forwardRef<FileCodeIconHandle, FileCodeIconProps>(
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

  const leftVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, -1.2, 0.3, 0],
    y: [0, 0, 0, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };
  const rightVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, 1.2, -0.3, 0],
    y: [0, 0, 0, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const popVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.08, 0.98, 1],
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
      <m.g
       variants={popVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
       <path d="M14 2v5a1 1 0 0 0 1 1h5" />
       <m.path d="M10 12.5 8 15l2 2.5" variants={leftVariants} />
       <m.path d="m14 12.5 2 2.5-2 2.5" variants={rightVariants} />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FileCodeIcon.displayName = "FileCodeIcon";
export { FileCodeIcon };
