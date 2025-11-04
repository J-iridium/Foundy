<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let item: {
		id: number;
		title: string;
		slug: string;
		image?: string;
		excerpt?: string;
		description?: string;
		status: 'Draft' | 'Published' | 'Archived';
	};
	export let type: 'posts' | 'products' | 'media' = 'posts';
	export let onEdit: (id: number) => void;
	export let onDelete: (id: number) => void;
	export let onStatusChange: (id: number, newStatus: string) => void;

	const dispatch = createEventDispatcher();

	const statusColors = {
		Draft: 'from-warning-400 to-warning-600',
		Published: 'from-success-400 to-success-600',
		Archived: 'from-surface-500 to-surface-700'
	};
</script>

<!-- Generic Card -->
<div
	class="relative rounded-xl border border-surface-700 bg-surface-800 overflow-hidden hover:border-primary-700 transition"
>
	<!-- Status color bar -->
	<div
		class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r {statusColors[item.status]}"
	></div>

	<!-- MEDIA CARD VIEW -->
	{#if type === 'media'}
		<!-- Image -->
		{#if item.image}
			<img
				src={item.image}
				alt={item.title}
				class="w-full h-56 object-cover border-b border-surface-700"
			/>
		{:else}
			<div
				class="w-full h-56 flex items-center justify-center bg-surface-900 border-b border-surface-700 text-surface-400 text-sm"
			>
				No Image Available
			</div>
		{/if}

		<!-- Name -->
		<div class="p-4 text-center">
			<h2 class="text-white font-medium truncate">{item.title}</h2>
		</div>

		<!-- Footer -->
		<div class="border-t border-surface-700 px-4 py-3 space-y-3">
			<!-- Status selector -->
			<div class="flex justify-center">
				<select
					class="text-sm bg-surface-700 text-surface-200 rounded-md border border-surface-600 px-2 py-1 focus:ring-2 focus:ring-primary-500"
					bind:value={item.status}
					on:change={() => onStatusChange(item.id, item.status)}
				>
					<option>Draft</option>
					<option>Published</option>
				</select>
			</div>

			<!-- Action buttons -->
			<div
				class="flex justify-around text-sm border-t border-surface-700 pt-2 mt-2 text-center"
			>
				<button
					class="text-primary-400 hover:text-primary-300 transition"
					on:click={() => dispatch('preview', item)}
				>
					Preview
				</button>
				<button
					class="text-error-400 hover:text-error-300 transition"
					on:click={() => onDelete(item.id)}
				>
					Delete
				</button>
			</div>
		</div>

	{:else}
		<!-- DEFAULT CARD VIEW (Posts / Products) -->
		{#if item.image}
			<img
				src={item.image}
				alt=""
				class="w-full h-40 object-cover border-b border-surface-700"
			/>
		{/if}

		<div class="p-5 flex flex-col gap-3">
			<h2 class="font-semibold text-lg text-white truncate">
				{item.title}
			</h2>
			<p class="text-surface-400 text-sm line-clamp-2">
				{item.excerpt || item.description || 'No description yet.'}
			</p>

			<div class="flex justify-between items-center mt-2">
				<select
					class="text-sm bg-surface-700 text-surface-200 rounded-md border border-surface-600 px-2 py-1 focus:ring-2 focus:ring-primary-500"
					bind:value={item.status}
					on:change={() => onStatusChange(item.id, item.status)}
				>
					<option>Draft</option>
					<option>Published</option>
					<option>Archived</option>
				</select>

				<span
					class="text-xs font-medium rounded-md px-2 py-0.5
					{item.status === 'Draft' && 'bg-warning-700 text-warning-200'}
					{item.status === 'Published' && 'bg-success-700 text-success-200'}
					{item.status === 'Archived' && 'bg-surface-600 text-surface-200'}"
				>
					{item.status}
				</span>
			</div>

			<div
				class="flex justify-around text-sm mt-3 pt-2 border-t border-surface-700"
			>
				<button
					class="text-primary-400 hover:text-primary-300 transition"
					on:click={() => dispatch('preview', item)}
				>
					Preview
				</button>
				<button
					class="text-success-400 hover:text-success-300 transition"
					on:click={() => onEdit(item.id)}
				>
					Edit
				</button>
				<button
					class="text-error-400 hover:text-error-300 transition"
					on:click={() => onDelete(item.id)}
				>
					Delete
				</button>
			</div>
		</div>
	{/if}
</div>
