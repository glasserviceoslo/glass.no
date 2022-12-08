import { Rive } from '@rive-app/canvas';

new Rive({
  src: '/assets/mobile.riv',
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  autoplay: true,
});
