<script lang="ts">
  import { Rive } from '@rive-app/canvas';
  import { onMount } from 'svelte';
  export let src: string;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    new Rive({ src, canvas, autoplay: true });
  });
</script>

<canvas id="canvas" class="mx-auto h-auto w-3/5 lg:h-[90%] lg:w-[90%]" width="500" height="500" bind:this={canvas} />
