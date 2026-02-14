import { test, expect } from '@playwright/test';

const APP_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000/LearnProgramming';

test.describe('Tutorial App', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(APP_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');
	});

	test('renders all main panels', async ({ page }) => {
		await expect(page.getByTestId('chapter-bar')).toBeVisible();
		await expect(page.getByTestId('session-tabs')).toBeVisible();
		await expect(page.getByTestId('spreadsheet')).toBeVisible();
		await expect(page.getByTestId('code-editor')).toBeVisible();
		await expect(page.getByTestId('chat-panel')).toBeVisible();

		await page.screenshot({ path: 'e2e/screenshots/01-initial-load.png', fullPage: true });
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

	test('spreadsheet displays initial data', async ({ page }) => {
		const cell00 = page.getByTestId('cell-btn-0-0');
		await expect(cell00).toContainText('10');

		const cell10 = page.getByTestId('cell-btn-1-0');
		await expect(cell10).toContainText('20');
	});

	test('can edit a spreadsheet cell', async ({ page }) => {
		await page.getByTestId('cell-btn-0-0').click();
		const input = page.getByTestId('cell-input-0-0');
		await expect(input).toBeVisible();

		await input.fill('99');
		await input.press('Enter');

		await expect(page.getByTestId('cell-btn-0-0')).toContainText('99');

		await page.screenshot({ path: 'e2e/screenshots/02-cell-edited.png', fullPage: true });
	});

	test('can run code and see output', async ({ page }) => {
		await page.getByTestId('run-btn').click();

		await expect(page.getByTestId('code-output')).toBeVisible();
		await expect(page.getByTestId('code-stdout')).toBeVisible();

		await page.screenshot({ path: 'e2e/screenshots/03-code-executed.png', fullPage: true });
	});

	test('code execution updates spreadsheet columns', async ({ page }) => {
		await page.getByTestId('run-btn').click();
		await expect(page.getByTestId('code-output')).toBeVisible();

		const cellB0 = page.getByTestId('cell-btn-0-1');
		await expect(cellB0).toContainText('13');

		await page.screenshot({
			path: 'e2e/screenshots/04-spreadsheet-updated.png',
			fullPage: true
		});
	});

	test('can switch chapters', async ({ page }) => {
		await page.getByTestId('chapter-map').click();

		await expect(page.getByTestId('session-column-formulas')).toBeVisible();
		await expect(page.getByTestId('session-transformations')).toBeVisible();

		await expect(page.getByTestId('cell-btn-0-0')).toContainText('100');

		await page.screenshot({ path: 'e2e/screenshots/05-chapter-switched.png', fullPage: true });
	});

	test('can switch sessions within a chapter', async ({ page }) => {
		await page.getByTestId('session-functions').click();

		await expect(page.getByTestId('cell-btn-0-0')).toContainText('10');

		const codeInput = page.getByTestId('code-input');
		await expect(codeInput).toContainText('add3');

		await page.screenshot({
			path: 'e2e/screenshots/06-session-switched.png',
			fullPage: true
		});
	});

	test('spreadsheet formula evaluation', async ({ page }) => {
		await page.getByTestId('session-functions').click();

		await page.getByTestId('cell-btn-0-1').click();
		const input = page.getByTestId('cell-input-0-1');
		await input.fill('=A1+3');
		await input.press('Enter');

		await expect(page.getByTestId('cell-btn-0-1')).toContainText('13');

		await page.screenshot({
			path: 'e2e/screenshots/07-formula-evaluated.png',
			fullPage: true
		});
	});

	test('chat panel shows lesson instruction', async ({ page }) => {
		await expect(page.getByTestId('lesson-instruction')).toBeVisible();
		await expect(page.getByTestId('lesson-instruction')).toContainText('Raw Calculus');
	});

	test('settings modal opens and closes', async ({ page }) => {
		await page.getByTestId('settings-btn').click();
		await expect(page.getByTestId('settings-title')).toBeVisible();
		await expect(page.getByTestId('api-key-input')).toBeVisible();

		await page.screenshot({ path: 'e2e/screenshots/08-settings-modal.png', fullPage: true });

		await page.getByTestId('settings-cancel').click();
		await expect(page.getByTestId('settings-title')).not.toBeVisible();
	});

	test('language selector shows options', async ({ page }) => {
		const select = page.getByTestId('language-select');
		await expect(select).toBeVisible();
		await expect(select).toHaveValue('js');
	});
});
