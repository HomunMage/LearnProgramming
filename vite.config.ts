// vite.config.ts
/// <reference types="vitest" />

import { projectBaseWithSlash } from './myconfig.js';

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(({ mode }) => {
	const isProduction = mode === 'production';

	return {
		base: isProduction ? projectBaseWithSlash : '/',

		plugins: [tailwindcss(), sveltekit()],
		server: {
			host: '0.0.0.0',
			port: 3000
		},
		preview: {
			allowedHosts: ['app']
		},
		test: {
			workspace: [
				{
					extends: './vite.config.ts',
					test: {
						name: 'client',
						environment: 'jsdom',
						clearMocks: true,
						include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
						exclude: ['src/lib/server/**'],
						setupFiles: ['./vitest-setup-client.ts']
					}
				},
				{
					extends: './vite.config.ts',
					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.{test,spec}.{js,ts}'],
						exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
					}
				}
			]
		}
	};
});
