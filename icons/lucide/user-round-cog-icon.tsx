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
export interface UserRoundCogIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface UserRoundCogIconProps extends Omit<
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

const UserRoundCogIcon = forwardRef<
 UserRoundCogIconHandle,
 UserRoundCogIconProps
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

  const bodyVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [40, 0],
    opacity: [0.3, 1],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
   },
  };

  const headVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [0.5, 1.2, 1],
    opacity: [0, 1],
    transition: { duration: 0.6 * duration, ease: "easeOut" },
   },
  };

  const cogVariants: Variants = {
   normal: { rotate: 0, scale: 1, opacity: 1 },
   animate: {
    rotate: 360,
    scale: [0.9, 1.2, 1],
    opacity: 1,
    transition: { duration: 1.2 * duration, ease: "easeInOut" },
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
      className="lucide lucide-user-round-cog-icon lucide-user-round-cog"
     >
      <m.path
       d="M2 21a8 8 0 0 1 10.434-7.62"
       strokeDasharray="40"
       strokeDashoffset="40"
       variants={bodyVariants}
       initial="normal"
       animate={controls}
      />

      <m.circle
       cx="10"
       cy="8"
       r="5"
       variants={headVariants}
       initial="normal"
       animate={controls}
      />

      <m.g variants={cogVariants} initial="normal" animate={controls}>
       <m.circle cx="18" cy="18" r="3" />
       <m.path d="m14.305 19.53.923-.382" />
       <m.path d="m15.228 16.852-.923-.383" />
       <m.path d="m16.852 15.228-.383-.923" />
       <m.path d="m16.852 20.772-.383.924" />
       <m.path d="m19.148 15.228.383-.923" />
       <m.path d="m19.53 21.696-.382-.924" />
       <m.path d="m20.772 16.852.924-.383" />
       <m.path d="m20.772 19.148.924.383" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

UserRoundCogIcon.displayName = "UserRoundCogIcon";
export { UserRoundCogIcon };
