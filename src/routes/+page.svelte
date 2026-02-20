<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { projectBase } from '../../myconfig.js';

	onMount(() => {
		goto(`${projectBase}/course/functional`, { replaceState: true });
	});
</script>
