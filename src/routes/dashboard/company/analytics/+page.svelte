<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/StatsCard.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import { CMS } from '$lib/supabase/cms';
	import { CheckCircle2, AlertTriangle, Building2 } from '@lucide/svelte';
    import PageHeader from '$components/PageHeader.svelte';
	import { showToast } from '$lib/stores/toast';


	let analytics : any = [];
	let loading = true;

	// Aggregate stats for company dashboard
	let totalVisitors = 0;
	let totalPageViews = 0;
	let avgSessionDuration = 0;
	let totalDiskUsage = 0;

	async function load() {
		const { data, error } = await CMS.Company.analytics();

		if (error) {
			showToast('warning', 'Analytics Error', error)
			loading = false;
			return;
		}

		analytics = data;
		(data)
		calculateMetrics();
		loading = false;
	}


	function calculateMetrics() {
		if (!analytics || analytics.length === 0) return;

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
</script>

<div class="space-y-6">
	<!-- Header -->
	<PageHeader 
		title="Company Analytic" 
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
				<LineChart
					title="Visitors Over Time"
					description="Last 30 days"
					{analytics}
				/>
				<BarChart
					title="Page Views by Site"
					description="Company-wide"
					{analytics}
				/>
			</div>
		</div>
	{/if}
    </div>
</div>