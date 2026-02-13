<script lang="ts">
	import type { Language } from '$lib/tutorial/engine/executor';

	let {
		code,
		language,
		output,
		error,
		onrun,
		oncodechange,
		onlanguagechange
	}: {
		code: string;
		language: Language;
		output: string;
		error: string | null;
		onrun: () => void;
		oncodechange: (code: string) => void;
		onlanguagechange: (lang: Language) => void;
	} = $props();

	let isRunning = $state(false);

	async function handleRun() {
		isRunning = true;
		onrun();
		// Small delay to show spinner
		await new Promise((r) => setTimeout(r, 100));
		isRunning = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
			e.preventDefault();
			handleRun();
		}
		// Tab support in textarea
		if (e.key === 'Tab') {
			e.preventDefault();
			const target = e.target as HTMLTextAreaElement;
			const start = target.selectionStart;
			const end = target.selectionEnd;
			const newCode = code.slice(0, start) + '  ' + code.slice(end);
			oncodechange(newCode);
			// Restore cursor position after Svelte updates
			requestAnimationFrame(() => {
				target.selectionStart = target.selectionEnd = start + 2;
			});
		}
	}
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
			<option value="js">JavaScript</option>
			<option value="python">Python</option>
			<option value="sql">SQL</option>
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

	<!-- Code input -->
	<textarea
		data-testid="code-input"
		value={code}
		oninput={(e) => oncodechange((e.target as HTMLTextAreaElement).value)}
		onkeydown={handleKeydown}
		spellcheck={false}
		class="min-h-0 flex-1 resize-none bg-gray-900 p-3 font-mono text-sm text-green-300 outline-none placeholder:text-gray-600"
		placeholder="Write code here..."
	></textarea>

	<!-- Output -->
	{#if output || error}
		<div data-testid="code-output" class="border-t border-gray-700 bg-gray-950 p-3">
			<div class="mb-1 text-xs font-medium text-gray-500">Output:</div>
			{#if error}
				<pre data-testid="code-error" class="text-xs text-red-400">{error}</pre>
			{/if}
			{#if output}
				<pre data-testid="code-stdout" class="text-xs text-gray-300">{output}</pre>
			{/if}
		</div>
	{/if}
</div>
