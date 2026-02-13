// LLM provider interface — decoupled design for swapping backends

export interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

export interface LessonContext {
	topic: string;
	chapter: string;
	tableData: (string | number | null)[][];
	currentCode: string;
	language: 'js' | 'python' | 'sql';
}

export interface LLMProvider {
	name: string;
	sendMessage(messages: ChatMessage[], context?: LessonContext): Promise<string>;
}
