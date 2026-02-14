<!-- src/lib/components/CodeEditor.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { EditorView, keymap } from '@codemirror/view';
	import { EditorState, Compartment } from '@codemirror/state';
	import { basicSetup } from 'codemirror';
	import { javascript } from '@codemirror/lang-javascript';
	import { python } from '@codemirror/lang-python';
	import { sql } from '@codemirror/lang-sql';
	import { html } from '@codemirror/lang-html';
	import { markdown } from '@codemirror/lang-markdown';
	import { oneDark } from '@codemirror/theme-one-dark';
	import type { Language } from '$lib/tutorial/engine/executor';

	let {
		code,
		language,
		output,
		error,
		onrun,
		oncodechange,
		onlanguagechange,
		availableLanguages = [
			{ value: 'js', label: 'JavaScript' },
			{ value: 'python', label: 'Python' },
			{ value: 'sql', label: 'SQL' }
		]
	}: {
		code: string;
		language: Language;
		output: string;
		error: string | null;
		onrun: () => void | Promise<void>;
		oncodechange: (code: string) => void;
		onlanguagechange: (lang: Language) => void;
		availableLanguages?: { value: string; label: string }[];
	} = $props();

	let isRunning = $state(false);
	let editorEl: HTMLDivElement | undefined = $state();
	let view: EditorView | undefined = $state();

	const langCompartment = new Compartment();

	function getLangExtension(lang: Language) {
		switch (lang) {
			case 'js':
				return javascript();
			case 'python':
				return python();
			case 'sql':
				return sql();
			case 'html':
				return html();
			case 'markdown':
				return markdown();
			case 'jsx':
				return javascript({ jsx: true });
			case 'vue':
				return javascript();
			case 'svelte':
				return html();
		}
	}

	async function handleRun() {
		isRunning = true;
		try {
			await onrun();
		} finally {
			isRunning = false;
		}
	}

	onMount(() => {
		const runKeymap = keymap.of([
			{ key: 'Ctrl-Enter', run: () => (handleRun(), true) },
			{ key: 'Cmd-Enter', run: () => (handleRun(), true) }
		]);

		view = new EditorView({
			state: EditorState.create({
				doc: code,
				extensions: [
					basicSetup,
					oneDark,
					langCompartment.of(getLangExtension(language)),
					runKeymap,
					EditorView.updateListener.of((update) => {
						if (update.docChanged) {
							oncodechange(update.state.doc.toString());
						}
					}),
					EditorView.theme({
						'&': { height: '100%', fontSize: '13px' },
						'.cm-scroller': { overflow: 'auto' }
					})
				]
			}),
			parent: editorEl!
		});

		return () => {
			view?.destroy();
			view = undefined;
		};
	});

	// Sync external code changes (chapter switch, language switch)
	$effect(() => {
		if (view && view.state.doc.toString() !== code) {
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: code }
			});
		}
	});

	// Switch language highlighting
	$effect(() => {
		if (view) {
			view.dispatch({
				effects: langCompartment.reconfigure(getLangExtension(language))
			});
		}
	});
</script>

<div data-testid="code-editor" class="flex min-h-0 flex-1 flex-col rounded border border-gray-700">
	<!-- Toolbar -->
	<div class="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-3 py-1.5">
		<select
			data-testid="language-select"
			value={language}
			onchange={(e) => onlanguagechange((e.target as HTMLSelectElement).value as Language)}
			class="rounded bg-gray-700 px-2 py-1 text-xs text-gray-300"
		>
			{#each availableLanguages as lang (lang.value)}
				<option value={lang.value}>{lang.label}</option>
			{/each}
		</select>

		<button
			data-testid="run-btn"
			onclick={handleRun}
			disabled={isRunning}
			class="flex items-center gap-1 rounded bg-green-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
		>
			{isRunning ? 'Running...' : 'Run (Ctrl+Enter)'}
		</button>
	</div>

	<!-- Code editor (CodeMirror) -->
	<div data-testid="code-input" class="min-h-0 flex-1" bind:this={editorEl}></div>

	<!-- Output -->
	{#if output || error}
		<div
			data-testid="code-output"
			class="max-h-32 overflow-y-auto border-t border-gray-700 bg-gray-950 p-3"
		>
			<div class="mb-1 text-xs font-medium text-gray-500">Output:</div>
			{#if error}
				<pre data-testid="code-error" class="whitespace-pre-wrap text-xs text-red-400">{error}</pre>
			{/if}
			{#if output}
				<pre
					data-testid="code-stdout"
					class="whitespace-pre-wrap text-xs text-gray-300">{output}</pre>
			{/if}
		</div>
	{/if}
</div>
