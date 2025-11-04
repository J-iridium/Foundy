<script lang="ts">
	export let item: any;
</script>

<div class="p-8 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto items-center">
	<img
		src={item.image}
		alt={item.title}
		class="rounded-lg border border-surface-700 w-full"
	/>
	<div>
		<h1 class="text-3xl font-bold text-white mb-2">{item.title}</h1>
		<p class="text-surface-400 text-sm mb-4">Status: {item.status}</p>
		<p class="text-surface-200 mb-6 leading-relaxed">
			{item.description ||
			'An example of how your product will look in the storefront view.'}
		</p>
		<button
			class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition"
		>
			Add to Cart
		</button>
	</div>
</div>
