import { motion } from 'framer-motion';

export const Animation = () => (
  <motion.div
    className="box"
    animate={{
      scale: [1, 2, 2, 1, 1],
      rotate: [0, 0, 180, 180, 0],
      borderRadius: ['0%', '0%', '50%', '50%', '0%'],
    }}
    transition={{
      duration: 2,
      ease: 'easeInOut',
      times: [0, 0.2, 0.5, 0.8, 1],
      repeat: Number.POSITIVE_INFINITY,
      repeatDelay: 1,
    }}
  />
);
