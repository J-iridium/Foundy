<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/StatsCard.svelte';
	import Graph from '$lib/components/graph/Graph.svelte';
	import LineRenderer from '$lib/components/graph/renderers/LineRenderer.svelte';
	import BarRenderer from '$lib/components/graph/renderers/BarRenderer.svelte';
	import MultiLineRenderer from '$components/graph/renderers/MultiLineRenderer.svelte';
	import { CMS } from '$lib/supabase/cms';
	import { Building2 } from '@lucide/svelte';
	import PageHeader from '$components/PageHeader.svelte';
	import { showToast } from '$lib/stores';
	import type { Analytics } from '../../../../types/db';

	let analytics: Analytics[] = [];
	let loading = true;

	let totalVisitors = 0;
	let totalPageViews = 0;
	let avgSessionDuration = 0;
	let totalDiskUsage = 0;

	async function load() {
		const { data, error } = await CMS.Company.analytics();

		if (error) {
			showToast('warning', 'Analytics Error', error);
			loading = false;
			return;
		}

		analytics = data;
		calculateMetrics();
		loading = false;
	}

	function calculateMetrics() {
		if (!analytics?.length) return;

		let totalDuration = 0;
		let totalSitesWithDuration = 0;

		for (const site of analytics) {
			totalVisitors += site.unique_visitors ?? 0;
			totalPageViews += site.views ?? 0;
			totalDiskUsage += site.disk_usage ?? 0;

			if (site.retention) {
				totalDuration += site.retention;
				totalSitesWithDuration++;
			}
		}

		avgSessionDuration =
			totalSitesWithDuration > 0
				? Math.round(totalDuration / totalSitesWithDuration)
				: 0;
	}

	onMount(load);

	// Convert analytics into datasets for the new Graph component
	$: visitorsData = analytics.map((site, i) => ({
		label: site.domain ?? `Site ${i + 1}`,
		value: site.unique_visitors ?? 0
	}));

	$: viewsData = analytics.map((site, i) => ({
		label: site.domain ?? `Site ${i + 1}`,
		value: site.views ?? 0
	}));

	const visitors = [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 40 },
    { label: 'Mar', value: 35 },
    { label: 'Apr', value: 20 }
  ];

  const signups = [
    { label: 'Jan', value: 10 },
    { label: 'Feb', value: 25 },
    { label: 'Mar', value: 20 },
    { label: 'Apr', value: 40 }
  ];

  const conversions = [
    { label: 'Jan', value: 5 },
    { label: 'Feb', value: 15 },
    { label: 'Mar', value: 12 },
    { label: 'Apr', value: 70 }
  ];

  const dataset = [
    { name: 'Visitors', color: 'var(--color-primary-500)', data: visitors },
    { name: 'Signups', color: 'var(--color-secondary-400)', data: signups },
    { name: 'Conversions', color: 'var(--color-success-400)', data: conversions }
  ];
</script>

<div class="space-y-6">
	<!-- Header -->
	<PageHeader 
		title="Company Analytics" 
		description="Overview of usage and performance across all sites."
		iconTitle={Building2}
	/>

	<div class="p-3 space-y-6 overflow-y-auto">
		{#if loading}
			<p class="text-surface-400 italic">Loading analytics...</p>
		{:else}
			<!-- Metric Cards -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card
					title="Total Visitors"
					value={totalVisitors.toLocaleString()}
					change="5%"
					positive={true}
				/>
				<Card
					title="Total Page Views"
					value={totalPageViews.toLocaleString()}
					change="3%"
					positive={true}
				/>
				<Card
					title="Avg. Session Duration"
					value={`${avgSessionDuration} sec`}
					change="-1%"
					positive={false}
				/>
			</div>

			<!-- Charts -->
			<div>
				<h2 class="text-lg font-semibold mb-4 text-on-surface">
					Usage Overview
				</h2>

				<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<Graph
						title="Visitors Over Time"
						data={visitorsData}
						type={LineRenderer}
					/>

					<Graph
						title="Page Views by Site"
						data={viewsData}
						type={BarRenderer}
					/>

					
					<Graph
						title="Growth Overview"
						series={dataset}
						type={MultiLineRenderer}
					/>
				</div>
			</div>
		{/if}
	</div>
</div>
