import React from 'react';
import { motion, useTransform } from 'framer-motion';
import * as utils from './utils';

interface BoxProps {
  children: React.ReactNode;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(({ children, ...props }, ref) => (
  <div className="bg-white p-4 md:p-8 lg:p-12" ref={ref} {...props}>
    {children}
  </div>
));

const MotionBox = motion(Box);

const CameraContext = React.createContext<utils.Camera | null>(null);

export const useCamera = () => {
  const camera = React.useContext(CameraContext);
  if (!camera) {
    throw new Error('useCamera can only be called inside of a Camera');
  }
  return camera;
};

type CameraProps = BoxProps;

export const Camera = ({ children, ...otherProps }: CameraProps) => {
  const [camera] = React.useState(() => new utils.Camera());
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (containerRef.current && contentRef.current) {
      camera.containerEl = containerRef.current;
      camera.contentEl = contentRef.current;
    }
  }, []);

  const translate = useTransform<number, string>(
    [camera.motionValues.posX, camera.motionValues.posY],
    ([x, y]) => `${-x}px ${-y}px`,
  );

  const transformOrigin = useTransform(
    [camera.motionValues.posX, camera.motionValues.posY],
    ([x, y]) => `calc(50% + ${x}px) calc(50% + ${y}px)`,
  );

  return (
    <CameraContext.Provider value={camera}>
      <MotionBox ref={containerRef} style={{ overflow: 'hidden' }} {...otherProps}>
        <MotionBox
          ref={contentRef}
          style={{
            height: '100%',
            width: '100%',
            translate,
            transformOrigin,
            scale: camera.motionValues.zoom,
            rotate: camera.motionValues.rotation,
          }}
        >
          {children}
        </MotionBox>
      </MotionBox>
    </CameraContext.Provider>
  );
};

export interface CameraTargetProps {
  children: (target: utils.CameraTarget) => React.ReactNode;
}

export const CameraTarget = React.forwardRef<utils.CameraTarget, CameraTargetProps>(
  ({ children, ...otherProps }, forwardedRef) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const camera = useCamera();
    const [cameraTarget] = React.useState(() => new utils.CameraTarget(camera));

    React.useLayoutEffect(() => {
      if (ref.current) {
        cameraTarget.el = ref.current;
      }
      if (typeof forwardedRef === 'function') {
        forwardedRef(cameraTarget);
      } else if (forwardedRef) {
        forwardedRef.current = cameraTarget;
      }
    }, []);

    return (
      <Box ref={ref} {...otherProps}>
        {typeof children === 'function' ? children(cameraTarget) : children}
      </Box>
    );
  },
);
