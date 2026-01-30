"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BookmarkMinusIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BookmarkMinusIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const BookmarkMinusIcon = forwardRef<
 BookmarkMinusIconHandle,
 BookmarkMinusIconProps
>(
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

  const bookmarkVariants: Variants = {
   normal: { scale: 1, y: 0 },
   animate: {
    scale: [1, 1.05, 0.95, 1],
    y: [0, -2, 0],
    transition: { duration: 1.2 * duration, ease: "easeInOut" },
   },
  };

  const minusVariants: Variants = {
   normal: { scaleX: 1, opacity: 1 },
   animate: {
    scaleX: [1, 0.7, 1.2, 1],
    opacity: [1, 0.6, 1],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
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
     animate={controls}
     initial="normal"
     variants={bookmarkVariants}
    >
     <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
     <motion.line x1="15" x2="9" y1="10" y2="10" variants={minusVariants} />
    </motion.svg>
   </motion.div>
  );
 },
);

BookmarkMinusIcon.displayName = "BookmarkMinusIcon";
export { BookmarkMinusIcon };
