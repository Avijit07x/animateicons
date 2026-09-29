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

  const lineVariants = (delay: number, length: number): Variants => ({
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [-length, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.4 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
     opacity: {
      duration: 0.25 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={controls}
      initial="normal"
     >
      <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
      <path d="M14 2v5a1 1 0 0 0 1 1h5" />
      <m.path
       d="M10 9H8"
       strokeDasharray="3"
       strokeDashoffset="0"
       variants={lineVariants(0, 3)}
      />
      <m.path
       d="M16 13H8"
       strokeDasharray="9"
       strokeDashoffset="0"
       variants={lineVariants(0.15, 9)}
      />
      <m.path
       d="M16 17H8"
       strokeDasharray="9"
       strokeDashoffset="0"
       variants={lineVariants(0.3, 9)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FileTextIcon.displayName = "FileTextIcon";
export { FileTextIcon };
