<!-- src/lib/components/HtmlPreview.svelte -->
<script lang="ts">
	let {
		html,
		title = 'Preview'
	}: {
		html: string;
		title?: string;
	} = $props();

	let srcdoc = $derived(
		`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
body { font-family: system-ui, sans-serif; padding: 1rem; margin: 0; color: #e2e8f0; background: #1a202c; }
h1, h2, h3, h4, h5, h6 { color: #63b3ed; margin-top: 1rem; }
a { color: #90cdf4; }
code { background: #2d3748; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875em; }
pre { background: #2d3748; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
pre code { background: none; padding: 0; }
blockquote { border-left: 3px solid #4a5568; margin-left: 0; padding-left: 1rem; color: #a0aec0; }
table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #4a5568; padding: 0.5rem; text-align: left; }
th { background: #2d3748; }
img { max-width: 100%; height: auto; }
ul, ol { padding-left: 1.5rem; }
hr { border: none; border-top: 1px solid #4a5568; margin: 1rem 0; }
</style>
</head>
<body>${html}</body>
</html>`
	);
</script>

<div data-testid="html-preview" class="flex h-full flex-col rounded border border-gray-700">
	<div class="border-b border-gray-700 bg-gray-800 px-3 py-2">
		<span class="text-sm font-medium text-gray-300">{title}</span>
	</div>
	<iframe {srcdoc} sandbox="allow-scripts" class="flex-1 rounded-b bg-gray-950" title="HTML Preview"
	></iframe>
</div>
