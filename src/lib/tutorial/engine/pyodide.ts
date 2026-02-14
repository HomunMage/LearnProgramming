// src/lib/tutorial/engine/pyodide.ts
// Pyodide lazy loader — loads Python WASM runtime from CDN on first use

const PYODIDE_VERSION = '0.26.4';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.mjs`;

let instance: any = null;
let loading: Promise<any> | null = null;

export function isPyodideLoaded(): boolean {
	return instance !== null;
}

export async function getPyodide(): Promise<any> {
	if (instance) return instance;
	if (loading) return loading;

	loading = (async () => {
		const mod = await import(/* @vite-ignore */ PYODIDE_CDN);
		instance = await mod.loadPyodide();
		return instance;
	})();

	return loading;
}
