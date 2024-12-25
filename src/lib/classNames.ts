import { twMerge } from 'tailwind-merge';

export const classNames = (...classes: unknown[]) => {
  return twMerge(classes.filter(Boolean).join(' '));
};
