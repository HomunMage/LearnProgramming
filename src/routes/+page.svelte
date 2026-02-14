<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(`${base}/course/functional`, { replaceState: true });
	});
</script>
