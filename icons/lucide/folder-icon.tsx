"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface FolderIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FolderIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const FolderIcon = forwardRef<FolderIconHandle, FolderIconProps>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 1,
   isAnimated = true,
   ...props
  },
  ref,
 ) => {
  const folderControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () =>
     reduced ? folderControls.start("normal") : folderControls.start("animate"),
    stopAnimation: () => folderControls.start("normal"),
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     folderControls.start("animate");
    } else {
     onMouseEnter?.(e as any);
    }
   },
   [folderControls, reduced, onMouseEnter, isAnimated],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     folderControls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [folderControls, onMouseLeave],
  );

  const folderVariants: Variants = {
   normal: { scale: 1, rotate: 0, y: 0 },
   animate: {
    scale: [1, 1.05, 0.98, 1],
    rotate: [0, -2, 2, 0],
    y: [0, -2, 1, 0],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
   },
  };

  return (
   <motion.div
    className={cn("inline-flex items-center justify-center", className)}
    onMouseEnter={handleEnter}
    onMouseLeave={handleLeave}
    {...props}
   >
    <motion.svg
     xmlns="http://www.w3.org/2000/svg"
     width={size}
     height={size}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     animate={folderControls}
     initial="normal"
     variants={folderVariants}
    >
     <motion.path
      d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      initial="normal"
      animate={folderControls}
      variants={folderVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

FolderIcon.displayName = "FolderIcon";
export { FolderIcon };
