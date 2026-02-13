<script lang="ts">
	import TopicBar from '$lib/components/TopicBar.svelte';
	import ChapterTabs from '$lib/components/ChapterTabs.svelte';
	import Spreadsheet from '$lib/components/Spreadsheet.svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import ChatPanel from '$lib/components/ChatPanel.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import { tutorial } from '$lib/stores/tutorial.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { createProvider } from '$lib/backend/llm';
	import type { LLMProvider, LessonContext } from '$lib/backend/llm';
	import { toArray } from '$lib/tutorial/engine/spreadsheet';

	let showSettings = $state(false);

	let provider = $derived<LLMProvider | null>(
		settings.hasApiKey ? createProvider(settings.providerType, settings.apiKey) : null
	);

	let lessonContext = $derived<LessonContext>({
		topic: tutorial.currentTopic.title,
		chapter: tutorial.currentChapter.title,
		tableData: toArray(tutorial.spreadsheet),
		currentCode: tutorial.code,
		language: tutorial.language
	});
</script>

<!-- Top navigation -->
<div class="flex items-center justify-between bg-gray-800">
	<TopicBar
		topics={tutorial.topics}
		activeIndex={tutorial.topicIndex}
		ontopicchange={(i) => tutorial.selectTopic(i)}
	/>
	<button
		data-testid="settings-btn"
		onclick={() => (showSettings = true)}
		class="mr-4 rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
		title="Settings"
	>
		<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
			/>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
			/>
		</svg>
	</button>
</div>

<ChapterTabs
	chapters={tutorial.currentTopic.chapters}
	activeIndex={tutorial.chapterIndex}
	onchapterchange={(i) => tutorial.selectChapter(i)}
/>

<!-- Main content: 3 panels -->
<div class="grid min-h-0 flex-1 grid-cols-[1fr_380px]">
	<!-- Left: Spreadsheet + Code -->
	<div class="flex min-h-0 flex-col gap-2 overflow-hidden border-r border-gray-700 p-3">
		<div class="shrink-0">
			<Spreadsheet
				grid={tutorial.spreadsheet}
				oncellchange={(r, c, v) => tutorial.editCell(r, c, v)}
			/>
		</div>

		<CodeEditor
			code={tutorial.code}
			language={tutorial.language}
			output={tutorial.output}
			error={tutorial.error}
			onrun={() => tutorial.run()}
			oncodechange={(c) => tutorial.editCode(c)}
			onlanguagechange={(l) => tutorial.setLanguage(l)}
		/>
	</div>

	<!-- Right: Chat -->
	<div class="min-h-0 p-3">
		<ChatPanel {provider} {lessonContext} instruction={tutorial.currentChapter.tutorial} />
	</div>
</div>

<SettingsModal open={showSettings} onclose={() => (showSettings = false)} />
