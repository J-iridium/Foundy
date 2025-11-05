<script lang="ts">
	let company = {
		name: '',
		domain: '',
		plan: 'starter',
		whitelabel: false
	};

	let user = {
		email: '',
		full_name: '',
		password: '',
		role: 'owner'
	};

	let result: any = null;
	let loading = false;
	let error: string | null = null;

	async function createTestCompany() {
		loading = true;
		error = null;
		result = null;

		try {
			const res = await fetch('/admin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ company, user })
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Something went wrong');
			result = data;
		} catch (err: any) {
			error = err.message;
			console.error(err);
		}

		loading = false;
	}
</script>

<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-lg shadow-lg max-w-md mx-auto">
	<h1 class="text-2xl font-bold mb-4">Create Company Setup</h1>

	<form on:submit|preventDefault={createTestCompany} class="space-y-4">
		<!-- Company details -->
		<fieldset class="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
			<legend class="font-semibold text-gray-800 dark:text-gray-100 px-2">Company details</legend>

			<label class="block mb-2">
				<span class="block text-sm font-medium mb-1">Name</span>
				<input
					class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={company.name}
					required
				/>
			</label>

			<label class="block mb-2">
				<span class="block text-sm font-medium mb-1">Domain</span>
				<input
					class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={company.domain}
					required
				/>
			</label>

			<label class="block mb-2">
				<span class="block text-sm font-medium mb-1">Plan</span>
				<select
					class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={company.plan}
				>
					<option value="starter">Starter</option>
					<option value="pro">Pro</option>
					<option value="business">Business</option>
					<option value="agency-basic">Agency Basic</option>
					<option value="agency-pro">Agency Pro</option>
					<option value="agency-max">Agency Max</option>
				</select>
			</label>

			<label class="flex items-center gap-2 mt-3">
				<input
					type="checkbox"
					class="w-4 h-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded focus:ring-blue-500"
					bind:checked={company.whitelabel}
				/>
				<span class="text-sm">Enable Whitelabel</span>
			</label>
		</fieldset>

		<!-- User details -->
		<fieldset class="p-4 border border-gray-300 dark:border-gray-700 rounded-md">
			<legend class="font-semibold text-gray-800 dark:text-gray-100 px-2">User details</legend>

			<label class="block mb-2">
				<span class="block text-sm font-medium mb-1">Email</span>
				<input
					type="email"
					class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={user.email}
					required
				/>
			</label>

			<label class="block mb-2">
				<span class="block text-sm font-medium mb-1">Full name</span>
				<input
					class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={user.full_name}
					required
				/>
			</label>

			<label class="block mb-2">
				<span class="block text-sm font-medium mb-1">Password</span>
				<input
					type="password"
					class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={user.password}
					required
				/>
			</label>

			<label class="block">
				<span class="block text-sm font-medium mb-1">Role</span>
				<select
					class="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={user.role}
				>
					<option value="owner">Owner</option>
					<option value="editor">Editor</option>
					<option value="viewer">Viewer</option>
				</select>
			</label>
		</fieldset>

		<button
			type="submit"
			class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
			disabled={loading}
		>
			{loading ? 'Creating...' : 'Create Company + User'}
		</button>
	</form>

	{#if error}
		<p class="text-red-600 dark:text-red-400 mt-4">Error: {error}</p>
	{/if}

	{#if result}
		<div class="mt-6 border-t border-gray-300 dark:border-gray-700 pt-4 text-sm">
			<h2 class="font-semibold mb-2 text-green-600 dark:text-green-400">✅ Created:</h2>
			<p><b>Company:</b> {result.company.name} ({result.company.id})</p>
			<p><b>Site:</b> {result.site.name} → {result.site.domain}</p>
			<p><b>User:</b> {result.user.email} → {result.user.role}</p>
			<p><b>Token:</b> <code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{result.token.slice(0, 40)}...</code></p>
		</div>
	{/if}
</div>
