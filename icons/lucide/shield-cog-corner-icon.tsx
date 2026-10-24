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
export interface ShieldCogCornerIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ShieldCogCornerIconProps extends Omit<
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

const ShieldCogCornerIcon = forwardRef<
 ShieldCogCornerIconHandle,
 ShieldCogCornerIconProps
>(
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

  const blockVariants: Variants = {
   normal: { rotate: 0, x: 0 },
   animate: {
    rotate: [0, -7, 4, -1.5, 0],
    x: [0, -0.6, 0.25, -0.1, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.2, 0.5, 0.78, 1],
    },
   },
  };

  const cogVariants: Variants = {
   normal: { rotate: 0, transition: { duration: 0 } },
   animate: {
    rotate: [0, 360],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
   },
  };

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
       variants={blockVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "22px" }}
      >
       <path d="M11 22c-3.806-1.45-7-3.966-7-9V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v4" />
       <m.g
        variants={cogVariants}
        style={{
         transformBox: "view-box",
         originX: "17.695px",
         originY: "17.695px",
        }}
       >
        <path d="M14.923 16.547 14 16.164" />
        <path d="m14.923 18.843-.923.383" />
        <path d="M16.547 14.923 16.164 14" />
        <path d="m16.547 20.467-.383.924" />
        <path d="m18.843 14.923.383-.923" />
        <path d="m19.225 21.391-.382-.924" />
        <path d="m20.467 16.547.923-.383" />
        <path d="m20.467 18.843.923.383" />
        <circle cx="17.695" cy="17.695" r="3" />
       </m.g>
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ShieldCogCornerIcon.displayName = "ShieldCogCornerIcon";
export { ShieldCogCornerIcon };
