<script lang="ts">
    export let title = '';
    export let data = [];
    export let series = [];
    export let type: any;
    export let height = 220;
  
    const max = Math.max(
      ...(series.length
        ? series.flatMap((s) => s.data.map((d) => d.value))
        : data.map((d) => d.value))
    );
  
    const steps = 5;
    const stepValue = Math.ceil(max / steps);
  
    let tooltip = {
      visible: false,
      clientX: 0,
      clientY: 0,
      label: '',
      values: []
    };
  
    function handleTooltip(e) {
      tooltip = e.detail;
    }
  
    const palette = [
      'var(--color-primary-500)',
      'var(--color-secondary-400)',
      'var(--color-accent-400)',
      'var(--color-success-400)',
      'var(--color-warning-400)',
      'var(--color-danger-400)'
    ];
  </script>
  
  <div class="bg-surface-800 rounded-xl shadow-sm p-5 border border-surface-700 relative">
    {#if title}
      <h3 class="text-sm font-medium text-surface-200 mb-4">{title}</h3>
    {/if}
  
    <div class="relative" style="height:{height}px">
      <!-- Grid -->
      <div class="absolute inset-0 px-2">
        {#each Array(steps + 1) as _, i (i)}
          <div
            class="absolute w-full flex items-center"
            style="bottom:{(i / steps) * 100}%;"
          >
            <div class="w-full border-t border-surface-700/70"></div>
            <span
              class="absolute left-0 -translate-x-3 text-[10px] text-surface-400 select-none"
              style="bottom:-0.4rem;"
            >
              {i === 0 ? '0' : Math.round(i * stepValue)}
            </span>
          </div>
        {/each}
      </div>
  
      <svelte:component
        this={type}
        {height}
        {max}
        {data}
        {series}
        on:tooltip={handleTooltip}
      />
    </div>
  
    <!-- X labels -->
    <div class="flex justify-between mt-2 text-xs text-surface-400 px-4">
      {#if series.length}
        {#each series[0].data as { label }}
          <span>{label}</span>
        {/each}
      {:else}
        {#each data as { label }}
          <span>{label}</span>
        {/each}
      {/if}
    </div>
  
    <!-- 🧠 Global fixed tooltip -->
    {#if tooltip.visible}
  <div
    class="fixed z-[9999] bg-surface-900/95 border border-surface-700 text-surface-200 text-xs rounded-md px-3 py-2 shadow-xl backdrop-blur-sm pointer-events-none transition-transform duration-75"
    style="
      top:{tooltip.clientY + 8}px;
      left:{tooltip.clientX + 8}px;
      transform: translate(-50%, -50%);
    "
  >
    <div class="font-semibold text-surface-100 mb-1">
      {tooltip.label}
    </div>
    {#each tooltip.values as { name, color, value }}
      <div class="flex items-center gap-2 whitespace-nowrap">
        <span
          class="inline-block w-2.5 h-2.5 rounded-full"
          style="background-color:{color}"
        ></span>
        <span>{name}: {value}</span>
      </div>
    {/each}
  </div>
{/if}

  </div>
  