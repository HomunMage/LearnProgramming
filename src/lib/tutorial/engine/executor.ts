// Code execution engine — runs JS (browser), Python (Pyodide), SQL (sql.js)

import type { CellValue } from './spreadsheet';

export type Language = 'js' | 'python' | 'sql';

export interface ExecutionResult {
	output: string;
	returnValue: unknown;
	error: string | null;
	tableUpdate?: CellValue[][];
}

/** Execute JavaScript code with column data injected as variables */
export async function executeJS(
	code: string,
	inputs: Record<string, CellValue[]>
): Promise<ExecutionResult> {
	const logs: string[] = [];

	try {
		// Build variable declarations from inputs
		const declarations = Object.entries(inputs)
			.map(([name, values]) => `const ${name} = ${JSON.stringify(values)};`)
			.join('\n');

		// Capture console.log output
		const fullCode = `
			const __logs = [];
			const console = { log: (...args) => __logs.push(args.map(String).join(' ')) };
			${declarations}
			const __result = (() => { ${code} })();
			return { logs: __logs, result: __result };
		`;

		const fn = new Function(`"use strict"; ${fullCode}`);
		const { logs: capturedLogs, result } = fn() as {
			logs: string[];
			result: unknown;
		};
		logs.push(...capturedLogs);

		// If result is an array of arrays, treat as table update
		let tableUpdate: CellValue[][] | undefined;
		if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
			tableUpdate = result as CellValue[][];
		}

		return {
			output: logs.join('\n'),
			returnValue: result,
			error: null,
			tableUpdate
		};
	} catch (err) {
		return {
			output: logs.join('\n'),
			returnValue: null,
			error: err instanceof Error ? err.message : String(err)
		};
	}
}

/** Execute Python code via Pyodide (lazy-loaded from CDN) */
export async function executePython(
	_code: string,
	_inputs: Record<string, CellValue[]>
): Promise<ExecutionResult> {
	// Pyodide loading is deferred to future phase
	return {
		output: '',
		returnValue: null,
		error: 'Python execution is not yet available. Coming soon!'
	};
}

/** Execute SQL via sql.js (lazy-loaded from CDN) */
export async function executeSQL(
	_code: string,
	_tableData: CellValue[][]
): Promise<ExecutionResult> {
	// sql.js loading is deferred to future phase
	return {
		output: '',
		returnValue: null,
		error: 'SQL execution is not yet available. Coming soon!'
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
