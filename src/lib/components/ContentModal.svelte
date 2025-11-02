<script lang="ts">
    export let open : boolean = false
    export let mode : 'create' | 'edit' = 'create';
    export let site_id : string;
    export let name : string = '';
    export let type : 'blog' | 'image' | 'catalog' | 'text' = 'text';
    export let data : any = {};
    export let status : 'draft' | 'published' | 'archived' = 'draft';

    export let onClose : () => void = () => {};
    export let onSubmit : (payload : any) => Promise<void> = async () => {};
    
    async function handleSubmit() {
        await onSubmit({site_id, name , type, data, status});
    }
</script>

{#if open}
	<!-- Overlay -->
	<div class="fixed inset-0 bg-surface-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
		<!-- Modal container -->
		<div class="bg-surface text-on-surface shadow-lg rounded-xl w-full max-w-2xl p-6 space-y-5 border border-outline">
			<!-- Header -->
			<div class="flex items-center justify-between">
				<h2 class="text-xl font-semibold">
					{mode === 'create' ? 'Add Content' : 'Edit Content'}
				</h2>
				<button
					class="text-on-surface-variant hover:text-primary transition"
					on:click={onClose}
					aria-label="Close"
				>
					✕
				</button>
			</div>

			<!-- Common fields -->
			<div class="grid gap-4">
				<label class="block">
					<span class="text-sm text-on-surface-variant">Name (unique per site)</span>
					<input
						class="input input-filled w-full mt-1"
						bind:value={name}
						readonly={mode === 'edit'}
					/>
				</label>

				<label class="block">
					<span class="text-sm text-on-surface-variant">Type</span>
					<select
						class="input input-filled w-full mt-1"
						bind:value={type}
						disabled={mode === 'edit'}
					>
						<option value="text">Text</option>
						<option value="blog">Blog</option>
						<option value="image">Image</option>
						<option value="catalog">Catalog</option>
					</select>
				</label>

				<label class="block">
					<span class="text-sm text-on-surface-variant">Status</span>
					<select class="input input-filled w-full mt-1" bind:value={status}>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
						<option value="archived">Archived</option>
					</select>
				</label>
			</div>

			<!-- Type-specific editors -->
			{#if type === 'text'}
				<div class="grid gap-3">
					<label>Title <input class="input input-filled w-full" bind:value={data.title} /></label>
					<label>Text <textarea class="textarea textarea-filled w-full" rows="5" bind:value={data.text} /></label>
					<label
						>Alignment
						<select class="input input-filled w-full" bind:value={data.alignment}>
							<option>left</option>
							<option>center</option>
							<option>right</option>
						</select>
					</label>
				</div>

			{:else if type === 'blog'}
				<div class="grid gap-3">
					<label>Title <input class="input input-filled w-full" bind:value={data.title} /></label>
					<label>Preview <input class="input input-filled w-full" bind:value={data.preview} /></label>
					<label>Body <textarea class="textarea textarea-filled w-full" rows="8" bind:value={data.body} /></label>
					<label>Cover (base64) <textarea class="textarea textarea-filled w-full" rows="3" bind:value={data.cover_image} /></label>
					<label>Tags (comma sep)
						<input
							class="input input-filled w-full"
							on:change={(e) => (data.tags = String(e.target.value).split(',').map((s) => s.trim()))}
						/>
					</label>
				</div>

			{:else if type === 'image'}
				<div class="grid gap-3">
					<label>Alt <input class="input input-filled w-full" bind:value={data.alt} /></label>
					<label>Label <input class="input input-filled w-full" bind:value={data.label} /></label>

					<label>
						Image file (.png, .jpg)
						<input
							type="file"
							accept="image/png, image/jpeg"
							class="input input-filled w-full"
							on:change={onFileSelected}
						/>
					</label>

					{#if data.src}
						<div class="mt-2">
							<p class="text-sm text-on-surface-variant mb-1">Preview:</p>
							<img src={data.src} alt={data.alt} class="max-h-48 rounded border border-outline" />
						</div>
					{/if}
				</div>

			{:else if type === 'catalog'}
				<div class="grid gap-3">
					<label>Title <input class="input input-filled w-full" bind:value={data.title} /></label>
					<label>Price <input type="number" step="0.01" class="input input-filled w-full" bind:value={data.price} /></label>
					<label>Sale price <input type="number" step="0.01" class="input input-filled w-full" bind:value={data.sale_price} /></label>
					<label>Sale period (JSON) <textarea class="textarea textarea-filled w-full" rows="3" bind:value={data.sale_period} /></label>
					<label>Images (base64 array JSON) <textarea class="textarea textarea-filled w-full" rows="4" bind:value={data.images} /></label>
					<label>Options (JSON) <textarea class="textarea textarea-filled w-full" rows="4" bind:value={data.options} /></label>
				</div>
			{/if}

			<!-- Footer buttons -->
			<div class="flex justify-end gap-3 pt-3">
				<button class="btn variant-outline" on:click={onClose}>Cancel</button>
				<button
					class="btn variant-filled-primary"
					on:click|preventDefault={handleSubmit}
				>
					{mode === 'create' ? 'Create' : 'Save'}
				</button>
			</div>
		</div>
	</div>
{/if}