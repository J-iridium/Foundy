<!-- TODO: FIX token rotation! -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedSite } from '$lib/stores/site';
	import { CMS } from '$lib/cms';
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
	import { Globe, Key, RefreshCw, Save, CheckCircle2, AlertTriangle } from '@lucide/svelte';

	const toaster = createToaster({});

	let site: any = null;
	let loading = true;
	let newDomain = '';
	let jwtToken: string | null = null;
	let rotating = false;
	let revealing = false;
	let saving = false;

	// Fetch current site details
	onMount(async () => {
		if (!$selectedSite) {
			toaster.warning({
				title: 'No site selected',
				description: 'Please select a site first.'
			});
			loading = false;
			return;
		}
		await fetchSite();
	});

	async function fetchSite() {
		const { data, error } = await CMS.Sites.get($selectedSite);
		if (error) {
			toaster.warning({
				title: 'Error loading site',
				description: error
			});
			loading = false;
			return;
		}
		site = data;
		newDomain = site.domain;
		loading = false;
	}

	// Reveal JWT token
	async function revealToken() {
		revealing = true;
		const { data, error } = await CMS.Tokens.get($selectedSite);
		revealing = false;

		if (error) {
			toaster.warning({
				title: 'Token Error',
				description: error
			});
			return;
		}
		jwtToken = data.token.token;
		toaster.success({
			title: 'Token Retrieved',
			description: 'The site token has been revealed.'
		});
	}

	// Rotate JWT token
	async function rotateToken() {
		rotating = true;
		const { data, error } = await CMS.Tokens.rotate($selectedSite);
		rotating = false;

		if (error) {
			toaster.warning({
				title: 'Token Rotation Failed',
				description: error
			});
			return;
		}

		jwtToken = data.token.token;
		toaster.success({
			title: 'Token Rotated',
			description: 'A new JWT token has been generated.'
		});
	}

	// Update domain
	async function saveChanges() {
		if (!newDomain.trim()) {
			toaster.warning({
				title: 'Invalid Domain',
				description: 'Please enter a valid domain name.'
			});
			return;
		}
		saving = true;

		const { data, error } = await CMS.Sites.update($selectedSite, {
			domain: newDomain
		});

		saving = false;
		if (error) {
			toaster.warning({
				title: 'Save Failed',
				description: error
			});
			return;
		}

		site = data;
		toaster.success({
			title: 'Domain Updated',
			description: `Domain changed to ${newDomain}.`
		});
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	 <div class=" p-3 border-b border-surface-700 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-on-surface flex items-center gap-2">
				<Globe class="w-5 h-5 text-primary-400" />
				Site Settings
			</h1>
			<p class="text-sm text-surface-400 mt-1">
				View and manage this site's configuration.
			</p>
		</div>
		<button
			on:click={saveChanges}
			class="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
			disabled={saving}
		>
			<Save class="w-4 h-4" />
			{saving ? 'Saving...' : 'Save Changes'}
		</button>
	</div>
	<div class="p-3 space-y-6">
		{#if loading}
			<p class="text-surface-400 italic">Loading site settings...</p>
		{:else}
			<!-- Card: General Info -->
			<div class="relative bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
				<div class="absolute top-0 left-0 h-1 w-full bg-primary-600"></div>

				<div class="p-6 space-y-4">
					<h2 class="text-lg font-semibold text-white">Site Information</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label class="block text-sm text-surface-400 mb-1">Domain</label>
							<input
								type="text"
								bind:value={newDomain}
								class="w-full px-3 py-2 rounded-lg bg-surface-700 border border-surface-600 text-sm text-surface-100 focus:ring-2 focus:ring-primary-500 outline-none transition"
							/>
						</div>

						<div>
							<label class="block text-sm text-surface-400 mb-1">Created</label>
							<div class="px-3 py-2 rounded-lg bg-surface-700 border border-surface-600 text-sm text-surface-100">
								{site.created_at
									? new Date(site.created_at).toLocaleDateString()
									: '—'}
							</div>
						</div>
					</div>

					
				</div>
			</div>

			<!-- Card: Token Management -->
			<div class="relative bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
				<div class="absolute top-0 left-0 h-1 w-full bg-tertiary-600"></div>

				<div class="p-6 space-y-4">
					<h2 class="text-lg font-semibold text-white flex items-center gap-2">
						<Key class="w-5 h-5 text-tertiary-400" /> JWT Token
					</h2>

					<p class="text-sm text-surface-400">
						Manage your site’s authentication token. You can reveal or rotate it
						for security.
					</p>

					<div class="bg-surface-900 border border-surface-700 rounded-lg p-3 text-xs overflow-x-auto font-mono">
						{#if jwtToken}
							{jwtToken}
						{:else}
							<span class="text-surface-500">Token hidden</span>
						{/if}
					</div>

					<div class="flex gap-3 justify-end">
						<button
							on:click={revealToken}
							class="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-700 text-surface-200 hover:bg-surface-600 transition"
							disabled={revealing}
						>
							<Key class="w-4 h-4" />
							{revealing ? 'Revealing...' : 'Reveal Token'}
						</button>

						<button
							on:click={rotateToken}
							class="flex items-center gap-2 px-4 py-2 rounded-lg bg-error-600 text-white hover:bg-error-700 transition"
							disabled={rotating}
						>
							<RefreshCw class="w-4 h-4" />
							{rotating ? 'Rotating...' : 'Rotate Token'}
						</button>
					</div>
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
