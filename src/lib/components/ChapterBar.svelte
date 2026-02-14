<!-- src/lib/components/ChapterBar.svelte -->
<script lang="ts">
	import type { Chapter } from '$lib/tutorial/content';

	let {
		chapters,
		activeIndex,
		onchapterchange
	}: {
		chapters: Chapter[];
		activeIndex: number;
		onchapterchange: (index: number) => void;
	} = $props();
</script>

<nav data-testid="chapter-bar" class="flex gap-1 bg-gray-800 px-4 py-2">
	{#each chapters as chapter, i (chapter.id)}
		<button
			data-testid="chapter-{chapter.id}"
			class="rounded-t-lg px-4 py-2 text-sm font-medium transition-colors
				{i === activeIndex
				? 'bg-gray-700 text-white'
				: 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}"
			onclick={() => onchapterchange(i)}
		>
			{chapter.title}
		</button>
	{/each}
</nav>
