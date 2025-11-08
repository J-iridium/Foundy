<script lang="ts">
	import { onMount } from 'svelte';
	import { store_selectedSite } from '$lib/stores';
	import { CMS } from '$lib/supabase/cms';
	import Card from '$lib/components/StatsCard.svelte';
	import LineChart from '$components/depricated/LineChart.svelte';
	import BarChart from '$components/depricated/BarChart.svelte';
	import { showToast } from '$lib/stores/toast.store';
	import { CheckCircle2, AlertTriangle, Globe } from '@lucide/svelte';
    import PageHeader from '$components/PageHeader.svelte';

	let analytics : any = {};
	let loading = true;

	let totalVisitors = 0;
	let totalPageViews = 0;
	let avgSessionDuration = 0;
	let diskUsage = 0;

	// load analytics for current site
	onMount(async () => {
		if (!$store_selectedSite) {
			showToast('warning','No site selected', 'Please select a site first')
			loading = false;
			return;
		}

		const { data, error } = await CMS.Sites.analytics($store_selectedSite);

		if (error) {
			showToast('warning', 'Analytics error', error)
			loading = false;
			return;
		}

		analytics = data;
		calculateMetrics();
		loading = false;
	});

	function calculateMetrics() {
		if (!analytics) return;

		totalVisitors = analytics.unique_visitors ?? 0;
		totalPageViews = analytics.views ?? 0;
		avgSessionDuration = analytics.retention ?? 0;
		diskUsage = analytics.disk_usage ?? 0;
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<PageHeader 
		title="Site Analytics" 
		description="Usage and performance for your selected site."
		iconTitle={Globe}
	/> 
	
	<div class="p-3 space-y-6">
	{#if loading}
		<p class="text-surface-400 italic">Loading analytics...</p>
	{:else if !analytics}
		<p class="text-surface-400 italic">No analytics data available.</p>
	{:else}
		<!-- Stats Cards -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			<Card
				title="Visitors"
				value={totalVisitors.toLocaleString()}
				change="4%"
				positive={true}
			/>
			<Card
				title="Page Views"
				value={totalPageViews.toLocaleString()}
				change="2%"
				positive={true}
			/>
			<Card
				title="Avg. Session Duration"
				value={`${avgSessionDuration}s`}
				change="1%"
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
					title="Page Views"
					description="Daily breakdown"
					{analytics}
				/>
			</div>
		</div>
	{/if}
	</div>
</div>