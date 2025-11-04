<script>
  export let data = [
    { label: "Jan", value: 20 },
    { label: "Feb", value: 45 },
    { label: "Mar", value: 35 },
    { label: "Apr", value: 60 },
    { label: "May", value: 50 },
    { label: "Jun", value: 70 }
  ];

  const max = Math.max(...data.map(d => d.value));
  const points = data
    .map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.value / max) * 100}`)
    .join(" ");
</script>

<div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
  <h3 class="text-sm font-medium text-gray-600 mb-4">Active Users</h3>
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-48">
    <polyline
      fill="none"
      stroke="rgb(59,130,246)"
      stroke-width="2"
      points={points}
    />
  </svg>
  <div class="flex justify-between mt-2 text-xs text-gray-500">
    {#each data as { label }}
      <span>{label}</span>
    {/each}
  </div>
</div>
