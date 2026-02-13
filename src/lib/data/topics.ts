// All tutorial topics and chapters — single source of truth
// To add content: append to the chapters array of any topic

import type { Topic } from './types';

export const topics: Topic[] = [
	{
		id: 'pure-functions',
		title: 'Pure Functions',
		chapters: [
			{
				id: 'cells-and-values',
				title: 'Cells & Values',
				description: 'Learn how spreadsheet cells map to variables and arrays.',
				tutorial: `## Welcome! Let's start with the basics.

Look at the spreadsheet above. Each **cell** holds a value — just like in Excel.

**Column A** has some numbers. Try clicking a cell and changing a value.

In programming, values are stored in **variables**. The code below shows how column A looks as a JavaScript array.

Press **Run** to see the output!`,
				table: [
					[1, null, null],
					[2, null, null],
					[3, null, null],
					[4, null, null],
					[5, null, null]
				],
				js: `// Column A is now a variable!
// An array is just a list of values
console.log("A =", A);
console.log("First value:", A[0]);
console.log("Second value:", A[1]);

// B syncs to column B in the spreadsheet
B = A.map(x => x);`,
				py: `# Column A is now a variable!
# A list is just a list of values
print("A =", A)
print("First value:", A[0])
print("Second value:", A[1])`,
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
				description: 'See how Excel formulas are really pure functions.',
				tutorial: `## Formulas = Functions

In Excel, you write \`=A1+3\` to add 3 to a cell. That's a **pure function**:
- Same input → always same output
- No side effects (doesn't change anything else)

Try typing \`=A1+3\` in cell **B1**. Then try \`=A2+3\` in **B2**.

The code below does the **same thing** but for the entire column at once!`,
				table: [
					[10, null, null],
					[20, null, null],
					[30, null, null],
					[40, null, null],
					[50, null, null]
				],
				js: `// A pure function: takes input, returns output
// No side effects — it doesn't change A!
function add3(x) {
  return x + 3;
}

// B syncs to column B in the spreadsheet
B = A.map(add3);

console.log("A =", A);
console.log("B =", B);
console.log("add3(10) =", add3(10));`,
				py: `# A pure function: takes input, returns output
def add3(x):
    return x + 3

# Apply the function to every value in A
B = list(map(add3, A))

print("A =", A)
print("B =", B)
print("add3(10) =", add3(10))`,
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
				description: 'Compose small functions into bigger transformations.',
				tutorial: `## Composing Functions

In Excel, you can write \`=A1*2+1\`. That's **two operations** combined.

In programming, you can:
1. Write small functions that each do **one thing**
2. **Compose** them together

Column A has values. The code creates B (doubled) and C (doubled + 1).

Try editing the functions and running the code!`,
				table: [
					[1, null, null],
					[2, null, null],
					[3, null, null],
					[4, null, null],
					[5, null, null]
				],
				js: `// Small functions that do one thing
function double(x) {
  return x * 2;
}

function add1(x) {
  return x + 1;
}

// B and C sync to spreadsheet columns
B = A.map(double);
C = B.map(add1);

console.log("A =", A);
console.log("B = A doubled:", B);
console.log("C = B plus 1:", C);`,
				py: `# Small functions that do one thing
def double(x):
    return x * 2

def add1(x):
    return x + 1

# Compose: apply double, then add1
B = list(map(double, A))
C = list(map(add1, B))

print("A =", A)
print("B = A doubled:", B)
print("C = B plus 1:", C)

# Or do it in one step:
D = [x * 2 + 1 for x in A]
print("D = same result:", D)`,
				columnBindings: { A: 0 },
				hints: [
					'Each function does one thing. double() doubles, add1() adds 1.',
					'x => x * 2 + 1 is a shorthand function (arrow function). Same idea!',
					'Try composing your own: what about a function that squares a number?'
				]
			}
		]
	},
	{
		id: 'map',
		title: 'Map',
		chapters: [
			{
				id: 'column-formulas',
				title: 'Column Formulas',
				description: 'Map is like dragging an Excel formula down a column.',
				tutorial: `## Map = Dragging a Formula Down

In Excel, when you write a formula in B1 and **drag it down**, you're applying the same formula to every row. That's exactly what \`.map()\` does!

Column A has prices. Let's calculate a 10% tax for each item.

In Excel: \`=A1*0.1\` dragged down.
In code: \`A.map(price => price * 0.1)\``,
				table: [
					[100, null, null],
					[250, null, null],
					[50, null, null],
					[175, null, null],
					[300, null, null]
				],
				js: `// .map() transforms every item in a list
// Like dragging =A1*0.1 down in Excel

// B and C sync to spreadsheet columns
B = A.map(price => price * 0.1);
C = A.map(price => price * 1.1);

console.log("Prices:", A);
console.log("Tax (10%):", B);
console.log("Total:", C);`,
				py: `# map() transforms every item in a list
# Like dragging =A1*0.1 down in Excel

tax = [price * 0.1 for price in A]
total = [price * 1.1 for price in A]

print("Prices:", A)
print("Tax (10%):", tax)
print("Total:", total)`,
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
				description: 'Map works on any data type — text, numbers, anything.',
				tutorial: `## Map Can Transform Anything

Map isn't just for math. You can transform text, convert types, or reshape data.

Column A has names. Let's transform them!`,
				table: [
					['alice', null, null],
					['bob', null, null],
					['charlie', null, null],
					['diana', null, null],
					['eve', null, null]
				],
				js: `// Map can transform any type of data
// Here we transform strings (text)

// B and C sync to spreadsheet columns
B = A.map(name => typeof name === 'string' ? name.toUpperCase() : name);
C = A.map(name => typeof name === 'string' ? name.length : 0);

console.log("Names:", A);
console.log("UPPERCASE:", B);
console.log("Lengths:", C);`,
				py: `# Map can transform any type of data
# Here we transform strings (text)

upper = [name.upper() for name in A]
lengths = [len(name) for name in A]

print("Names:", A)
print("UPPERCASE:", upper)
print("Lengths:", lengths)`,
				columnBindings: { A: 0 },
				hints: [
					".toUpperCase() converts text to ALL CAPS — like Excel's =UPPER(A1)",
					".length gives the number of characters — like Excel's =LEN(A1)",
					'Try adding a greeting: name => "Hello " + name'
				]
			}
		]
	},
	{
		id: 'filter',
		title: 'Filter',
		chapters: [
			{
				id: 'conditions',
				title: 'Conditions',
				description: 'Filter keeps only the rows that match a condition.',
				tutorial: `## Filter = Show Rows Where...

In Excel, you can filter rows to only show certain ones. In programming, \`.filter()\` does the same thing.

Column A has numbers. Let's keep only the ones greater than 30.

Excel: Filter column A, condition "greater than 30"
Code: \`A.filter(x => x > 30)\``,
				table: [
					[10, null, null],
					[45, null, null],
					[20, null, null],
					[60, null, null],
					[35, null, null],
					[5, null, null],
					[50, null, null]
				],
				js: `// .filter() keeps items that pass a test
// Like Excel's filter: "show rows where A > 30"

// B syncs to column B (filtered results)
B = A.filter(x => x > 30);

console.log("All:", A);
console.log("Greater than 30:", B);
console.log("30 or less:", A.filter(x => x <= 30));
console.log("Even numbers:", A.filter(x => x % 2 === 0));`,
				py: `# filter() keeps items that pass a test
# Like Excel's filter: "show rows where A > 30"

big = [x for x in A if x > 30]
small = [x for x in A if x <= 30]
even = [x for x in A if x % 2 == 0]

print("All:", A)
print("Greater than 30:", big)
print("30 or less:", small)
print("Even numbers:", even)`,
				columnBindings: { A: 0 },
				hints: [
					'x => x > 30 is a test: "is x greater than 30?" Returns true or false.',
					'.filter() keeps items where the test returns true, removes the rest.',
					'x % 2 === 0 checks if a number is even (% is the remainder operator).'
				]
			}
		]
	},
	{
		id: 'reduce',
		title: 'Reduce',
		chapters: [
			{
				id: 'aggregation',
				title: 'Aggregation',
				description: 'Reduce combines a whole column into a single value — like SUM.',
				tutorial: `## Reduce = SUM, COUNT, AVERAGE...

In Excel, \`=SUM(A1:A5)\` adds up a whole column into **one number**. That's \`.reduce()\` — it takes a list and reduces it to a single value.

Column A has scores. Let's calculate sum, count, and average.

Try typing \`=SUM(A1:A5)\` in cell B1 in the spreadsheet to see it work there too!`,
				table: [
					[85, null, null],
					[92, null, null],
					[78, null, null],
					[95, null, null],
					[88, null, null]
				],
				js: `// .reduce() combines all values into one
// Like =SUM() in Excel

const sum = A.reduce((total, x) => total + x, 0);
const count = A.length;
const average = sum / count;
const max = A.reduce((best, x) => x > best ? x : best, A[0]);

// B syncs to column B (summary in first cell)
B = [sum, count, average, max, 0];

console.log("Scores:", A);
console.log("Sum:", sum);
console.log("Count:", count);
console.log("Average:", average);
console.log("Highest:", max);`,
				py: `# reduce() combines all values into one
# Like =SUM() in Excel
from functools import reduce

total = reduce(lambda acc, x: acc + x, A, 0)
count = len(A)
average = total / count
highest = reduce(lambda best, x: x if x > best else best, A)

print("Scores:", A)
print("Sum:", total)
print("Count:", count)
print("Average:", average)
print("Highest:", highest)`,
				columnBindings: { A: 0 },
				hints: [
					'reduce((total, x) => total + x, 0) means: start at 0, add each item to the total.',
					'The 0 at the end is the starting value (like starting the sum at zero).',
					'Try: find the minimum score using reduce.'
				]
			}
		]
	}
];
