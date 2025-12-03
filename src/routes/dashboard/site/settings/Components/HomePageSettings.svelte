<script lang="ts">
    import { onMount } from 'svelte';
    import { store_selectedSite } from '$lib/stores/site.store';
    import { CMS } from '$lib/supabase/cms';
    import { showToast } from '$lib/stores';
    
    // Type Imports
    import { Modals } from '$types/generated/Modals'; // Import the schema source
    import type { HomePage } from '$types/db/content';
    import type { FrequentlyAnsweredQuestionsData } from '$types/db/content/T/FrequentlyansweredquestionsData.T';
    import type { PricingData } from '$types/db/content/T/PricingData.T';
    import type { FeaturedData } from '$types/db/content/T/FeaturedData.T';
    import type { ReferencesData } from '$types/db/content/T/ReferenceData.T';
    import type { HeroData } from '$types/db/content/T/HeroData.T';

    // Component Import
    import AddEditModal from '$lib/components/modal/AddEditModal.svelte';

    // Homepage data object
    let homepage: HomePage = { data: {} } as HomePage;
    let loadingHome = true;

    // --- Modal State ---
    let showModal = false;
    let modalTitleKey = "";     // Used for the title (e.g. "Pricing")
    let modalSchema: any = {};  // The specific slice of Modals.ts
    let modalPreData: any = {}; // The data to edit
    let editingIndex: number | null = null; // To track if we are updating an array item

    onMount(async () => {
        if (!$store_selectedSite) return;
        const { data, error } = await CMS.Content.get($store_selectedSite, 'homepage', 'homepage');
        if (error) {
            showToast('warning', 'Failed to load homepage', error.message);
            return;
        }
        homepage = data as HomePage;
        loadingHome = false;
    });

    // --- Helper to Open Modal ---
    function openModal(key: string, schema: any, data: any = {}, index: number | null = null) {
        modalTitleKey = key;
        modalSchema = schema;
        modalPreData = data;
        editingIndex = index;
        showModal = true;
    }

    // --- Modal Save Handler ---
    function handleModalSave(e: CustomEvent) {
        const newData = e.detail.data;

        // 1. Handle Single Object Sections (Hero, Logo)
        if (modalTitleKey === 'Hero') {
            homepage.data.hero = newData;
        } 
        
        // 2. Handle Array Sections (Pricing, Featured, etc.)
        else {
            const sectionKey = modalTitleKey.toLowerCase(); // 'pricing', 'featured', 'faq'
            
            // Ensure array exists
            if (!homepage.data[sectionKey]) homepage.data[sectionKey] = [];

            if (editingIndex !== null && editingIndex >= 0) {
                // Update existing item
                homepage.data[sectionKey][editingIndex] = newData;
            } else {
                // Add new item
                homepage.data[sectionKey] = [...homepage.data[sectionKey], newData];
            }
        }

        // Trigger Svelte reactivity manually for deep objects if needed
        homepage = { ...homepage }; 

        CMS.Content.update(homepage.site_id,homepage.id!, homepage);
        
        showToast('success', 'Saved', `${modalTitleKey} updated locally`);
    }


    /* ---- Specific Editing Functions ---- */

    function editHero(hero: HeroData) {
        // Pass the Hero schema and current data
        openModal('Hero', Modals.homepage.hero, hero);
    }

    // --- FEATURED ---
    function addFeatured() {
        // Schema: inside the array [0]
        openModal('featured', Modals.homepage.featured[0], {});
    }
    function editFeatured(featured: FeaturedData, index: number) {
        openModal('featured', Modals.homepage.featured[0], featured, index);
    }
    function deleteFeatured(featured: FeaturedData) {
        homepage.data.featured = homepage.data.featured.filter(f => f !== featured);
    }

    // --- PRICING ---
    function addPricing() {
        openModal('pricing', Modals.homepage.pricing[0], {});
    }
    function editPricing(tier: PricingData, index: number) {
        openModal('pricing', Modals.homepage.pricing[0], tier, index);
    }
    function deletePricing(pricing: PricingData) {
        homepage.data.pricing = homepage.data.pricing.filter(p => p !== pricing);
    }

    // --- FAQ ---
    function addFAQ() {
        openModal('faq', Modals.homepage.faq[0], {});
    }
    function editFAQ(faq: FrequentlyAnsweredQuestionsData, index: number) {
        openModal('faq', Modals.homepage.faq[0], faq, index);
    }
    function deleteFAQ(faq: FrequentlyAnsweredQuestionsData) {
        homepage.data.faq = homepage.data.faq.filter(f => f !== faq);
    }

    // --- REFERENCES ---
    function addReference() {
        openModal('references', Modals.homepage.references[0], {});
    }
    function editReference(reference: ReferencesData, index: number) {
        openModal('references', Modals.homepage.references[0], reference, index);
    }
    function deleteReference(reference: ReferencesData) {
        homepage.data.references = homepage.data.references.filter(r => r !== reference);
    }

