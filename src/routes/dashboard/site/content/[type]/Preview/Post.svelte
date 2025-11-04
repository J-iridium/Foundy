<script lang="ts">
	export let item: any;
</script>

<div class="p-8 prose prose-invert max-w-3xl mx-auto">
	<h1 class="text-3xl font-bold text-white mb-2">{item.title}</h1>
	<p class="text-surface-400 italic mb-4">
		Status: {item.status}
	</p>
	<img
		src={item.image}
		alt=""
		class="w-full rounded-lg mb-4 border border-surface-700"
	/>
	<p class="text-surface-200 leading-relaxed">
		{item.excerpt ||
		'This is an interactive preview of how your post will appear on the live site.'}
	</p>
</div>
