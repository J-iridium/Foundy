<script lang="ts">
    import { page } from '$app/stores';
    import { CMS } from '../../../../../lib/supabase/cms';
    import Card from './Card.svelte';
    import { PlusCircle, Package } from '@lucide/svelte'; // Removed X, not needed here anymore
    import { showToast } from '../../../../../lib/stores';
    import ModalPreview from './ModalPreview.svelte';
    import { store_selectedSite } from '../../../../../lib/stores/site.store';
    import PageHeader from '../../../../../lib/components/PageHeader.svelte';
    
    // --- Dynamic System Imports ---
    import { Modals } from '$types/generated/Modals';
    import AddEditModal from '../../../../../lib/components/modal/AddEditModal.svelte';

    let items: any[] = [];
    let previewItem: any = null;

    // --- Modal State ---
    let showModal = false;
    let editingId: string | null = null; // Tracks if creating (null) or editing (string)
    let modalPreData: any = {};          // Holds data to populate the form

    // Reactive derived values
    $: site_id = $store_selectedSite;
    $: type = $page.params.type; // 'posts' | 'products' | 'media'

    // Calculate schema dynamically. Assumes Modals[type] is an array (e.g., Modals.posts[0])
    $: currentSchema = (type && Modals[type as keyof typeof Modals]) 
        ? Modals[type as keyof typeof Modals][0] 
        : {};

    // Load items when params change
    $: if (site_id && type) {
        loadItems();
    }

    // -----------------------------------------------------
    // LOAD CONTENT FROM DB
    // -----------------------------------------------------
    async function loadItems() {
        if (!site_id || !type) return;
        const { data, error } = await CMS.Content.listByType(site_id, type);
        if (error) {
            console.error(error);
            showToast('warning', 'Load Failed', 'Could not load content.')
            return;
        }
        items = data || [];
    }

    // -----------------------------------------------------
    // PREVIEW HANDLERS
    // -----------------------------------------------------
    function onPreview(item : any) {
        previewItem = item;
    }
    function closePreview() {
        previewItem = null;
    }

    // -----------------------------------------------------
    // MODAL HANDLERS (Add / Edit)
    // -----------------------------------------------------
    
    // Open Modal for NEW Item
    function openAdd() {
        editingId = null;
        modalPreData = {}; 
        showModal = true;
    }

    // Open Modal for EXISTING Item
    function onEdit(id: string) {
        const found = items.find((i) => i.id === id);
        if (!found) return;

        editingId = id;
        // Pass the internal 'data' object (JSON content) to the form
        modalPreData = found.data || {}; 
        showModal = true;
    }

    // Unified Save Handler (Used for both Create and Update)
    async function handleModalSave(e: CustomEvent) {
        const formData = e.detail.data;

        // Determine a Display Name (Title/Name/Headline) for the DB row
        const contentName = formData.title || formData.name || formData.headline || 'Untitled';

        if (editingId) {
            // --- UPDATE EXISTING ---
            const { data, error } = await CMS.Content.update(site_id, editingId, {
                name: contentName,
                data: formData
                // Note: If you have a specific 'status' field in your form, map it here:
                // status: formData.status
            });

            if (error) {
                showToast('warning', 'Update Failed', error);
                return;
            }

            // Update local list
            items = items.map((i) => (i.id === editingId ? data : i));
            showToast('success', 'Updated', 'Changes saved successfully.');
        } else {
            // --- CREATE NEW ---
            const { data, error } = await CMS.Content.create({
                siteId: site_id,
                name: contentName,
                type: type,
                status: 'Draft', // Default status for new items
                data: formData,
                updatedAt: ''
            });

            if (error) {
                showToast('warning', 'Add Failed', error);
                return;
            }

            // Add to local list
            items = [data, ...items];
            showToast('success', 'Added', `Created new ${type?.slice(0,-1)}`);
        }
        
        // AddEditModal handles its own closing event, but we ensure state is false here
        showModal = false;
    }

    // -----------------------------------------------------
    // DIRECT ACTIONS (Delete / Status)
    // -----------------------------------------------------
    async function onDelete(id: string) {
        items = items.filter((i) => i.id !== id);
        const { error } = await CMS.Content.remove(site_id, id);

        if (error) {
            showToast('warning', 'Delete Failed', error)
            return;
        }
        showToast('success', 'Deleted', `Removed content ID: ${id}`)
    }

    async function onStatusChange(id: string, newStatus: string) {
        // 1. Optimistic Update
        items = items.map((i) => (i.id === id ? { ...i, status: newStatus } : i));

        // 2. Persist
        const { error } = await CMS.Content.update(site_id, id, { status: newStatus });

        if (error) {
            // 3. Rollback
            items = items.map((i) => (i.id === id ? { ...i, status: 'Draft' } : i));
            showToast('warning', 'Update Failed', error)
            return;
        }
        showToast('success', 'Status Updated', `Content set to ${newStatus}`)
    }
</script>

<div class="space-y-6">
    <PageHeader 
        title={`Manage ${type}`} 
        description={`Add, edit, and organize all ${type} in your CMS.`}
        action={openAdd} 
        iconButton={PlusCircle}
        iconTitle={Package}
        textButton={`Add ${type}`}
    /> 

    <div class="p-3 space-y-6">
        {#if items.length === 0}
            <div class="border border-surface-700 rounded-lg p-6 text-center text-surface-400 bg-surface-800">
                <p>No {type} yet.</p>
                <p class="text-sm mt-2">
                    Click <span class="text-primary-400 font-medium">“Add {type}”</span> to create your first entry.
                </p>
            </div>
        {:else}
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
                {#each items as item (item.id)}
                    <Card
                        {item}
                        {type}
                        {onEdit}
                        {onDelete}
                        {onStatusChange}
                        on:preview={(e) => onPreview(e.detail)}
                        class="h-full"
                    />
                {/each}
            </div>
        {/if}
    </div>
</div>

{#if showModal}
    <AddEditModal 
        type={type} 
        schema={currentSchema}
        preData={modalPreData}
        on:save={handleModalSave} 
        on:close={() => (showModal = false)} 
    />
{/if}

{#if previewItem}
    <ModalPreview {type} item={previewItem} onClose={closePreview} />
{/if}