</script>

<div class="relative bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
    <div class="absolute top-0 left-0 h-1 w-full bg-primary-600"></div>

    <div class="p-6 space-y-6">
        <h2 class="text-lg font-semibold text-white flex items-center gap-2">
            Homepage Content
        </h2>

        {#if loadingHome}
            <div class="animate-pulse flex space-x-4">
                <div class="flex-1 space-y-4 py-1">
                    <div class="h-4 bg-surface-600 rounded w-3/4"></div>
                </div>
            </div>
        {:else}

            <section class="space-y-3">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-md font-semibold text-white">Hero Section</h3>
                    <button class="px-3 py-2 bg-surface-700 rounded-md text-sm hover:bg-surface-600 transition"
                        on:click={() => editHero(homepage.data.hero)}>
                        Edit Hero
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-900 p-4 rounded-lg border border-surface-700">
                    
                    <div class="flex flex-col justify-center space-y-4">
                        <div class="space-y-1">
                            <span class="text-xs uppercase tracking-wider text-surface-400 font-bold">Company Name</span>
                            <div class="text-xl font-semibold text-white">
                                {homepage.data.hero?.title || 'Not set'}
                            </div>
                        </div>

                        <div class="space-y-1">
                            <span class="text-xs uppercase tracking-wider text-surface-400 font-bold">Company Slogan</span>
                            <div class="text-gray-300">
                                {homepage.data.hero?.subtitle || 'Not set'}
                            </div>
                        </div>
                    </div>

                    <div class="md:h-full min-h-[160px] max-h-[210px] flex items-center justify-end overflow-hidden p-2">
						{#if homepage.data.hero.logo}
							<img 
								src={`data:image/jpeg;base64,${homepage.data.hero.image}`} 
								alt="Hero" 
								class="md:h-full object-contain rounded-lg bg-surface-800 border border-surface-600 " 
							/>
						{:else}
							<span class="text-surface-500 text-sm">No Image</span>
						{/if}
					</div>

                </div>
            </section>

            <!-- <section class="space-y-3">
                <div class="flex justify-between items-center">
                    <h3 class="text-md font-semibold text-white">Logo</h3>
                    <button class="px-3 py-2 bg-surface-700 rounded-md text-sm hover:bg-surface-600"
                        on:click={() => editLogo()}>
                        Upload / Change Logo
                    </button>
                </div>  
            </section> -->

            <section class="space-y-3">
                <div class="flex justify-between items-center">
                    <h3 class="text-md font-semibold text-white">Featured Companies</h3>
                    <button on:click={addFeatured} class="px-3 py-2 bg-primary-700 rounded-md text-sm hover:bg-primary-600">
                        Add Featured
                    </button>
                </div>

                {#if homepage.data?.featured}
                    {#each homepage.data.featured as item, index}
                        <div class="flex justify-between bg-surface-900 p-3 rounded-lg border border-surface-700">
                            <span>{item.companyName}</span>
                            <div class="flex gap-2">
                                <button class="text-xs px-2 py-1 bg-surface-700 rounded-md hover:bg-surface-600" on:click={() => editFeatured(item, index)}>Edit</button>
                                <button class="text-xs px-2 py-1 bg-error-600 rounded-md hover:bg-error-500" on:click={() => deleteFeatured(item)}>Delete</button>
                            </div>
                        </div>
                    {/each}
                {/if}
            </section>

            <section class="space-y-3">
                <div class="flex justify-between items-center">
                    <h3 class="text-md font-semibold text-white">Pricing Plans</h3>
                    <button on:click={addPricing} class="px-3 py-2 bg-primary-700 rounded-md text-sm hover:bg-primary-600">
                        Add Pricing Tier
                    </button>
                </div>

                {#if homepage.data?.pricing}
                    {#each homepage.data.pricing as tier, index}
                        <div class="flex justify-between bg-surface-900 p-3 rounded-lg border border-surface-700">
                            <span>{tier.name}</span>
                            <div class="flex gap-2">
                                <button class="text-xs px-2 py-1 bg-surface-700 rounded-md hover:bg-surface-600" on:click={() => editPricing(tier, index)}>Edit</button>
                                <button class="text-xs px-2 py-1 bg-error-600 rounded-md hover:bg-error-500" on:click={() => deletePricing(tier)}>Delete</button>
                            </div>
                        </div>
                    {/each}
                {/if}
            </section>

            <section class="space-y-3">
                <div class="flex justify-between items-center">
                    <h3 class="text-md font-semibold text-white">Frequently Asked Questions</h3>
                    <button on:click={addFAQ} class="px-3 py-2 bg-primary-700 rounded-md text-sm hover:bg-primary-600">
                        Add Question
                    </button>
                </div>

                {#if homepage.data?.faq}
                    {#each homepage.data.faq as q, index}
                        <div class="flex justify-between bg-surface-900 p-3 rounded-lg border border-surface-700">
                            <span>{q.question}</span>
                            <div class="flex gap-2">
                                <button class="text-xs px-2 py-1 bg-surface-700 rounded-md hover:bg-surface-600" on:click={() => editFAQ(q, index)}>Edit</button>
                                <button class="text-xs px-2 py-1 bg-error-600 rounded-md hover:bg-error-500" on:click={() => deleteFAQ(q)}>Delete</button>
                            </div>
                        </div>
                    {/each}
                {/if}
            </section>

            <section class="space-y-3">
                <div class="flex justify-between items-center">
                    <h3 class="text-md font-semibold text-white">References</h3>
                    <button on:click={addReference} class="px-3 py-2 bg-primary-700 rounded-md text-sm hover:bg-primary-600">
                        Add Reference
                    </button>
                </div>

                {#if homepage.data?.references}
                    {#each homepage.data.references as ref, index}
                        <div class="flex justify-between bg-surface-900 p-3 rounded-lg border border-surface-700">
                            <span class="truncate max-w-[200px]">{ref.label ?? ref.uri}</span>
                            <div class="flex gap-2">
                                <button class="text-xs px-2 py-1 bg-surface-700 rounded-md hover:bg-surface-600" on:click={() => editReference(ref, index)}>Edit</button>
                                <button class="text-xs px-2 py-1 bg-error-600 rounded-md hover:bg-error-500" on:click={() => deleteReference(ref)}>Delete</button>
                            </div>
                        </div>
                    {/each}
                {/if}
            </section>

        {/if}
    </div>
</div>

{#if showModal}
    <AddEditModal 
        type={modalTitleKey} 
        schema={modalSchema} 
        preData={modalPreData} 
        on:close={() => showModal = false}
        on:save={handleModalSave}
    />
{/if}