<script lang="ts">
	import PageHeader from '$components/PageHeader.svelte';
	import { onMount } from 'svelte';
	import { CMS } from '$lib/supabase/cms';
	import { showToast } from '$lib/stores';
	import type { Sorting } from '$types/app';
	import { fade, scale } from 'svelte/transition';
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
    import type { Plan } from '$types/db';

	type Site = {
		id: string;
		domain?: string;
		jwt_token?: string;
		created_at?: string;
	};


	const max_pages = {
		'starter': 1,
		'pro': 3,
		'business': 5,
		'agency-basic': 10,
		'agency-pro': 30,
		'agency-max': Infinity
	};

	let company_tier: Plan;
	let sites: Site[] = [];
	let loading = true;


	let sortOption : Sorting = 'oldest';
	$: sortedSites = [...sites].sort((a, b) => {
		// @ts-ignore
		if (sortOption === 'az') return (a.domain || '').localeCompare(b.domain || '');
		// @ts-ignore
		if (sortOption === 'za') return (b.domain || '').localeCompare(a.domain || '');
		// @ts-ignore
		if (sortOption === 'newest') return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
		// default oldest
		return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
	});


	let showModal = false;
	let newDomain = '';

	// Delete modal
	let deleteModal = false;
	let deleteConfirm = '';
	let siteToDelete: Site | null = null;

	async function fetchSites() {
		const { data, error } = await CMS.Sites.list();
		if (error) {
			showToast('warning', 'Error loading sites', error)
			return;
		}
		sites = data;
		loading = false;
	}

	async function addSite() {
		if (!newDomain.trim()) return;
		const { error } = await CMS.Sites.create({ domain: newDomain });
		if (error) {
			showToast('warning', 'Error creating sites', error.message)
			return;
		}
		fetchSites();
		newDomain = '';
		showModal = false;
		showToast('success', 'Site added', 'New site created successfully!');
	}

	async function revealToken(index: number, site_id: string) {
		const { data, error } = await CMS.Tokens.get(site_id);
		if (error) {
			showToast('warning', 'Token error', error)
			return;
		}
		sortedSites[index].jwt_token = data.token.token;
		showToast('success', 'Token revealed', `JWT token for ${sortedSites[index].domain} loaded successfully`);
	}

	async function getCompanyTier() {
		const { data, error } = await CMS.Company.get();
		if (error) {
			showToast('warning', 'Couldn\'t get company', error)
			return;
		}
		company_tier = data.plan as Plan;
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
			showToast('warning', 'Delete Failed', error)
			return;
		}

		sites = sites.filter((s) => s.id !== siteToDelete?.id);
		deleteModal = false;
		showToast('success', 'Site Deleted',  `${siteToDelete.domain} has been removed.`)
	}

	onMount(fetchSites);
	onMount(getCompanyTier);
</script>

<!-- Main layout -->
<div class="space-y-6">
	<!-- Header -->
	<PageHeader 
	 	title="Company Sites"
		description="Manage all connected domains and their JWT access tokens."
		iconButton={PlusCircle}
		iconTitle={Building2}
		textButton="Add Site"
		action={() => (showModal = sites.length < max_pages[company_tier])}
		showSort={true}
		sortValue={sortOption}
		onSortChange={(value : String) => {(sortOption as String) = value}}
	/> 
	

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
			{#each sortedSites as site, i}
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

		<!-- Pagination
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
		{/if} -->
	{/if}
	</div>
	<!-- Add Site Modal -->
	{#if showModal}
		<div
			class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
			on:click={() => (showModal = false)}
			transition:fade={{duration:150}}
		>
			<div
				class="bg-surface-900 border border-surface-700 rounded-xl p-6 w-full max-w-md shadow-lg relative"
				on:click|stopPropagation
				transition:scale={{ duration: 200, start: 0.8 }}
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