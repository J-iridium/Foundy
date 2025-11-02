<script lang="ts">
	import { onMount } from 'svelte';
	import ContentModal from '$lib/components/ContentModal.svelte';
	import { CMS } from '$lib/cms'; // new cookie-based SDK

	let sites: any[] = [];
	let site_id = '';
	let items: any[] = [];
	let error: string | null = null;
	let loading = false;

	// modal state
	let open = false;
	let mode: 'create' | 'edit' = 'create';
	let form = { site_id: '', name: '', type: 'text', status: 'draft', data: {} as any };

	// --------------------------------------------------------------------------
	// Load all sites and their content
	// --------------------------------------------------------------------------
	async function load() {
		try {
			loading = true;
			error = null;

			//  1. Get all sites for the logged-in user/company
			const { data: siteList, error: siteErr } = await CMS.Sites.list();
			if (siteErr) throw new Error(siteErr);
			sites = siteList ?? [];

			//  2. Automatically select first site if none selected
			if (!site_id && sites.length > 0) site_id = sites[0].id;

			//  3. If no site selected, clear list
			if (!site_id) {
				items = [];
				return;
			}

			//  4. Get content for the selected site
			const { data: contentList, error: contentErr } = await CMS.Content.list(site_id);
			if (contentErr) throw new Error(contentErr);
			items = contentList ?? [];
		} catch (e: any) {
			error = e.message;
		} finally {
			loading = false;
		}
	}

	// --------------------------------------------------------------------------
	// Select a site
	// --------------------------------------------------------------------------
	async function onSelectSite(e: Event) {
		site_id = (e.target as HTMLSelectElement).value;
		await load();
	}

	// --------------------------------------------------------------------------
	// Create / Edit Modal
	// --------------------------------------------------------------------------
	function createNew() {
		mode = 'create';
		form = { site_id, name: '', type: 'text', status: 'draft', data: {} };
		open = true;
	}

	function editItem(row: any) {
		mode = 'edit';
		form = {
			site_id: row.site_id,
			name: row.name,
			type: row.type,
			status: row.status,
			data: row.data ?? {}
		};
		open = true;
	}

	// --------------------------------------------------------------------------
	// Submit (create or update)
	// --------------------------------------------------------------------------
	async function onSubmit(payload: any) {
		try {
			if (mode === 'create') {
				const { error: err } = await CMS.Content.create(payload);
				if (err) throw new Error(err);
			} else {
				const { error: err } = await CMS.Content.update(payload.site_id, payload.name, payload);
				if (err) throw new Error(err);
			}
			open = false;
			await load();
		} catch (e: any) {
			console.log(e)
			error = e.message;
		}
	}

	// --------------------------------------------------------------------------
	// Delete content
	// --------------------------------------------------------------------------
	// async function remove(row: any) {
	// 	if (!confirm(`Delete "${row.name}"?`)) return;
	// 	try {
	// 		const { error: err } = await CMS.Content.remove(row.site_id, row.name);
	// 		if (err) throw new Error(err);
	// 		await load();
	// 	} catch (e: any) {
	// 		error = e.message;
	// 	}
	// }

	// --------------------------------------------------------------------------
	// Initialize on mount
	// --------------------------------------------------------------------------
	onMount(load);
</script>


<h1 class="text-2xl font-semibold mb-4">Content</h1>

<!-- Site selector -->
<label class="block mb-3">
	<span class="text-sm font-medium text-gray-700">Select Site</span>
	<select class="border rounded p-2 w-full mt-1" on:change={onSelectSite} bind:value={site_id} disabled={loading}>
		{#if sites.length === 0}
			<option value="">No sites available</option>
		{:else}
			{#each sites as s}
				<option value={s.id}>{s.name ?? s.domain ?? s.id}</option>
			{/each}
		{/if}
	</select>
</label>

<div class="flex justify-between items-center mb-3">
	<button class="bg-blue-600 text-white px-3 py-2 rounded" on:click={createNew} disabled={!site_id || loading}>
		Add Content
	</button>
</div>

{#if loading}
	<p class="text-gray-600">Loading…</p>
{:else if error}
	<p class="text-red-600">{error}</p>
{:else}
	<table class="w-full text-sm border rounded overflow-hidden">
		<thead class="bg-gray-50">
			<tr>
				<th class="text-left p-2">Name</th>
				<th class="text-left p-2">Type</th>
				<th class="text-left p-2">Status</th>
				<th class="text-left p-2">Updated</th>
				<th class="text-left p-2 text-right">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#if items.length === 0}
				<tr><td colspan="5" class="text-center p-4 text-gray-500">No content yet</td></tr>
			{:else}
				{#each items as row (row.name)}
					<tr class="border-t hover:bg-gray-50">
						<td class="p-2">{row.name}</td>
						<td class="p-2">{row.type}</td>
						<td class="p-2 capitalize">{row.status}</td>
						<td class="p-2">{new Date(row.updated_at).toLocaleString()}</td>
						<td class="p-2 text-right">
							<button class="px-2 py-1 border rounded mr-2 hover:bg-gray-100" on:click={() => editItem(row)}>Edit</button>
							<button class="px-2 py-1 border rounded text-red-600 hover:bg-red-50" on:click={() => remove(row)}>Delete</button>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
{/if}

<ContentModal
	bind:open
	{mode}
	site_id={form.site_id}
	bind:name={form.name}
	bind:type={form.type}
	bind:data={form.data}
	bind:status={form.status}
	onSubmit={onSubmit}
	onClose={() => (open = false)}
/>
