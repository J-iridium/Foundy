<script lang="ts">
	import { onMount } from 'svelte';
	import { CMS } from '$lib/cms';
	import { Pagination, Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
	import {
		Globe,
		Key,
		PlusCircle,
		X,
		Trash2,
		CheckCircle2,
		AlertTriangle,
		Building2
	} from '@lucide/svelte';

	// Local toaster
	const toaster = createToaster({});

	type Site = {
		id: string;
		domain?: string;
		jwt_token?: string;
		created_at?: string;
	};

	type Tier =
		| 'starter'
		| 'pro'
		| 'business'
		| 'agency-basic'
		| 'agency-pro'
		| 'agency-max';

	const max_pages = {
		starter: 1,
		pro: 3,
		business: 5,
		'agency-basic': 10,
		'agency-pro': 30,
		'agency-max': Infinity
	};

	let company_tier: Tier;
	let sites: Site[] = [];
	let loading = true;

	// Pagination
	let currentPage = 1;
	const perPage = 6;

	let showModal = false;
	let newDomain = '';

	// Delete modal
	let deleteModal = false;
	let deleteConfirm = '';
	let siteToDelete: Site | null = null;

	async function fetchSites() {
		const { data, error } = await CMS.Sites.list();
		if (error) {
			toaster.warning({ title: 'Error loading sites', description: error });
			return;
		}
		sites = data;
		loading = false;
	}

	async function addSite() {
		if (!newDomain.trim()) return;
		const { data, error } = await CMS.Sites.create({ name: '', domain: newDomain });
		if (error) {
			toaster.warning({ title: 'Error creating site', description: error });
			return;
		}
		fetchSites();
		// sites = [...sites, data];
		// console.log(sites)
		newDomain = '';
		showModal = false;
		toaster.success({
			title: 'Site Added',
			description: 'New site created successfully!'
		});
	}

	async function revealToken(index: number, site_id: string) {
		const { data, error } = await CMS.Tokens.get(site_id);
		if (error) {
			toaster.warning({ title: 'Token Error', description: error });
			return;
		}
		sites[index].jwt_token = data.token.token;
		sites = [...sites];
		toaster.success({
			title: 'Token Revealed',
			description: `JWT token for ${sites[index].domain} loaded successfully`
		});
	}

	async function getCompanyTier() {
		const { data, error } = await CMS.Company.get();
		if (error) {
			toaster.error({
				title: "Couldn't get company",
				description: error
			});
			return;
		}
		company_tier = data.plan as Tier;
	}

	function openDeleteModal(site: Site) {
		siteToDelete = site;
		deleteConfirm = '';
		deleteModal = true;
	}

	async function deleteSite() {
		if (!siteToDelete) return;
		const { error } = await CMS.Sites.delete(siteToDelete.id);

		if (error) {
			toaster.warning({ title: 'Delete Failed', description: error });
			return;
		}

		sites = sites.filter((s) => s.id !== siteToDelete?.id);
		deleteModal = false;
		toaster.success({
			title: 'Site Deleted',
			description: `${siteToDelete.domain} has been removed.`
		});
	}

	$: totalPages = Math.ceil(sites.length / perPage);
	$: paginatedSites = sites.slice(
		(currentPage - 1) * perPage,
		currentPage * perPage
	);

	onMount(fetchSites);
	onMount(getCompanyTier);
</script>

<!-- Main layout -->
<div class="space-y-6">
	<!-- Header -->
	<div class=" p-3 border-b border-surface-700 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-on-surface flex items-center gap-2">
				<Building2 class="w-5 h-5 text-primary-400" />
				Company Sites
			</h1>
			<p class="text-sm text-surface-400 mt-1">
				Manage all connected domains and their JWT access tokens.
			</p>
		</div>
		<button
			on:click={() =>
				(showModal = sites.length < max_pages[company_tier])
			}
			class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
		>
			<PlusCircle class="w-4 h-4" /> Add Site
		</button>
	</div>

	<!-- Sites Grid -->
	<div class="p-3 space-y-6"> 
	{#if loading}
		<p class="text-surface-400 italic">Loading sites...</p>
	{:else if sites.length === 0}
		<div
			class="border border-surface-600 rounded-lg p-6 text-center text-surface-400 bg-surface-800"
		>
			<p>No sites yet.</p>
			<p class="text-sm mt-2">
				Click
				<span class="text-primary-400 font-medium">“Add Site”</span> to register
				your first domain.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
			{#each paginatedSites as site, i}
				<div
					class="relative rounded-xl border border-surface-700 bg-surface-800 overflow-hidden hover:border-primary-700 transition"
				>
					<div
						class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-primary-600"
					></div>

					<div class="p-5 flex flex-col gap-3 h-full">
						<h2
							class="font-semibold text-lg text-white flex items-center gap-2"
						>
							<Globe class="w-4 h-4 text-primary-400" />
							{site.domain}
						</h2>

						{#if site.jwt_token}
							<div
								class="bg-surface-900 border border-surface-700 rounded-lg p-3 text-xs overflow-x-auto font-mono"
							>
								<Key class="inline w-3 h-3 mr-2 text-surface-400" />
								{site.jwt_token}
							</div>
						{:else}
							<button
								on:click={() => revealToken(i, site.id)}
								class="text-sm px-3 py-2 bg-surface-700 text-surface-200 hover:bg-primary-700/60 hover:text-white rounded-md transition"
							>
								Reveal Token
							</button>
						{/if}
						<div class="mt-auto">
							<div class="flex items-center justify-between mt-auto">
								<p class="text-xs text-surface-500">
									Created
									{site.created_at
										? new Date(site.created_at).toLocaleDateString()
										: '—'}
								</p>

								<button
									on:click={() => openDeleteModal(site)}
									class="text-xs text-error-400 hover:text-error-300 transition flex items-center gap-1"
								>
									<Trash2 class="w-3 h-3" /> Delete
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex justify-center mt-8">
				<Pagination
					bind:currentPage
					{totalPages}
					variant="filled"
					color="primary"
					size="sm"
				/>
			</div>
		{/if}
	{/if}
	</div>
	<!-- Add Site Modal -->
	{#if showModal}
		<div
			class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
			on:click={() => (showModal = false)}
		>
			<div
				class="bg-surface-900 border border-surface-700 rounded-xl p-6 w-full max-w-md shadow-lg relative"
				on:click|stopPropagation
			>
				<button
					on:click={() => (showModal = false)}
					class="absolute top-3 right-3 text-surface-400 hover:text-surface-200"
				>
					<X class="w-5 h-5" />
				</button>

				<h2 class="text-lg font-semibold text-white mb-4">Add a New Site</h2>

				<div class="space-y-3">
					<label class="block">
						<span class="text-sm text-surface-400">Domain</span>
						<input
							type="text"
							placeholder="e.g. jiridium.nl"
							bind:value={newDomain}
							class="mt-1 w-full px-3 py-2 rounded-lg bg-surface-800 border border-surface-600 text-sm text-surface-100 focus:ring-2 focus:ring-primary-500 outline-none transition"
						/>
					</label>

					<div class="flex justify-end gap-3 pt-3">
						<button
							on:click={() => (showModal = false)}
							class="px-4 py-2 rounded-lg bg-surface-700 text-surface-200 hover:bg-surface-600 transition"
						>
							Cancel
						</button>
						<button
							on:click={addSite}
							class="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
						>
							Create
						</button>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<!-- Delete Confirmation Modal -->
{#if deleteModal && siteToDelete}
<div
	class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
	on:click={() => (deleteModal = false)}
>
	<div
		class="bg-surface-900 border border-surface-700 rounded-xl p-6 w-full max-w-md shadow-lg relative"
		on:click|stopPropagation
	>
		<button
			on:click={() => (deleteModal = false)}
			class="absolute top-3 right-3 text-surface-400 hover:text-surface-200"
		>
			<X class="w-5 h-5" />
		</button>

		<h2 class="text-lg font-semibold text-white mb-2">Delete Site</h2>
		<p class="text-sm text-surface-400 mb-3">
			To confirm deletion, type the domain name
			<span class="text-surface-200 font-semibold">
				{siteToDelete.domain}
			</span>
			below.
		</p>

		<!-- ⚠️ Permanent deletion warning -->
		<p class="text-xs text-error-400 font-medium mb-4">
			This action is <span class="font-semibold">permanent</span>. All data, content, and configurations on this site will be <span class="font-semibold">irreversibly deleted</span> and cannot be recovered.
		</p>

		<input
			type="text"
			placeholder={siteToDelete.domain}
			bind:value={deleteConfirm}
			class="w-full px-3 py-2 rounded-lg bg-surface-800 border border-surface-600 text-sm text-surface-100 focus:ring-2 focus:ring-error-500 outline-none transition"
		/>

		<div class="flex justify-end gap-3 pt-5">
			<button
				on:click={() => (deleteModal = false)}
				class="px-4 py-2 rounded-lg bg-surface-700 text-surface-200 hover:bg-surface-600 transition"
			>
				Cancel
			</button>
			<button
				on:click={deleteSite}
				class="px-4 py-2 rounded-lg bg-error-600 text-white hover:bg-error-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
				disabled={deleteConfirm.trim() !== siteToDelete.domain}
			>
				Delete Site
			</button>
		</div>
	</div>
</div>
{/if}
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
