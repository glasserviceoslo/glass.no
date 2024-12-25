import React from 'react';
import { useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

// // Reversible clock as MotionValue
// const useClock = ({ defaultValue = 0, reverse = false } = {}) => {
//   const rawClock = useMotionValue(0);
//   const clock = useMotionValue(defaultValue);
//   useAnimationFrame((t) => {
//     const dt = t - rawClock.get();
//     rawClock.set(rawClock.get() + dt);
//     if (reverse) {
//       clock.set(clock.get() - dt);
//     } else {
//       clock.set(clock.get() + dt);
//     }
//   });
//   return clock;
// };

// // Compose all of our helper hooks into a clock
// // that depends on scroll direction/position
// export const useScrollClock = ({ scrollAccelerationFactor = 10 } = {}) => {
//   const scrollPosition = useScrollPosition();
//   const lastScrollDirection = useLastScrollDirection();
//   const clock = useClock({
//     defaultValue: Date.now(),
//     reverse: lastScrollDirection === "up"
//   });

//   return useTransform(
//     [clock, scrollPosition],
//     ([time, pos]: number[]) => time + pos * scrollAccelerationFactor
//   );
// };

export const useClock = ({ defaultValue = 0, reverse = false, speed = 1 } = {}) => {
  const clock = useMotionValue(defaultValue);
  const paused = React.useRef(false);
  useAnimationFrame((t, dt) => {
    if (paused.current) {
      return;
    }
    if (reverse) {
      clock.set(clock.get() - dt * speed);
    } else {
      clock.set(clock.get() + dt * speed);
    }
  });
  return {
    value: clock,
    stop: () => {
      paused.current = true;
    },
    start: () => {
      paused.current = false;
    },
  };
};
