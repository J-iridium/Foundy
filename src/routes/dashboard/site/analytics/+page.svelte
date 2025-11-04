<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedSite } from '$lib/stores/site';
	import { CMS } from '$lib/cms';
	import Card from '$lib/components/StatsCard.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import BarChart from '$lib/components/BarChart.svelte';
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
	import { CheckCircle2, AlertTriangle, Globe } from '@lucide/svelte';

	const toaster = createToaster({});
	let analytics = null;
	let loading = true;

	let totalVisitors = 0;
	let totalPageViews = 0;
	let avgSessionDuration = 0;
	let diskUsage = 0;

	// load analytics for current site
	onMount(async () => {
		if (!$selectedSite) {
			toaster.warning({
				title: 'No site selected',
				description: 'Please select a site first.'
			});
			loading = false;
			return;
		}

		const { data, error } = await CMS.Sites.analytics($selectedSite);

		if (error) {
			toaster.warning({
				title: 'Analytics Error',
				description: error
			});
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
	<div class=" p-3 border-b border-surface-700 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-on-surface flex items-center gap-2">
				<Globe class="w-5 h-5 text-primary-400" />
				Site Analytics
			</h1>
			<p class="text-sm text-surface-400 mt-1">
				Usage and performance for your selected site.
			</p>
		</div>
	</div>
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

<!-- Toasts -->
<Toast.Group {toaster} position="bottom-right">
	{#snippet children(toast)}
		<Toast
			{toast}
			class="bg-surface-900 border border-surface-700 text-on-surface rounded-lg shadow-md flex items-start gap-3 p-4 min-w-[280px]"
		>
			{#if toast.type === 'success'}
				<CheckCircle2 class="text-success-400 w-5 h-5 mt-1" />
			{:else if toast.type === 'warning'}
				<AlertTriangle class="text-warning-400 w-5 h-5 mt-1" />
			{/if}
			<Toast.Message class="flex-1">
				<Toast.Title class="font-semibold">{toast.title}</Toast.Title>
				{#if toast.description}
					<Toast.Description class="text-sm opacity-90 mt-1">
						{toast.description}
					</Toast.Description>
				{/if}
			</Toast.Message>
			<Toast.CloseTrigger class="ml-2 text-surface-400 hover:text-white transition" />
		</Toast>
	{/snippet}
</Toast.Group>
