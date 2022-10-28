import { Rive } from '@rive-app/canvas';

let canvas;

new Rive({
  src: '/assets/GSS.riv',
  canvas: document.getElementById('canvas'),
  autoplay: true,
});
