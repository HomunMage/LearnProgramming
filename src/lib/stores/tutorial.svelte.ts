// Tutorial navigation state — Svelte 5 runes

import { topics } from '$lib/tutorial/content';
import type { Topic, Chapter } from '$lib/tutorial/content';

let currentTopicIndex = $state(0);
let currentChapterIndex = $state(0);

export const tutorial = {
	get topics(): Topic[] {
		return topics;
	},
	get topicIndex() {
		return currentTopicIndex;
	},
	set topicIndex(i: number) {
		currentTopicIndex = i;
		currentChapterIndex = 0;
	},
	get chapterIndex() {
		return currentChapterIndex;
	},
	set chapterIndex(i: number) {
		currentChapterIndex = i;
	},
	get currentTopic(): Topic {
		return topics[currentTopicIndex];
	},
	get currentChapter(): Chapter {
		return topics[currentTopicIndex].chapters[currentChapterIndex];
	}
};
