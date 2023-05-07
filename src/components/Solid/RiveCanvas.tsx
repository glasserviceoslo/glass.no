/** @jsxImportSource solid-js */

import riveApp from '@rive-app/canvas';
import { onMount, onCleanup } from 'solid-js';

let canvas: HTMLCanvasElement;
let rive: riveApp.Rive;
export const RiveCanvas = ({ src }: { src: string }) => {
  onMount(() => {
    rive = new riveApp.Rive({
      src,
      canvas,
      autoplay: true,
    });
  });

  return (
    <canvas
      ref={canvas}
      id="canvas"
      class="mx-auto h-auto w-3/5 lg:h-[90%] lg:w-[90%]"
      width="500"
      height="500"
    ></canvas>
  );
};
