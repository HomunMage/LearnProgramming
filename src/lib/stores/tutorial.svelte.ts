// Tutorial store — single source of truth for navigation + runtime state

import { topics } from '$lib/data/topics';
import type { Topic, Chapter } from '$lib/data/types';
import type { Language } from '$lib/tutorial/engine/executor';
import type { SpreadsheetState } from '$lib/tutorial/engine/spreadsheet';
import { loadData, setCellRaw, toArray, letterToCol } from '$lib/tutorial/engine/spreadsheet';
import { autoBindings, buildInputs } from '$lib/tutorial/engine/bridge';
import { execute } from '$lib/tutorial/engine/executor';

// --- Navigation state ---
let currentTopicIndex = $state(0);
let currentChapterIndex = $state(0);

// --- Runtime state ---
let spreadsheet = $state<SpreadsheetState>(loadData(topics[0].chapters[0].table));
let code = $state(topics[0].chapters[0].js ?? '');
let language = $state<Language>('js');
let output = $state('');
let error = $state<string | null>(null);

function currentChapter(): Chapter {
	return topics[currentTopicIndex].chapters[currentChapterIndex];
}

function defaultLanguage(chapter: Chapter): Language {
	if (chapter.js) return 'js';
	if (chapter.py) return 'python';
	if (chapter.sql) return 'sql';
	return 'js';
}

function codeForLanguage(chapter: Chapter, lang: Language): string {
	switch (lang) {
		case 'js':
			return chapter.js ?? '';
		case 'python':
			return chapter.py ?? '';
		case 'sql':
			return chapter.sql ?? '';
	}
}

function resetRuntime() {
	const chapter = currentChapter();
	const lang = defaultLanguage(chapter);
	spreadsheet = loadData(chapter.table);
	language = lang;
	code = codeForLanguage(chapter, lang);
	output = '';
	error = null;
}

export const tutorial = {
	// --- Navigation getters ---
	get topics(): Topic[] {
		return topics;
	},
	get topicIndex() {
		return currentTopicIndex;
	},
	get chapterIndex() {
		return currentChapterIndex;
	},
	get currentTopic(): Topic {
		return topics[currentTopicIndex];
	},
	get currentChapter(): Chapter {
		return currentChapter();
	},

	// --- Runtime getters ---
	get spreadsheet() {
		return spreadsheet;
	},
	get code() {
		return code;
	},
	get language() {
		return language;
	},
	get output() {
		return output;
	},
	get error() {
		return error;
	},

	// --- Navigation actions ---
	selectTopic(i: number) {
		currentTopicIndex = i;
		currentChapterIndex = 0;
		resetRuntime();
	},
	selectChapter(i: number) {
		currentChapterIndex = i;
		resetRuntime();
	},

	// --- Runtime actions ---
	setLanguage(lang: Language) {
		language = lang;
		code = codeForLanguage(currentChapter(), lang);
		output = '';
		error = null;
	},
	editCode(str: string) {
		code = str;
	},
	editCell(row: number, col: number, value: string) {
		spreadsheet = setCellRaw(spreadsheet, row, col, value);
	},
	async run() {
		const bindings = autoBindings(spreadsheet.cols);
		const inputs = buildInputs(spreadsheet, bindings);
		const result = await execute(language, code, inputs, toArray(spreadsheet));
		output = result.output;
		error = result.error;

		// Sync column variables (B, C, D...) back to spreadsheet
		for (const [letter, values] of Object.entries(result.columns)) {
			const col = letterToCol(letter);
			if (col < spreadsheet.cols) {
				for (let ri = 0; ri < values.length && ri < spreadsheet.rows; ri++) {
					spreadsheet = setCellRaw(spreadsheet, ri, col, String(values[ri] ?? ''));
				}
			}
		}
	}
};
