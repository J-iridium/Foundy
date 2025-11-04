<script lang="ts">
  export let data = [
    { label: "Jan", value: 20 },
    { label: "Feb", value: 45 },
    { label: "Mar", value: 35 },
    { label: "Apr", value: 60 },
    { label: "May", value: 50 },
    { label: "Jun", value: 70 },
    { label: "Jul", value: 15 }
  ];

  const max = Math.max(...data.map(d => d.value)) * 1.05;
  const steps = 5;
  const stepValue = Math.ceil(max / steps);

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (d.value / max) * 100
  }));

  // Monotone cubic interpolation for smooth, even-width line
  function catmullRom2bezier(points: { x: number; y: number }[]) {
    if (points.length < 2) return '';
    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] || points[i];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2] || p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  }

  const path = catmullRom2bezier(points);
</script>

<div class="bg-surface-800 rounded-xl shadow-sm p-5 border border-surface-700">
  <h3 class="text-sm font-medium text-surface-200 mb-4">Active Users</h3>

  <div class="relative h-48">
    <!-- Grid lines and Y labels -->
    <div class="absolute inset-0 px-2">
      {#each Array(steps + 1) as _, i (i)}
        <div
          class="absolute w-full flex items-center"
          style="bottom: {(i / steps) * 100}%;"
        >
          <div class="w-full border-t border-surface-700/70"></div>
          <span
            class="absolute left-0 -translate-x-3 text-[10px] text-surface-400 select-none"
            style="bottom: -0.4rem;"
          >
            {i === 0 ? "0" : Math.round(i * stepValue)}
          </span>
        </div>
      {/each}
    </div>

    <!-- Smooth line -->
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      class="absolute top-0 left-0 w-full h-full px-6"
    >
      <path
        d={path}
        fill="none"
        class="stroke-[var(--color-primary-500)]"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>
  </div>

  <!-- X-axis labels -->
  <div class="flex justify-between mt-2 text-xs text-surface-400 px-4">
    {#each data as { label }}
      <span>{label}</span>
    {/each}
  </div>
</div>
