<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();

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
    } from '@lucide/svelte';
    import { Navigation } from '@skeletonlabs/skeleton-svelte';
  
    const linksSidebar = {
		dashboard: [
			{ label: 'Analytics', href: '/dashboard/company/analytics', icon: BarChart3 },
			{ label: 'Settings', href: '/dashboard/company/settings', icon: SettingsIcon},
			// { label: 'Users', href: '/dashboard/company/users', icon: UsersIcon },
		],
		content: [
			{ label: 'Posts', href: '/dashboard/content/posts', icon: FileTextIcon },
			// { label: 'Pages', href: '#', icon: LayoutIcon },
			{ label: 'Products', href: '/dashboard/content/products', icon: PackageIcon },
			{ label: 'Media', href: '/dashboard/content/media', icon: ImageIcon },
		],
	};

  
    let anchorSidebar = 'btn hover:preset-tonal justify-start px-2 w-full';
</script>
  
<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

  <div class="w-full h-screen grid grid-cols-[auto_1fr] items-stretch border border-surface-200-800">
    <!-- --- -->
    <Navigation layout="sidebar" class="grid grid-rows-[auto_1fr_auto] gap-4">
      <Navigation.Header>
		<img
				src="/jiridium.png"
				alt="jiridium logo"
				class="w-full h-20 object-cover rounded-t-lg"
			/>
      </Navigation.Header>
      <Navigation.Content>
        {#each Object.entries(linksSidebar) as [category, links]}
          <Navigation.Group>
            <Navigation.Label class="capitalize pl-2">{category}</Navigation.Label>
            <Navigation.Menu>
              {#each links as link (link)}
                {@const Icon = link.icon}
                <a href={link.href} class={anchorSidebar} title={link.label} aria-label={link.label}>
                  <Icon class="size-4" />
                  <span>{link.label}</span>
                </a>
              {/each}
            </Navigation.Menu>
          </Navigation.Group>
        {/each}
      </Navigation.Content>
      <!-- <Navigation.Footer>
        <a href="/" class={anchorSidebar} title="Settings" aria-label="Settings">
          <SettingsIcon class="size-4" />
          <span>Settings</span>
        </a>
      </Navigation.Footer> -->
    </Navigation>
    <!-- --- -->
    <div class="flex justify-center items-center">
		
		{@render children()}
      <!-- <p class="opacity-50">Contents</p> -->
    </div>
  </div>

