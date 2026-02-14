import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000/LearnProgramming';
const HTML_URL = `${BASE_URL}/course/html`;

test.describe('HTML: Layout', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(HTML_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');
	});

	test('renders preview and code editor', async ({ page }) => {
		await expect(page.getByTestId('html-preview')).toBeVisible();
		await expect(page.getByTestId('code-editor')).toBeVisible();

		await page.screenshot({ path: 'e2e/screenshots/html-initial.png', fullPage: true });
	});

	test('language selector defaults to HTML', async ({ page }) => {
		const select = page.getByTestId('language-select');
		await expect(select).toBeVisible();
		await expect(select).toHaveValue('html');
	});

	test('language selector shows HTML and Markdown options', async ({ page }) => {
		const select = page.getByTestId('language-select');
		const options = select.locator('option');
		await expect(options).toHaveCount(2);
		await expect(options.nth(0)).toHaveText('HTML');
		await expect(options.nth(1)).toHaveText('Markdown');
	});
});

test.describe('HTML: Chapters & Sessions', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(HTML_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');
	});

	test('shows HTML and Markdown chapters', async ({ page }) => {
		await expect(page.getByTestId('chapter-html-basics')).toBeVisible();
		await expect(page.getByTestId('chapter-markdown-basics')).toBeVisible();
	});

	test('shows sessions for HTML Basics', async ({ page }) => {
		await expect(page.getByTestId('session-first-page')).toBeVisible();
		await expect(page.getByTestId('session-lists')).toBeVisible();
		await expect(page.getByTestId('session-links-images')).toBeVisible();
	});

	test('switching to Markdown chapter changes language', async ({ page }) => {
		await page.getByTestId('chapter-markdown-basics').click();

		const select = page.getByTestId('language-select');
		await expect(select).toHaveValue('markdown');

		await expect(page.getByTestId('session-md-intro')).toBeVisible();
	});

	test('chat panel shows lesson instruction', async ({ page }) => {
		await expect(page.getByTestId('lesson-instruction')).toBeVisible();
		await expect(page.getByTestId('lesson-instruction')).toContainText('First HTML Page');
	});
});

test.describe('HTML: Preview rendering', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(HTML_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');
	});

	test('run renders HTML in preview', async ({ page }) => {
		await page.getByTestId('run-btn').click();

		const iframe = page.getByTestId('html-preview').locator('iframe');
		await expect(iframe).toBeVisible();

		const frame = iframe.contentFrame();
		await expect(frame.locator('h1')).toContainText('Hello World');

		await page.screenshot({ path: 'e2e/screenshots/html-rendered.png', fullPage: true });
	});

	test('run renders Markdown as HTML in preview', async ({ page }) => {
		await page.getByTestId('chapter-markdown-basics').click();
		await page.getByTestId('run-btn').click();

		const iframe = page.getByTestId('html-preview').locator('iframe');
		const frame = iframe.contentFrame();
		await expect(frame.locator('h1')).toContainText('Hello Markdown');
		await expect(frame.locator('strong')).toContainText('bold');

		await page.screenshot({ path: 'e2e/screenshots/html-markdown-rendered.png', fullPage: true });
	});
});
