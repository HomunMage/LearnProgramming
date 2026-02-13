// Topic 2: Map — apply a function to every row

import type { Topic } from './types';

export const mapTopic: Topic = {
	id: 'map',
	title: 'Map',
	chapters: [
		{
			id: 'column-formulas',
			title: 'Column Formulas',
			instruction: `## Map = Dragging a Formula Down

In Excel, when you write a formula in B1 and **drag it down**, you're applying the same formula to every row. That's exactly what \`.map()\` does!

Column A has prices. Let's calculate a 10% tax for each item.

In Excel: \`=A1*0.1\` dragged down.
In code: \`A.map(price => price * 0.1)\``,
			initialTable: [
				[100, null, null],
				[250, null, null],
				[50, null, null],
				[175, null, null],
				[300, null, null]
			],
			initialCode: `// .map() transforms every item in a list
// Like dragging =A1*0.1 down in Excel

const tax = A.map(price => price * 0.1);
const total = A.map(price => price * 1.1);

console.log("Prices:", A);
console.log("Tax (10%):", tax);
console.log("Total:", total);
return [tax, total];`,
			language: 'js',
			columnBindings: { A: 0 },
			hints: [
				'.map() runs a function on every item and creates a new list.',
				'price => price * 0.1 means "take the price, multiply by 0.1".',
				'Try changing the tax rate to 20% (0.2).'
			]
		},
		{
			id: 'transformations',
			title: 'Transformations',
			instruction: `## Map Can Transform Anything

Map isn't just for math. You can transform text, convert types, or reshape data.

Column A has names. Let's transform them!`,
			initialTable: [
				['alice', null, null],
				['bob', null, null],
				['charlie', null, null],
				['diana', null, null],
				['eve', null, null]
			],
			initialCode: `// Map can transform any type of data
// Here we transform strings (text)

const upper = A.map(name => {
  if (typeof name === 'string') {
    return name.toUpperCase();
  }
  return name;
});

const lengths = A.map(name => {
  if (typeof name === 'string') {
    return name.length;
  }
  return 0;
});

console.log("Names:", A);
console.log("UPPERCASE:", upper);
console.log("Lengths:", lengths);
return [upper, lengths];`,
			language: 'js',
			columnBindings: { A: 0 },
			hints: [
				".toUpperCase() converts text to ALL CAPS — like Excel's =UPPER(A1)",
				".length gives the number of characters — like Excel's =LEN(A1)",
				'Try adding a greeting: name => "Hello " + name'
			]
		}
	]
};
