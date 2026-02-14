import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000/LearnProgramming';
const FUNCTIONAL_URL = `${BASE_URL}/course/functional`;

test.describe('Shared: Root redirect', () => {
	test('redirects to functional course', async ({ page }) => {
		await page.goto(BASE_URL);
		await page.waitForURL(/\/course\/functional/);
		await expect(page.getByTestId('chapter-bar')).toBeVisible();
	});
});

test.describe('Shared: Navigation menu', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(FUNCTIONAL_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');
	});

	test('nav menu opens and shows all courses', async ({ page }) => {
		await page.getByTestId('nav-menu-btn').click();
		await expect(page.getByTestId('nav-course-functional')).toBeVisible();
		await expect(page.getByTestId('nav-course-html')).toBeVisible();
		await expect(page.getByTestId('nav-settings')).toBeVisible();

		await page.screenshot({ path: 'e2e/screenshots/shared-nav-menu.png', fullPage: true });
	});

	test('nav menu can navigate to HTML course', async ({ page }) => {
		await page.getByTestId('nav-menu-btn').click();
		await page.getByTestId('nav-course-html').click();
		await page.waitForURL(/\/course\/html/);
		await expect(page.getByTestId('chapter-bar')).toBeVisible();
		await expect(page.getByTestId('chat-panel')).toBeVisible();
	});
});

test.describe('Shared: CourseShell structure', () => {
	test('functional course has shared shell', async ({ page }) => {
		await page.goto(FUNCTIONAL_URL);
		await page.waitForSelector('[data-testid="chapter-bar"]');

		await expect(page.getByTestId('chapter-bar')).toBeVisible();
		await expect(page.getByTestId('session-tabs')).toBeVisible();
		await expect(page.getByTestId('chat-panel')).toBeVisible();
		await expect(page.getByTestId('nav-menu-btn')).toBeVisible();
	});

	test('html course has shared shell', async ({ page }) => {
		await page.goto(`${BASE_URL}/course/html`);
		await page.waitForSelector('[data-testid="chapter-bar"]');

		await expect(page.getByTestId('chapter-bar')).toBeVisible();
		await expect(page.getByTestId('session-tabs')).toBeVisible();
		await expect(page.getByTestId('chat-panel')).toBeVisible();
		await expect(page.getByTestId('nav-menu-btn')).toBeVisible();
	});
});
