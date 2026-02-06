<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { monotoneBezierPath } from '../utils/monotone';
  
    export let series: {
      name?: string;
      color?: string;
      data: { label: string; value: number }[];
    }[] = [];
  
    export let max: number;
    export let height: number;
  
    const palette = [
      'var(--color-primary-500)',
      'var(--color-secondary-400)',
      'var(--color-accent-400)',
      'var(--color-success-400)',
      'var(--color-warning-400)',
      'var(--color-danger-400)'
    ];
  
    const dispatch = createEventDispatcher();
    let svgEl: SVGSVGElement;
  
    // use first dataset to derive shared X positions
    const base = series[0];
    const xPositions = base
      ? base.data.map((_, i) => (i / (Math.max(1, base.data.length - 1))) * 100)
      : [];
  
    function pathFor(s) {
      const pts = s.data.map((d, i) => ({
        x: (i / Math.max(1, s.data.length - 1)) * 100,
        y: 100 - Math.max(0, (d.value / (max || 1)) * 100)
      }));
      return monotoneBezierPath(pts);
    }
  
    function handleMove(e: MouseEvent) {
      if (!series.length) return;
  
      const rect = svgEl.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
      const closest = xPositions.reduce((a, b) =>
        Math.abs(b - xPct) < Math.abs(a - xPct) ? b : a
      );
      const i = xPositions.indexOf(closest);
  
      // Build tooltip data for all lines at this index
      const values = series.map((s, j) => ({
        name: s.name ?? `Series ${j + 1}`,
        color: s.color || palette[j % palette.length],
        value: s.data[i]?.value
      }));
  
      dispatch('tooltip', {
        visible: true,
        clientX: e.clientX + 56.5,
        clientY: e.clientY - 25.5 - (9.5 * series.length) - 1,
        label: base?.data[i]?.label,
        values
      });
    }
  
    function handleLeave() {
      dispatch('tooltip', { visible: false });
    }
  </script>
  
  <svg
    bind:this={svgEl}
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    class="absolute top-0 left-0 w-full h-full px-6 cursor-crosshair"
    on:mousemove={handleMove}
    on:mouseleave={handleLeave}
  >
    {#each series as s, i}
      <path
        d={pathFor(s)}
        fill="none"
        stroke={s.color || palette[i % palette.length]}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        vector-effect="non-scaling-stroke"
      />
    {/each}
  </svg>
  