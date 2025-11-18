<script lang="ts">
  import { onMount } from 'svelte';
  import { foundy } from '$lib/foundy/foundy-sdk';

  let posts: any[] = [];
  let error: string | null = null;

  // Configure SDK once at app start
  foundy.configure({
    jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaXRlSWQiOiIzY2M0MGJiYy0yYjcxLTRhZGMtOTYwNC0wY2U1MjY1ZjExNmMiLCJkb21haW4iOiJsb2NhbGhvc3Q6NTE3MyIsInBlcm1pc3Npb25zIjpbInJlYWQ6Y29udGVudCJdLCJpYXQiOjE3NjMwNTA3ODQsImV4cCI6MTc5NDU4Njc4NH0.gEo8liJIL-Snf02nZZfPct0iKyhfXu96jTgPDK8z8yI'
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
