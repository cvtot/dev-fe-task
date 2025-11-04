import { test, expect } from '@playwright/test';

test('Browse posts list', async ({ page }) => {
  await page.goto('/posts');
  const posts = page.locator('.main-post');
  const count = await posts.count();
  expect(count).toBeGreaterThan(0);
});
