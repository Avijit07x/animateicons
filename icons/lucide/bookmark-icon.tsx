"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface BookmarkIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BookmarkIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const BookmarkIcon = forwardRef<BookmarkIconHandle, BookmarkIconProps>(
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
  const controls = useAnimation();
  const sparkControls = useAnimation();
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );

  const bookmarkVariants: Variants = {
   normal: { y: 0, scale: 1 },
   animate: {
    y: [0, -2, 1, 0],
    scale: [1, 1.04, 0.98, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
    },
   },
  };

  return (
   <motion.div
    className={cn("relative inline-flex", className)}
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
     variants={bookmarkVariants}
     animate={controls}
     initial="normal"
    >
     <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </motion.svg>
   </motion.div>
  );
 },
);

BookmarkIcon.displayName = "BookmarkIcon";
export { BookmarkIcon };
