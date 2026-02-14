// src/lib/backend/llm/provider.ts
// LLM provider factory — manages the active provider

import type { LLMProvider } from './types';
import { GeminiProvider } from './gemini';

export type ProviderType = 'gemini';

/** Create a provider instance by type */
export function createProvider(type: ProviderType, apiKey: string): LLMProvider {
	switch (type) {
		case 'gemini':
			return new GeminiProvider(apiKey);
		// Future: add 'openai', 'anthropic' cases here
	}
}
