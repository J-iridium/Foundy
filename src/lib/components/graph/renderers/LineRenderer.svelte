<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { monotoneBezierPath } from '../utils/monotone';
  
    export let data: { label: string; value: number }[] = [];
    export let max: number;
    export let height: number;
  
    const dispatch = createEventDispatcher();
    let svgEl: SVGSVGElement;
  
    // Map data points to relative coordinates
    const pts = data.map((d, i) => ({
      x: (i / Math.max(1, data.length - 1)) * 100,
      y: 100 - Math.max(0, (d.value / (max || 1)) * 100)
    }));
  
    const path = monotoneBezierPath(pts);
  
    // Precompute X positions (percentage of width)
    const xPositions = pts.map(p => p.x);
  
    function handleMove(e: MouseEvent) {
      const rect = svgEl.getBoundingClientRect();
      const xPct = ((e.clientX - rect.left) / rect.width) * 100;
  
      // Find nearest actual data index
      const closest = xPositions.reduce((a, b) =>
        Math.abs(b - xPct) < Math.abs(a - xPct) ? b : a
      );
      const i = xPositions.indexOf(closest);
  
      dispatch('tooltip', {
        visible: true,
        clientX: e.clientX + 36,
        clientY: e.clientY - 36,
        label: data[i]?.label,
        values: [
          {
            name: 'Value',
            color: 'var(--color-primary-500)',
            value: data[i]?.value
          }
        ]
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
    <path
      d={path}
      fill="none"
      stroke="var(--color-primary-500)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      vector-effect="non-scaling-stroke"
    />
  </svg>
  