<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	const dispatch = createEventDispatcher();
	export let type: 'posts' | 'products' | 'media' = 'posts';

	let title = '';
	let excerpt = '';
	let description = '';
	let price = '';
	let imageFiles: File[] = [];
	let base64Images: string[] = [];

	async function handleFileChange(e: Event) {
		imageFiles = Array.from((e.target as HTMLInputElement).files || []);
		base64Images = await Promise.all(
			imageFiles.map(
				(file) =>
					new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => {
							const result = reader.result as string;
							resolve(result.split(',')[1]);
						};
						reader.onerror = reject;
						reader.readAsDataURL(file);
					})
			)
		);
	}

	function save() {
		let data: Record<string, any> = {};
		let name = title.trim();

		if (type === 'posts') {
			data = { title, excerpt, images: base64Images.length ? base64Images : undefined };
		} else if (type === 'products') {
			data = { title, description, price: parseFloat(price || '0'), images: base64Images.length ? base64Images : undefined };
		} else {
			data = { title, images: base64Images.length ? base64Images : undefined };
		}

		dispatch('save', { name, type, status: 'Draft', data });
		dispatch('close');
	}
</script>

<div class=" text-gray-900 dark:text-gray-100  rounded-lg  w-full max-w-lg">
	<h2 class="text-lg font-semibold mb-3 capitalize">Add {type.slice(0, -1)}</h2>

	{#if type === 'posts'}
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Title" bind:value={title} />
		<textarea class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Excerpt" bind:value={excerpt} />
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" type="file" multiple accept="image/*" on:change={handleFileChange} />
	{:else if type === 'products'}
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Product name" bind:value={title} />
		<textarea class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Description" bind:value={description} />
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Price (e.g. 29.99)" bind:value={price} />
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" type="file" multiple accept="image/*" on:change={handleFileChange} />
	{:else}
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Name" bind:value={title} />
		<input class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" type="file" multiple accept="image/*" on:change={handleFileChange} />
	{/if}

	{#if base64Images.length}
		<div class="flex flex-wrap gap-2 mb-3">
			{#each base64Images as img}
				<img src={`data:image/jpeg;base64,${img}`} alt="" class="w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-700" />
			{/each}
		</div>
	{/if}

	<div class="flex justify-end gap-2">
		<button class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition" on:click={() => dispatch('close')}>
			Cancel
		</button>
		<button class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition" on:click={save}>
			Save
		</button>
	</div>
</div>
