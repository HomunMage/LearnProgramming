# LearnProgramming — Tutorial Platform Design

## Core Concept

Teach non-coders programming by bridging **Excel spreadsheets → functional programming**.

People already understand "B column = A column + 3". That IS a pure function.
"Drag the formula down every row" IS `map`. "SUM(A:A)" IS `reduce`. "Show rows where A > 5" IS `filter`.

The app makes this connection explicit: left-top is an interactive spreadsheet, left-bottom shows the equivalent code, and the AI tutor on the right helps explain.

---

## Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  [Pure Functions] [Map] [Filter] [Reduce]    ← Topic Bar        │
│  [Ch.1 Cells] [Ch.2 Formulas] [Ch.3 Compose] ← Chapter Tabs    │
├─────────────────────────────────┬────────────────────────────────┤
│                                 │                                │
│   Interactive Spreadsheet       │       AI Chat Panel            │
│   ┌───┬───┬───┬───┐            │                                │
│   │   │ A │ B │ C │            │  🤖 Welcome! Try typing 3     │
│   │ 1 │ 1 │ 4 │   │            │     in cell A1...             │
│   │ 2 │ 2 │ 5 │   │            │                                │
│   │ 3 │ 3 │ 6 │   │            │  👤 What does =A1+3 mean?     │
│   └───┴───┴───┴───┘            │                                │
│                                 │  🤖 Great question! When you  │
│  ┌─────────────────────────┐    │     write =A1+3, you're       │
│  │ // equivalent code       │    │     creating a pure function  │
│  │ const B = A.map(         │    │     that...                   │
│  │   x => x + 3             │    │                                │
│  │ )                         │    │  ┌────────────────────────┐   │
│  │              [JS▾] [▶Run] │    │  │ Ask anything...        │   │
│  └─────────────────────────┘    │  └────────────────────────┘   │
├─────────────────────────────────┴────────────────────────────────┤
│  Footer                                                          │
└──────────────────────────────────────────────────────────────────┘
```

- **Left top**: Interactive Excel-like grid (editable cells, formulas)
- **Left bottom**: Code editor (JS/Python/SQL) with run button
- **Right**: AI chat session (Gemini, decoupled for swapping)
- **Top**: Topic bar + chapter tabs

---

## Tutorial Content Progression

### Topic 1: Pure Functions (Excel as Calculator)

- **Ch 1 — Cells & Values**: Types (numbers, text), entering data
- **Ch 2 — Simple Formulas**: `=A1+3` → `const add3 = (x) => x + 3` — pure function concept
- **Ch 3 — Referencing**: `=A1+B1` → function composition, multiple inputs

### Topic 2: Map (Apply to Every Row)

- **Ch 1 — Column Formulas**: Drag formula down = `A.map(x => x + 3)`
- **Ch 2 — Transformations**: String ops, type conversion across columns

### Topic 3: Filter (Show Only Some Rows)

- **Ch 1 — Conditions**: `=IF(A1>5,...)` → `.filter(x => x > 5)`
- **Ch 2 — SQL WHERE**: Same data, SQL syntax `SELECT * FROM data WHERE A > 5`

### Topic 4: Reduce (Summarize a Column)

- **Ch 1 — Aggregation**: `=SUM(A:A)`, `=COUNT(...)`, `=AVERAGE(...)` → `.reduce()`
- **Ch 2 — Building Reduce**: Step-by-step accumulator concept

---

## File Structure

```
src/
├── lib/
│   ├── backend/
│   │   └── llm/
│   │       ├── types.ts            # LLMProvider interface, ChatMessage
│   │       ├── gemini.ts           # Google Gemini implementation
│   │       ├── provider.ts         # Factory + active provider state
│   │       └── index.ts            # Re-exports
│   │
│   ├── tutorial/
│   │   ├── content/
│   │   │   ├── types.ts            # Topic, Chapter, Lesson types
│   │   │   ├── index.ts            # Content registry (all topics)
│   │   │   ├── pure-functions.ts   # Topic 1 chapters
│   │   │   ├── map.ts              # Topic 2 chapters
│   │   │   ├── filter.ts           # Topic 3 chapters
│   │   │   └── reduce.ts           # Topic 4 chapters
│   │   │
│   │   └── engine/
│   │       ├── spreadsheet.ts      # Spreadsheet data model + formula eval
│   │       ├── executor.ts         # Code runner (JS in-browser, Python via Pyodide, SQL via sql.js)
│   │       └── bridge.ts           # Table ↔ Code linking (select col → function param)
│   │
│   ├── components/
│   │   ├── TopicBar.svelte         # Horizontal topic navigation
│   │   ├── ChapterTabs.svelte      # Tab strip for chapters
│   │   ├── Spreadsheet.svelte      # Interactive Excel-like grid
│   │   ├── CodeEditor.svelte       # Code editor + language selector + run
│   │   ├── ChatPanel.svelte        # AI chat interface
│   │   └── SettingsModal.svelte    # API key input, preferences
│   │
│   └── stores/
│       ├── tutorial.svelte.ts      # Current topic/chapter state (Svelte 5 runes)
│       └── settings.svelte.ts      # API key, preferences (localStorage-backed)
│
├── routes/
│   ├── +layout.svelte              # Shell: topic bar, footer
│   └── +page.svelte                # Main 3-panel layout
│
└── app.css                         # Tailwind import
```

---

## Key Modules Detail

### 1. LLM Backend (`src/lib/backend/llm/`)

**Decoupled design** — swap Gemini for OpenAI/Anthropic by implementing the interface:

```typescript
// types.ts
interface ChatMessage {
	role: 'user' | 'assistant' | 'system';
	content: string;
}

