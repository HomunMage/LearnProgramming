// src/lib/courses/html/chapters.ts
// HTML & Markdown course — chapters and sessions

import type { Chapter } from '$lib/data/types';

export const chapters: Chapter[] = [
	{
		id: 'html-basics',
		title: 'HTML Basics',
		sessions: [
			{
				id: 'first-page',
				title: 'Your First Page',
				description: 'Create a basic HTML page with headings and paragraphs.',
				tutorial: `## Your First HTML Page

HTML uses **tags** to structure content. Tags come in pairs: \`<tag>\` opens, \`</tag>\` closes.

The most common tags:
- \`<h1>\` to \`<h6>\` — headings (h1 is biggest)
- \`<p>\` — paragraph
- \`<strong>\` — bold
- \`<em>\` — italic

Press **Run** to see your HTML rendered above!`,
				table: [],
				html: `<h1>Hello World</h1>
<p>This is my first HTML page.</p>
<p>HTML is <strong>easy</strong> to learn!</p>`,
				columnBindings: {},
				hints: [
					'<h1> is the largest heading, <h6> is the smallest.',
					'Every opening tag needs a closing tag: <p>...</p>',
					'Try adding a <h2> subheading below the <h1>.'
				]
			},
			{
				id: 'lists',
				title: 'Lists',
				description: 'Create ordered and unordered lists.',
				tutorial: `## Lists in HTML

Two types of lists:
- \`<ul>\` — **unordered** list (bullet points)
- \`<ol>\` — **ordered** list (numbered)

Each item uses \`<li>\` (list item).

Try switching between \`<ul>\` and \`<ol>\` to see the difference!`,
				table: [],
				html: `<h2>My Favorite Languages</h2>
<ul>
  <li>JavaScript</li>
  <li>Python</li>
  <li>HTML & CSS</li>
</ul>

<h2>Steps to Learn</h2>
<ol>
  <li>Read the tutorial</li>
  <li>Write some code</li>
  <li>Practice daily</li>
</ol>`,
				columnBindings: {},
				hints: [
					'<ul> makes bullet points, <ol> makes numbered lists.',
					'<li> is always inside <ul> or <ol>.',
					'Try nesting a list inside another list!'
				]
			},
			{
				id: 'links-images',
				title: 'Links & Images',
				description: 'Add hyperlinks and images to your page.',
				tutorial: `## Links and Images

- \`<a href="url">\` — creates a clickable link
- \`<img src="url" alt="description">\` — displays an image

The \`href\` and \`src\` are **attributes** — extra info inside the tag.

Note: \`<img>\` is a **self-closing** tag (no \`</img>\` needed).`,
				table: [],
				html: `<h2>Useful Links</h2>
<p>Learn more at <a href="https://developer.mozilla.org">MDN Web Docs</a>.</p>

<h2>An Image</h2>
<img src="https://via.placeholder.com/300x100/1a202c/63b3ed?text=Hello+HTML" alt="Hello HTML banner">

<p>Images use <code>src</code> for the URL and <code>alt</code> for description.</p>`,
				columnBindings: {},
				hints: [
					'href stands for "hypertext reference" — the URL to link to.',
					'alt text describes the image for accessibility.',
					'Try changing the link URL or image source.'
				]
			}
		]
	},
	{
		id: 'markdown-basics',
		title: 'Markdown',
		sessions: [
			{
				id: 'md-intro',
				title: 'Markdown Intro',
				description: 'Write formatted text with simple syntax.',
				tutorial: `## What is Markdown?

Markdown is a **lightweight** way to format text that converts to HTML.

Instead of writing \`<h1>Title</h1>\`, you write \`# Title\`.

It's used everywhere: GitHub READMEs, documentation, chat apps, blogs.

Press **Run** to see your Markdown rendered as HTML!`,
				table: [],
				md: `# Hello Markdown

This is **bold** and this is *italic*.

## A Subheading

Here's a list:
- Item one
- Item two
- Item three

And a [link to MDN](https://developer.mozilla.org).

> This is a blockquote — great for quotes or callouts.`,
				columnBindings: {},
				hints: [
					'# is h1, ## is h2, ### is h3.',
					'**bold** and *italic* are the most common formatting.',
					'Try adding a numbered list: 1. First 2. Second 3. Third'
				]
			},
			{
				id: 'md-code',
				title: 'Code in Markdown',
				description: 'Add inline code and code blocks.',
				tutorial: `## Code in Markdown

Markdown makes it easy to show code:

- Inline: wrap with single backticks \\\`like this\\\`
- Block: wrap with triple backticks

Code blocks can specify a language for syntax highlighting.

This is how documentation and tutorials are written!`,
				table: [],
				md: `# Code Examples

Inline code: Use \`console.log()\` to print output.

## JavaScript Example

\`\`\`javascript
function greet(name) {
  return "Hello, " + name;
}
console.log(greet("World"));
\`\`\`

## Python Example

\`\`\`python
def greet(name):
    return f"Hello, {name}"
print(greet("World"))
\`\`\`

## A Table

| Language | Year | Type |
|----------|------|------|
| JavaScript | 1995 | Dynamic |
| Python | 1991 | Dynamic |
| Rust | 2010 | Static |`,
				columnBindings: {},
				hints: [
					'Single backticks for inline code, triple for blocks.',
					'Add a language name after ``` for syntax highlighting.',
					'Tables use | to separate columns and - for the header line.'
				]
			}
		]
	}
];
