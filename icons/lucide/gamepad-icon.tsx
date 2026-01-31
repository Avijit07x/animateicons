"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface GamepadHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GamepadProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const GamepadIcon = forwardRef<GamepadHandle, GamepadProps>(
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

  const bodyVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.95, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
    },
   },
  };

  const buttonVariants: Variants = {
   normal: { scale: 1, rotate: 0 },
   animate: {
    scale: [1, 0.85, 1],
    rotate: [0, 20, -20, 0],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
    },
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
    >
     <motion.path
      d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"
      variants={bodyVariants}
      initial="normal"
      animate={controls}
      style={{
       transformBox: "fill-box",
       transformOrigin: "center",
      }}
     />

     <motion.line
      x1="6"
      x2="10"
      y1="11"
      y2="11"
      variants={buttonVariants}
      initial="normal"
      animate={controls}
     />
     <motion.line
      x1="8"
      x2="8"
      y1="9"
      y2="13"
      variants={buttonVariants}
      initial="normal"
      animate={controls}
     />

     <motion.line
      x1="15"
      x2="15.01"
      y1="12"
      y2="12"
      variants={buttonVariants}
      initial="normal"
      animate={controls}
     />
     <motion.line
      x1="18"
      x2="18.01"
      y1="10"
      y2="10"
      variants={buttonVariants}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

GamepadIcon.displayName = "GamepadIcon";
export { GamepadIcon };
