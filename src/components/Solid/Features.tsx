/** @jsxImportSource solid-js */

import { Motion, Presence } from '@motionone/solid';

export const Features = ({ content }: any) => {
  return (
    <section class="bg-white px-6 pt-20 dark:bg-gray-900" id="hvorfor-oss">
      <div class="mx-auto max-w-screen-xl px-4 pb-10 lg:px-6">
        <div class="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
          <Motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{
              opacity: 1,
              x: 20,
              transition: { delay: 0.2 },
            }}
            transition={{ duration: 0.9 }}
            class="h-full w-full"
          >
            Scroll
          </Motion.div>
        </div>
      </div>
    </section>
  );
};
