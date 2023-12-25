<script lang="ts">
  import { onMount } from 'svelte';
  export let src: string;

  let canvas: HTMLCanvasElement;

  onMount(async () => {
    const { Rive } = await import('@rive-app/canvas');
    new Rive({ src, canvas, autoplay: true });
  });
</script>

<canvas id="canvas" class="mx-auto h-auto w-3/5 lg:h-[90%] lg:w-[90%]" width="500" height="500" bind:this={canvas} />
