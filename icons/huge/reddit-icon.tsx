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
export interface RedditIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface RedditIconProps extends Omit<
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

const RedditIcon = forwardRef<RedditIconHandle, RedditIconProps>(
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

  const eyeVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.1, 1],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
     delay: 0.25 * duration,
    },
   },
  };

  const antennaVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -16, 12, -6, 0],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
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
      <path d="M15 17C14.1556 17.6293 13.1196 18 12 18C10.8804 18 9.84437 17.6293 8.99998 17" />
      <m.g
       variants={antennaVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "9px" }}
      >
       <path d="M18.5 4.5C18.5 5.32843 17.8284 6 17 6C16.1716 6 15.5 5.32843 15.5 4.5C15.5 3.67157 16.1716 3 17 3C17.8284 3 18.5 3.67157 18.5 4.5Z" />
       <path d="M15.5 4.5C14.3333 4.66667 12 5.8 12 9" />
      </m.g>
      <path d="M12 21C16.4183 21 20 18.3137 20 15C20 14.6482 19.9573 14.304 19.8799 13.9688C21.0801 13.7856 22 12.7514 22 11.5C22 10.1193 20.8807 9 19.5 9C18.4903 9 17.6221 9.59932 17.2275 10.4609C15.8253 9.55191 13.9989 9 12 9C10.0007 9 8.17381 9.55164 6.77147 10.4609C6.37678 9.59952 5.50951 9 4.49998 9C3.11927 9 1.99998 10.1193 1.99998 11.5C1.99998 12.7511 2.91935 13.7852 4.11913 13.9688C4.04169 14.3039 3.99998 14.6483 3.99998 15C3.99998 18.3137 7.58171 21 12 21Z" />
      <m.path
       d="M15.25 13H15M15.5 13C15.5 13.2761 15.2761 13.5 15 13.5C14.7238 13.5 14.5 13.2761 14.5 13C14.5 12.7239 14.7238 12.5 15 12.5C15.2761 12.5 15.5 12.7239 15.5 13Z"
       variants={eyeVariants}
       style={{ transformBox: "view-box", originX: "15px", originY: "13px" }}
      />
      <m.path
       d="M9.74998 13H9.49998M9.99998 13C9.99998 13.2761 9.77612 13.5 9.49998 13.5C9.22384 13.5 8.99998 13.2761 8.99998 13C8.99998 12.7239 9.22384 12.5 9.49998 12.5C9.77612 12.5 9.99998 12.7239 9.99998 13Z"
       variants={eyeVariants}
       style={{ transformBox: "view-box", originX: "9.5px", originY: "13px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

RedditIcon.displayName = "RedditIcon";
export { RedditIcon };
