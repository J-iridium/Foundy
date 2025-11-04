<script lang="ts">
	export let item: any;
</script>

<div class="p-6 flex flex-col items-center justify-center h-full">
	<h1 class="text-xl font-semibold text-white mb-3">{item.title}</h1>
	<img
		src={item.image}
		alt=""
		class="max-h-[70vh] rounded-lg border border-surface-700"
	/>
</div>
