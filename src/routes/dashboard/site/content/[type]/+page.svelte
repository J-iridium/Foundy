<script lang="ts">
	import { page } from '$app/stores';
	import Card from './Card.svelte';
	import { PlusCircle, X, Package } from '@lucide/svelte';
	import { Toast, createToaster } from '@skeletonlabs/skeleton-svelte';
	import ModalAdd from './ModalAdd.svelte';
    import ModalPreview from './ModalPreview.svelte';

	let previewItem: any = null;

	function onPreview(item) {
		previewItem = item;
	}

	function closePreview() {
		previewItem = null;
	}

	const toaster = createToaster({});
	let showModal = false;
	let items = [];

	$: type = $page.params.type; // posts | products | media

	// Mock data (replace with CMS API later)
	$: items = [
		{
			id: 1,
			title: type === 'products' ? 'Ocean Pendant Necklace' : 'Designing a Modern CMS',
			slug: 'example-' + type,
			excerpt: type === 'posts' ? 'Our approach to simplicity and scalability.' : undefined,
			description: type === 'products' ? 'Premium handmade necklace inspired by the sea.' : undefined,
			// image: '/demo/placeholder.jpg',
			status: 'Draft'
		},
		{
			id: 2,
			title: type === 'products' ? 'Ash Ceramic Cup' : 'The Future of SaaS CMS Platforms',
			slug: 'example2-' + type,
			excerpt: type === 'posts' ? 'Why flexibility matters in content workflows.' : undefined,
			// image: '/demo/placeholder.jpg',
			status: 'Published'
		}
	];

	function onEdit(id: number) {
		toaster.success({ title: 'Edit', description: `Edit content ID: ${id}` });
	}

	function onDelete(id: number) {
		items = items.filter((i) => i.id !== id);
		toaster.success({ title: 'Deleted', description: `Removed content ID: ${id}` });
	}

	function onStatusChange(id: number, newStatus: string) {
		items = items.map((i) => (i.id === id ? { ...i, status: newStatus } : i));
		toaster.info({ title: 'Status Updated', description: `Set to ${newStatus}` });
	}

	function addItem(e) {
		const payload = e.detail;
		const id = Math.max(0, ...items.map((i) => i.id)) + 1;
		items = [{ id, slug: `new-${id}`, ...payload }, ...items];
	}
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class=" p-3 border-b border-surface-700 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-on-surface flex items-center gap-2">
				<Package class="w-5 h-5 text-primary-400" />
				Manage {type}
			</h1>
			<p class="text-sm text-surface-400 mt-1">
				Add, edit, and organize all {type} in your CMS.
			</p>
		</div>
		<button
			on:click={() => (showModal = true)}
			class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
		>
			<PlusCircle class="w-4 h-4" /> Add {type.slice(0, -1)}
		</button>
	</div>


	<!-- Grid -->
	<div class="p-3 space-y-6">
	{#if items.length === 0}
		<div
			class="border border-surface-700 rounded-lg p-6 text-center text-surface-400 bg-surface-800"
		>
			<p>No {type} yet.</p>
			<p class="text-sm mt-2">
				Click
				<span class="text-primary-400 font-medium">“Add {type.slice(0, -1)}”</span>
				to create your first entry.
			</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
			{#each items as item (item.id)}
                <Card
                    {item}
                    {onEdit}
                    {onDelete}
                    {onStatusChange}
                    {type}
                    on:preview={(e) => onPreview(e.detail)}
                />
            {/each}
		</div>
	{/if}

	<!-- Modal -->
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
			{#if toast.type === 'success'}
				<!-- <CheckCircle2 class="text-success-400 w-5 h-5 mt-1" /> -->
			{:else if toast.type === 'warning'}
				<!-- <AlertTriangle class="text-warning-400 w-5 h-5 mt-1" /> -->
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
