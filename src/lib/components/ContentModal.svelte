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
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl w-full max-w-2xl p-4 space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">
          {mode === 'create' ? 'Add Content' : 'Edit Content'}
        </h2>
        <button on:click={onClose} aria-label="Close">✕</button>
      </div>

      <!-- Common fields -->
      <div class="grid gap-3">
        <label class="block">
          <span class="text-sm">Name (unique per site)</span>
          <input class="border rounded p-2 w-full" bind:value={name} readonly={mode==='edit'} />
        </label>

        <label class="block">
          <span class="text-sm">Type</span>
          <select class="border rounded p-2 w-full" bind:value={type} disabled={mode==='edit'}>
            <option value="text">text</option>
            <option value="blog">blog</option>
            <option value="image">image</option>
            <option value="catalog">catalog</option>
          </select>
        </label>

        <label class="block">
          <span class="text-sm">Status</span>
          <select class="border rounded p-2 w-full" bind:value={status}>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
      </div>

      <!-- Type-specific editors -->
      {#if type === 'text'}
        <div class="grid gap-2">
          <label>Title <input class="border rounded p-2 w-full" bind:value={data.title} /></label>
          <label>Text <textarea class="border rounded p-2 w-full" rows="5" bind:value={data.text} /></label>
          <label>Alignment
            <select class="border rounded p-2 w-full" bind:value={data.alignment}>
              <option>left</option>
              <option>center</option>
              <option>right</option>
            </select>
          </label>
        </div>
      {:else if type === 'blog'}
        <div class="grid gap-2">
          <label>Title <input class="border rounded p-2 w-full" bind:value={data.title} /></label>
          <label>Preview <input class="border rounded p-2 w-full" bind:value={data.preview} /></label>
          <label>Body <textarea class="border rounded p-2 w-full" rows="8" bind:value={data.body} /></label>
          <label>Cover (base64) <textarea class="border rounded p-2 w-full" rows="3" bind:value={data.cover_image} /></label>
          <label>Tags (comma sep) <input class="border rounded p-2 w-full" on:change={(e)=> data.tags = String(e.target.value).split(',').map(s=>s.trim())} /></label>
        </div>
      {:else if type === 'image'}
        <div class="grid gap-2">
          <label>Alt <input class="border rounded p-2 w-full" bind:value={data.alt} /></label>
          <label>Label <input class="border rounded p-2 w-full" bind:value={data.label} /></label>
          <label>Src (base64) <textarea class="border rounded p-2 w-full" rows="6" bind:value={data.src} /></label>
        </div>
      {:else if type === 'catalog'}
        <div class="grid gap-2">
          <label>Title <input class="border rounded p-2 w-full" bind:value={data.title} /></label>
          <label>Price <input type="number" step="0.01" class="border rounded p-2 w-full" bind:value={data.price} /></label>
          <label>Sale price <input type="number" step="0.01" class="border rounded p-2 w-full" bind:value={data.sale_price} /></label>
          <label>Sale period (JSON) <textarea class="border rounded p-2 w-full" rows="3" bind:value={data.sale_period} /></label>
          <label>Images (base64 array JSON) <textarea class="border rounded p-2 w-full" rows="4" bind:value={data.images} /></label>
          <label>Options (JSON) <textarea class="border rounded p-2 w-full" rows="4" bind:value={data.options} /></label>
        </div>

        <script>
          // helpers voor JSON velden
          $: data_sale_period = JSON.stringify(data.sale_period ?? {}, null, 2);
          $: data_images = JSON.stringify(data.images ?? [], null, 2);
          $: data_options = JSON.stringify(data.options ?? [], null, 2);
          $: (() => { try { data.sale_period = JSON.parse(data_sale_period) } catch {} })();
          $: (() => { try { data.images = JSON.parse(data_images) } catch {} })();
          $: (() => { try { data.options = JSON.parse(data_options) } catch {} })();
        </script>
      {/if}

      <div class="flex justify-end gap-2 pt-2">
        <button class="px-3 py-2 rounded border" on:click={onClose}>Cancel</button>
        <button class="px-4 py-2 rounded bg-blue-600 text-white" on:click|preventDefault={handleSubmit}>
          {mode === 'create' ? 'Create' : 'Save'}
        </button>
      </div>
    </div>
  </div>
{/if}