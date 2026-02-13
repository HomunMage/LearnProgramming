// Topic 3: Filter — show only rows matching a condition

import type { Topic } from './types';

export const filterTopic: Topic = {
	id: 'filter',
	title: 'Filter',
	chapters: [
		{
			id: 'conditions',
			title: 'Conditions',
			instruction: `## Filter = Show Rows Where...

In Excel, you can filter rows to only show certain ones. In programming, \`.filter()\` does the same thing.

Column A has numbers. Let's keep only the ones greater than 30.

Excel: Filter column A, condition "greater than 30"
Code: \`A.filter(x => x > 30)\``,
			initialTable: [
				[10, null, null],
				[45, null, null],
				[20, null, null],
				[60, null, null],
				[35, null, null],
				[5, null, null],
				[50, null, null]
			],
			initialCode: `// .filter() keeps items that pass a test
// Like Excel's filter: "show rows where A > 30"

const big = A.filter(x => x > 30);
const small = A.filter(x => x <= 30);
const even = A.filter(x => x % 2 === 0);

console.log("All:", A);
console.log("Greater than 30:", big);
console.log("30 or less:", small);
console.log("Even numbers:", even);
return big;`,
			language: 'js',
			columnBindings: { A: 0 },
			hints: [
				'x => x > 30 is a test: "is x greater than 30?" Returns true or false.',
				'.filter() keeps items where the test returns true, removes the rest.',
				'x % 2 === 0 checks if a number is even (% is the remainder operator).'
			]
		}
	]
};
