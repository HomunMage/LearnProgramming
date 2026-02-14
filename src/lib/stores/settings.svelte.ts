// src/lib/stores/settings.svelte.ts
// User settings store — localStorage-backed, Svelte 5 runes

import type { ProviderType } from '$lib/backend/llm';

const STORAGE_KEY = 'learn-prog-settings';

interface Settings {
	apiKey: string;
	providerType: ProviderType;
}

function loadSettings(): Settings {
	if (typeof localStorage === 'undefined') return { apiKey: '', providerType: 'gemini' };
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw) as Settings;
	} catch {
		// ignore
	}
	return { apiKey: '', providerType: 'gemini' };
}

function saveSettings(s: Settings): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

const initial = loadSettings();

let apiKey = $state(initial.apiKey);
let providerType = $state<ProviderType>(initial.providerType);

export const settings = {
	get apiKey() {
		return apiKey;
	},
	set apiKey(v: string) {
		apiKey = v;
		saveSettings({ apiKey, providerType });
	},
	get providerType() {
		return providerType;
	},
	set providerType(v: ProviderType) {
		providerType = v;
		saveSettings({ apiKey, providerType });
	},
	get hasApiKey() {
		return apiKey.length > 0;
	}
};
