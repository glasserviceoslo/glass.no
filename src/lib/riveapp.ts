import riveWASMResource from '@rive-app/canvas/rive.wasm';
import { Rive, RuntimeLoader } from '@rive-app/canvas';

RuntimeLoader.setWasmUrl(riveWASMResource as unknown as string);

new Rive({
  src: '/assets/mobile.riv',
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  autoplay: true,
});
