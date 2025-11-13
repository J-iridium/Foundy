<script lang="ts">
	import { X } from '@lucide/svelte';
	import type { ComponentType } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import PreviewPost from './Preview/Post.svelte';
	import PreviewProduct from './Preview/Product.svelte';
	import PreviewMedia from './Preview/Media.svelte';

	export let type: 'posts' | 'products' | 'media';
	export let item: any;
	export let onClose: () => void;

	let component: ComponentType;

	// Dynamically select preview layout based on type
	$: {
		if (type === 'posts') component = PreviewPost;
		else if (type === 'products') component = PreviewProduct;
		else component = PreviewMedia;
	}
</script>

<div
	class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
	on:click={() => onClose()}
	transition:fade={{duration: 150}}
>
	<div
		class="bg-surface-900 border border-surface-700 rounded-xl w-[90%] h-[85%] max-w-5xl overflow-hidden relative flex flex-col"
		on:click|stopPropagation
		transition:scale={{duration: 200, start: 0.8}}
	>
		<!-- Header -->
		<div class="flex justify-between items-center p-4 border-b border-surface-700 bg-surface-800">
			<h2 class="text-white font-semibold text-lg">Live Preview</h2>
			<button
				on:click={onClose}
				class="text-surface-400 hover:text-surface-100 transition"
			>
				<X class="w-5 h-5" />
			</button>
		</div>

		<!-- Live Content Area -->
		<div class="flex-1 bg-surface-950 overflow-y-auto">
			<svelte:component this={component} {item} />
		</div>
	</div>
</div>
