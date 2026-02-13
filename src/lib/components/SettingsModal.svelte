<script lang="ts">
	import { settings } from '$lib/stores/settings.svelte';

	let {
		open,
		onclose
	}: {
		open: boolean;
		onclose: () => void;
	} = $props();

	let apiKeyInput = $state(settings.apiKey);

	function handleSave() {
		settings.apiKey = apiKeyInput;
		onclose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
		if (e.key === 'Enter') handleSave();
	}
</script>

{#if open}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
		onclick={onclose}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="mx-4 w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-xl"
			onclick={(e) => e.stopPropagation()}
			role="document"
		>
			<h2 data-testid="settings-title" class="mb-4 text-lg font-semibold text-white">Settings</h2>

			<div class="mb-4">
				<label for="api-key" class="mb-1 block text-sm text-gray-400">
					Google Gemini API Key
				</label>
				<input
					data-testid="api-key-input"
					id="api-key"
					type="password"
					bind:value={apiKeyInput}
					placeholder="Enter your API key..."
					class="w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
				/>
				<p class="mt-1 text-xs text-gray-500">
					Get a free key at
					<a
						href="https://aistudio.google.com/apikey"
						target="_blank"
						rel="noreferrer"
						class="text-blue-400 underline"
					>
						aistudio.google.com
					</a>
				</p>
			</div>

			<div class="flex justify-end gap-2">
				<button
					data-testid="settings-cancel"
					onclick={onclose}
					class="rounded px-4 py-2 text-sm text-gray-400 hover:text-white"
				>
					Cancel
				</button>
				<button
					data-testid="settings-save"
					onclick={handleSave}
					class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}
