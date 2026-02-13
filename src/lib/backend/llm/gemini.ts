// Google Gemini LLM provider

import type { ChatMessage, LessonContext, LLMProvider } from './types';

const GEMINI_API_URL =
	'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

function buildSystemPrompt(context?: LessonContext): string {
	let prompt = `You are a friendly programming tutor helping a beginner learn programming through Excel-like spreadsheets.
Keep explanations simple. Use the spreadsheet data the student is working with as examples.
Relate programming concepts to Excel formulas they already understand.
Be encouraging and patient. Use short, clear sentences.`;

	if (context) {
		prompt += `\n\nCurrent lesson context:
- Topic: ${context.topic}
- Chapter: ${context.chapter}
- Language: ${context.language}
- Current code:\n\`\`\`${context.language}\n${context.currentCode}\n\`\`\`
- Table data: ${JSON.stringify(context.tableData)}`;
	}

	return prompt;
}

function toGeminiMessages(
	messages: ChatMessage[],
	context?: LessonContext
): { contents: unknown[]; systemInstruction?: unknown } {
	const systemPrompt = buildSystemPrompt(context);

	const contents = messages
		.filter((m) => m.role !== 'system')
		.map((m) => ({
			role: m.role === 'assistant' ? 'model' : 'user',
			parts: [{ text: m.content }]
		}));

	return {
		contents,
		systemInstruction: { parts: [{ text: systemPrompt }] }
	};
}

export class GeminiProvider implements LLMProvider {
	name = 'Gemini';

	constructor(private apiKey: string) {}

	async sendMessage(messages: ChatMessage[], context?: LessonContext): Promise<string> {
		const body = toGeminiMessages(messages, context);

		const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			const text = await response.text();
			throw new Error(`Gemini API error (${response.status}): ${text}`);
		}

		const data = (await response.json()) as {
			candidates?: { content?: { parts?: { text?: string }[] } }[];
		};

		const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
		if (!text) throw new Error('No response from Gemini');

		return text;
	}
}
