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
export interface MonitorCogIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MonitorCogIconProps extends Omit<
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

const MonitorCogIcon = forwardRef<MonitorCogIconHandle, MonitorCogIconProps>(
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

  const screenVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -5, 4, -2, 0],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
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
       variants={screenVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "17px" }}
      >
       <path d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
       <m.g
        variants={cogVariants}
        style={{ transformBox: "view-box", originX: "18px", originY: "6px" }}
       >
        <circle cx="18" cy="6" r="3" />
        <path d="m14.305 7.53.923-.382" />
        <path d="m15.228 4.852-.923-.383" />
        <path d="m16.852 3.228-.383-.924" />
        <path d="m16.852 8.772-.383.923" />
        <path d="m19.148 3.228.383-.924" />
        <path d="m19.53 9.696-.382-.924" />
        <path d="m20.772 4.852.924-.383" />
        <path d="m20.772 7.148.924.383" />
       </m.g>
      </m.g>
      <path d="M12 17v4" />
      <path d="M8 21h8" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MonitorCogIcon.displayName = "MonitorCogIcon";
export { MonitorCogIcon };
