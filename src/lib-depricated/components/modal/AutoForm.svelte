<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let schema: any; 
  export let value: any; 
  export let label: string = '';

  const dispatch = createEventDispatcher();

  // --- Styles from your snippet ---
  const inputClass = "w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-gray-100";
  const btnSecondary = "px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition";
  const btnDestructive = "text-xs text-red-500 hover:text-red-700 dark:text-red-400";

  // Determine type
  function getSchemaType(s: any): 'primitive' | 'array-objects' | 'object' | 'string-array' {
    if (typeof s === 'string') {
      if (s === 'string[]') return 'string-array';
      return 'primitive';
    }
    if (Array.isArray(s)) return 'array-objects';
    if (typeof s === 'object') return 'object';
    return 'primitive';
  }

  const type = getSchemaType(schema);

  // Initialize defaults
  if (value === undefined) {
    if (type === 'array-objects' || type === 'string-array') value = [];
    else if (type === 'object') value = {};
    else value = '';
  }

  // --- Your File Logic ---
  async function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const files = Array.from(target.files || []);
    
    const base64Results = await Promise.all(
        files.map((file) =>
            new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            })
        )
    );

    // If schema is just "base64" (singular), take the first one. 
    // If you add "base64[]" to your Modals.ts later, you can map this to array.
    if (schema === 'base64') {
        value = base64Results[0] || '';
    } else {
        value = base64Results; // Fallback for arrays
    }
  }

  function addArrayItem() {
    value = [...value, {}];
  }

  function removeArrayItem(index: number) {
    value = value.filter((_, i) => i !== index);
  }
</script>

<div class="mb-3">
  {#if type === 'primitive'}
    
    {#if schema === 'string'}
        {#if label.toLowerCase().includes('description') || label.toLowerCase().includes('content') || label.toLowerCase().includes('html')}
            <textarea class={inputClass} placeholder={label} bind:value rows="3"></textarea>
        {:else}
            <input type="text" class={inputClass} placeholder={label} bind:value />
        {/if}

    {:else if schema === 'number'}
      <input type="number" class={inputClass} placeholder={label} bind:value />

    {:else if schema === 'base64'}
      <div class="mb-2">
        <label class="block text-sm font-medium mb-1 capitalize text-gray-700 dark:text-gray-300">{label}</label>
        <input type="file" accept="image/*" class={inputClass} on:change={handleFileChange} />
        
        {#if value}
            <div class="mt-2">
                <img src={`data:image/jpeg;base64,${value}`} alt="Preview" class="w-16 h-16 object-cover rounded border border-gray-300 dark:border-gray-700" />
            </div>
        {/if}
      </div>

    {:else if schema === 'boolean'}
        <label class="flex items-center gap-2 mb-2 text-gray-900 dark:text-gray-100">
            <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" bind:checked={value} />
            <span class="capitalize">{label}</span>
        </label>
    {:else}
        <input type="text" class={inputClass} placeholder={label} bind:value />
    {/if}

  {:else if type === 'string-array'}
    <label class="block text-sm font-medium mb-1 capitalize text-gray-700 dark:text-gray-300">{label} (comma separated)</label>
    <input 
        type="text" 
        class={inputClass}
        value={Array.isArray(value) ? value.join(', ') : ''} 
        on:input={(e) => value = e.currentTarget.value.split(',').map(s=>s.trim()).filter(Boolean)} 
        placeholder="tag1, tag2"
    />

  {:else if type === 'object'}
    <div class="pl-3 border-l-2 border-gray-200 dark:border-gray-700 mt-2 mb-4">
      <h3 class="text-sm font-semibold text-gray-500 mb-2 capitalize">{label || 'Details'}</h3>
      {#each Object.entries(schema) as [key, subSchema]}
        <svelte:self schema={subSchema} bind:value={value[key]} label={key} />
      {/each}
    </div>

  {:else if type === 'array-objects'}
    <div class="mt-3 mb-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-semibold text-gray-700 dark:text-gray-200 capitalize">{label} List</h3>
        <button type="button" class={btnSecondary} on:click={addArrayItem}>+ Add {label}</button>
      </div>

      <div class="space-y-3">
        {#each value as item, i}
            <div class="relative border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-3 rounded-lg">
                <div class="absolute top-2 right-2 z-10">
                    <button type="button" class={btnDestructive} on:click={() => removeArrayItem(i)}>Remove</button>
                </div>
                
                {#each Object.entries(schema[0]) as [key, subSchema]}
                    <svelte:self schema={subSchema} bind:value={item[key]} label={key} />
                {/each}
            </div>
        {/each}
      </div>
    </div>
  {/if}
</div>