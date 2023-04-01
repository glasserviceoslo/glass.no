import { motion, MotionValue, useMotionTemplate, useTransform } from 'framer-motion';

interface InfiniteBannerProps extends React.HTMLProps<HTMLDivElement> {
  clock: MotionValue<number>;
  loopDuration?: number;
  children: React.ReactNode;
}

export const InfiniteBanner = ({ clock, loopDuration = 22000, children, ...otherProps }: InfiniteBannerProps) => {
  const progress = useTransform(clock, (time) => (time % loopDuration) / loopDuration);
  const percentage = useTransform(progress, (t) => t * 100);
  const translateX = useMotionTemplate`-${percentage}%`;
  return (
    <div
      {...otherProps}
      style={{
        position: 'relative',
        width: 'max-content',
        overflow: 'hidden',
        ...otherProps.style,
      }}
    >
      <motion.div style={{ translateX, width: 'max-content' }}>
        <div>{children}</div>
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            left: '100%',
            top: 0,
          }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};
