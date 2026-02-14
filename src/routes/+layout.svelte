<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import '../app.css';
	import { preloadPyodide, preloadFrameworks } from '$lib/tutorial/engine/preload';

	preloadPyodide();
	preloadFrameworks();

	let { children } = $props();
</script>

<main class="flex h-screen flex-col bg-gray-900 text-gray-100">
	{@render children?.()}
</main>
