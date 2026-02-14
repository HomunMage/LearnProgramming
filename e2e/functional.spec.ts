import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000/LearnProgramming';
const FUNCTIONAL_URL = `${BASE_URL}/course/functional`;

test.describe('Functional: Layout', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(FUNCTIONAL_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');
	});

	test('renders spreadsheet and code editor', async ({ page }) => {
		await expect(page.getByTestId('spreadsheet')).toBeVisible();
		await expect(page.getByTestId('code-editor')).toBeVisible();

		await page.screenshot({
			path: 'e2e/screenshots/functional-initial.png',
			fullPage: true
		});
	});

	test('language selector defaults to JS', async ({ page }) => {
		const select = page.getByTestId('language-select');
		await expect(select).toBeVisible();
		await expect(select).toHaveValue('js');
	});
});

test.describe('Functional: Chapters & Sessions', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(FUNCTIONAL_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');
	});

	test('shows all four chapters', async ({ page }) => {
		await expect(page.getByTestId('chapter-pure-functions')).toBeVisible();
		await expect(page.getByTestId('chapter-map')).toBeVisible();
		await expect(page.getByTestId('chapter-filter')).toBeVisible();
		await expect(page.getByTestId('chapter-reduce')).toBeVisible();
	});

	test('shows sessions for active chapter', async ({ page }) => {
		await expect(page.getByTestId('session-raw-calculus')).toBeVisible();
		await expect(page.getByTestId('session-cells-and-values')).toBeVisible();
		await expect(page.getByTestId('session-functions')).toBeVisible();
		await expect(page.getByTestId('session-lambda')).toBeVisible();
		await expect(page.getByTestId('session-compose')).toBeVisible();
	});

	test('can switch chapters', async ({ page }) => {
		await page.getByTestId('chapter-map').click();

		await expect(page.getByTestId('session-column-formulas')).toBeVisible();
		await expect(page.getByTestId('session-transformations')).toBeVisible();
		await expect(page.getByTestId('cell-btn-0-0')).toContainText('100');

		await page.screenshot({
			path: 'e2e/screenshots/functional-chapter-switch.png',
			fullPage: true
		});
	});

	test('can switch sessions within a chapter', async ({ page }) => {
		await page.getByTestId('session-functions').click();

		await expect(page.getByTestId('cell-btn-0-0')).toContainText('10');
		await expect(page.getByTestId('code-input')).toContainText('add3');

		await page.screenshot({
			path: 'e2e/screenshots/functional-session-switch.png',
			fullPage: true
		});
	});

	test('chat panel shows lesson instruction', async ({ page }) => {
		await expect(page.getByTestId('lesson-instruction')).toBeVisible();
		await expect(page.getByTestId('lesson-instruction')).toContainText('Raw Calculus');
	});
});

test.describe('Functional: Spreadsheet', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(FUNCTIONAL_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');
	});

	test('displays initial data', async ({ page }) => {
		await expect(page.getByTestId('cell-btn-0-0')).toContainText('10');
		await expect(page.getByTestId('cell-btn-1-0')).toContainText('20');
	});

	test('can edit a cell', async ({ page }) => {
		await page.getByTestId('cell-btn-0-0').click();
		const input = page.getByTestId('cell-input-0-0');
		await expect(input).toBeVisible();

		await input.fill('99');
		await input.press('Enter');

		await expect(page.getByTestId('cell-btn-0-0')).toContainText('99');

		await page.screenshot({
			path: 'e2e/screenshots/functional-cell-edit.png',
			fullPage: true
		});
	});

	test('formula evaluation', async ({ page }) => {
		await page.getByTestId('session-functions').click();

		await page.getByTestId('cell-btn-0-1').click();
		const input = page.getByTestId('cell-input-0-1');
		await input.fill('=A1+3');
		await input.press('Enter');

		await expect(page.getByTestId('cell-btn-0-1')).toContainText('13');

		await page.screenshot({
			path: 'e2e/screenshots/functional-formula.png',
			fullPage: true
		});
	});
});

test.describe('Functional: Code execution', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(FUNCTIONAL_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');
	});

	test('can run code and see output', async ({ page }) => {
		await page.getByTestId('run-btn').click();

		await expect(page.getByTestId('code-output')).toBeVisible();
		await expect(page.getByTestId('code-stdout')).toBeVisible();

		await page.screenshot({
			path: 'e2e/screenshots/functional-code-run.png',
			fullPage: true
		});
	});

	test('execution updates spreadsheet columns', async ({ page }) => {
		await page.getByTestId('run-btn').click();
		await expect(page.getByTestId('code-output')).toBeVisible();

		await expect(page.getByTestId('cell-btn-0-1')).toContainText('13');

		await page.screenshot({
			path: 'e2e/screenshots/functional-columns-updated.png',
			fullPage: true
		});
	});
});
