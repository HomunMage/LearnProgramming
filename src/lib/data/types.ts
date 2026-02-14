// src/lib/data/types.ts
// Data types for tutorial content

import type { CellValue } from '$lib/tutorial/engine/spreadsheet';

export interface Session {
	id: string;
	title: string;
	description: string;
	tutorial: string;
	table: CellValue[][];
	js?: string;
	py?: string;
	sql?: string;
	html?: string;
	md?: string;
	columnBindings: Record<string, number>;
	hints: string[];
}

export interface Chapter {
	id: string;
	title: string;
	sessions: Session[];
}
