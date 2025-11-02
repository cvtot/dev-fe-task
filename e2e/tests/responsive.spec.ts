import { test, expect, chromium } from '@playwright/test';

test('Check layout on multiple devices', async ({ browser }) => {
  const viewports = [
    { name: 'Desktop', width: 1280, height: 720 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    await page.goto('/posts');
    await expect(page.locator('.main-post')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: `e2e/screenshots/posts-${vp.name}.png` });

    await context.close();
  }
});
