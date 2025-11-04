<script lang="ts">
	  import favicon from '$lib/assets/favicon.svg';
    import { Navigation } from '@skeletonlabs/skeleton-svelte';
    import { onMount } from 'svelte';
    import { CMS } from '$lib/cms';
    import { selectedSite } from '$lib/stores/site';
    import { page } from '$app/stores';

    import {
      BarChart3,
      ImageIcon,
      PackageIcon,
      HouseIcon,
      LayoutIcon,
      FileTextIcon,
      UsersIcon,
      SettingsIcon,
      SkullIcon,
      PanelsTopLeftIcon,
      LogOutIcon,
      GlobeIcon
    } from '@lucide/svelte';
    
    const companyLinkSidebar = {
      company: [
        { label: 'Analytics', href: '/dashboard/company/analytics', icon: BarChart3 },
        { label: 'Settings', href: '/dashboard/company/settings', icon: SettingsIcon},
        { label: 'Sites', href: '/dashboard/company/sites', icon: GlobeIcon}
      ],
    }
    const linksSidebar = {
      dashboard: [
        { label: 'Analytics', href: '/dashboard/site/analytics', icon: BarChart3 },
        { label: 'Settings', href: '/dashboard/site/settings', icon: SettingsIcon},
      ],
		content: [
      { label: 'Posts', href: '/dashboard/site/content/posts', icon: FileTextIcon },
			{ label: 'Products', href: '/dashboard/site/content/products', icon: PackageIcon },
			{ label: 'Media', href: '/dashboard/site/content/media', icon: ImageIcon },
		],
	};
  
  
  let { children } = $props();
  let anchorSidebar : string = 'btn justify-start px-2 w-full';
  let sitesPromise: Promise<any[]>;

	async function fetchSites() {
		const { data, error } = await CMS.Sites.list();
		if (error) throw new Error(error);

    selectedSite.set(data[0].id)
    // $selectedSite = data[0];

		return data ?? [];
	}

	sitesPromise = fetchSites();

  async function onSelect(e: Event) {
		selectedSite.set((e.target as HTMLSelectElement).value);
	}
</script>
  
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

  <div class="w-full h-screen grid grid-cols-[auto_1fr] items-stretch border border-surface-200-800">
    <!-- LOGO / WHITELABEL -->
<Navigation
  layout="sidebar"
  class="grid grid-rows-[auto_1fr_auto] bg-surface-900 text-on-surface border-r border-surface-700"
>
  <!-- Header -->
  <Navigation.Header class="p-3 border-b border-surface-700">
    <img
      src="/jiridium.png"
      alt="jiridium logo"
      class="w-full h-16 object-contain rounded-lg bg-surface-850 p-2"
    />
  </Navigation.Header>

  <!-- Scrollable Content -->
  <Navigation.Content class="overflow-y-auto px-2 py-3">
    <!-- COMPANY NAV -->
    {#each Object.entries(companyLinkSidebar) as [category, links]}
      <Navigation.Group>
        <Navigation.Label class="text-xs uppercase tracking-wide text-surface-400 mt-4 mb-2 pl-3">
          {category}
        </Navigation.Label>
        <Navigation.Menu class="space-y-1">
          {#each links as link (link)}
            {@const Icon = link.icon}
            <a
              href={link.href}
              class="
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                transition-colors duration-200
                hover:bg-primary-400 hover:text-surface-50
                focus:ring-2 focus:ring-primary-500
                {$page.url.pathname === link.href
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-surface-200'}
              "
            >
              <Icon class="size-4 opacity-90" />
              <span>{link.label}</span>
            </a>
          {/each}
        </Navigation.Menu>
      </Navigation.Group>
    {/each}

    <!-- SITE SELECT -->
    {#await sitesPromise then sites}
      <label class="block mt-6 px-3">
        <span class="text-xs text-surface-400 mb-1 block">SELECTED SITE</span>
        {#if sites.length === 1}
          <div class="border border-surface-600 rounded-lg px-3 py-2 text-sm bg-surface-800">
            {sites[0].domain}
          </div>
        {:else}
          <select
            bind:value={$selectedSite}
            onchange={onSelect}
            class="
              w-full px-3 py-2 rounded-lg bg-surface-800 text-surface-100 text-sm border border-surface-600
              focus:border-primary-500 focus:ring-2 focus:ring-primary-500 outline-none transition
              cursor-pointer
            "
          >
            {#each sites as s}
              <option class="bg-surface-900 text-surface-50" value={s.id}>
                {s.domain ?? s.name ?? s.id}
              </option>
            {/each}
          </select>
        {/if}
      </label>
    {:catch err}
      <p class="text-error-400 text-sm px-3 mt-2">{err.message}</p>
    {/await}

    <!-- SITE NAV -->
    {#each Object.entries(linksSidebar) as [category, links]}
      <Navigation.Group>
        <Navigation.Label class="text-xs uppercase tracking-wide text-surface-400 mt-5 mb-2 pl-3">
          {category}
        </Navigation.Label>
        <Navigation.Menu class="space-y-1">
          {#each links as link (link)}
            {@const Icon = link.icon}
            <a
              href={link.href}
              class="
                flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                transition-colors duration-200
                hover:bg-primary-400 hover:text-surface-50
                focus:ring-2 focus:ring-primary-500
                {$page.url.pathname === link.href
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-surface-200'}
              "
            >
              <Icon class="size-4 opacity-90" />
              <span>{link.label}</span>
            </a>
          {/each}
        </Navigation.Menu>
      </Navigation.Group>
    {/each}
  </Navigation.Content>

  <!-- Footer -->
  <Navigation.Footer class="border-t border-surface-700 p-3">
    <a
      href="/logout"
      class="
        flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
        text-surface-300 hover:text-white hover:bg-primary-400
        transition-colors duration-200
      "
    >
      <LogOutIcon class="size-4" />
      <span>Logout</span>
    </a>
  </Navigation.Footer>
</Navigation>
    <!-- --- -->
    <div class="flex flex-col m-4 rounded-lg overflow-hidden">
		  {@render children()}
      <!-- <p class="opacity-50">Contents</p> -->
    </div>
  </div>

