<script lang="ts">
	import { goto } from '$app/navigation';
	let email = '';
	let password = '';
	let error: string | null = null;
	let loading = false;

	async function login() {
		error = null;
		loading = true;
		const res = await fetch('/api/v2/app/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
		const data = await res.json();
		if (!res.ok) {
			error = data.error || 'Invalid credentials';
			loading = false;
			return;
		}
		goto('/dashboard/company/analytics');
	}
</script>

<div class="max-w-sm mx-auto mt-20 p-6 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
	<h1 class="text-xl font-semibold mb-4">Sign In</h1>

	<form on:submit|preventDefault={login} class="space-y-3">
		<input type="email" placeholder="Email" class="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" bind:value={email} required />
		<input type="password" placeholder="Password" class="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none" bind:value={password} required />
		<button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full disabled:opacity-50 transition" disabled={loading}>
			{loading ? 'Signing in...' : 'Sign in'}
		</button>
	</form>

	{#if error}
		<p class="text-red-600 dark:text-red-400 mt-3">{error}</p>
	{/if}
</div>
