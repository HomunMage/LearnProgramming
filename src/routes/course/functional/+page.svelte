<!-- src/routes/course/functional/+page.svelte -->
<script lang="ts">
	import CourseShell from '$lib/components/CourseShell.svelte';
	import Spreadsheet from '$lib/components/Spreadsheet.svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import { createTutorialStore } from '$lib/stores/tutorial.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { createProvider } from '$lib/backend/llm';
	import type { LLMProvider, LessonContext } from '$lib/backend/llm';
	import { toArray } from '$lib/tutorial/engine/spreadsheet';
	import { chapters } from '$lib/courses/functional/chapters';

	const tutorial = createTutorialStore(chapters);

	let provider = $derived<LLMProvider | null>(
		settings.hasApiKey ? createProvider(settings.providerType, settings.apiKey) : null
	);

	let lessonContext = $derived<LessonContext>({
		chapter: tutorial.currentChapter.title,
		session: tutorial.currentSession.title,
		tableData: toArray(tutorial.spreadsheet),
		currentCode: tutorial.code,
		language: tutorial.language
	});
</script>

<CourseShell
	chapters={tutorial.chapters}
	chapterIndex={tutorial.chapterIndex}
	sessions={tutorial.currentChapter.sessions}
	sessionIndex={tutorial.sessionIndex}
	{provider}
	{lessonContext}
	instruction={tutorial.currentSession.tutorial}
	onchapterchange={(i) => tutorial.selectChapter(i)}
	onsessionchange={(i) => tutorial.selectSession(i)}
>
	{#snippet leftPanel()}
		<div class="shrink-0 p-3 pb-0">
			<Spreadsheet
				grid={tutorial.spreadsheet}
				oncellchange={(r, c, v) => tutorial.editCell(r, c, v)}
			/>
		</div>
		<div class="min-h-0 flex-1 p-3">
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
	{/snippet}
</CourseShell>
