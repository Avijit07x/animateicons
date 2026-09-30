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
export interface Loading01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Loading01IconProps extends Omit<
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

const Loading01Icon = forwardRef<Loading01IconHandle, Loading01IconProps>(
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

  const spokeVariants = (delay: number): Variants => ({
   normal: { opacity: 1, scale: 1 },
   animate: {
    opacity: [1, 0.2, 1],
    scale: [1, 0.8, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: delay * duration,
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
      <m.path
       d="M12 3V6"
       variants={spokeVariants(0.0)}
       style={{ transformBox: "view-box", originX: "12px", originY: "4.5px" }}
      />
      <m.path
       d="M12 18V21"
       variants={spokeVariants(0.2)}
       style={{ transformBox: "view-box", originX: "12px", originY: "19.5px" }}
      />
      <m.path
       d="M21 12L18 12"
       variants={spokeVariants(0.1)}
       style={{ transformBox: "view-box", originX: "19.5px", originY: "12px" }}
      />
      <m.path
       d="M6 12L3 12"
       variants={spokeVariants(0.3)}
       style={{ transformBox: "view-box", originX: "4.5px", originY: "12px" }}
      />
      <m.path
       d="M18.3635 5.63672L16.2422 7.75804"
       variants={spokeVariants(0.05)}
       style={{ transformBox: "view-box", originX: "17.3px", originY: "6.7px" }}
      />
      <m.path
       d="M7.75804 16.2422L5.63672 18.3635"
       variants={spokeVariants(0.25)}
       style={{ transformBox: "view-box", originX: "6.7px", originY: "17.3px" }}
      />
      <m.path
       d="M18.3635 18.3635L16.2422 16.2422"
       variants={spokeVariants(0.15)}
       style={{
        transformBox: "view-box",
        originX: "17.3px",
        originY: "17.3px",
       }}
      />
      <m.path
       d="M7.75804 7.75804L5.63672 5.63672"
       variants={spokeVariants(0.35)}
       style={{ transformBox: "view-box", originX: "6.7px", originY: "6.7px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Loading01Icon.displayName = "Loading01Icon";
export { Loading01Icon };
