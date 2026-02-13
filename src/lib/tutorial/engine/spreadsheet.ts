// Spreadsheet data model with formula evaluation

export type CellValue = string | number | null;

export interface CellData {
	raw: string;
	computed: CellValue;
	formula: boolean;
}

export interface SpreadsheetState {
	cells: CellData[][];
	rows: number;
	cols: number;
}

/** Convert column index to letter: 0→A, 1→B, etc. */
export function colToLetter(col: number): string {
	return String.fromCharCode(65 + col);
}

/** Convert column letter to index: A→0, B→1, etc. */
export function letterToCol(letter: string): number {
	return letter.toUpperCase().charCodeAt(0) - 65;
}

/** Parse a cell reference like "A1" into { col, row } (0-indexed) */
function parseCellRef(ref: string): { col: number; row: number } | null {
	const match = ref.match(/^([A-Z])(\d+)$/i);
	if (!match) return null;
	return { col: letterToCol(match[1]), row: parseInt(match[2], 10) - 1 };
}

/** Evaluate a formula string against current cell grid */
function evaluateFormula(formula: string, cells: CellData[][]): CellValue {
	// Remove leading "="
	let expr = formula.slice(1).trim();

	// Handle built-in functions: SUM, COUNT, AVERAGE
	expr = expr.replace(
		/\b(SUM|COUNT|AVERAGE)\(([A-Z])(\d+):([A-Z])(\d+)\)/gi,
		(_match, fn, col1, row1, col2, row2) => {
			const c1 = letterToCol(col1);
			const c2 = letterToCol(col2);
			const r1 = parseInt(row1, 10) - 1;
			const r2 = parseInt(row2, 10) - 1;

			const values: number[] = [];
			for (let r = r1; r <= r2; r++) {
				for (let c = c1; c <= c2; c++) {
					const val = cells[r]?.[c]?.computed;
					if (typeof val === 'number') values.push(val);
				}
			}

			const fnName = (fn as string).toUpperCase();
			if (fnName === 'SUM') return String(values.reduce((a, b) => a + b, 0));
			if (fnName === 'COUNT') return String(values.length);
			if (fnName === 'AVERAGE')
				return values.length > 0 ? String(values.reduce((a, b) => a + b, 0) / values.length) : '0';
			return '0';
		}
	);

	// Replace cell references (A1, B2, etc.) with their computed values
	expr = expr.replace(/\b([A-Z])(\d+)\b/gi, (_match, col, row) => {
		const ref = parseCellRef(col + row);
		if (!ref) return '0';
		const val = cells[ref.row]?.[ref.col]?.computed;
		if (typeof val === 'number') return String(val);
		if (typeof val === 'string') return JSON.stringify(val);
		return '0';
	});

	try {
		// Safe evaluation of arithmetic expressions
		// Only allow numbers, operators, parens, and commas
		if (!/^[\d\s+\-*/().,"' ]+$/.test(expr)) return null;
		return new Function(`"use strict"; return (${expr});`)() as CellValue;
	} catch {
		return null;
	}
}

/** Create an empty spreadsheet */
export function createSpreadsheet(rows: number, cols: number): SpreadsheetState {
	const cells: CellData[][] = [];
	for (let r = 0; r < rows; r++) {
		const row: CellData[] = [];
		for (let c = 0; c < cols; c++) {
			row.push({ raw: '', computed: null, formula: false });
		}
		cells.push(row);
	}
	return { cells, rows, cols };
}

/** Set a cell's raw value and recalculate */
export function setCellRaw(
	state: SpreadsheetState,
	row: number,
	col: number,
	raw: string
): SpreadsheetState {
	const cells = state.cells.map((r) => r.map((c) => ({ ...c })));
	const isFormula = raw.startsWith('=');
	cells[row][col] = { raw, computed: null, formula: isFormula };
	return evaluate({ ...state, cells });
}

/** Recalculate all cells (formulas depend on other cells) */
export function evaluate(state: SpreadsheetState): SpreadsheetState {
	const cells = state.cells.map((r) => r.map((c) => ({ ...c })));

	// First pass: set non-formula values
	for (let r = 0; r < state.rows; r++) {
		for (let c = 0; c < state.cols; c++) {
			const cell = cells[r][c];
			if (!cell.formula) {
				const num = Number(cell.raw);
				cell.computed = cell.raw === '' ? null : isNaN(num) ? cell.raw : num;
			}
		}
	}

	// Multiple passes to resolve formula dependencies (simple approach)
	for (let pass = 0; pass < 5; pass++) {
		for (let r = 0; r < state.rows; r++) {
			for (let c = 0; c < state.cols; c++) {
				const cell = cells[r][c];
				if (cell.formula) {
					cell.computed = evaluateFormula(cell.raw, cells);
				}
			}
		}
	}

	return { ...state, cells };
}

/** Load initial data into a spreadsheet */
export function loadData(data: CellValue[][]): SpreadsheetState {
	const rows = data.length;
	const cols = Math.max(...data.map((r) => r.length), 1);
	const state = createSpreadsheet(rows, cols);

	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < data[r].length; c++) {
			const val = data[r][c];
			state.cells[r][c] = {
				raw: val === null ? '' : String(val),
				computed: null,
				formula: typeof val === 'string' && val.startsWith('=')
			};
		}
	}

	return evaluate(state);
}

/** Get all computed values from a column */
export function getColumnValues(state: SpreadsheetState, col: number): CellValue[] {
	return state.cells.map((row) => row[col]?.computed ?? null);
}

/** Export spreadsheet as plain 2D array */
export function toArray(state: SpreadsheetState): CellValue[][] {
	return state.cells.map((row) => row.map((cell) => cell.computed));
}
