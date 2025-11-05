<script lang="ts">
	import { onMount } from 'svelte';
	import { CMS } from '$lib/cms';
	import { Save, Building2, Layers, ArrowUpRight, UploadIcon, ImageIcon } from '@lucide/svelte';
	import { createToaster, Toast } from '@skeletonlabs/skeleton-svelte';
    import PageHeader from '$components/PageHeader.svelte';
	
    
    const toaster = createToaster({});
    const max_pages  = {
		'starter' : 1,
		'pro' : 3,
		'business' : 5,
		'agency-basic' : 10,
		'agency-pro' : 30,
		'agency-max' : Infinity
	}

	let company: {
        sites_limit : number,
        sites_usage : number,
        name : string,
        domain : string,
        description : string,
        plan : string,
        logoUrl : string,
        whitelabel : boolean
    } = {};

    let loading = true;
    let uploading = false;
    


    async function fetchCompanySites() {
        const {data, error} = await CMS.Sites.list();
        if (error) {
			toaster.warning({ title: 'Error loading company', description: error });
			return;
		}
        company.sites_limit = max_pages[company.plan];
        company.sites_usage = data.length
    }

	async function fetchCompany() {
		const { data, error } = await CMS.Company.get();
		if (error) {
			toaster.warning({ title: 'Error loading company', description: error });
			return;
		}
        company.name = data.name;
        company.description = data.description ?? '';
        company.domain = data.domain ?? '';
        company.plan = data.plan;
        company.whitelabel = data.whitelabel

        fetchCompanySites();
        loading = false;
	}

    async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		try {
			uploading = true;
			const { data, error } = await CMS.Company.uploadLogo(file);
			uploading = false;

			if (error) {
				toaster.warning({
					title: 'Upload Failed',
					description: error
				});
				return;
			}

			logoUrl = data.url;
			toaster.success({
				title: 'Logo Uploaded',
				description: 'Your company logo has been updated successfully.'
			});
		} catch (e) {
			uploading = false;
			toaster.warning({
				title: 'Upload Failed',
				description: 'An unexpected error occurred.'
			});
		}
	}

    // TODO: Reactive this
	async function saveChanges() {
		// const { error } = await CMS.Company.update({
		// 	name,
		// 	description,
		// 	domain
		// });

		// if (error) {
		// 	toaster.warning({ title: 'Save Failed', description: error });
		// 	return;
		// }

		// toaster.success({
		// 	title: 'Company Settings Updated',
		// 	description: 'Your changes have been saved successfully.'
		// });
	}

	onMount(fetchCompany);
</script>

