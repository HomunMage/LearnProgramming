// src/lib/tutorial/engine/executor.ts
// Code execution engine — runs JS (browser), Python (Pyodide), SQL (sql.js)
// Variables named B, C, D... automatically sync back to spreadsheet columns.

import type { CellValue } from './spreadsheet';
import { getPyodide, isPyodideLoaded } from './pyodide';

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
	code: string,
	inputs: Record<string, CellValue[]>
): Promise<ExecutionResult> {
	const logs: string[] = [];
	try {
		const firstLoad = !isPyodideLoaded();
		const pyodide = await getPyodide();
		if (firstLoad) logs.push('[Python runtime loaded]');

		// Capture print() output
		pyodide.setStdout({ batched: (msg: string) => logs.push(msg) });

		// Clean previous single-letter globals to avoid stale column data
		await pyodide.runPythonAsync(
			`for _l in list(globals()):\n    if len(_l) == 1 and _l.isupper(): del globals()[_l]`
		);

		// Inject column variables as native Python lists
		for (const [name, values] of Object.entries(inputs)) {
			pyodide.globals.set(name, pyodide.toPy(values));
		}

		// Auto-load packages used in code (numpy, etc.) from Pyodide CDN
		await pyodide.loadPackagesFromImports(code);

		// Run user code
		await pyodide.runPythonAsync(code);

		// Collect column-letter variables that are lists or numpy arrays, returned as JSON
		const resultJson = await pyodide.runPythonAsync(
			`import json as _json\n` +
				`_cols = {}\n` +
				`for _l in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':\n` +
				`    try:\n` +
				`        _v = eval(_l)\n` +
				`        if isinstance(_v, list): _cols[_l] = _v\n` +
				`        elif hasattr(_v, 'tolist'): _cols[_l] = _v.tolist()\n` +
				`    except: pass\n` +
				`_json.dumps(_cols)`
		);
		const columns: Record<string, CellValue[]> = resultJson ? JSON.parse(resultJson) : {};

		return { output: logs.join('\n'), error: null, columns };
	} catch (err) {
		return {
			output: logs.join('\n'),
			error: err instanceof Error ? err.message : String(err),
			columns: {}
		};
	}
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
