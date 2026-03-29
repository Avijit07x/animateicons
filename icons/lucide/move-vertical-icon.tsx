"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface MoveVerticalIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MoveVerticalIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const MoveVerticalIcon = forwardRef<
 MoveVerticalIconHandle,
 MoveVerticalIconProps
>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 0.6,
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

  const iconVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.05, 1],
    transition: { duration: duration, ease: "easeInOut" },
   },
  };

  const topArrowVariants: Variants = {
   normal: { y: 0, opacity: 1 },
   animate: {
    y: [-1, -3, 0],
    opacity: [1, 0.7, 1],
    transition: { duration: duration, ease: "easeInOut" },
   },
  };

  const bottomArrowVariants: Variants = {
   normal: { y: 0, opacity: 1 },
   animate: {
    y: [1, 3, 0],
    opacity: [1, 0.7, 1],
    transition: { duration: duration, ease: "easeInOut" },
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
     variants={iconVariants}
    >
     <path d="M12 2v20" />

     <motion.path
      d="m8 6 4-4 4 4"
      variants={topArrowVariants}
      initial="normal"
      animate={controls}
     />

     <motion.path
      d="m8 18 4 4 4-4"
      variants={bottomArrowVariants}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

MoveVerticalIcon.displayName = "MoveVerticalIcon";
export { MoveVerticalIcon };
