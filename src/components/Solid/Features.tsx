import { Motion, Presence } from '@motionone/solid';

export const Features = () => {
  return (
    <>
      <Motion.div
        initial={{ x: 0, opacity: 0 }}
        animate={{
          opacity: 1,
          x: 100,
          transition: { delay: 0.2, easing: [0.17, 0.55, 0.55, 1] },
        }}
        transition={{ duration: 0.9 }}
        class="h-full w-full"
      >
        Scroll
      </Motion.div>
    </>
  );
};
