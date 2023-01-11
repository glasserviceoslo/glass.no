import { Component, createEffect, createSignal, Show } from 'solid-js';
import { Motion, Presence } from '@motionone/solid';
import { useInterval } from '$lib/interval';
import { getSanityImageURL, removeExt } from '$lib/sanity.image';
import type { Image } from '$lib/sanity.queries';

// alt={`${src.split('.').slice(0, -1).join('').substring(8)}`}

export const Carousel: Component<{ images: Array<Image> }> = ({ images }) => {
  const [index, setIndex] = createSignal(0);
  const next = () => {
    setIndex((p) => ++p % images.length);
    slideInterval.restart();
  };
  const prev = () => {
    setIndex((p) => (p + images.length - 1) % images.length);
    slideInterval.restart();
  };

  const slideInterval = useInterval(() => setIndex((p) => ++p % images.length), 5000);

  createEffect(() => slideInterval.start());

  return (
    <section class="relative h-[70vw] overflow-hidden md:h-[61vw]">
      {images.map((image, i) => (
        <Presence exitBeforeEnter>
          <Show keyed when={index() === i}>
            <Motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.05 } }}
              transition={{ duration: 0.1 }}
              exit={{ opacity: 0, x: -50 }}
              class="h-full w-full"
            >
              <picture>
                <source srcset={getSanityImageURL(image.asset).format('webp').url()} type="image/webp" />
                <img
                  width={720}
                  height={420}
                  class="h-full w-full object-cover"
                  loading="lazy"
                  src={getSanityImageURL(image.asset).url()}
                  alt={image.asset.altText || removeExt(image.asset.originalFilename)}
                />
              </picture>
              {/* <img
                alt={image.asset.altText || removeExt(image.asset.originalFilename)}
                loading="lazy"
                src={getSanityImageURL(image).format('webp').width(1000).url()}
              /> */}
            </Motion.div>
          </Show>
        </Presence>
      ))}
      <button
        aria-label="previous slide button"
        type="button"
        class="absolute top-0 left-4 bottom-0 mx-0
                my-auto flex h-[13%] items-center justify-center rounded-full p-2 text-gray-200 shadow-sm hover:bg-gray-300 hover:text-gray-600"
        onClick={prev}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width={4}
          stroke="currentColor"
          class="h-8 w-8"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        aria-label="next slide button"
        type="button"
        class="absolute top-0 right-4 bottom-0 mx-0 my-auto flex h-[13%] items-center justify-center rounded-full p-2 text-gray-200 shadow-sm hover:bg-gray-300 hover:text-gray-600"
        onClick={next}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width={4}
          stroke="currentColor"
          class="h-8 w-8"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      <div class="absolute right-0 left-0 bottom-1 my-0 mx-auto flex items-center justify-center gap-1 p-2">
        {/* {srcs.map((s, i, arr) => (
          <input
            id={s}
            class="mx-1 grid h-4 w-4 appearance-none place-content-center rounded-full border-2 border-gray-300 bg-gray-200 accent-gray-300 before:h-3 before:w-3 before:scale-0 before:rounded-full before:shadow-checked before:transition-transform before:duration-150 before:ease-in-out before:content-[''] checked:before:scale-100"
            checked={index() === i}
            disabled
            type="radio"
            aria-label="slide changer"
            name="slider"
            value={s}
          />
        ))} */}
        {images.map((img, i) => (
          <div
            id={img._key}
            class={`mx-1 grid h-4 w-4 appearance-none place-content-center rounded-full border-2 border-gray-300 bg-gray-200 accent-gray-300 before:h-3 before:w-3 before:scale-0 before:rounded-full before:shadow-checked before:transition-transform before:duration-150 before:ease-in-out before:content-[''] ${
              index() === i && 'before:scale-100'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