<!-- Page container -->
<div class="space-y-6">
	<!-- Header -->
	<PageHeader 
		title="Company Settings" 
		description="Update your company details and plan information."
		action={saveChanges}
		iconButton={Save}
		iconTitle={Building2}
		textButton="Save Changes"
	/> 

    <div class="p-3 space-y-6">
	{#if loading}
		<p class="text-surface-400 italic">Loading company information...</p>
	{:else}
		<!-- Card: Company Info -->
		<div
			class="relative bg-surface-800 border border-surface-700 rounded-xl overflow-hidden"
		>
			<div class="absolute top-0 left-0 h-1 w-full bg-primary-600"></div>

			<div class="p-6 space-y-5">
				<h2 class="text-lg font-semibold text-white">Company Details</h2>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label class="block text-sm text-surface-400 mb-1">Name</label>
						<input
							type="text"
							bind:value={company.name}
							class="w-full px-3 py-2 rounded-lg bg-surface-700 border border-surface-600 text-sm text-surface-100 focus:ring-2 focus:ring-primary-500 outline-none transition"
						/>
					</div>

					<div>
						<label class="block text-sm text-surface-400 mb-1">Domain</label>
						<input
							type="text"
							bind:value={company.domain}
							class="w-full px-3 py-2 rounded-lg bg-surface-700 border border-surface-600 text-sm text-surface-100 focus:ring-2 focus:ring-primary-500 outline-none transition"
						/>
					</div>
				</div>

				<div>
					<label class="block text-sm text-surface-400 mb-1">Description</label>
					<textarea
						bind:value={company.description}
						rows="3"
						class="w-full px-3 py-2 rounded-lg bg-surface-700 border border-surface-600 text-sm text-surface-100 focus:ring-2 focus:ring-primary-500 outline-none transition"
					/>
				</div>
			</div>
		</div>

		<!-- Card: Plan & Usage -->
		<div
			class="relative bg-surface-800 border border-surface-700 rounded-xl overflow-hidden"
		>
			<div class="absolute top-0 left-0 h-1 w-full bg-tertiary-600"></div>

			<div class="p-6 space-y-4">
				<h2 class="text-lg font-semibold text-white flex items-center gap-2">
					<Layers class="w-4 h-4 text-tertiary-400" /> Plan & Usage
				</h2>

				<div class="flex flex-col sm:flex-row sm:items-center justify-between">
					<div>
						<p class="text-surface-300 text-sm">Current Plan</p>
						<p class="text-lg font-semibold text-tertiary-300">
							{company.plan}
						</p>
						<p class="text-xs text-surface-500 mt-1">
							{company.sites_usage ?? 0} / {company.sites_limit ?? 0} sites in
							use
						</p>
					</div>

					<button
						class="flex items-center gap-2 mt-4 sm:mt-0 px-4 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-surface-200 text-sm transition"
					>
						<ArrowUpRight class="w-4 h-4 text-tertiary-400" />
						Manage Plan
					</button>
				</div>
			</div>
		</div>
        {#if company.whitelabel}
            <!-- White-label Logo Card -->
            <div class="relative bg-surface-800 border border-surface-700 rounded-xl overflow-hidden">
                <div class="absolute top-0 left-0 h-1 w-full bg-primary-600"></div>

                <div class="p-6 space-y-4">
                    <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                        <ImageIcon class="w-4 h-4 text-primary-400" />
                        Whitelabel Branding
                    </h2>

                    <p class="text-sm text-surface-400">
                        Upload your company logo to display on your client dashboards and emails.
                    </p>

                    <div
                        class="flex flex-col sm:flex-row items-center gap-4 bg-surface-900 border border-surface-700 rounded-lg p-4"
                    >
                        <!-- Preview -->
                        <div
                            class="w-24 h-24 bg-surface-700 border border-surface-600 rounded-lg flex items-center justify-center overflow-hidden"
                        >
                            {#if company.logoUrl}
                                <img src={company.logoUrl} alt="Company Logo" class="object-contain w-full h-full" />
                            {:else}
                                <ImageIcon class="w-8 h-8 text-surface-500" />
                            {/if}
                        </div>

                        <!-- Upload Input -->
                        <div class="flex flex-col gap-2">
                            <label
                                for="file-upload"
                                class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
                            >
                                <UploadIcon class="w-4 h-4" />
                                {uploading ? 'Uploading...' : 'Upload Logo'}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                on:change={handleFileUpload}
                                class="hidden"
                                disabled={uploading}
                            />
                            <p class="text-xs text-surface-500">
                                Recommended: transparent PNG or SVG (max 1 MB)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        {/if}
	{/if}
</div>
</div>

<!-- Toast Group -->
<Toast.Group {toaster} position="bottom-right">
	{#snippet children(toast)}
		<Toast
			{toast}
			class="bg-surface-900 border border-surface-700 text-on-surface rounded-lg shadow-md flex items-start gap-3 p-4 min-w-[280px]"
		>
			<Toast.Message class="flex-1">
				<Toast.Title class="font-semibold">{toast.title}</Toast.Title>
				{#if toast.description}
					<Toast.Description class="text-sm opacity-90 mt-1">
						{toast.description}
					</Toast.Description>
				{/if}
			</Toast.Message>
			<Toast.CloseTrigger class="ml-2 text-surface-400 hover:text-white transition" />
		</Toast>
	{/snippet}
</Toast.Group>
