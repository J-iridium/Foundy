<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { Modals } from "$types/generated/Modals"; 
  import AutoForm from "./AutoForm.svelte"; 

  export let type: keyof typeof Modals | string = ""; 
  export let schema: any = undefined;
  export let preData: Record<string, any> = {};

  const dispatch = createEventDispatcher();
  
  $: finalSchema = schema || (type ? Modals[type as keyof typeof Modals] : {});

  let formData: Record<string, any> = {};

  // Deep copy data on init
  $: {
    if (preData && Object.keys(preData).length > 0) {
        formData = structuredClone(preData);
    } else {
        formData = {};
    }
  }

  function save() {
    dispatch("save", { type, data: formData });
    dispatch("close");
  }

  // --- Close on backdrop click logic ---
  function handleBackdropClick(e: MouseEvent) {
      if (e.target === e.currentTarget) {
          dispatch("close");
      }
  }
</script>

<div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
    transition:fade={{ duration: 200 }}
    on:click={handleBackdropClick}
    role="dialog"
>
  <div 
      class="bg-white dark:bg-surface-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]"
      transition:fly={{ y: 20, duration: 300 }}
  >
    
    <div class="p-5 pb-0">
        <h2 class="text-xl font-bold capitalize">
            {Object.keys(preData).length ? 'Edit' : 'Add'} {type}
        </h2>
    </div>

    <div class="p-5 overflow-y-auto flex-1 custom-scrollbar">
        {#if finalSchema}
            {#each Object.entries(finalSchema) as [key, fieldSchema]}
                <AutoForm 
                    schema={fieldSchema} 
                    bind:value={formData[key]} 
                    label={key} 
                />
            {/each}
        {:else}
            <div class="p-4 bg-red-100 text-red-700 rounded-md">Schema not found</div>
        {/if}
    </div>

    <div class="p-5 pt-0 flex justify-end gap-2 mt-2">
        <button 
            class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition" 
            on:click={() => dispatch("close")}
        >
            Cancel
        </button>
        <button 
            class="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm" 
            on:click={save}
        >
            Save
        </button>
    </div>

  </div>
</div>

<style>
    /* Optional: cleaner scrollbar for the modal content */
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 20px;
    }
</style>