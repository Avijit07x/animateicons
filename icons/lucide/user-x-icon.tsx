"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface UserXHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface UserXProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const UserXIcon = forwardRef<UserXHandle, UserXProps>(
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
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [40, 0],
    opacity: [0.3, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut" as const,
    },
   },
  };

  const headVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [0.5, 1.2, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeOut" as const,
    },
   },
  };

  const crossGroupVariants: Variants = {
   normal: { scale: 1, rotate: 0, opacity: 1 },
   animate: {
    scale: [1, 1.3, 1],
    rotate: [0, -10, 10, 0],
    opacity: [0.3, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut" as const,
    },
   },
  };

  const crossLineVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [20, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut" as const,
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
     className="lucide lucide-user-x-icon lucide-user-x"
    >
     <motion.path
      d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
      strokeDasharray="40"
      strokeDashoffset="40"
      variants={bodyVariants}
      initial="normal"
      animate={controls}
     />
     <motion.circle
      cx="9"
      cy="7"
      r="4"
      variants={headVariants}
      initial="normal"
      animate={controls}
     />

     <motion.g
      variants={crossGroupVariants}
      initial="normal"
      animate={controls}
     >
      <motion.line
       x1="17"
       x2="22"
       y1="8"
       y2="13"
       strokeDasharray="20"
       strokeDashoffset="20"
       variants={crossLineVariants}
       initial="normal"
       animate={controls}
      />
      <motion.line
       x1="22"
       x2="17"
       y1="8"
       y2="13"
       strokeDasharray="20"
       strokeDashoffset="20"
       variants={crossLineVariants}
       initial="normal"
       animate={controls}
      />
     </motion.g>
    </motion.svg>
   </motion.div>
  );
 },
);

UserXIcon.displayName = "UserXIcon";
export { UserXIcon };
