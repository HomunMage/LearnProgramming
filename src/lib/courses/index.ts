// src/lib/courses/index.ts
// Course registry — all available courses

import type { CourseDefinition } from './types';
import { chapters as functionalChapters } from './functional/chapters';
import { chapters as htmlChapters } from './html/chapters';
import { chapters as frameworksChapters } from './frameworks/chapters';

export const courses: CourseDefinition[] = [
	{
		id: 'functional',
		title: 'Functional Programming',
		description: 'Learn map, filter, reduce with spreadsheets',
		icon: 'f(x)',
		layout: 'spreadsheet',
		chapters: functionalChapters
	},
	{
		id: 'html',
		title: 'HTML & Markdown',
		description: 'Learn HTML and Markdown with live preview',
		icon: '</>',
		layout: 'html-preview',
		chapters: htmlChapters
	},
	{
		id: 'frameworks',
		title: 'Frameworks',
		description: 'Learn React, Vue, and Svelte side by side',
		icon: '⚛',
		layout: 'framework-preview',
		chapters: frameworksChapters
	}
];

export function getCourse(id: string): CourseDefinition | undefined {
	return courses.find((c) => c.id === id);
}
