// src/lib/tutorial/engine/framework.ts
// Builds self-contained HTML pages that run React, Vue, or Svelte code in an iframe.

const DARK_STYLES = `
body { font-family: system-ui, sans-serif; padding: 1rem; margin: 0; color: #e2e8f0; background: #1a202c; }
h1, h2, h3, h4, h5, h6 { color: #63b3ed; margin-top: 1rem; }
a { color: #90cdf4; }
button { padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid #4a5568; background: #2d3748; color: #e2e8f0; cursor: pointer; font-size: 0.875rem; }
button:hover { background: #4a5568; }
input, select, textarea { padding: 0.375rem 0.5rem; border-radius: 0.25rem; border: 1px solid #4a5568; background: #2d3748; color: #e2e8f0; font-size: 0.875rem; }
pre { background: #2d3748; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
code { background: #2d3748; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875em; }
ul, ol { padding-left: 1.5rem; }
.error { color: #fc8181; white-space: pre-wrap; font-family: monospace; font-size: 0.875rem; }
`;

// Closing script tag split to avoid parser issues in srcdoc
const CS = '</' + 'script>';

/** Encode code as a JS string literal safe for embedding inside <script> tags.
 *  JSON.stringify handles quotes/newlines; replacing < with \x3c prevents
 *  the HTML parser from seeing </script> and closing the outer script tag. */
function safeJsStringLiteral(code: string): string {
	return JSON.stringify(code).replace(/</g, '\\x3c');
}

function buildReactHtml(code: string): string {
	return (
		`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${DARK_STYLES}</style>
<script src="https://unpkg.com/react@18/umd/react.development.js">` +
		CS +
		`
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js">` +
		CS +
		`
<script src="https://unpkg.com/@babel/standalone/babel.min.js">` +
		CS +
		`
</head>
<body>
<div id="root"></div>
<script type="text/babel" data-type="module">
${code}
` +
		CS +
		`
</body>
</html>`
	);
}

function buildVueHtml(code: string): string {
	return (
		`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${DARK_STYLES}</style>
<script src="https://unpkg.com/vue@3/dist/vue.global.js">` +
		CS +
		`
</head>
<body>
<div id="app"></div>
<script>
${code}
` +
		CS +
		`
</body>
</html>`
	);
}

function buildSvelteHtml(code: string): string {
	// Encode source as a safe JS string literal (no </script> leaking to HTML parser)
	const encoded = safeJsStringLiteral(code);
	return (
		`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${DARK_STYLES}</style>
</head>
<body>
<div id="app"></div>
<script type="module">
async function run() {
  const target = document.getElementById('app');
  try {
    const code = ${encoded};
    const { compile } = await import('https://esm.sh/svelte@5/compiler');
    const result = compile(code, {
      generate: 'client',
      css: 'injected',
      name: 'App'
    });

    let jsCode = result.js.code;
    jsCode = jsCode.replace(/['"]svelte\\/([^'"]+)['"]/g, '"https://esm.sh/svelte@5/$1"');
    jsCode = jsCode.replace(/['"]svelte['"]/g, '"https://esm.sh/svelte@5"');

    const blob = new Blob([jsCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const mod = await import(url);
    URL.revokeObjectURL(url);

    const { mount } = await import('https://esm.sh/svelte@5');
    mount(mod.default, { target });
  } catch (err) {
    target.innerHTML = '\\x3cpre class="error">' + err.message + '\\x3c/pre>';
  }
}
run();
` +
		CS +
		`
</body>
</html>`
	);
}

function buildVanillaHtml(code: string): string {
	return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>${DARK_STYLES}</style>
</head>
<body>
${code}
</body>
</html>`;
}

export type FrameworkType = 'html' | 'jsx' | 'vue' | 'svelte';

export function buildFrameworkHtml(code: string, framework: FrameworkType): string {
	switch (framework) {
		case 'html':
			return buildVanillaHtml(code);
		case 'jsx':
			return buildReactHtml(code);
		case 'vue':
			return buildVueHtml(code);
		case 'svelte':
			return buildSvelteHtml(code);
	}
}
