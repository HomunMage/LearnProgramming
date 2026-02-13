import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000/LearnProgramming';

export default defineConfig({
	testDir: './e2e',
	outputDir: './e2e/test-results',
	fullyParallel: true,
	retries: 1,
	timeout: 30_000,
	use: {
		baseURL,
		ignoreHTTPSErrors: true,
		screenshot: 'on',
		trace: 'on-first-retry',
		viewport: { width: 1280, height: 720 }
	},
	projects: [
		{
			name: 'firefox',
			use: { browserName: 'firefox' }
		}
	]
});
