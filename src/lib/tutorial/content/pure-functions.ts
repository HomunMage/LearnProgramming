// Topic 1: Pure Functions — learn through Excel formulas

import type { Topic } from './types';

export const pureFunctions: Topic = {
	id: 'pure-functions',
	title: 'Pure Functions',
	chapters: [
		{
			id: 'cells-and-values',
			title: 'Cells & Values',
			instruction: `## Welcome! Let's start with the basics.

Look at the spreadsheet above. Each **cell** holds a value — just like in Excel.

**Column A** has some numbers. Try clicking a cell and changing a value.

In programming, values are stored in **variables**. The code below shows how column A looks as a JavaScript array.

Press **Run** to see the output!`,
			initialTable: [
				[1, null, null],
				[2, null, null],
				[3, null, null],
				[4, null, null],
				[5, null, null]
			],
			initialCode: `// Column A is now a variable!
// An array is just a list of values
console.log("A =", A);
console.log("First value:", A[0]);
console.log("Second value:", A[1]);
return A;`,
			language: 'js',
			columnBindings: { A: 0 },
			hints: [
				'Try changing the numbers in column A, then run the code again.',
				'A[0] means "the first item" — computers count from 0, not 1!',
				'An array like [1, 2, 3] is just a list of values, similar to a column in Excel.'
			]
		},
		{
			id: 'simple-formulas',
			title: 'Simple Formulas',
			instruction: `## Formulas = Functions

In Excel, you write \`=A1+3\` to add 3 to a cell. That's a **pure function**:
- Same input → always same output
- No side effects (doesn't change anything else)

Try typing \`=A1+3\` in cell **B1**. Then try \`=A2+3\` in **B2**.

The code below does the **same thing** but for the entire column at once!`,
			initialTable: [
				[10, null, null],
				[20, null, null],
				[30, null, null],
				[40, null, null],
				[50, null, null]
			],
			initialCode: `// A pure function: takes input, returns output
// No side effects — it doesn't change A!
function add3(x) {
  return x + 3;
}

// Apply the function to every value in A
const B = A.map(add3);

console.log("A =", A);
console.log("B =", B);
console.log("add3(10) =", add3(10));
return B;`,
			language: 'js',
			columnBindings: { A: 0 },
			hints: [
				'A pure function is like an Excel formula — =A1+3 always gives the same result for the same A1.',
				"map() applies a function to every item. It's like dragging a formula down in Excel!",
				'Try changing add3 to multiply by 2 instead: return x * 2'
			]
		},
		{
			id: 'compose',
			title: 'Combining Functions',
			instruction: `## Composing Functions

In Excel, you can write \`=A1*2+1\`. That's **two operations** combined.

In programming, you can:
1. Write small functions that each do **one thing**
2. **Compose** them together

Column A has values. The code creates B (doubled) and C (doubled + 1).

Try editing the functions and running the code!`,
			initialTable: [
				[1, null, null],
				[2, null, null],
				[3, null, null],
				[4, null, null],
				[5, null, null]
			],
			initialCode: `// Small functions that do one thing
function double(x) {
  return x * 2;
}

function add1(x) {
  return x + 1;
}

// Compose: apply double, then add1
const B = A.map(double);
const C = B.map(add1);

console.log("A =", A);
console.log("B = A doubled:", B);
console.log("C = B plus 1:", C);

// Or do it in one step:
const D = A.map(x => x * 2 + 1);
console.log("D = same result:", D);
return [B, C];`,
			language: 'js',
			columnBindings: { A: 0 },
			hints: [
				'Each function does one thing. double() doubles, add1() adds 1.',
				'x => x * 2 + 1 is a shorthand function (arrow function). Same idea!',
				'Try composing your own: what about a function that squares a number?'
			]
		}
	]
};
