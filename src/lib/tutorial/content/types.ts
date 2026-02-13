// Tutorial content type definitions

import type { CellValue } from '../engine/spreadsheet';
import type { Language } from '../engine/executor';

export interface Chapter {
	id: string;
	title: string;
	instruction: string;
	initialTable: CellValue[][];
	initialCode: string;
	language: Language;
	columnBindings: Record<string, number>;
	hints: string[];
}

export interface Topic {
	id: string;
	title: string;
	chapters: Chapter[];
}
