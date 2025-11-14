"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import {
 forwardRef,
 useCallback,
 useEffect,
 useImperativeHandle,
 useRef,
} from "react";

export interface ExternalLinkIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface EyeClosedIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const EyeClosedIcon = forwardRef<ExternalLinkIconHandle, EyeClosedIconProps>(
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
  const arcControls = useAnimation();
  const lashesControls = useAnimation();
  const squeezeControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);
  const idleTimer = useRef<number | null>(null);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () => {
     if (reduced) {
      arcControls.start("normal");
      lashesControls.start("normal");
      squeezeControls.start("normal");
     } else {
      arcControls.start("animate");
      lashesControls.start("flick");
      squeezeControls.start("idle");
     }
    },
    stopAnimation: () => {
     arcControls.start("normal");
     lashesControls.start("normal");
     squeezeControls.start("normal");
    },
   };
  });

  useEffect(() => {
   if (!isAnimated || reduced) return;
   const loop = async () => {
    await squeezeControls.start("idle");
    const delay = 2500 + Math.random() * 3000;
    idleTimer.current = window.setTimeout(loop, delay);
   };
   loop();
   return () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
   };
  }, [squeezeControls, reduced]);

  const handleEnter = useCallback(() => {
   if (!isAnimated || reduced) return;
   if (!isControlled.current) {
    arcControls.start("pulse");
    lashesControls.start("flick");
    squeezeControls.start("hover");
   }
  }, [arcControls, lashesControls, squeezeControls, reduced]);

  const handleLeave = useCallback(() => {
   if (!isControlled.current) {
    arcControls.start("normal");
    lashesControls.start("normal");
    squeezeControls.start("normal");
   }
  }, [arcControls, lashesControls, squeezeControls]);

  const arcVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0.5, 1],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
   },
   pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
   },
  };

  const lashesVariants: Variants = {
   normal: { rotate: 0, y: 0, opacity: 1 },
   flick: (i: number) => ({
    rotate: [0, -12, 8, 0],
    y: [0, -2, 1, 0],
    opacity: [1, 0.7, 1, 1],
    transition: {
     duration: 0.6 * duration,
     delay: i * 0.05,
     ease: "easeInOut",
    },
   }),
  };

  const squeezeVariants: Variants = {
   normal: { scaleY: 1 },
   idle: {
    scaleY: [1, 0.85, 1],
    transition: { duration: 0.3 * duration, ease: "easeInOut" },
   },
   hover: {
    scaleY: [1, 0.8, 1],
    transition: { duration: 0.25 * duration, ease: "easeInOut" },
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
     strokeWidth={2}
     strokeLinecap="round"
     strokeLinejoin="round"
     animate={squeezeControls}
     variants={squeezeVariants}
    >
     <motion.path
      d="M2 8a10.645 10.645 0 0 0 20 0"
      variants={arcVariants}
      initial="normal"
      animate={arcControls}
     />
     <motion.path
      d="m15 18-.722-3.25"
      custom={0}
      variants={lashesVariants}
      initial="normal"
      animate={lashesControls}
     />
     <motion.path
      d="m9 18 .722-3.25"
      custom={1}
      variants={lashesVariants}
      initial="normal"
      animate={lashesControls}
     />
     <motion.path
      d="m20 15-1.726-2.05"
      custom={2}
      variants={lashesVariants}
      initial="normal"
      animate={lashesControls}
     />
     <motion.path
      d="m4 15 1.726-2.05"
      custom={3}
      variants={lashesVariants}
      initial="normal"
      animate={lashesControls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

EyeClosedIcon.displayName = "EyeClosedIcon";
export { EyeClosedIcon };
