<script lang="ts">
	import { type Component } from "svelte";
	import { Nut} from "@lucide/svelte";

	export let iconTitle: Component = Nut;
	export let title: string = "Give Title";
	export let description: string = "Give Description";
	export let iconButton: Component = Nut;
	export let textButton: string = "this is a button";
    export let isDisabled: boolean = false;
	export let action: () => void;
    console.log(action, iconButton)
</script>

<div class="p-3 border-b border-surface-700 flex items-center justify-between">
	<div>
		<h1 class="text-2xl font-semibold text-on-surface flex items-center gap-2">
			<svelte:component this={iconTitle} class="w-5 h-5 text-primary-400" />
			{title}
		</h1>
		<p class="text-sm text-surface-400 mt-1">{description}</p>
	</div>
    {#if action !== undefined}
	<button
		on:click={action}
		class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        disabled={isDisabled}
	>
		<svelte:component this={iconButton} class="w-4 h-4" />
		{textButton}
	</button>
    {/if}
</div>
