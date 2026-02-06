<script lang="ts">
	import { type Component } from "svelte";
	import { Nut } from "@lucide/svelte";
    import type { Sorting } from "$types/app";

	export let iconTitle: Component = Nut;
	export let title: string = "Give Title";
	export let description: string = "Give Description";
	export let iconButton: Component = Nut;
	export let textButton: string = "this is a button";
	export let isDisabled: boolean = false;
	export let action: (() => void) | undefined;

	// 👇 New props for sorting
	export let showSort: boolean = false;
	export let sortValue: Sorting = "oldest";
	export let onSortChange: (value: Sorting) => void = () => {};

	const options = [
		{ value: "newest", label: "Newest First" },
		{ value: "oldest", label: "Oldest First" },
		{ value: "az", label: "A-Z" },
		{ value: "za", label: "Z-A" }
	];
</script>

<div class="p-3 border-b border-surface-700 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
	<!-- Left section -->
	<div>
		<h1 class="text-2xl font-semibold text-on-surface flex items-center gap-2">
			<svelte:component this={iconTitle} class="w-5 h-5 text-primary-400" />
			{title}
		</h1>
		<p class="text-sm text-surface-400 mt-1">{description}</p>
	</div>

	<!-- Right section -->
	<div class="flex items-center gap-3">
		{#if showSort}
			<select
				bind:value={sortValue}
				on:change={(e) => onSortChange((e.target as HTMLSelectElement).value as Sorting)}
				class="bg-surface-800 border border-surface-700 text-sm text-surface-200 rounded-lg py-2 focus:ring-2 focus:ring-primary-500 outline-none hover:bg-surface-700 transition"
			>
				{#each options as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		{/if}

		{#if action !== undefined}
			<button
				on:click={action}
				class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
				disabled={isDisabled}
			>
				<svelte:component this={iconButton} class="w-4 h-4" />
				{textButton}
			</button>
		{/if}
	</div>
</div>
