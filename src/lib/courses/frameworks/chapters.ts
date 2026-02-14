// src/lib/courses/frameworks/chapters.ts
// Frameworks course — same concept in Vanilla, React, Vue, Svelte (switch via language dropdown)

import type { Chapter } from '$lib/data/types';

export const chapters: Chapter[] = [
	{
		id: 'counter',
		title: 'Counter',
		sessions: [
			{
				id: 'counter',
				title: 'Click Counter',
				description: 'A button that increments a counter — the hello world of frameworks.',
				tutorial: `## Counter

The simplest interactive example: a button that increments a number.

Switch between **Vanilla**, **React**, **Vue**, and **Svelte** to compare.

| Concept | Vanilla | React | Vue | Svelte |
|---------|---------|-------|-----|--------|
| State | variable | \`useState(0)\` | \`ref(0)\` | \`$state(0)\` |
| Update | manual DOM | \`setCount()\` | \`count.value++\` | \`count++\` |
| Event | \`addEventListener\` | \`onClick={fn}\` | \`@click="fn"\` | \`onclick={fn}\` |`,
				table: [],
				html: `<h1>Vanilla Counter</h1>
<h2 id="display">Count: 0</h2>
<button id="btn">Click me</button>

<script>
  let count = 0;
  const display = document.getElementById('display');
  const btn = document.getElementById('btn');

  btn.addEventListener('click', () => {
    count++;
    display.textContent = 'Count: ' + count;
  });
</script>`,
				jsx: `function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>React Counter</h1>
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
				vue: `const { createApp, ref } = Vue;

const app = createApp({
  setup() {
    const count = ref(0);
    return { count };
  },
  template: \`
    <div>
      <h1>Vue Counter</h1>
      <h2>Count: {{ count }}</h2>
      <button @click="count++">Click me</button>
    </div>
  \`
});

app.mount('#app');`,
				svelte: `<script>
  let count = $state(0);
</script>

<h1>Svelte Counter</h1>
<h2>Count: {count}</h2>
<button onclick={() => count++}>Click me</button>`,
				columnBindings: {},
				hints: [
					'Vanilla: you must manually update the DOM with textContent or innerHTML.',
					'React: useState returns [value, setter]. Call setter to update.',
					'Vue/Svelte: reactive state auto-updates the template.'
				]
			}
		]
	},
	{
		id: 'for-each',
		title: 'For Each',
		sessions: [
			{
				id: 'list-render',
				title: 'List Rendering',
				description: 'Render a list of items from an array.',
				tutorial: `## For Each

Rendering lists is fundamental. Each approach is different:

| Approach | Syntax | Notes |
|----------|--------|-------|
| Vanilla | \`forEach\` + DOM API | Manual element creation |
| React | \`.map()\` | Returns JSX array |
| Vue | \`v-for\` | Template directive |
| Svelte | \`{#each}\` | Template block |

Vanilla requires manual DOM manipulation. Frameworks handle it declaratively.`,
				table: [],
				html: `<h1>Shopping List</h1>
<ul id="list"></ul>

<script>
  const items = ['Apple', 'Banana', 'Cherry', 'Durian'];
  const list = document.getElementById('list');

  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
</script>`,
				jsx: `function App() {
  const items = ['Apple', 'Banana', 'Cherry', 'Durian'];

  return (
    <div>
      <h1>Shopping List</h1>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
				vue: `const { createApp } = Vue;

const app = createApp({
  setup() {
    const items = ['Apple', 'Banana', 'Cherry', 'Durian'];
    return { items };
  },
  template: \`
    <div>
      <h1>Shopping List</h1>
      <ul>
        <li v-for="(item, i) in items" :key="i">{{ item }}</li>
      </ul>
    </div>
  \`
});

app.mount('#app');`,
				svelte: `<script>
  const items = ['Apple', 'Banana', 'Cherry', 'Durian'];
</script>

<h1>Shopping List</h1>
<ul>
  {#each items as item}
    <li>{item}</li>
  {/each}
</ul>`,
				columnBindings: {},
				hints: [
					'Vanilla: createElement + appendChild is verbose but explicit.',
					'React: .map() returns JSX elements. key helps track items.',
					'Vue/Svelte: template directives handle the loop declaratively.'
				]
			}
		]
	},
	{
		id: 'reactivity',
		title: 'Reactivity',
		sessions: [
			{
				id: 'reactive-state',
				title: 'Reactive State',
				description: 'Compare how each approach handles reactive state.',
				tutorial: `## Reactivity

How does the UI stay in sync with data?

| Approach | State | Derived/Computed |
|----------|-------|-----------------|
| Vanilla | variable + manual DOM | compute yourself |
| React | \`useState\` + re-render | \`useMemo\` |
| Vue | \`ref()\` signals | \`computed()\` |
| Svelte | \`$state()\` runes | \`$derived()\` |

**Vanilla** requires manually updating every DOM node. Frameworks automate this.`,
				table: [],
				html: `<h1>Vanilla Reactivity</h1>

<h2 id="counter">Count: 0 (doubled: 0)</h2>
<button id="add">+ Add</button>
<button id="sub">- Subtract</button>

<hr>

<h2>Two-way Binding</h2>
<input id="nameInput" value="World" placeholder="Type your name" />
<p>Hello, <strong id="nameDisplay">World</strong>!</p>

<script>
  let count = 0;
  const counter = document.getElementById('counter');
  const nameInput = document.getElementById('nameInput');
  const nameDisplay = document.getElementById('nameDisplay');

  function updateCounter() {
    counter.textContent = 'Count: ' + count + ' (doubled: ' + (count * 2) + ')';
  }

  document.getElementById('add').addEventListener('click', () => {
    count++;
    updateCounter();
  });

  document.getElementById('sub').addEventListener('click', () => {
    count--;
    updateCounter();
  });

  nameInput.addEventListener('input', (e) => {
    nameDisplay.textContent = e.target.value;
  });
</script>`,
				jsx: `function App() {
  const [count, setCount] = React.useState(0);
  const doubled = React.useMemo(() => count * 2, [count]);
  const [name, setName] = React.useState('World');

  return (
    <div>
      <h1>React Reactivity</h1>

      <h2>Count: {count} (doubled: {doubled})</h2>
      <button onClick={() => setCount(count + 1)}>+ Add</button>
      <button onClick={() => setCount(count - 1)}>- Subtract</button>

      <hr />

      <h2>Two-way Binding</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type your name" />
      <p>Hello, <strong>{name}</strong>!</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
				vue: `const { createApp, ref, computed } = Vue;

const app = createApp({
  setup() {
    const count = ref(0);
    const doubled = computed(() => count.value * 2);
    const name = ref('World');

    return { count, doubled, name };
  },
  template: \`
    <div>
      <h1>Vue Reactivity</h1>

      <h2>Count: {{ count }} (doubled: {{ doubled }})</h2>
      <button @click="count++">+ Add</button>
      <button @click="count--">- Subtract</button>

      <hr>

      <h2>Two-way Binding</h2>
      <input v-model="name" placeholder="Type your name" />
      <p>Hello, <strong>{{ name }}</strong>!</p>
    </div>
  \`
});

app.mount('#app');`,
				svelte: `<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  let name = $state('World');
</script>

<h1>Svelte Reactivity</h1>

<h2>Count: {count} (doubled: {doubled})</h2>
<button onclick={() => count++}>+ Add</button>
<button onclick={() => count--}>- Subtract</button>

<hr>

<h2>Two-way Binding</h2>
<input bind:value={name} placeholder="Type your name" />
<p>Hello, <strong>{name}</strong>!</p>`,
				columnBindings: {},
				hints: [
					'Vanilla: you must update every DOM node manually — error-prone at scale.',
					'React: useMemo recomputes only when dependencies change.',
					'Vue/Svelte: computed/derived values auto-track and auto-update.'
				]
			}
		]
	},
	{
		id: 'conditional',
		title: 'Conditional',
		sessions: [
			{
				id: 'if-else',
				title: 'If / Else',
				description: 'Conditionally show or hide content.',
				tutorial: `## Conditional Rendering

Show different UI based on state:

| Approach | Syntax |
|----------|--------|
| Vanilla | \`if/else\` + DOM manipulation |
| React | \`{cond && <El/>}\` or ternary |
| Vue | \`v-if\` / \`v-else\` |
| Svelte | \`{#if}\` / \`{:else}\` |

Vanilla requires manual show/hide logic. Frameworks make it declarative.`,
				table: [],
				html: `<h1>Vanilla Conditional</h1>

<button id="toggleBtn">Log in</button>
<p id="status">Please log in.</p>

<hr>

<button id="countBtn">Count: 0</button>
<p id="positive" style="display: none;">Count is positive!</p>
<p id="over10" style="display: none;">Count is over 10!</p>

<script>
  let loggedIn = false;
  let count = 0;
  const toggleBtn = document.getElementById('toggleBtn');
  const status = document.getElementById('status');
  const countBtn = document.getElementById('countBtn');
  const positive = document.getElementById('positive');
  const over10 = document.getElementById('over10');

  toggleBtn.addEventListener('click', () => {
    loggedIn = !loggedIn;
    toggleBtn.textContent = loggedIn ? 'Log out' : 'Log in';
    status.textContent = loggedIn ? 'Welcome back!' : 'Please log in.';
  });

  countBtn.addEventListener('click', () => {
    count++;
    countBtn.textContent = 'Count: ' + count;
    positive.style.display = count > 0 ? '' : 'none';
    over10.style.display = count > 10 ? '' : 'none';
  });
</script>`,
				jsx: `function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <h1>React Conditional</h1>

      <button onClick={() => setLoggedIn(!loggedIn)}>
        {loggedIn ? 'Log out' : 'Log in'}
      </button>

      {loggedIn ? (
        <p>Welcome back!</p>
      ) : (
        <p>Please log in.</p>
      )}

      <hr />

      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {count > 0 && <p>Count is positive!</p>}
      {count > 10 && <p>Count is over 10!</p>}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
				vue: `const { createApp, ref } = Vue;

const app = createApp({
  setup() {
    const loggedIn = ref(false);
    const count = ref(0);
    return { loggedIn, count };
  },
  template: \`
    <div>
      <h1>Vue Conditional</h1>

      <button @click="loggedIn = !loggedIn">
        {{ loggedIn ? 'Log out' : 'Log in' }}
      </button>

      <p v-if="loggedIn">Welcome back!</p>
      <p v-else>Please log in.</p>

      <hr>

      <button @click="count++">Count: {{ count }}</button>
      <p v-if="count > 0">Count is positive!</p>
      <p v-if="count > 10">Count is over 10!</p>
    </div>
  \`
});

app.mount('#app');`,
				svelte: `<script>
  let loggedIn = $state(false);
  let count = $state(0);
</script>

<h1>Svelte Conditional</h1>

<button onclick={() => loggedIn = !loggedIn}>
  {loggedIn ? 'Log out' : 'Log in'}
</button>

{#if loggedIn}
  <p>Welcome back!</p>
{:else}
  <p>Please log in.</p>
{/if}

<hr>

<button onclick={() => count++}>Count: {count}</button>
{#if count > 0}
  <p>Count is positive!</p>
{/if}
{#if count > 10}
  <p>Count is over 10!</p>
{/if}`,
				columnBindings: {},
				hints: [
					'Vanilla: toggle display with style.display. Verbose but explicit.',
					'React: {condition && <El/>} renders El only when true.',
					'Vue/Svelte: declarative conditionals in the template.'
				]
			}
		]
	}
];
