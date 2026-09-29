"use client";

import { cn } from "@/lib/utils";
import type { Variants } from "motion/react";
import {
 LazyMotion,
 domMin,
 m,
 useAnimation,
 useReducedMotion,
} from "motion/react";
import {
 forwardRef,
 useCallback,
 useImperativeHandle,
 useRef,
 type HTMLAttributes,
} from "react";
export interface WifiCogIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface WifiCogIconProps extends Omit<
 HTMLAttributes<HTMLDivElement>,
 | "color"
 | "onDrag"
 | "onDragStart"
 | "onDragEnd"
 | "onAnimationStart"
 | "onAnimationEnd"
 | "onAnimationIteration"
> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
 color?: string;
}

const WifiCogIcon = forwardRef<WifiCogIconHandle, WifiCogIconProps>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 1,
   isAnimated = true,
   color,
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

  const cogVariants: Variants = {
   normal: { rotate: 0, transition: { duration: 0 } },
   animate: {
    rotate: [0, 360],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
   },
  };

  const arcVariants = (i: number): Variants => ({
   normal: { y: 0 },
   animate: {
    y: [0, -1, 0.3, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
     delay: (0.1 + i * 0.08) * duration,
    },
   },
  });

  return (
   <LazyMotion features={domMin} strict>
    <m.div
     className={cn("inline-flex items-center justify-center", className)}
     onMouseEnter={handleEnter}
     onMouseLeave={handleLeave}
     {...props}
     style={{ color, ...props.style }}
    >
     <m.svg
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
     >
      <m.g
       variants={cogVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "18px" }}
      >
       <path d="m14.305 19.53.923-.382" />
       <path d="m15.228 16.852-.923-.383" />
       <path d="m16.852 15.228-.383-.923" />
       <path d="m16.852 20.772-.383.924" />
       <path d="m19.148 15.228.383-.923" />
       <path d="m19.53 21.696-.382-.924" />
       <path d="m20.772 16.852.924-.383" />
       <path d="m20.772 19.148.924.383" />
       <circle cx="18" cy="18" r="3" />
      </m.g>
      <m.path d="M2 7.82a15 15 0 0 1 20 0" variants={arcVariants(2)} />
      <m.path d="M5 11.858a10 10 0 0 1 11.5-1.785" variants={arcVariants(1)} />
      <m.path d="M8.5 15.429a5 5 0 0 1 2.413-1.31" variants={arcVariants(0)} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

WifiCogIcon.displayName = "WifiCogIcon";
export { WifiCogIcon };
