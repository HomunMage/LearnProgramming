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
	import type { Language } from '$lib/tutorial/engine/executor';
	import { loadData, setCellRaw, toArray } from '$lib/tutorial/engine/spreadsheet';
	import type { SpreadsheetState } from '$lib/tutorial/engine/spreadsheet';
	import { autoBindings, buildInputs } from '$lib/tutorial/engine/bridge';
	import { execute } from '$lib/tutorial/engine/executor';

	// Settings modal
	let showSettings = $state(false);

	// Spreadsheet state
	let spreadsheet = $state<SpreadsheetState>(loadData(tutorial.currentChapter.initialTable));

	// Code editor state
	let code = $state(tutorial.currentChapter.initialCode);
	let language = $state<Language>(tutorial.currentChapter.language);
	let output = $state('');
	let error = $state<string | null>(null);

	// Reload when chapter changes
	$effect(() => {
		const chapter = tutorial.currentChapter;
		spreadsheet = loadData(chapter.initialTable);
		code = chapter.initialCode;
		language = chapter.language;
		output = '';
		error = null;
	});

	// LLM provider (reactive to settings changes)
	let provider = $derived<LLMProvider | null>(
		settings.hasApiKey ? createProvider(settings.providerType, settings.apiKey) : null
	);

	// Lesson context for AI chat
	let lessonContext = $derived<LessonContext>({
		topic: tutorial.currentTopic.title,
		chapter: tutorial.currentChapter.title,
		tableData: toArray(spreadsheet),
		currentCode: code,
		language
	});

	function handleCellChange(row: number, col: number, value: string) {
		spreadsheet = setCellRaw(spreadsheet, row, col, value);
	}

	async function handleRun() {
		const bindings = autoBindings(spreadsheet.cols);
		const inputs = buildInputs(spreadsheet, bindings);
		const result = await execute(language, code, inputs, toArray(spreadsheet));
		output = result.output;
		error = result.error;

		// If code returned column data, update spreadsheet
		if (result.returnValue != null) {
			const ret = result.returnValue;
			if (Array.isArray(ret) && ret.length > 0) {
				// If return is array of arrays (multiple columns), update B, C, etc.
				if (Array.isArray(ret[0])) {
					const columns = ret as (string | number | null)[][];
					for (let ci = 0; ci < columns.length; ci++) {
						const targetCol = ci + 1; // B=1, C=2, ...
						for (let ri = 0; ri < columns[ci].length; ri++) {
							if (ri < spreadsheet.rows && targetCol < spreadsheet.cols) {
								spreadsheet = setCellRaw(spreadsheet, ri, targetCol, String(columns[ci][ri] ?? ''));
							}
						}
					}
				} else {
					// Single array → update column B
					const values = ret as (string | number | null)[];
					for (let ri = 0; ri < values.length; ri++) {
						if (ri < spreadsheet.rows && 1 < spreadsheet.cols) {
							spreadsheet = setCellRaw(spreadsheet, ri, 1, String(values[ri] ?? ''));
						}
					}
				}
			}
		}
	}

	function handleTopicChange(index: number) {
		tutorial.topicIndex = index;
	}

	function handleChapterChange(index: number) {
		tutorial.chapterIndex = index;
	}
</script>

<!-- Top navigation -->
<div class="flex items-center justify-between bg-gray-800">
	<TopicBar
		topics={tutorial.topics}
		activeIndex={tutorial.topicIndex}
		ontopicchange={handleTopicChange}
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
	onchapterchange={handleChapterChange}
/>

<!-- Main content: 3 panels -->
<div class="grid min-h-0 flex-1 grid-cols-[1fr_380px]">
	<!-- Left: Spreadsheet + Code -->
	<div class="flex min-h-0 flex-col gap-2 overflow-auto border-r border-gray-700 p-3">
		<Spreadsheet grid={spreadsheet} oncellchange={handleCellChange} />

		<CodeEditor
			{code}
			{language}
			{output}
			{error}
			onrun={handleRun}
			oncodechange={(c) => (code = c)}
			onlanguagechange={(l) => (language = l)}
		/>
	</div>

	<!-- Right: Chat -->
	<div class="min-h-0 p-3">
		<ChatPanel {provider} {lessonContext} instruction={tutorial.currentChapter.instruction} />
	</div>
</div>

<SettingsModal open={showSettings} onclose={() => (showSettings = false)} />
