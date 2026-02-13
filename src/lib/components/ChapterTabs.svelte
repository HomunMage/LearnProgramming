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

<div class="flex gap-1 border-b border-gray-700 bg-gray-800/50 px-4">
	{#each chapters as chapter, i (chapter.id)}
		<button
			class="border-b-2 px-3 py-2 text-sm transition-colors
				{i === activeIndex
				? 'border-blue-400 text-blue-400'
				: 'border-transparent text-gray-500 hover:border-gray-600 hover:text-gray-300'}"
			onclick={() => onchapterchange(i)}
		>
			{chapter.title}
		</button>
	{/each}
</div>