interface LessonContext {
	topic: string;
	chapter: string;
	tableData: CellData[][];
	currentCode: string;
	language: 'js' | 'python' | 'sql';
}

interface LLMProvider {
	name: string;
	sendMessage(messages: ChatMessage[], context?: LessonContext): Promise<string>;
}
```

```typescript
// gemini.ts — first implementation
class GeminiProvider implements LLMProvider {
	name = 'Gemini';
	constructor(private apiKey: string) {}
	async sendMessage(messages, context?) {
		// Prepend system prompt with lesson context
		// Call Gemini API (generativelanguage.googleapis.com)
		// Return text response
	}
}
```

- API key stored in `localStorage`, entered via SettingsModal
- System prompt includes current lesson context so AI gives relevant help
- Provider is created/swapped at runtime via `provider.ts`

### 2. Spreadsheet Engine (`src/lib/tutorial/engine/spreadsheet.ts`)

Pure TypeScript, no UI:

```typescript
type CellValue = string | number | null;
type CellData = {
	raw: string; // what user typed (e.g. "=A1+3")
	computed: CellValue; // evaluated result (e.g. 4)
	formula: boolean; // starts with "="
};

class SpreadsheetModel {
	cells: CellData[][]; // [row][col]

	setCellRaw(row: number, col: number, raw: string): void;
	evaluate(): void; // recalculate all formulas
	getColumnValues(col: number): CellValue[];
	toArray(): CellValue[][]; // plain values for code execution
}
```

Formula evaluation:

- Parse `=A1+3` style references
- Support basic ops: `+`, `-`, `*`, `/`
- Support basic functions: `SUM()`, `COUNT()`, `AVERAGE()`, `IF()`
- Dependency-order evaluation (topological sort on cell refs)

### 3. Code Executor (`src/lib/tutorial/engine/executor.ts`)

```typescript
interface ExecutionResult {
	output: string; // stdout
	returnValue: unknown; // last expression value
	error: string | null;
	tableUpdate?: CellValue[][]; // if code returns array, update table
}

async function executeJS(
	code: string,
	inputs: Record<string, CellValue[]>
): Promise<ExecutionResult>;
async function executePython(
	code: string,
	inputs: Record<string, CellValue[]>
): Promise<ExecutionResult>;
async function executeSQL(code: string, tableData: CellValue[][]): Promise<ExecutionResult>;
```

- **JS**: `new Function()` in try/catch — inputs injected as variables (e.g. `const A = [1,2,3]`)
- **Python**: Pyodide (loaded from CDN on first use, lazy)
- **SQL**: sql.js (SQLite WASM, loaded from CDN on first use, lazy)
- Table ↔ Code bridge: selected columns become named inputs; return arrays update table columns

### 4. Tutorial Content (`src/lib/tutorial/content/`)

Each chapter defines:

```typescript
interface Chapter {
	id: string;
	title: string;
	instruction: string; // markdown lesson text (shown in chat as system intro)
	initialTable: CellValue[][]; // starting spreadsheet data
	initialCode: string; // starter code in editor
	language: 'js' | 'python' | 'sql';
	columnBindings: Record<string, number>; // e.g. { A: 0, B: 1 } — which cols are inputs
	hints: string[]; // progressive hints for AI tutor
	validation?: (table: CellValue[][], output: string) => boolean; // check if user solved it
}

interface Topic {
	id: string;
	title: string;
	icon: string;
	chapters: Chapter[];
}
```

### 5. Svelte Components

All components are **UI-only**, calling lib functions:

- **TopicBar**: Renders topic buttons, highlights active, emits `ontopicchange`
- **ChapterTabs**: Renders chapter tabs for active topic, emits `onchapterchange`
- **Spreadsheet**: Renders grid from `SpreadsheetModel`, handles cell editing, emits changes
- **CodeEditor**: `<textarea>` with monospace font (upgrade to CodeMirror later), language dropdown, Run button
- **ChatPanel**: Message list + input, calls `LLMProvider.sendMessage()`, auto-includes lesson context

---

## New Dependencies

| Package                                                                                           | Purpose                          | Size            |
| ------------------------------------------------------------------------------------------------- | -------------------------------- | --------------- |
| `sql.js`                                                                                          | SQLite in WASM for SQL execution | ~1MB WASM (CDN) |
| `codemirror` + `@codemirror/lang-javascript` + `@codemirror/lang-python` + `@codemirror/lang-sql` | Code editor                      | ~150KB          |

- **Pyodide**: Loaded from CDN (`cdn.jsdelivr.net/pyodide/`), no npm install needed — ~6MB WASM loaded lazily on first Python execution
- **sql.js**: WASM loaded from CDN lazily on first SQL execution
- Remove unused deps: `luxon`, `uuid`

---

## Implementation Phases

### Phase 1 — Skeleton + JS execution (this session)

1. Clean up: remove old checker code, update package.json name
2. Create layout: TopicBar, ChapterTabs, 3-panel grid
3. Build SpreadsheetModel + Spreadsheet component (basic grid, formula eval)
4. Build CodeEditor + JS executor (textarea, run button, output)
5. Build table ↔ code bridge (column → variable binding)
6. Build LLM types + Gemini provider + ChatPanel
7. Build settings (API key input in localStorage)
8. Create Topic 1 content (Pure Functions, 3 chapters)
9. Wire it all together on +page.svelte
10. Verify: `npm run lint` + `npm run build`

### Phase 2 — Python + SQL (future)

- Add Pyodide lazy loader
- Add sql.js lazy loader
- Add Topic 2-4 content

### Phase 3 — Polish (future)

- CodeMirror upgrade from textarea
- Progress tracking (localStorage)
- Mobile responsive layout
- More topics
