<script lang="ts">
  import { Rive } from '@rive-app/canvas';
  import { onMount } from 'svelte';
  export let src: string;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    new Rive({ src, canvas, autoplay: true });
  });
</script>

<section class="flex flex-col justify-center items-center">
  <canvas class="h-1/2 w-1/2" width={1000} height={1000} bind:this={canvas} />
</section>
