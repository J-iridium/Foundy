<script lang="ts">
	export let item: {
		id: string;
		status: 'Draft' | 'Published' | 'Archived';
		data: {
			title?: string;
			description?: string;
			price?: number;
			images?: string[];
		};
	};
</script>

<div class="p-8 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-center">
	<!-- Product images -->
	{#if item.data?.images?.length}
		<div class="flex flex-col gap-3">
			<!-- Main image -->
			<img
				src={`data:image/jpeg;base64,${item.data.images[0]}`}
				alt={item.data?.title || ''}
				class="rounded-lg border border-surface-700 w-full max-h-[60vh] object-cover"
			/>

			<!-- Thumbnails -->
			{#if item.data.images.length > 1}
				<div class="flex gap-2 overflow-x-auto mt-2 pb-2">
					{#each item.data.images.slice(1) as thumb}
						<img
							src={`data:image/jpeg;base64,${thumb}`}
							alt=""
							class="w-20 h-20 rounded-md border border-surface-600 object-cover flex-shrink-0"
						/>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<div
			class="flex items-center justify-center h-full text-surface-400 text-sm border border-dashed border-surface-600 rounded-lg p-8"
		>
			No product image available
		</div>
	{/if}

	<!-- Product info -->
	<div>
		<h1 class="text-3xl font-bold text-white mb-2">
			{item.data?.title || item.name || 'Untitled Product'}
		</h1>

		<p class="text-surface-400 text-sm mb-4">Status: {item.status}</p>

		{#if item.data?.price != null}
			<p class="text-2xl font-semibold text-primary-400 mb-4">
				€{item.data.price.toFixed(2)}
			</p>
		{/if}

		<p class="text-surface-200 mb-6 leading-relaxed">
			{item.data?.description ||
				'An example of how your product will look in the storefront view.'}
		</p>

		<button
			class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
		>
			Add to Cart
		</button>
	</div>
</div>
