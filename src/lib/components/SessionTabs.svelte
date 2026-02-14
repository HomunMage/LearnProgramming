<!-- src/lib/components/SessionTabs.svelte -->
<script lang="ts">
	import type { Session } from '$lib/tutorial/content';

	let {
		sessions,
		activeIndex,
		onsessionchange
	}: {
		sessions: Session[];
		activeIndex: number;
		onsessionchange: (index: number) => void;
	} = $props();
</script>

<div data-testid="session-tabs" class="flex gap-1 border-b border-gray-700 bg-gray-800/50 px-4">
	{#each sessions as session, i (session.id)}
		<button
			data-testid="session-{session.id}"
			class="border-b-2 px-3 py-2 text-sm transition-colors
				{i === activeIndex
				? 'border-blue-400 text-blue-400'
				: 'border-transparent text-gray-500 hover:border-gray-600 hover:text-gray-300'}"
			onclick={() => onsessionchange(i)}
		>
			{session.title}
		</button>
	{/each}
</div>
