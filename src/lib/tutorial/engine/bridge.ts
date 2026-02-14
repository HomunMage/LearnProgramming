// src/lib/tutorial/engine/bridge.ts
// Bridge between spreadsheet data and code execution
// Maps spreadsheet columns to named variables for code

import type { SpreadsheetState, CellValue } from './spreadsheet';
import { colToLetter, getColumnValues } from './spreadsheet';

export interface ColumnBinding {
	colIndex: number;
	variableName: string;
}

/** Build input variables from column bindings */
export function buildInputs(
	state: SpreadsheetState,
	bindings: Record<string, number>
): Record<string, CellValue[]> {
	const inputs: Record<string, CellValue[]> = {};
	for (const [name, colIndex] of Object.entries(bindings)) {
		inputs[name] = getColumnValues(state, colIndex);
	}
	return inputs;
}

/** Auto-generate bindings: A→col0, B→col1, etc. */
export function autoBindings(cols: number): Record<string, number> {
	const bindings: Record<string, number> = {};
	for (let c = 0; c < cols; c++) {
		bindings[colToLetter(c)] = c;
	}
	return bindings;
}
