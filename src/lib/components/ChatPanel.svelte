<!-- src/lib/components/ChatPanel.svelte -->
<script lang="ts">
	import type { ChatMessage, LLMProvider, LessonContext } from '$lib/backend/llm';

	let {
		provider,
		lessonContext,
		instruction
	}: {
		provider: LLMProvider | null;
		lessonContext: LessonContext;
		instruction: string;
	} = $props();

	let messages = $state<ChatMessage[]>([]);
	let input = $state('');
	let isLoading = $state(false);
	let chatContainer: HTMLDivElement | undefined = $state();

	// Reset messages when lesson changes
	$effect(() => {
		// Track instruction changes
		void instruction;
		messages = [];
	});

	function scrollToBottom() {
		requestAnimationFrame(() => {
			if (chatContainer) {
				chatContainer.scrollTop = chatContainer.scrollHeight;
			}
		});
	}

	async function sendMessage() {
		const text = input.trim();
		if (!text || isLoading) return;

		input = '';
		messages = [...messages, { role: 'user', content: text }];
		scrollToBottom();

		if (!provider) {
			messages = [
				...messages,
				{
					role: 'assistant',
					content: 'Please set your API key in Settings (gear icon) to chat with the AI tutor.'
				}
			];
			scrollToBottom();
			return;
		}

		isLoading = true;
		try {
			const response = await provider.sendMessage(messages, lessonContext);
			messages = [...messages, { role: 'assistant', content: response }];
		} catch (err) {
			messages = [
				...messages,
				{
					role: 'assistant',
					content: `Error: ${err instanceof Error ? err.message : 'Something went wrong'}`
				}
			];
		}
		isLoading = false;
		scrollToBottom();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function renderMarkdown(text: string): string {
		// Simple markdown: **bold**, `code`, ```code blocks```
		return text
			.replace(
				/```(\w*)\n([\s\S]*?)```/g,
				'<pre class="my-2 rounded bg-gray-800 p-2 text-xs"><code>$2</code></pre>'
			)
			.replace(/`([^`]+)`/g, '<code class="rounded bg-gray-800 px-1 text-xs">$1</code>')
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/\n/g, '<br>');
	}
</script>

<div data-testid="chat-panel" class="flex h-full flex-col rounded border border-gray-700">
	<!-- Header -->
	<div class="border-b border-gray-700 bg-gray-800 px-3 py-2">
		<span class="text-sm font-medium text-gray-300">AI Tutor</span>
	</div>

	<!-- Messages -->
	<div
		data-testid="chat-messages"
		bind:this={chatContainer}
		class="flex-1 space-y-3 overflow-y-auto p-3"
	>
		<!-- Lesson instruction as first message -->
		<div data-testid="lesson-instruction" class="rounded-lg bg-blue-900/20 p-3">
			<div class="mb-1 text-xs font-medium text-blue-400">Lesson</div>
			<div class="prose-sm text-sm text-gray-300">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html renderMarkdown(instruction)}
			</div>
		</div>

		{#each messages as msg, i (i)}
			<div
				class="rounded-lg p-3 {msg.role === 'user'
					? 'ml-4 bg-blue-600/20 text-blue-100'
					: 'mr-4 bg-gray-800 text-gray-300'}"
			>
				<div
					class="mb-1 text-xs font-medium {msg.role === 'user'
						? 'text-blue-400'
						: 'text-green-400'}"
				>
					{msg.role === 'user' ? 'You' : 'AI Tutor'}
				</div>
				<div class="text-sm">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html renderMarkdown(msg.content)}
				</div>
			</div>
		{/each}

		{#if isLoading}
			<div class="mr-4 rounded-lg bg-gray-800 p-3">
				<div class="mb-1 text-xs font-medium text-green-400">AI Tutor</div>
				<div class="text-sm text-gray-400">Thinking...</div>
			</div>
		{/if}
	</div>

	<!-- Input -->
	<div class="border-t border-gray-700 p-2">
		<div class="flex gap-2">
			<textarea
				data-testid="chat-input"
				bind:value={input}
				onkeydown={handleKeydown}
				placeholder={provider ? 'Ask anything...' : 'Set API key in Settings to chat'}
				disabled={isLoading}
				rows={2}
				class="flex-1 resize-none rounded bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600 disabled:opacity-50"
			></textarea>
			<button
				data-testid="chat-send"
				onclick={sendMessage}
				disabled={!input.trim() || isLoading}
				class="self-end rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
			>
				Send
			</button>
		</div>
	</div>
</div>
