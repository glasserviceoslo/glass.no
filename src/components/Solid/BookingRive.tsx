import { Rive } from '@rive-app/canvas';
import { onMount } from 'solid-js';

let canvas: HTMLCanvasElement;
export const BookingRive = () => {
  onMount(() => {
    new Rive({
      src: '/assets/mobile.riv',
      canvas,
      autoplay: true,
    });
  });

  return <canvas ref={canvas} id="canvas" class="h-[90%] w-[90%]" width="500" height="500"></canvas>;
};
