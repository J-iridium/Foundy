<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let type: 'posts' | 'products' | 'media' = 'posts';
	export let item: any;

	let title = item.data?.title || '';
	let excerpt = item.data?.excerpt || '';
	let description = item.data?.description || '';
	let price = item.data?.price?.toString() || '';
	let base64Images: string[] = item.data?.images || [];

	function save() {
		let data: Record<string, any> = {};

		if (type === 'posts') {
			data = { title, excerpt, images: base64Images };
		} else if (type === 'products') {
			data = { title, description, price: parseFloat(price || '0'), images: base64Images };
		} else {
			data = { title, images: base64Images };
		}

		dispatch('save', { id: item.id, name: item.name, type, status: item.status, data });
		dispatch('close');
	}
</script>

<div class=" text-gray-900 dark:text-gray-100  rounded-lg w-full max-w-lg">
	<h2 class="text-lg font-semibold mb-3 capitalize">Edit {type.slice(0, -1)}</h2>

	{#if type === 'posts'}
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Title" bind:value={title} />
		<textarea class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Excerpt" bind:value={excerpt} />
	{:else if type === 'products'}
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Product name" bind:value={title} />
		<textarea class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Description" bind:value={description} />
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Price" bind:value={price} />
	{:else}
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Name" bind:value={title} />
	{/if}

	<div class="flex justify-end gap-2 mt-4">
		<button class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition" on:click={() => dispatch('close')}>
			Cancel
		</button>
		<button class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition" on:click={save}>
			Save Changes
		</button>
	</div>
</div>
