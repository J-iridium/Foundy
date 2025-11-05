<script lang="ts">
	export let item: {
		id: string;
		status: 'Draft' | 'Published' | 'Archived';
		data: {
			title?: string;
			images?: string[];
		};
	};
</script>

<div class="p-6 flex flex-col items-center justify-center h-full">
	<h1 class="text-xl font-semibold text-white mb-3">
		{item.data?.title || item.name || 'Untitled Media'}
	</h1>

	{#if item.data?.images?.length}
		<img
			src={`data:image/jpeg;base64,${item.data.images[0]}`}
			alt={item.data?.title || ''}
			class="max-h-[70vh] rounded-lg border border-surface-700 object-contain"
		/>
	{:else}
		<div
			class="flex items-center justify-center text-surface-400 text-sm border border-dashed border-surface-600 rounded-lg p-8"
		>
			No image available
		</div>
	{/if}
</div>
