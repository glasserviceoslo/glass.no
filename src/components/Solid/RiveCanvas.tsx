/** @jsxImportSource solid-js */

import type { Rive } from '@rive-app/canvas';
import { onMount, onCleanup } from 'solid-js';

let canvas: HTMLCanvasElement;
let riveapp: Rive;
export const RiveCanvas = ({ src }: { src: string }) => {
  onMount(() => {
    import('@rive-app/canvas').then(({ Rive }) => {
      riveapp = new Rive({ src, canvas, autoplay: true });
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
