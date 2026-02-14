// src/lib/data/types.ts
// Data types for tutorial content

import type { CellValue } from '$lib/tutorial/engine/spreadsheet';

export interface Chapter {
	id: string;
	title: string;
	description: string;
	tutorial: string;
	table: CellValue[][];
	js?: string;
	py?: string;
	sql?: string;
	columnBindings: Record<string, number>;
	hints: string[];
}

export interface Topic {
	id: string;
	title: string;
	chapters: Chapter[];
}
