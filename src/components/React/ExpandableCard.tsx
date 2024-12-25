import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/hooks/react/use-outside-click';
import { Button, buttonVariants } from '../ui/button';
import { cn, getExcerpt } from '@/lib/utils';
import type { ParsedContent } from '@/types';
import { useCalTheme } from '@/hooks/react/use-update-cal-theme';

interface Props {
  content: ParsedContent;
}
export function ExpandableCard({ content }: Props) {
  const [active, setActive] = useState<ParsedContent | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const { calApi } = useCalTheme();

  useEffect(() => {
    if (calApi && !calApi.loaded) {
      calApi('ui', {
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    }
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  useOutsideClick(ref, (event: MouseEvent) => {
    const calModalBoxes = document.getElementsByTagName('cal-modal-box');
    const isCalElement = Array.from(calModalBoxes).includes(event.target as Element);

    if (!isCalElement) {
      setActive(null);
    }
  });

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.image}
                  alt={active.imageAlt}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="flex items-end justify-between w-full">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.title}
                    </motion.h3>
                    {content.anchorText ? (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        data-cal-link="glassno/befaring"
                        className={cn(`${buttonVariants({ variant: 'default' })} dark:text-white ml-auto`)}
                      >
                        {content.anchorText}
                      </motion.button>
                    ) : null}
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-16 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {content.text}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <motion.div
        layoutId={`card-${content.title}-${id}`}
        key={content.title}
        onClick={() => setActive(content)}
        className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
      >
        <div className="flex gap-4 flex-col  w-full">
          <motion.div layoutId={`image-${content.title}-${id}`}>
            <img
              width={100}
              height={100}
              src={content.image}
              alt={content.imageAlt}
              className="h-60 w-full rounded-lg object-cover object-center"
            />
          </motion.div>
          <div className="flex justify-center items-center flex-col">
            <motion.h3
              layoutId={`title-${content.title}-${id}`}
              className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
            >
              {content.title}
            </motion.h3>
            <motion.p
              layoutId={`description-${content.text}-${id}`}
              className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
            >
              {getExcerpt(content.text)}
            </motion.p>
            <Button variant="link">
              <span className="text-info dark:text-blue-300">Les mer</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
