<script lang="ts">
	import { goto } from '$app/navigation';

	let code = '';
	let companyName = '';
	let domain = '';
	let plan = 'starter';

	let error: string | null = null;
	let loading = false;

	async function register() {
		error = null;
		loading = true;

		const res = await fetch('/api/v2/app/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				code,
				companyName,
				domain,
				plan
			})
		});

		const data = await res.json();

		if (!res.ok) {
			error = data.error || 'Registration failed';
			loading = false;
			return;
		}

		// You may later replace this with cookie-based auth
		localStorage.setItem('site_token', data.token);

		goto('/dashboard/company/analytics');
	}
</script>

<div class="max-w-sm mx-auto mt-20 p-6 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg">
	<h1 class="text-xl font-semibold mb-4">Create account</h1>

	<form on:submit|preventDefault={register} class="space-y-3">
		<input
			type="text"
			placeholder="Registration code"
			class="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
			bind:value={code}
			required
		/>

		<input
			type="text"
			placeholder="Company name"
			class="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
			bind:value={companyName}
			required
		/>

		<input
			type="text"
			placeholder="Primary domain (example.com)"
			class="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
			bind:value={domain}
			required
		/>

		<select
			class="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
			bind:value={plan}
		>
			<option value="starter">Starter</option>
			<option value="pro">Pro</option>
			<option value="business">Business</option>
		</select>

		<button
			type="submit"
			class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full disabled:opacity-50 transition"
			disabled={loading}
		>
			{loading ? 'Creating account...' : 'Create account'}
		</button>
	</form>

	{#if error}
		<p class="text-red-600 dark:text-red-400 mt-3">{error}</p>
	{/if}

	<p class="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
		Already have an account?
		<a href="/signin" class="text-blue-600 hover:underline ml-1">
			Sign in
		</a>
	</p>
</div>
