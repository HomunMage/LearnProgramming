// Code execution engine — runs JS (browser), Python (Pyodide), SQL (sql.js)
// Variables named B, C, D... automatically sync back to spreadsheet columns.

import type { CellValue } from './spreadsheet';

export type Language = 'js' | 'python' | 'sql';

export interface ExecutionResult {
	output: string;
	error: string | null;
	/** Column letter → array of values to write back (e.g. { B: [1,2,3], C: [4,5,6] }) */
	columns: Record<string, CellValue[]>;
}

const COL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Execute JavaScript code with column data injected as variables */
export async function executeJS(
	code: string,
	inputs: Record<string, CellValue[]>
): Promise<ExecutionResult> {
	try {
		// Build variable declarations from inputs (A, B, C... that already have data)
		const declarations = Object.entries(inputs)
			.map(([name, values]) => `let ${name} = ${JSON.stringify(values)};`)
			.join('\n');

		// After user code runs, collect all column-letter variables that are arrays
		const collectCols = COL_LETTERS.split('')
			.map((l) => `if(typeof ${l}!=='undefined'&&Array.isArray(${l}))__cols.${l}=${l};`)
			.join('');

		const fullCode = `
			const __logs = [];
			const console = { log: (...args) => __logs.push(args.map(String).join(' ')) };
			const __cols = {};
			${declarations}
			${code}
			${collectCols}
			return { logs: __logs, columns: __cols };
		`;

		const fn = new Function(fullCode);
		const { logs, columns } = fn() as {
			logs: string[];
			columns: Record<string, CellValue[]>;
		};

		return {
			output: logs.join('\n'),
			error: null,
			columns
		};
	} catch (err) {
		return {
			output: '',
			error: err instanceof Error ? err.message : String(err),
			columns: {}
		};
	}
}

/** Execute Python code via Pyodide (lazy-loaded from CDN) */
export async function executePython(
	_code: string,
	_inputs: Record<string, CellValue[]>
): Promise<ExecutionResult> {
	return {
		output: '',
		error: 'Python execution is not yet available. Coming soon!',
		columns: {}
	};
}

/** Execute SQL via sql.js (lazy-loaded from CDN) */
export async function executeSQL(
	_code: string,
	_tableData: CellValue[][]
): Promise<ExecutionResult> {
	return {
		output: '',
		error: 'SQL execution is not yet available. Coming soon!',
		columns: {}
	};
}

/** Unified execute function */
export async function execute(
	language: Language,
	code: string,
	inputs: Record<string, CellValue[]>,
	tableData: CellValue[][] = []
): Promise<ExecutionResult> {
	switch (language) {
		case 'js':
			return executeJS(code, inputs);
		case 'python':
			return executePython(code, inputs);
		case 'sql':
			return executeSQL(code, tableData);
	}
}
