<!-- src/lib/components/NavMenu.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { courses } from '$lib/courses';
	import SettingsModal from './SettingsModal.svelte';

	let menuOpen = $state(false);
	let showSettings = $state(false);

	let activeCourseId = $derived((): string => {
		const match = page.url.pathname.match(/\/course\/(\w+)/);
		return match ? match[1] : 'functional';
	});

	function closeMenu() {
		menuOpen = false;
	}
</script>

<svelte:window
	onclick={(e) => {
		if (menuOpen && !(e.target as HTMLElement).closest('[data-nav-menu]')) {
			menuOpen = false;
		}
	}}
/>

<div class="relative" data-nav-menu>
	<button
		data-testid="nav-menu-btn"
		onclick={() => (menuOpen = !menuOpen)}
		class="rounded p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
		title="Menu"
	>
		<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M4 6h16M4 12h16M4 18h16"
			/>
		</svg>
	</button>

	{#if menuOpen}
		<div
			class="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-xl"
		>
			<div class="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">
				Courses
			</div>
			{#each courses as course (course.id)}
				<a
					data-testid="nav-course-{course.id}"
					href="/course/{course.id}"
					class="flex items-center gap-2 px-4 py-2 text-sm transition-colors
						{activeCourseId() === course.id
						? 'bg-blue-900/40 text-blue-300'
						: 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
					onclick={closeMenu}
				>
					<span class="w-8 text-center text-xs">{course.icon}</span>
					{course.title}
				</a>
			{/each}
			<div class="my-1 border-t border-gray-700"></div>
			<button
				data-testid="nav-settings"
				onclick={() => {
					showSettings = true;
					menuOpen = false;
				}}
				class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
				Settings
			</button>
		</div>
	{/if}
</div>

<SettingsModal open={showSettings} onclose={() => (showSettings = false)} />
