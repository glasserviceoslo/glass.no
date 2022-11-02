import { Rive } from '@rive-app/canvas';

new Rive({
  src: '/assets/mobile.riv',
  canvas: document.getElementById('canvas'),
  autoplay: true,
});
