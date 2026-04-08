import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CopyrightIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CopyrightIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const CopyrightIcon = forwardRef<CopyrightIconHandle, CopyrightIconProps>(
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
   [controls, reduced, onMouseEnter, isAnimated],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const iconVariants: Variants = {
   normal: { scale: 1, rotate: 0, transition: { duration: 0 } },
   animate: {
    scale: [1, 1.1, 0.95, 1.1, 0.95, 1],
    rotate: [0, 180, 360],
    transition: {
     scale: { duration: 1.5 * duration, ease: "easeInOut", repeat: 0 },
     rotate: { duration: 1.5 * duration, ease: "easeInOut", repeat: 0 },
    },
   },
  };

  const circleVariants: Variants = {
   normal: { pathLength: 1, opacity: 1, transition: { duration: 0 } },
   animate: {
    pathLength: [1, 0, 1],
    opacity: [1, 0.5, 1],
    transition: { duration: 1.5 * duration, ease: "easeInOut", repeat: 0 },
   },
  };

  const cVariants: Variants = {
   normal: {
    pathLength: 1,
    opacity: 1,
    scale: 1,
    transition: { duration: 0 },
   },
   animate: {
    pathLength: [1, 0, 1],
    opacity: [1, 0.3, 1],
    scale: [1, 0.8, 1],
    transition: {
     duration: 1.5 * duration,
     ease: "easeInOut",
     repeat: 0,
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
     animate={controls}
     initial="normal"
     variants={iconVariants}
    >
     <motion.circle cx="12" cy="12" r="10" variants={circleVariants} />
     <motion.path d="M14.83 14.83a4 4 0 1 1 0-5.66" variants={cVariants} />
    </motion.svg>
   </motion.div>
  );
 },
);

CopyrightIcon.displayName = "CopyrightIcon";
export { CopyrightIcon };
