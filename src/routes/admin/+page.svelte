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
            console.log(data)
			if (!res.ok) throw new Error(data.error || 'Something went wrong');
			result = data;
		} catch (err: any) {
			error = err.message;
			console.error(err);
		}

		loading = false;
	}
</script>

<h1 class="text-2xl font-bold mb-4">🧪 Test Supabase Company Setup</h1>

<form on:submit|preventDefault={createTestCompany} class="space-y-4 max-w-md">
	<fieldset class="p-4 border rounded">
		<legend class="font-semibold">Company details</legend>
		<label>
			Name:
			<input class="border rounded p-1 w-full" bind:value={company.name} required />
		</label>
		<label>
			Domain:
			<input class="border rounded p-1 w-full" bind:value={company.domain} required />
		</label>
		<label>
			Plan:
			<select class="border rounded p-1 w-full" bind:value={company.plan}>
				<option value="starter">starter</option>
				<option value="pro">pro</option>
				<option value="business">business</option>
                <option value="agency-basic">agency basic</option>
                <option value="agency-pro">agency pro</option>
                <option value="agency-max">agency max</option>
			</select>
		</label>
		<label class="flex items-center gap-2">
			<input type="checkbox" bind:checked={company.whitelabel} />
			<span>Whitelabel</span>
		</label>
	</fieldset>

	<fieldset class="p-4 border rounded">
		<legend class="font-semibold">User details</legend>
		<label>
			Email:
			<input type="email" class="border rounded p-1 w-full" bind:value={user.email} required />
		</label>
		<label>
			Full name:
			<input class="border rounded p-1 w-full" bind:value={user.full_name} required />
		</label>
        <label>
			Password:
			<input class="border rounded p-1 w-full" bind:value={user.password} required />
		</label>
		<label>
			Role:
			<select class="border rounded p-1 w-full" bind:value={user.role}>
				<option value="owner">owner</option>
				<option value="editor">editor</option>
				<option value="viewer">viewer</option>
			</select>
		</label>
	</fieldset>

	<button
		type="submit"
		class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
		disabled={loading}
	>
		{loading ? 'Creating...' : 'Create Company + User'}
	</button>
</form>

{#if error}
	<p class="text-red-600 mt-4">Error: {error}</p>
{/if}

{#if result}
	<div class="mt-6 border-t pt-4 text-sm">
		<h2 class="font-semibold mb-2">✅ Created:</h2>
		<p><b>Company:</b> {result.company.name} ({result.company.id})</p>
		<p><b>Site:</b> {result.site.name} → {result.site.domain}</p>
		<p><b>User:</b> {result.user.email} → {result.user.role}</p>
		<p><b>Token:</b> <code>{result.token.slice(0, 40)}...</code></p>
	</div>
{/if}
