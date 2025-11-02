<script lang="ts">
	export let data;
</script>

<div class="p-6">
	<h1 class="text-2xl font-semibold mb-2">Welcome!</h1>
	<p>You are logged in as <b>{data.user.role}</b> for company <b>{data.user.company_id}</b>.</p>

	<a href="/logout" class="text-blue-600 underline mt-4 block">Logout</a>
</div>
