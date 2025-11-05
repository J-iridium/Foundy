<script lang="ts">
	import { onMount } from 'svelte';

	let jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiZjgzZmQzYjktNmU1NC00NjNhLWIxODYtYmRmNjBkZTE3YmIzIiwic2l0ZV9pZCI6ImJiNzkwNzllLWMwOTQtNDQ1Mi1hNzU5LTNhYWEyODVlNTM4NyIsImRvbWFpbiI6ImppcmlkaXVtLm5sIiwicGVybWlzc2lvbnMiOlsicmVhZDpjb250ZW50Il0sImlhdCI6MTc2MjAyMDg5NCwiZXhwIjoxNzkzNTU2ODk0LCJpc3MiOiJmb3VuZHktY21zIn0.Ypsvrt3XZcjfinhcD0731OaUAaTYtpf6uDz1SUtKroU'; // Supply your JWT token here (or retrieve from cookies/localStorage)
	let content: any[] = [];
	let error: string | null = null;

	onMount(async () => {
		try {
			const res = await fetch('/api/v2/public/content', {
				headers: {
					Authorization: `Bearer ${jwtToken}`
				}
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Failed to load content');
			content = data.data || [];
		} catch (err: any) {
			error = err.message;
			console.error('Error loading public content:', err);
		}
	});

	// Derived collections
	$: posts = content.filter((c) => c.type === 'posts');
	$: products = content.filter((c) => c.type === 'products');
	$: media = content.filter((c) => c.type === 'media');
    
</script>

<div class="min-h-screen bg-surface-950 text-white p-8 space-y-10">
	<h1 class="text-3xl font-bold mb-8">Public CMS Content</h1>

	{#if error}
		<p class="text-red-400">Error: {error}</p>
	{:else if !content.length}
		<p class="text-surface-400">Loading published content...</p>
	{:else}
		<!-- POSTS -->
		{#if posts.length}
			<section>
				<h2 class="text-2xl font-semibold mb-4 text-primary-400">Posts</h2>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each posts as post}
						<div class="p-4 border border-surface-700 rounded-lg bg-surface-900">
							<h3 class="font-semibold text-lg mb-2">{post.data.title}</h3>
							<p class="text-surface-400 text-sm">
								{post.data.excerpt || 'No excerpt provided.'}
							</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- PRODUCTS -->
		{#if products.length}
			<section>
				<h2 class="text-2xl font-semibold mb-4 text-green-400">Products</h2>
				<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each products as product}
						<div class="p-4 border border-surface-700 rounded-lg bg-surface-900 flex flex-col items-center text-center">
							{#if product.data.images?.length}
								<img
									src={`data:image/jpeg;base64,${product.data.images[0]}`}
									alt={product.data.title}
									class="w-full h-48 object-cover rounded-md mb-3"
								/>
							{/if}
							<h3 class="font-semibold text-lg mb-1">{product.data.title}</h3>
							<p class="text-primary-400 font-bold mb-2">
								€{product.data.price?.toFixed(2) || '0.00'}
							</p>
							<p class="text-surface-400 text-sm">
								{product.data.description || 'No description.'}
							</p>
						</div>
					{/each}
				</div>
			</section>
		{/if}

		<!-- MEDIA -->
		{#if media.length}
			<section>
				<h2 class="text-2xl font-semibold mb-4 text-blue-400">Media</h2>
				<div class="grid md:grid-cols-3 gap-6">
					{#each media as m}
						<div class="p-3 bg-surface-900 border border-surface-700 rounded-lg flex flex-col items-center">
							{#if m.data.images?.length}
								<img
									src={`data:image/jpeg;base64,${m.data.images[0]}`}
									alt={m.data.title}
									class="rounded-lg w-full object-cover mb-2"
								/>
							{/if}
							<h3 class="font-medium">{m.data.title || 'Untitled Media'}</h3>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/if}
</div>
