"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface FacebookIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FacebookIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const FacebookIcon = forwardRef<FacebookIconHandle, FacebookIconProps>(
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

  const containerVariants: Variants = {
   normal: {
    scale: 1,
    y: 0,
   },
   animate: {
    scale: [1, 1.035, 1],
    y: [0, -1, 0],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
    },
   },
  };

  const logoVariants: Variants = {
   normal: {
    pathLength: 1,
    opacity: 1,
   },
   animate: {
    pathLength: [0, 1],
    opacity: [0.4, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.1,
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
     width={size}
     height={size}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinejoin="round"
     initial="normal"
     animate={controls}
     variants={containerVariants}
    >
     <motion.path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.18182 10.3333C5.20406 10.3333 5 10.5252 5 11.4444V13.1111C5 14.0304 5.20406 14.2222 6.18182 14.2222H8.54545V20.8889C8.54545 21.8081 8.74951 22 9.72727 22H12.0909C13.0687 22 13.2727 21.8081 13.2727 20.8889V14.2222H15.9267C16.6683 14.2222 16.8594 14.0867 17.0631 13.4164L17.5696 11.7497C17.9185 10.6014 17.7035 10.3333 16.4332 10.3333H13.2727V7.55556C13.2727 6.94191 13.8018 6.44444 14.4545 6.44444H17.8182C18.7959 6.44444 19 6.25259 19 5.33333V3.11111C19 2.19185 18.7959 2 17.8182 2H14.4545C11.191 2 8.54545 4.48731 8.54545 7.55556V10.3333H6.18182Z"
      variants={logoVariants}
      style={{
       transformBox: "fill-box",
       transformOrigin: "center",
      }}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

FacebookIcon.displayName = "FacebookIcon";
export { FacebookIcon };
