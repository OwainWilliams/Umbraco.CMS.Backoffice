import { expect, test } from '@playwright/test';

import config from '../playwright.config';

test('login', async ({ page }) => {
	// Go to /login
	await page.goto('/login');

	// Fill input[name="email"]
	await page.locator('input[name="email"]').fill('test@umbraco.com');

	// Fill input[name="password"]
	await page.locator('input[name="password"]').fill('test123456');

	// Click [aria-label="Login"]
	await page.locator('[aria-label="Login"]').click();

	await expect(page).toHaveURL(`${config.use?.baseURL}/section/content/dashboard/welcome`);
});
