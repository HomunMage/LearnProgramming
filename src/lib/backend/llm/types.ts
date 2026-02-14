// src/lib/backend/llm/types.ts
// LLM provider interface — decoupled design for swapping backends

export interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export interface LessonContext {
	chapter: string;
	session: string;
	tableData: (string | number | null)[][];
	currentCode: string;
	language: 'js' | 'python' | 'sql' | 'html' | 'markdown';
}

export interface LLMProvider {
	name: string;
	sendMessage(messages: ChatMessage[], context?: LessonContext): Promise<string>;
}
