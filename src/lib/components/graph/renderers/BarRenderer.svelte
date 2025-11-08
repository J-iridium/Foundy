<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let data: { label: string; value: number }[] = [];
  export let max: number;

  const color = 'var(--color-primary-500)';

  function handleHover(e: MouseEvent, i: number) {
    dispatch('tooltip', {
      visible: true,
      clientX: e.clientX + 40,
      clientY: e.clientY - 36,
      label: data[i].label,
      values: [
        {
          name: 'Value',
          color,
          value: data[i].value
        }
      ]
    });
  }

  function handleLeave() {
    dispatch('tooltip', { visible: false });
  }
</script>

<!-- Chart Bars -->
<div class="absolute inset-0 flex items-end justify-between gap-3 px-8">
  {#each data as { label, value }, i}
    <!-- <div
      class="relative flex-1 flex justify-center "
      
    > -->
      <!-- bar -->
      <div
        class=" cursor-crosshair w-6 bg-primary-500 rounded-t-md transition-all duration-500 ease-out hover:bg-primary-400"
        style="height:{Math.max((value / max) * 100, 4)}%;"
        on:mousemove={(e) => handleHover(e, i)}
        on:mouseleave={handleLeave}
      ></div>
    <!-- </div> -->
  {/each}
</div>
