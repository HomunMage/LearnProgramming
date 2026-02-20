<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { base } from '$lib/path';

	onMount(() => {
		goto(`${base}/course/functional`, { replaceState: true });
	});
</script>
