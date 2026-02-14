<!-- src/lib/components/CourseShell.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Chapter } from '$lib/data/types';
	import type { LLMProvider, LessonContext } from '$lib/backend/llm';
	import ChapterBar from './ChapterBar.svelte';
	import SessionTabs from './SessionTabs.svelte';
	import ChatPanel from './ChatPanel.svelte';
	import NavMenu from './NavMenu.svelte';

	let {
		chapters,
		chapterIndex,
		sessions,
		sessionIndex,
		provider,
		lessonContext,
		instruction,
		onchapterchange,
		onsessionchange,
		leftTop,
		leftBottom
	}: {
		chapters: Chapter[];
		chapterIndex: number;
		sessions: { id: string; title: string }[];
		sessionIndex: number;
		provider: LLMProvider | null;
		lessonContext: LessonContext;
		instruction: string;
		onchapterchange: (i: number) => void;
		onsessionchange: (i: number) => void;
		leftTop: Snippet;
		leftBottom: Snippet;
	} = $props();
</script>

<!-- Top navigation -->
<div class="flex items-center justify-between bg-gray-800">
	<ChapterBar {chapters} activeIndex={chapterIndex} {onchapterchange} />
	<div class="mr-4">
		<NavMenu />
	</div>
</div>

<SessionTabs {sessions} activeIndex={sessionIndex} {onsessionchange} />

<!-- Main content: 3 panels, all fixed height with own scroll -->
<div class="grid min-h-0 flex-1 grid-cols-[1fr_380px]">
	<!-- Left: two stacked panels -->
	<div class="grid min-h-0 grid-rows-2 border-r border-gray-700">
		<!-- Left Top -->
		<div class="min-h-0 overflow-y-auto p-3">
			{@render leftTop()}
		</div>

		<!-- Left Bottom -->
		<div class="min-h-0 overflow-hidden border-t border-gray-700 p-3">
			{@render leftBottom()}
		</div>
	</div>

	<!-- Right: Chat -->
	<div class="min-h-0 p-3">
		<ChatPanel {provider} {lessonContext} {instruction} />
	</div>
</div>
