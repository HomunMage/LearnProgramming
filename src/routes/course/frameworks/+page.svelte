<!-- src/routes/course/frameworks/+page.svelte -->
<script lang="ts">
	import CourseShell from '$lib/components/CourseShell.svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import HtmlPreview from '$lib/components/HtmlPreview.svelte';
	import { createTutorialStore } from '$lib/stores/tutorial.svelte';
	import { settings } from '$lib/stores/settings.svelte';
	import { createProvider } from '$lib/backend/llm';
	import type { LLMProvider, LessonContext } from '$lib/backend/llm';
	import { chapters } from '$lib/courses/frameworks/chapters';
	import { buildFrameworkHtml } from '$lib/tutorial/engine/framework';
	import type { FrameworkType } from '$lib/tutorial/engine/framework';

	const tutorial = createTutorialStore(chapters);

	let renderedHtml = $state('');

	const frameworkLanguages = [
		{ value: 'html', label: 'Vanilla' },
		{ value: 'jsx', label: 'React (JSX)' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'svelte', label: 'Svelte' }
	];

	const previewTitles: Record<string, string> = {
		html: 'Vanilla Preview',
		jsx: 'React Preview',
		vue: 'Vue Preview',
		svelte: 'Svelte Preview'
	};

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
		renderedHtml = buildFrameworkHtml(tutorial.code, tutorial.language as FrameworkType);
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
	{#snippet leftTop()}
		<HtmlPreview html={renderedHtml} title={previewTitles[tutorial.language] ?? 'Preview'} raw />
	{/snippet}

	{#snippet leftBottom()}
		<CodeEditor
			code={tutorial.code}
			language={tutorial.language}
			output=""
			error={null}
			onrun={handleRun}
			oncodechange={(c) => tutorial.editCode(c)}
			onlanguagechange={(l) => tutorial.setLanguage(l)}
			availableLanguages={frameworkLanguages}
		/>
	{/snippet}
</CourseShell>
