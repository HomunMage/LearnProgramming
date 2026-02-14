<!-- src/routes/course/html/+page.svelte -->
<script lang="ts">
	import { marked } from 'marked';
	import CourseShell from '$lib/components/CourseShell.svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import HtmlPreview from '$lib/components/HtmlPreview.svelte';
	import { createTutorialStore } from '$lib/stores/tutorial.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { createProvider } from '$lib/backend/llm';
	import type { LLMProvider, LessonContext } from '$lib/backend/llm';
	import { chapters } from '$lib/courses/html/chapters';

	const tutorial = createTutorialStore(chapters);

	let renderedHtml = $state('');

	const htmlLanguages = [
		{ value: 'html', label: 'HTML' },
		{ value: 'markdown', label: 'Markdown' }
	];

	let provider = $derived<LLMProvider | null>(
		settings.hasApiKey ? createProvider(settings.providerType, settings.apiKey) : null
	);

	let lessonContext = $derived<LessonContext>({
		chapter: tutorial.currentChapter.title,
		session: tutorial.currentSession.title,
		tableData: [],
		currentCode: tutorial.code,
		language: tutorial.language
	});

	function handleRun() {
		if (tutorial.language === 'markdown') {
			renderedHtml = marked.parse(tutorial.code) as string;
		} else {
			renderedHtml = tutorial.code;
		}
	}
</script>

<CourseShell
	chapters={tutorial.chapters}
	chapterIndex={tutorial.chapterIndex}
	sessions={tutorial.currentChapter.sessions}
	sessionIndex={tutorial.sessionIndex}
	{provider}
	{lessonContext}
	instruction={tutorial.currentSession.tutorial}
	onchapterchange={(i) => {
		tutorial.selectChapter(i);
		renderedHtml = '';
	}}
	onsessionchange={(i) => {
		tutorial.selectSession(i);
		renderedHtml = '';
	}}
>
	{#snippet leftPanel()}
		<div class="min-h-0 flex-1 p-3">
			<HtmlPreview
				html={renderedHtml}
				title={tutorial.language === 'markdown' ? 'Markdown Preview' : 'HTML Preview'}
			/>
		</div>
		<div class="min-h-0 flex-1 border-t border-gray-700 p-3">
			<CodeEditor
				code={tutorial.code}
				language={tutorial.language}
				output=""
				error={null}
				onrun={handleRun}
				oncodechange={(c) => tutorial.editCode(c)}
				onlanguagechange={(l) => tutorial.setLanguage(l)}
				availableLanguages={htmlLanguages}
			/>
		</div>
	{/snippet}
</CourseShell>
