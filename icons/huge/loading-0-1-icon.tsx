"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface Loading01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Loading01IconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const Loading01Icon = forwardRef<Loading01IconHandle, Loading01IconProps>(
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

  const loaderVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0.3 * duration } },
   animate: {
    rotate: 360,
    scale: [1, 1.1, 1],
    transition: {
     rotate: { duration: 1 * duration, ease: "linear", repeat: Infinity },
     scale: {
      duration: 0.6 * duration,
      repeat: Infinity,
      repeatType: "mirror",
     },
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
     initial="normal"
     animate={controls}
     variants={loaderVariants}
     style={{ transformOrigin: "center" }}
    >
     <path d="M12 3V6" />
     <path d="M12 18V21" />
     <path d="M21 12L18 12" />
     <path d="M6 12L3 12" />
     <path d="M18.3635 5.63672L16.2422 7.75804" />
     <path d="M7.75804 16.2422L5.63672 18.3635" />
     <path d="M18.3635 18.3635L16.2422 16.2422" />
     <path d="M7.75804 7.75804L5.63672 5.63672" />
    </motion.svg>
   </motion.div>
  );
 },
);

Loading01Icon.displayName = "Loading01Icon";
export { Loading01Icon };
