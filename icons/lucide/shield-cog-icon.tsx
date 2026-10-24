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
export interface ShieldCogIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ShieldCogIconProps extends Omit<
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

const ShieldCogIcon = forwardRef<ShieldCogIconHandle, ShieldCogIconProps>(
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
       <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
       <m.g
        variants={cogVariants}
        style={{
         transformBox: "view-box",
         originX: "12.077px",
         originY: "11.695px",
        }}
       >
        <path d="m10.929 14.467-.383.924" />
        <path d="M10.929 8.923 10.546 8" />
        <path d="M13.225 8.923 13.608 8" />
        <path d="m13.607 15.391-.382-.924" />
        <path d="m14.849 10.547.923-.383" />
        <path d="m14.849 12.843.923.383" />
        <path d="m9.305 10.547-.923-.383" />
        <path d="m9.305 12.843-.923.383" />
        <circle cx="12.077" cy="11.695" r="3" />
       </m.g>
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ShieldCogIcon.displayName = "ShieldCogIcon";
export { ShieldCogIcon };
