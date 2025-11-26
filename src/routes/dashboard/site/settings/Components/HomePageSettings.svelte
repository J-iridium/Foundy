<script lang="ts">
    import { onMount } from 'svelte';
    import { store_selectedSite } from '$lib/stores/site.store';
    import { CMS } from '$lib/supabase/cms';
    import { showToast } from '$lib/stores';
    import type { HomePage } from '$types/db/content';
    import type { FrequentlyAnsweredQuestionsData } from '$types/db/content/T/FrequentlyAnsweredQuestionsData.T';
    import type { PricingData } from '$types/db/content/T/PricingData.T';
    import type { FeaturedData } from '$types/db/content/T/FeaturedData.T';
    import type { ReferencesData } from '$types/db/content/T/ReferenceData.T';
    import type { HeroData } from '$types/db/content/T/HeroData.T';
    import type { HomePageData } from '$types/db/Content/T';

    // homepage data object
    let homepage: HomePage = {} as HomePage;

    let loadingHome = true;

    // fetch homepage data on mount
    onMount(async () => {
        if (!$store_selectedSite) return;

        const { data, error } = await CMS.Content.get($store_selectedSite,'homepage','homepage');
		
        if (error) {
			showToast('warning', 'Failed to load homepage', error.message);
            return;
        }

        homepage = data as HomePage;
		console.log(homepage)
        loadingHome = false;
    });

    /* ---- Editing Functions ---- */

    function editHero(hero : HeroData) {
        // open modal or navigate to hero editor
        showToast('info', 'Edit Hero', 'Open hero modal...');
    }

    function editLogo() {
        showToast('info', 'Edit Logo', 'Logo upload modal...');
    }

    function addFeatured() {
        showToast('info', 'New Featured', 'Open modal…');
    }

    function editFeatured(featured : FeaturedData) {
        showToast('info', 'Edit Featured', featured.companyName);
    }

    function deleteFeatured(featured : FeaturedData) {
        homepage.data.featured = homepage.data.featured.filter(f => f.companyName !== featured.companyName);
    }

    function addPricing() {
        showToast('info', 'New Pricing Tier', 'Open modal…');
    }

    function editPricing(tier) {
        showToast('info', 'Edit Pricing', tier.title);
    }

    function deletePricing(pricing : PricingData) {
        homepage.data.pricing = homepage.data.pricing.filter(p => p.name !== pricing.name);
    }

    function addFAQ() {
        showToast('info', 'New FAQ', 'Open modal…');
    }

    function editFAQ(faq : FrequentlyAnsweredQuestionsData) {
        showToast('info', 'Edit FAQ', faq.question);
    }

    function deleteFAQ(faq : FrequentlyAnsweredQuestionsData) {
        homepage.data.faq = homepage.data.faq.filter(f => f.question !== faq.question);
    }

    function addReference() {
        showToast('info', 'New Reference', 'Open modal…');
    }

    function editReference(reference : ReferencesData) {
        showToast('info', 'Edit Reference', reference.label ?? reference.uri);
    }

    function deleteReference(reference : ReferencesData) {
		if (homepage.data.references) 
	   		homepage.data.references = homepage.data.references.filter(r => r.label !== reference.label);
    }

</script>


<!-- Card: HomePage Content -->
<div class="relative bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
	<div class="absolute top-0 left-0 h-1 w-full bg-primary-600"></div>

	<div class="p-6 space-y-6">
		<h2 class="text-lg font-semibold text-white flex items-center gap-2">
			Homepage Content
		</h2>

		<!-- Hero -->
		<section class="space-y-3">
			<div class="flex justify-between items-center">
				<h3 class="text-md font-semibold text-white">Hero Section</h3>
				<button class="px-3 py-2 bg-surface-700 rounded-md text-sm"
					on:click={() => editHero(homepage.data.hero)}>
					Edit Hero
				</button>
			</div>
		</section>

		<!-- Logo -->
		<section class="space-y-3">
			<div class="flex justify-between items-center">
				<h3 class="text-md font-semibold text-white">Logo</h3>
				<button class="px-3 py-2 bg-surface-700 rounded-md text-sm"
					on:click={() => editLogo()}>
					Upload / Change Logo
				</button>
			</div>	
		</section>

		<!-- Featured -->
		<section class="space-y-3">
			<div class="flex justify-between items-center">
				<h3 class="text-md font-semibold text-white">Featured Companies</h3>
				<button on:click={addFeatured} class="px-3 py-2 bg-primary-700 rounded-md text-sm">
					Add Featured
				</button>
			</div>

			{#each homepage.data?.featured as item}
				<div class="flex justify-between bg-surface-900 p-3 rounded-lg border border-surface-700">
					<span>{item.companyName}</span>
					<div class="flex gap-2">
						<button class="text-xs px-2 py-1 bg-surface-700 rounded-md" on:click={() => editFeatured(item)}>Edit</button>
						<button class="text-xs px-2 py-1 bg-error-600 rounded-md" on:click={() => deleteFeatured(item)}>Delete</button>
					</div>
				</div>
			{/each}
		</section>

		<!-- Pricing -->
		<section class="space-y-3">
			<div class="flex justify-between items-center">
				<h3 class="text-md font-semibold text-white">Pricing Plans</h3>
				<button on:click={addPricing} class="px-3 py-2 bg-primary-700 rounded-md text-sm">
					Add Pricing Tier
				</button>
			</div>

			{#each homepage.data?.pricing as tier}
				<div class="flex justify-between bg-surface-900 p-3 rounded-lg border border-surface-700">
					<span>{tier.name}</span>
					<div class="flex gap-2">
						<button class="text-xs px-2 py-1 bg-surface-700 rounded-md" on:click={() => editPricing(tier)}>Edit</button>
						<button class="text-xs px-2 py-1 bg-error-600 rounded-md" on:click={() => deletePricing(tier.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</section>

		<!-- FAQ -->
		<section class="space-y-3">
			<div class="flex justify-between items-center">
				<h3 class="text-md font-semibold text-white">Frequently Asked Questions</h3>
				<button on:click={addFAQ} class="px-3 py-2 bg-primary-700 rounded-md text-sm">
					Add Question
				</button>
			</div>

			{#each homepage.data?.faq as q}
				<div class="flex justify-between bg-surface-900 p-3 rounded-lg border border-surface-700">
					<span>{q.question}</span>
					<div class="flex gap-2">
						<button class="text-xs px-2 py-1 bg-surface-700 rounded-md" on:click={() => editFAQ(q)}>Edit</button>
						<button class="text-xs px-2 py-1 bg-error-600 rounded-md" on:click={() => deleteFAQ(q.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</section>

		<!-- References -->
		<section class="space-y-3">
			<div class="flex justify-between items-center">
				<h3 class="text-md font-semibold text-white">References</h3>
				<button on:click={addReference} class="px-3 py-2 bg-primary-700 rounded-md text-sm">
					Add Reference
				</button>
			</div>

			{#each homepage.data?.references as ref}
				<div class="flex justify-between bg-surface-900 p-3 rounded-lg border border-surface-700">
					<span>{ref.label ?? ref.uri}</span>
					<div class="flex gap-2">
						<button class="text-xs px-2 py-1 bg-surface-700 rounded-md" on:click={() => editReference(ref)}>Edit</button>
						<button class="text-xs px-2 py-1 bg-error-600 rounded-md" on:click={() => deleteReference(ref.id)}>Delete</button>
					</div>
				</div>
			{/each}
		</section>

	</div>
</div>
