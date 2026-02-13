// Topic 4: Reduce — summarize a column into one value

import type { Topic } from './types';

export const reduceTopic: Topic = {
	id: 'reduce',
	title: 'Reduce',
	chapters: [
		{
			id: 'aggregation',
			title: 'Aggregation',
			instruction: `## Reduce = SUM, COUNT, AVERAGE...

In Excel, \`=SUM(A1:A5)\` adds up a whole column into **one number**. That's \`.reduce()\` — it takes a list and reduces it to a single value.

Column A has scores. Let's calculate sum, count, and average.

Try typing \`=SUM(A1:A5)\` in cell B1 in the spreadsheet to see it work there too!`,
			initialTable: [
				[85, null, null],
				[92, null, null],
				[78, null, null],
				[95, null, null],
				[88, null, null]
			],
			initialCode: `// .reduce() combines all values into one
// Like =SUM() in Excel

const sum = A.reduce((total, x) => total + x, 0);
const count = A.length;
const average = sum / count;
const max = A.reduce((best, x) => x > best ? x : best, A[0]);

console.log("Scores:", A);
console.log("Sum:", sum);
console.log("Count:", count);
console.log("Average:", average);
console.log("Highest:", max);
return sum;`,
			language: 'js',
			columnBindings: { A: 0 },
			hints: [
				'reduce((total, x) => total + x, 0) means: start at 0, add each item to the total.',
				'The 0 at the end is the starting value (like starting the sum at zero).',
				'Try: find the minimum score using reduce.'
			]
		}
	]
};
