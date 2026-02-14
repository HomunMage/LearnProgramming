// src/lib/tutorial/engine/preload.ts
// Preloads heavy runtimes in the background so they're cached when the user clicks Run.

import { getPyodide } from './pyodide';

const CDN_URLS = {
	react: [
		'https://unpkg.com/react@18/umd/react.development.js',
		'https://unpkg.com/react-dom@18/umd/react-dom.development.js',
		'https://unpkg.com/@babel/standalone/babel.min.js'
	],
	vue: ['https://unpkg.com/vue@3/dist/vue.global.js'],
	svelte: [
		'https://esm.sh/svelte@5/compiler',
		'https://esm.sh/svelte@5',
		'https://esm.sh/svelte@5/internal/client',
		'https://esm.sh/svelte@5/internal/disclose-version',
		'https://esm.sh/svelte@5/internal/flags/legacy'
	]
};

/** Warm browser HTTP cache for CDN URLs (fire-and-forget) */
function warmCache(urls: string[]) {
	for (const url of urls) {
		fetch(url, { mode: 'cors' }).catch(() => {});
	}
}

/** Preload Pyodide runtime (for functional course) */
export function preloadPyodide() {
	getPyodide().catch(() => {});
}

/** Preload framework CDN resources (for frameworks course) */
export function preloadFrameworks() {
	warmCache(CDN_URLS.react);
	warmCache(CDN_URLS.vue);
	warmCache(CDN_URLS.svelte);
}
