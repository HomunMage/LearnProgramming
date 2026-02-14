// src/lib/courses/functional/chapters.ts
// Functional programming course — chapters and sessions
// To add content: append to the sessions array of any chapter

import type { Chapter } from '$lib/data/types';

export const chapters: Chapter[] = [
	{
		id: 'pure-functions',
		title: 'Pure Functions',
		sessions: [
			{
				id: 'raw-calculus',
				title: 'Raw Calculus',
				description: 'Do math directly — no functions, no abstractions, just operations.',
				tutorial: `## Raw Calculus — Just Do the Math

Before learning functions, let's just **calculate directly**.

In Excel, you type numbers and formulas like \`=A1*2\`. In code, you do the same with operators: \`+\`, \`-\`, \`*\`, \`/\`.

Column A has numbers. The code reads them and computes results using raw operations — no functions needed!

Press **Run** to see it work.`,
				table: [
					[10, null, null],
					[20, null, null],
					[30, null, null],
					[40, null, null],
					[50, null, null]
				],
				js: `// Raw calculus — just operators, no functions
B = [];
C = [];
for (let i = 0; i < A.length; i++) {
  B.push(A[i] + 3);
  C.push(A[i] * 2);
}

console.log("A =", A);
console.log("B = A+3:", B);
console.log("C = A*2:", C);
console.log("Sum =", A.reduce((s, x) => s + x, 0));`,
				py: `# --- Python: raw loops ---
B = []
C = []
for x in A:
    B.append(x + 3)
    C.append(x * 2)
print("Python:", B, C)

# --- NumPy: raw operators ---
import numpy as np
a = np.array(A)
B = (a + 3).tolist()
C = (a * 2).tolist()
print("NumPy: ", B, C)
print("Sum:", np.sum(a), "Mean:", np.mean(a))

# --- Polars: raw expressions ---
import polars as pl
df = pl.DataFrame({"A": A}).with_columns(
    (pl.col("A") + 3).alias("B"),
    (pl.col("A") * 2).alias("C"),
)
print("Polars:\\n", df)
B = df["B"].to_list()
C = df["C"].to_list()`,
				columnBindings: { A: 0 },
				hints: [
					'Operators like + - * / work the same in Excel, JS, and Python.',
					'A loop goes through each value one at a time — NumPy and Polars do it all at once!',
					'Try changing the operations: what about A[i] ** 2 (squaring)?'
				]
			},
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
				py: `# --- Python: lists ---
print("A =", A)
print("First:", A[0], "Second:", A[1])

# --- NumPy: arrays ---
import numpy as np
a = np.array(A)
print("\\nnp.array:", a)
print("Sum:", np.sum(a), "Mean:", np.mean(a))

# --- Polars: DataFrames ---
import polars as pl
df = pl.DataFrame({"A": A})
print("\\n", df)`,
				columnBindings: { A: 0 },
				hints: [
					'Try changing the numbers in column A, then run the code again.',
					'A[0] means "the first item" — computers count from 0, not 1!',
					'An array like [1, 2, 3] is just a list of values, similar to a column in Excel.'
				]
			},
			{
				id: 'functions',
				title: 'Functions',
				description: 'Named functions — the building blocks of pure code.',
				tutorial: `## Formulas = Functions

In Excel, \`=A1+3\` always gives the same result for the same input. That's a **pure function**:
- Same input → always same output
- No side effects (doesn't change anything else)

A **named function** uses \`function\` (JS) or \`def\` (Python) to give it a name you can reuse.

Try typing \`=A1+3\` in cell **B1**. Then run the code to do the same thing for the whole column!`,
				table: [
					[10, null, null],
					[20, null, null],
					[30, null, null],
					[40, null, null],
					[50, null, null]
				],
				js: `// A named function: reusable, testable
function add3(x) {
  return x + 3;
}

function double(x) {
  return x * 2;
}

B = A.map(add3);
C = A.map(double);

console.log("A =", A);
console.log("B = add3:", B);
console.log("C = double:", C);
console.log("add3(10) =", add3(10));`,
				py: `# --- Python: def ---
def add3(x):
    return x + 3
def double(x):
    return x * 2
B = list(map(add3, A))
C = list(map(double, A))
print("Python:", B, C)

# --- NumPy: vectorized ---
import numpy as np
a = np.array(A)
B = (a + 3).tolist()
C = (a * 2).tolist()
print("NumPy: ", B, C)

# --- Polars: expressions ---
import polars as pl
df = pl.DataFrame({"A": A}).with_columns(
    (pl.col("A") + 3).alias("B"),
    (pl.col("A") * 2).alias("C"),
)
print("Polars:\\n", df)
B = df["B"].to_list()
C = df["C"].to_list()`,
				columnBindings: { A: 0 },
				hints: [
					'A pure function is like an Excel formula — =A1+3 always gives the same result for the same A1.',
					"map() applies a function to every item. It's like dragging a formula down in Excel!",
					'Try writing your own function: what about multiply by 10?'
				]
			},
			{
				id: 'lambda',
				title: 'Lambda',
				description: 'Anonymous functions — quick one-liners without a name.',
				tutorial: `## Lambda = Anonymous Functions

Sometimes you need a tiny function just once. Instead of naming it, use a **lambda** (anonymous function):

- **JS:** \`x => x + 3\` (arrow function)
- **Python:** \`lambda x: x + 3\`

Lambdas are perfect for quick transformations inside \`.map()\`, \`.filter()\`, etc.

They do the **exact same thing** as named functions — just shorter!`,
				table: [
					[10, null, null],
					[20, null, null],
					[30, null, null],
					[40, null, null],
					[50, null, null]
				],
				js: `// Arrow functions: x => expression
B = A.map(x => x + 3);
C = A.map(x => x * 2);

console.log("A =", A);
console.log("B = x+3:", B);
console.log("C = x*2:", C);

// Compose lambdas: chain .map() calls
D = A.map(x => x * 2).map(x => x + 1);
console.log("D = x*2+1:", D);`,
				py: `# --- Python: lambda ---
B = list(map(lambda x: x + 3, A))
C = list(map(lambda x: x * 2, A))
print("Python:", B, C)

# --- NumPy: no lambda needed ---
import numpy as np
a = np.array(A)
B = (a + 3).tolist()
C = (a * 2).tolist()
print("NumPy: ", B, C)

# --- Polars: expressions are like lambdas ---
import polars as pl
df = pl.DataFrame({"A": A}).with_columns(
    (pl.col("A") + 3).alias("B"),
    (pl.col("A") * 2).alias("C"),
)
print("Polars:\\n", df)
B = df["B"].to_list()
C = df["C"].to_list()`,
				columnBindings: { A: 0 },
				hints: [
					'x => x + 3 and lambda x: x + 3 are the same idea — a function without a name.',
					'Use lambdas for short, one-time operations. Use def/function for reusable logic.',
					"In NumPy/Polars, you often don't need lambdas — vectorized expressions are even shorter!"
				]
			},
			{
				id: 'compose',
				title: 'Combining Functions',
				description: 'Compose small functions into bigger transformations.',
				tutorial: `## Composing Functions

In Excel, you can write \`=A1*2+1\`. That's **two operations** combined.

In programming, you can:
1. Write small functions (named or lambda) that each do **one thing**
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
				js: `// Compose named functions
function double(x) { return x * 2; }
function add1(x) { return x + 1; }

B = A.map(double);
C = B.map(add1);

console.log("B = double:", B);
console.log("C = double+1:", C);

// Or compose with arrow functions
D = A.map(x => x * 2 + 1);
console.log("D = same:", D);`,
				py: `# --- Python: compose def + lambda ---
def double(x): return x * 2
B = list(map(double, A))
C = list(map(lambda x: x + 1, B))
print("Python:", B, C)

# --- NumPy: chain operations ---
import numpy as np
a = np.array(A)
B = (a * 2).tolist()
C = (a * 2 + 1).tolist()
print("NumPy: ", B, C)

# --- Polars: expression chain ---
import polars as pl
df = pl.DataFrame({"A": A}).with_columns(
    (pl.col("A") * 2).alias("B"),
    (pl.col("A") * 2 + 1).alias("C"),
)
print("Polars:\\n", df)
B = df["B"].to_list()
C = df["C"].to_list()`,
				columnBindings: { A: 0 },
				hints: [
					'Each function does one thing. double() doubles, add1() adds 1.',
					'Composition means applying one function after another — like a pipeline.',
					'Try composing your own: what about a function that squares a number?'
				]
			}
		]
	},
	{
		id: 'map',
		title: 'Map',
		sessions: [
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
				py: `# --- Python: list comprehension ---
B = [p * 0.1 for p in A]
C = [p * 1.1 for p in A]
print("Python - Tax:", B)

# --- NumPy: vectorized ---
import numpy as np
a = np.array(A)
B = (a * 0.1).tolist()
C = (a * 1.1).tolist()
print("NumPy  - Tax:", B)

# --- Polars: expressions ---
import polars as pl
df = pl.DataFrame({"A": A}).with_columns(
    (pl.col("A") * 0.1).alias("Tax"),
    (pl.col("A") * 1.1).alias("Total"),
)
print("Polars:\\n", df)
B = df["Tax"].to_list()
C = df["Total"].to_list()`,
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
				py: `# --- Python: list comprehension ---
B = [name.upper() for name in A]
C = [len(name) for name in A]
print("Python:", B, C)

# --- NumPy: np.char ---
import numpy as np
a = np.array(A)
B = np.char.upper(a).tolist()
C = np.char.str_len(a).tolist()
print("NumPy: ", B, C)

# --- Polars: string expressions ---
import polars as pl
df = pl.DataFrame({"A": A}).with_columns(
    pl.col("A").str.to_uppercase().alias("B"),
    pl.col("A").str.len_chars().alias("C"),
)
print("Polars:\\n", df)
B = df["B"].to_list()
C = df["C"].to_list()`,
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
		sessions: [
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
				py: `# --- Python: list comprehension ---
big = [x for x in A if x > 30]
even = [x for x in A if x % 2 == 0]
print("Python >30:", big, "Even:", even)

# --- NumPy: boolean indexing ---
import numpy as np
a = np.array(A)
big = a[a > 30].tolist()
even = a[a % 2 == 0].tolist()
print("NumPy  >30:", big, "Even:", even)

# --- Polars: .filter() ---
import polars as pl
df = pl.DataFrame({"A": A})
print("Polars >30:\\n", df.filter(pl.col("A") > 30))
print("Polars even:\\n", df.filter(pl.col("A") % 2 == 0))
B = df.filter(pl.col("A") > 30)["A"].to_list()`,
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
		sessions: [
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
				py: `# --- Python: builtins ---
from functools import reduce
total = sum(A)
avg = total / len(A)
highest = max(A)
print("Python - Sum:", total, "Avg:", avg, "Max:", highest)

# --- NumPy: aggregation ---
import numpy as np
a = np.array(A)
print("NumPy  - Sum:", np.sum(a), "Mean:", np.mean(a), "Max:", np.max(a))

# --- Polars: aggregation ---
import polars as pl
df = pl.DataFrame({"A": A})
stats = df.select(
    pl.col("A").sum().alias("sum"),
    pl.col("A").mean().alias("mean"),
    pl.col("A").max().alias("max"),
)
print("Polars:\\n", stats)`,
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
