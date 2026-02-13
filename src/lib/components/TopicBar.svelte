<script lang="ts">
	import type { Topic } from '$lib/tutorial/content';

	let {
		topics,
		activeIndex,
		ontopicchange
	}: {
		topics: Topic[];
		activeIndex: number;
		ontopicchange: (index: number) => void;
	} = $props();
</script>

<nav data-testid="topic-bar" class="flex gap-1 bg-gray-800 px-4 py-2">
	{#each topics as topic, i (topic.id)}
		<button
			data-testid="topic-{topic.id}"
			class="rounded-t-lg px-4 py-2 text-sm font-medium transition-colors
				{i === activeIndex
				? 'bg-gray-700 text-white'
				: 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}"
			onclick={() => ontopicchange(i)}
		>
			{topic.title}
		</button>
	{/each}
</nav>
