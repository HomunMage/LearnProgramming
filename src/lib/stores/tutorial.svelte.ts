// src/lib/stores/tutorial.svelte.ts
// Tutorial store factory — creates a store instance for any course's chapters

import type { Chapter, Session } from '$lib/data/types';
import type { Language } from '$lib/tutorial/engine/executor';
import type { SpreadsheetState } from '$lib/tutorial/engine/spreadsheet';
import { loadData, setCellRaw, toArray, letterToCol } from '$lib/tutorial/engine/spreadsheet';
import { autoBindings, buildInputs } from '$lib/tutorial/engine/bridge';
import { execute } from '$lib/tutorial/engine/executor';

export function createTutorialStore(courseChapters: Chapter[]) {
	// --- Navigation state ---
	let currentChapterIndex = $state(0);
	let currentSessionIndex = $state(0);

	// --- Runtime state ---
	let spreadsheet = $state<SpreadsheetState>(loadData(courseChapters[0].sessions[0].table));
	let code = $state(getInitialCode(courseChapters[0].sessions[0]));
	let language = $state<Language>(defaultLanguage(courseChapters[0].sessions[0]));
	let output = $state('');
	let error = $state<string | null>(null);

	function currentSession(): Session {
		return courseChapters[currentChapterIndex].sessions[currentSessionIndex];
	}

	function defaultLanguage(session: Session): Language {
		if (session.html) return 'html';
		if (session.md) return 'markdown';
		if (session.js) return 'js';
		if (session.py) return 'python';
		if (session.sql) return 'sql';
		return 'js';
	}

	function codeForLanguage(session: Session, lang: Language): string {
		switch (lang) {
			case 'js':
				return session.js ?? '';
			case 'python':
				return session.py ?? '';
			case 'sql':
				return session.sql ?? '';
			case 'html':
				return session.html ?? '';
			case 'markdown':
				return session.md ?? '';
		}
	}

	function getInitialCode(session: Session): string {
		return codeForLanguage(session, defaultLanguage(session));
	}

	function resetRuntime() {
		const session = currentSession();
		const lang = defaultLanguage(session);
		spreadsheet = loadData(session.table);
		language = lang;
		code = codeForLanguage(session, lang);
		output = '';
		error = null;
	}

	return {
		// --- Navigation getters ---
		get chapters(): Chapter[] {
			return courseChapters;
		},
		get chapterIndex() {
			return currentChapterIndex;
		},
		get sessionIndex() {
			return currentSessionIndex;
		},
		get currentChapter(): Chapter {
			return courseChapters[currentChapterIndex];
		},
		get currentSession(): Session {
			return currentSession();
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
		selectChapter(i: number) {
			currentChapterIndex = i;
			currentSessionIndex = 0;
			resetRuntime();
		},
		selectSession(i: number) {
			currentSessionIndex = i;
			resetRuntime();
		},

		// --- Runtime actions ---
		setLanguage(lang: Language) {
			language = lang;
			code = codeForLanguage(currentSession(), lang);
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
}
