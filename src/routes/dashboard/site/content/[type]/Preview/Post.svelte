<script lang="ts">
	export let item: {
		id: string;
		status: 'Draft' | 'Published' | 'Archived';
		data: {
			title?: string;
			excerpt?: string;
			description?: string;
			images?: string[];
		};
	};
</script>

<div class="p-8 prose prose-invert max-w-3xl mx-auto">
	<h1 class="text-3xl font-bold text-white mb-2">
		{item.data?.title || item.name || 'Untitled Post'}
	</h1>

	<p class="text-surface-400 italic mb-4">
		Status: {item.status}
	</p>

	{#if item.data?.images?.length}
		<img
			src={`data:image/jpeg;base64,${item.data.images[0]}`}
			alt={item.data?.title || ''}
			class="w-full rounded-lg mb-4 border border-surface-700"
		/>
	{/if}

	<p class="text-surface-200 leading-relaxed">
		{item.data?.excerpt ||
			item.data?.description ||
			'This is an interactive preview of how your post will appear on the live site.'}
	</p>
</div>
