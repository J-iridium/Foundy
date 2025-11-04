<script>
  import { createEventDispatcher } from 'svelte';
  export let type = 'posts'; // 'posts' | 'products' | 'media'
  const dispatch = createEventDispatcher();

  // Shared fields
  let title = '';
  let excerpt = '';
  let description = '';
  let price = '';
  let file; // for media uploads

  function save() {
    // Build payload by type
    let payload = { type, status: 'Draft' };

    if (type === 'posts') {
      payload = { ...payload, title, excerpt };
    } else if (type === 'products') {
      payload = { ...payload, title, description, price: parseFloat(price || '0') };
    } else {
      // media
      payload = { ...payload, fileName: file?.name ?? '', title };
    }

    dispatch('save', payload);
    dispatch('close');
  }
</script>

<h2 class="text-lg font-semibold mb-3 capitalize">Add {type.slice(0, -1)}</h2>

{#if type === 'posts'}
  <input class="w-full border rounded p-2 mb-2" placeholder="Title" bind:value={title} />
  <textarea class="w-full border rounded p-2 mb-3" placeholder="Excerpt" bind:value={excerpt} />
{:else if type === 'products'}
  <input class="w-full border rounded p-2 mb-2" placeholder="Product name" bind:value={title} />
  <textarea class="w-full border rounded p-2 mb-2" placeholder="Description" bind:value={description} />
  <input class="w-full border rounded p-2 mb-3" placeholder="Price (e.g. 29.99)" bind:value={price} />
{:else}
  <!-- media -->
  <input class="w-full border rounded p-2 mb-2" placeholder="Title (optional)" bind:value={title} />
  <input class="w-full border rounded p-2 mb-3" type="file" on:change={(e)=>file = e.currentTarget.files?.[0]} />
{/if}

<div class="flex justify-end gap-2">
  <button class="px-4 py-2 rounded bg-gray-200" on:click={() => dispatch('close')}>Cancel</button>
  <button class="px-4 py-2 rounded bg-blue-600 text-white" on:click={save}>Save</button>
</div>
