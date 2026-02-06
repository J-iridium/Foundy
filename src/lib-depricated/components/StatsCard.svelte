<script>
  import { TrendingUp, TrendingDown } from "@lucide/svelte";

  export let title = "";
  export let value = "";
  export let change = "";
  export let positive = true;
  export let icon = null; // optional icon component
</script>

<div
  class="relative overflow-hidden rounded-2xl bg-surface-800 border border-surface-700 p-5 transition hover:bg-surface-700/80 hover:shadow-md"
>
  <!-- Top Accent Bar -->
  <div
    class="absolute top-0 left-0 w-full h-1 rounded-t-2xl"
    class:bg-success-500={positive}
    class:bg-error-500={!positive}
  ></div>

  <!-- Card Body -->
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm font-medium text-surface-200">{title}</p>
      <h2 class="text-3xl font-semibold text-white mt-1 tracking-tight">
        {value}
      </h2>

      <div class="flex items-center gap-1 mt-2">
        {#if positive}
          <TrendingUp class="w-4 h-4 text-success-400" />
          <span class="text-sm font-medium text-success-400">
            +{change}
          </span>
        {:else}
          <TrendingDown class="w-4 h-4 text-error-400" />
          <span class="text-sm font-medium text-error-400">
            -{change}
          </span>
        {/if}
      </div>
    </div>

    {#if icon}
      <div
        class="p-3 rounded-xl bg-surface-700/70 border border-surface-600 text-surface-50"
      >
        <svelte:component this={icon} class="w-5 h-5" />
      </div>
    {/if}
  </div>
</div>
