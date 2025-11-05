<script lang="ts">
	import { page } from '$app/stores';
	import { CMS } from '$lib/cms'; // <-- our client SDK
	import Card from './Card.svelte';
	import { PlusCircle, X, Package } from '@lucide/svelte';
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
	import ModalAdd from './ModalAdd.svelte';
	import ModalPreview from './ModalPreview.svelte';
	import { selectedSite } from '$lib/stores/site';
	import { onMount } from 'svelte';

	const toaster = createToaster({});
	let items: any[] = [];
	let showModal = false;
	let previewItem: any = null;

	function onPreview(item) {
		console.log('Preview clicked:', item);
		previewItem = item;
	}
	function closePreview() {
		previewItem = null;
	}

	// Reactive derived values
	$: site_id = $selectedSite;
	$: type = $page.params.type; // 'posts' | 'products' | 'media'
	$: if (site_id && type) {
		console.log('Reloading content for', site_id, type);
		loadItems();
	}

	onMount(() => {
		console.log('onMount type:', type);
	});
	// -----------------------------------------------------
	// LOAD CONTENT FROM DB
	// -----------------------------------------------------
	async function loadItems() {
		if (!site_id || !type) return;
		const { data, error } = await CMS.Content.listByType(site_id, type);
		console.log(data)
		if (error) {
			console.error(error);
			toaster.warning({ title: 'Load Failed', description: 'Could not load content.' });
			return;
		}
		items = data || [];
	}

	$: loadItems(); // run reactively when route params change

	// -----------------------------------------------------
	// HANDLE ADD / DELETE / UPDATE
	// -----------------------------------------------------
	async function addItem(e) {
		const payload = e.detail;
		const { data, error } = await CMS.Content.create({
			site_id,
			name: payload.name,
			type: type,
			status: payload.status,
			data: payload.data,
		});
		if (error) {
			toaster.warning({ title: 'Add Failed', description: error });
			return;
		}
		items = [data, ...items];
		toaster.success({ title: 'Added', description: `Created new ${type.slice(0, -1)}` });
	}

	async function onDelete(id: string) {
		items = items.filter((i) => i.id !== id);
		const { error } = await CMS.Content.remove(site_id, id);

		if (error) {
			toaster.warning({ title: 'Delete Failed', description: error });
			return;
		}

		toaster.success({
			title: 'Deleted',
			description: `Removed content ID: ${id}`
		});
	}

	import ModalEdit from './ModalEdit.svelte';
    import PageHeader from '$components/PageHeader.svelte';

	let showEditModal = false;
	let editItem: any = null;

	function onEdit(id: string) {
		const found = items.find((i) => i.id === id);
		if (!found) return;
		editItem = found;
		showEditModal = true;
	}

	async function saveEdit(e) {
		const payload = e.detail;
		const { data, error } = await CMS.Content.update(site_id, payload.id, {
			status: payload.status,
			data: payload.data,
			name: payload.name
		});
		if (error) {
			toaster.warning({ title: 'Update Failed', description: error });
			return;
		}

		// Update UI
		items = items.map((i) => (i.id === payload.id ? data : i));
		showEditModal = false;
		toaster.success({ title: 'Updated', description: 'Changes saved successfully.' });
	}



	async function onStatusChange(id: string, newStatus: string) {
		// 1️ Immediately update the UI (optimistic)
		items = items.map((i) => (i.id === id ? { ...i, status: newStatus } : i));

		// 2️ Persist the change to the database
		const { error } = await CMS.Content.update(site_id, id, { status: newStatus });

		if (error) {
			// 3 Roll back on failure
			items = items.map((i) => (i.id === id ? { ...i, status: 'Draft' } : i));
			toaster.warning({
				title: 'Update Failed',
				description: error
			});
			return;
		}

		// 4️ Confirm success
		toaster.info({
			title: 'Status Updated',
			description: `Content set to ${newStatus}`
		});
	}
</script>

<!-- Layout -->
<div class="space-y-6">
	<!-- Header -->
	<PageHeader 
		title={`Manage ${type}`} 
		description={`Add, edit, and organize all ${type} in your CMS.`}
		action={() => (showModal = true)}
		iconButton={PlusCircle}
		iconTitle={Package}
		textButton={`Add ${type?.slice(0, -1)}`}
	/> 

	<!-- Content Grid -->
	<div class="p-3 space-y-6">
		{#if items.length === 0}
			<div class="border border-surface-700 rounded-lg p-6 text-center text-surface-400 bg-surface-800">
				<p>No {type} yet.</p>
				<p class="text-sm mt-2">
					Click <span class="text-primary-400 font-medium">“Add {type.slice(0, -1)}”</span> to create your first entry.
				</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{#each items as item (item.id)}
					<Card
						{item}
						{type}
						{onEdit}
						{onDelete}
						{onStatusChange}
						on:preview={(e) => onPreview(e.detail)}
					/>
				{/each}
			</div>
		{/if}

		<!-- Add Modal -->
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

					<ModalAdd {type} on:save={addItem} on:close={() => (showModal = false)} />
				</div>
			</div>
		{/if}
		{#if showEditModal}
			<div
				class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
				on:click={() => (showEditModal = false)}
			>
				<div
					class="bg-surface-900 border border-surface-700 rounded-xl p-6 w-full max-w-md shadow-lg relative"
					on:click|stopPropagation
				>
					<button
						on:click={() => (showEditModal = false)}
						class="absolute top-3 right-3 text-surface-400 hover:text-surface-200"
					>
						<X class="w-5 h-5" />
					</button>

					<ModalEdit
						{type}
						item={editItem}
						on:save={saveEdit}
						on:close={() => (showEditModal = false)}
					/>
				</div>
			</div>
		{/if}

	</div>
</div>

{#if previewItem}
	<ModalPreview {type} item={previewItem} onClose={closePreview} />
{/if}

<!-- Toasts -->
<Toast.Group {toaster} position="bottom-right">
	{#snippet children(toast)}
		<Toast
			{toast}
			class="bg-surface-900 border border-surface-700 text-on-surface rounded-lg shadow-md flex items-start gap-3 p-4 min-w-[280px]"
		>
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
