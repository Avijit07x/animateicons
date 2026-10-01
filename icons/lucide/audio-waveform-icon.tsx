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
export interface AudioWaveformIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface AudioWaveformIconProps extends Omit<
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

const AudioWaveformIcon = forwardRef<
 AudioWaveformIconHandle,
 AudioWaveformIconProps
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

  const humpVariants = (index: number, peak: number): Variants => ({
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.4, peak, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
     delay: index * 0.09 * duration,
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
       d="M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v5"
       variants={humpVariants(0, 1.25)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M8 12v8a2 2 0 0 0 4 0v-8"
       variants={humpVariants(1, 1.06)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M12 12V4a2 2 0 0 1 4 0v8"
       variants={humpVariants(2, 1.06)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M16 12v5a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"
       variants={humpVariants(3, 1.4)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

AudioWaveformIcon.displayName = "AudioWaveformIcon";
export { AudioWaveformIcon };
