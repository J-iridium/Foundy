<script lang="ts">
	import { goto } from '$app/navigation';
    import { CMS } from '$lib/cms';
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
		}else {
			(data)

			goto('/dashboard/company/analytics');
		}


		// Redirect to dashboard
	
	}
</script>

<div class="max-w-sm mx-auto mt-20 p-6 border rounded shadow">
	<h1 class="text-xl font-semibold mb-4">Sign In</h1>
	<form on:submit|preventDefault={login} class="space-y-3">
		<input
			type="email"
			placeholder="Email"
			class="border rounded p-2 w-full"
			bind:value={email}
			required
		/>
		<input
			type="password"
			placeholder="Password"
			class="border rounded p-2 w-full"
			bind:value={password}
			required
		/>
		<button
			type="submit"
			class="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
			disabled={loading}
		>
			{loading ? 'Signing in...' : 'Sign in'}
		</button>
	</form>

	{#if error}
		<p class="text-red-600 mt-3">{error}</p>
	{/if}
</div>
