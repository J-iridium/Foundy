<script lang="ts">
  import { onMount } from 'svelte';
  import { foundy } from '$lib/foundy/foundy-sdk';

  let posts: any[] = [];
  let error: string | null = null;

  // Configure SDK once at app start
  foundy.configure({
    jwtToken: ' eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaXRlSWQiOiJkNWRjOWQyOC05MmJkLTRjM2QtOTI4YS0yMjRlMWVjNzBhZTAiLCJkb21haW4iOiJmb3VuZHktb3BhbC52ZXJjZWwuYXBwIiwicGVybWlzc2lvbnMiOlsicmVhZDpjb250ZW50Il0sImlhdCI6MTc2MzA1MTM4OSwiZXhwIjoxNzk0NTg3Mzg5fQ.xb-BlsS8Qho_m59dQb1NOKVYs8rc3CMtopIskoU8Ki8'
  });

  onMount(async () => {
    try {
      posts = await foundy.content('posts');
    } catch (err: any) {
      error = err.message;
      console.error(err);
    }
  });
</script>

<div>
  {#if error}
    <p class="text-red-500">{error}</p>
  {:else}
    {#each posts as post}
      <div>{post.data.title}</div>
    {/each}
  {/if}
</div>
