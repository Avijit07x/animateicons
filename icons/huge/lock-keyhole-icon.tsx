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
export interface LockKeyholeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LockKeyholeIconProps extends Omit<
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

const LockKeyholeIcon = forwardRef<LockKeyholeIconHandle, LockKeyholeIconProps>(
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

  const lockVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -1.2, 1.2, -0.8, 0.8, 0],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const holeVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.5, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
    },
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
      <m.g variants={lockVariants}>
       <path d="M16.4964 9V6.5C16.4964 4.01472 14.4817 2 11.9964 2C9.51112 2 7.4964 4.01472 7.4964 6.5V9" />
       <path d="M13.4958 9H10.4964C8.16158 9 6.99417 9 6.11049 9.47237C5.41275 9.84535 4.84128 10.4169 4.46837 11.1146C3.99608 11.9984 3.99619 13.1658 3.99641 15.5006C3.99662 17.835 3.99673 19.0023 4.46907 19.8858C4.84203 20.5835 5.41347 21.1548 6.11115 21.5277C6.99475 22 8.16197 22 10.4964 22H13.4958C15.8304 22 16.9978 22 17.8814 21.5277C18.5791 21.1548 19.1506 20.5833 19.5235 19.8856C19.9958 19.0019 19.9958 17.8346 19.9958 15.5C19.9958 13.1654 19.9958 11.9981 19.5235 11.1144C19.1506 10.4167 18.5791 9.84525 17.8814 9.47231C16.9978 9 15.8304 9 13.4958 9Z" />
       <m.circle
        cx="11.9964"
        cy="15.5"
        r="2"
        variants={holeVariants}
        style={{
         transformBox: "view-box",
         originX: "11.9964px",
         originY: "15.5px",
        }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LockKeyholeIcon.displayName = "LockKeyholeIcon";
export { LockKeyholeIcon };
