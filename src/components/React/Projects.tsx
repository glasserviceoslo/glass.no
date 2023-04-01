import React from 'react';
import { Camera, CameraTarget, useCamera, utils } from './camera';
import { InfiniteBanner } from './InfiniteBanner';
import { useClock } from '$hooks/react/hooks';

const bannerOneImages = ['site-2.png', 'site-4.jpeg', 'site-5.jpeg', 'site-7.jpeg', 'site-8.png'];

const bannerTwoImages = ['site-10.jpeg', 'site-11.jpeg', 'site-13.jpeg', 'site-14.jpeg', 'site-15.jpeg'];

interface PhotoProps {
  src: string;
  alt: string;
  onClick: (t: utils.CameraTarget) => void;
}

const Photo = ({ src, alt, onClick }: PhotoProps) => {
  const ref = React.useRef<utils.CameraTarget>(null);

  return (
    <CameraTarget ref={ref}>
      <figure className="h-[20vh] w-[20wv]">
        <img
          tabIndex={0}
          src={src}
          alt={alt}
          onClick={() => {
            onClick(ref.current);
          }}
          className="border-6 h-full w-full cursor-pointer border-white object-cover"
        />
        <figcaption>Something</figcaption>
      </figure>
    </CameraTarget>
  );
};

const Banners = () => {
  const camera = useCamera();
  const [target, setTarget] = React.useState<utils.CameraTarget | null>(null);
  const clock = useClock({
    defaultValue: Date.now(),
    reverse: false,
  });
  const reverseClock = useClock({
    defaultValue: Date.now(),
    reverse: true,
  });

  React.useEffect(() => {
    if (target) {
      camera.follow(target);
      camera.setZoom(4);
      camera.setRotation(0);
      clock.stop();
      reverseClock.stop();
    } else {
      camera.panTo(new utils.Vector(0, 0));
      camera.setZoom(1);
      camera.setRotation(-10);
      clock.start();
      reverseClock.start();
    }
    return () => {
      if (target) camera.unfollow(target);
    };
  }, [camera, target, clock, reverseClock]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <InfiniteBanner clock={clock.value}>
          <div className="flex gap-6 pr-6">
            {bannerOneImages.map((img) => (
              <Photo key={img} src={img} alt={img} onClick={(t) => setTarget((prev) => (prev !== t ? t : null))} />
            ))}
          </div>
        </InfiniteBanner>
        <InfiniteBanner clock={reverseClock.value}>
          <div className="flex gap-6 pr-6">
            {bannerTwoImages.map((img) => (
              <Photo key={img} src={img} alt={img} onClick={(t) => setTarget((prev) => (prev !== t ? t : null))} />
            ))}
          </div>
        </InfiniteBanner>
      </div>
    </div>
  );
};

export const Projects = () => {
  return (
    <Camera>
      <div className="flex h-full scale-125 transform items-center justify-center">
        <Banners />
      </div>
    </Camera>
  );
};
