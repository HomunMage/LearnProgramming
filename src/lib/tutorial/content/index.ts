// Tutorial content registry

import type { Topic } from './types';
import { pureFunctions } from './pure-functions';
import { mapTopic } from './map';
import { filterTopic } from './filter';
import { reduceTopic } from './reduce';

export type { Topic, Chapter } from './types';

export const topics: Topic[] = [pureFunctions, mapTopic, filterTopic, reduceTopic];
