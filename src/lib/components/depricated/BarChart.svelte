<script lang="ts">
  export let data = [
    { label: "Jan", value: 40 },
    { label: "Feb", value: 55 },
    { label: "Mar", value: 32 },
    { label: "Apr", value: 65 },
    { label: "May", value: 58 },
    { label: "Jun", value: 70 }
  ];

  const max = Math.max(...data.map(d => d.value));
  const steps = 5;
  const chartHeight = 180;
  const stepValue = Math.ceil(max / steps);
</script>

<div class="bg-surface-800 rounded-xl shadow-sm p-5 border border-surface-700">
  <h3 class="text-sm font-medium text-surface-200 mb-4">Session Duration</h3>

  <div class="relative flex h-48">
    <div class="relative flex-1">
      <!-- Grid lines + Y axis -->
      <div class="absolute inset-0 px-4">
        {#each Array(steps + 1) as _, i (i)}
          <div
            class="absolute w-full flex items-center"
            style="bottom: {(i / steps) * 100}%;"
          >
            <!-- grid line -->
            <div class="w-full border-t border-surface-700/70"></div>
            <!-- y label (inside chart) -->
            <span
              class="absolute left-0 -translate-x-3 text-[10px] text-surface-400 select-none"
              style="bottom: -0.4rem;"
            >
              {i === 0 ? "0" : Math.round(i * stepValue)}
            </span>
          </div>
        {/each}
      </div>

      <!-- Bars -->
      <div class="relative m-3 flex items-end justify-between gap-3 pl-8 pr-3">
        {#each data as { label, value }}
          <div class="flex flex-col items-center flex-1">
            <div
              class="w-6 bg-primary-500 rounded-t-md transition-all duration-500 ease-out hover:bg-primary-400"
              style="height: {Math.max((value / max) * chartHeight, 4)}px"
            ></div>
            <span class="text-xs text-surface-300 mt-2">{label}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
