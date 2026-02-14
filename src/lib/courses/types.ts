// src/lib/courses/types.ts
// Course definition — metadata for course registry

import type { Chapter } from '$lib/data/types';

export type CourseLayout = 'spreadsheet' | 'html-preview';

export interface CourseDefinition {
	id: string;
	title: string;
	description: string;
	icon: string;
	layout: CourseLayout;
	chapters: Chapter[];
}
