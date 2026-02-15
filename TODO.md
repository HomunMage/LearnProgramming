---

## T-FEAT-05: Copy Code & Reset Code Buttons

**Priority:** Medium | **Size:** Small | **Sources:** plan/6

**Problem:** No way to copy code to clipboard or reset to original starter code after editing.

### Implementation

1. Add "Copy" button to `CodeEditor.svelte` toolbar (`navigator.clipboard.writeText()`)
2. Add "Reset" button that restores original session code for current language
3. Store original code reference in tutorial store
4. Confirmation dialog for reset

---

## T-FEAT-06: Shareable URLs / Deep Links

**Priority:** Low | **Size:** Small | **Sources:** plan/5

**Problem:** No URL params for current chapter/session. Can't share "go to Filter > Conditions".

### Implementation

1. Add URL params: `/course/functional?chapter=filter&session=conditions`
2. Parse on page load, navigate to correct chapter/session
3. Update URL on navigation (`replaceState`)
4. Share button copies current URL

---


---

## T-FEAT-08: Playground / Free-Code Mode

**Priority:** Low | **Size:** Small | **Sources:** plan/2

**Problem:** Students can only code within structured sessions. No sandbox for free experimentation.

### Implementation

Add a "Playground" entry in NavMenu with blank spreadsheet, empty code editor, all languages available, AI tutor still accessible.

---

## T-REFACTOR-03: Extract Content to JSON/Markdown Files

**Priority:** Low | **Size:** Large | **Sources:** plan/4

**Problem:** All course content is hardcoded in TypeScript files (`chapters.ts`, totaling ~1200 lines). Adding/editing content requires TypeScript knowledge and a rebuild.

### Architecture

```
src/lib/courses/content/
├── functional/
│   ├── course.json           # Course metadata
│   ├── pure-functions/
│   │   ├── chapter.json      # Chapter metadata + session order
│   │   ├── raw-calculus/
│   │   │   ├── session.json  # Session metadata, table, hints
│   │   │   ├── tutorial.md   # Lesson text
│   │   │   ├── code.js       # JS example
│   │   │   └── code.py       # Python example
│   │   └── ...
│   └── ...
├── html/...
└── frameworks/...

```



## T-REFACTOR-04: Improve AI Tutor System Prompt

**Priority:** Medium | **Size:** Small | **Sources:** plans/2,5

**Problem:** The Gemini system prompt is generic. Doesn't instruct the AI on pedagogy, doesn't include hints, doesn't reference the session's challenge.

### Implementation

1. Update system prompt in `gemini.ts` to include:
   - "The student is a non-programmer learning through Excel/Word metaphors"
   - "Always relate concepts back to spreadsheet equivalents"
   - "Use simple language, avoid jargon"
   - "Give hints before giving answers (Socratic method)"
2. Include session's `hints` array in system prompt
3. Include `description` and any `challenge.prompt` in context
4. Add session difficulty level so AI adjusts language complexity

### Files

- `src/lib/backend/llm/gemini.ts` — update system prompt construction
- `src/lib/backend/llm/types.ts` — add `hints` to `LessonContext`
