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
export interface FileBlockIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FileBlockIconProps extends Omit<
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

const FileBlockIcon = forwardRef<FileBlockIconHandle, FileBlockIconProps>(
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

  const blockVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 180],
    scale: [1, 1.25, 1],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
   },
  };

  const fileVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.04, 1],
    transition: { duration: 0.4 * duration, ease: "easeInOut" },
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
       d="M4 11.0004L4 14.5446C4 17.7896 4 19.4121 4.88607 20.5111C5.06508 20.7331 5.26731 20.9354 5.48933 21.1144C6.58831 22.0004 8.21082 22.0004 11.4558 22.0004C12.1614 22.0004 12.5141 22.0004 12.8372 21.8864C12.9044 21.8627 12.9702 21.8354 13.0345 21.8047C13.3436 21.6569 13.593 21.4074 14.0919 20.9085L18.8284 16.172C19.4065 15.5939 19.6955 15.3049 19.8478 14.9374C20 14.5698 20 14.1611 20 13.3436V10.0004C20 6.22919 20 4.34358 18.8284 3.172C17.7693 2.11284 16.1265 2.01122 13.0345 2.00146M13 21.5004V21.0004C13 18.172 13 16.7578 13.8787 15.8791C14.7574 15.0004 16.1716 15.0004 19 15.0004H19.5"
       variants={fileVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M9.97487 7.97438C10.6082 7.34101 11 6.46601 11 5.49951C11 3.56651 9.433 1.99951 7.5 1.99951C6.5335 1.99951 5.6585 2.39126 5.02513 3.02464M9.97487 7.97438C9.3415 8.60776 8.4665 8.99951 7.5 8.99951C5.567 8.99951 4 7.43251 4 5.49951C4 4.53301 4.39175 3.65801 5.02513 3.02464M9.97487 7.97438L5.02513 3.02464"
       variants={blockVariants}
       style={{ transformBox: "view-box", originX: "7.5px", originY: "5.5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FileBlockIcon.displayName = "FileBlockIcon";
export { FileBlockIcon };
