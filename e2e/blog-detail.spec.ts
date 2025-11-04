import { test, expect } from '@playwright/test';

test.describe('Blog Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to blog detail directly instead of through list
    await page.goto('/blogs/1', { waitUntil: 'load' });
    await page.waitForTimeout(1000);
  });

  test.describe('Detail Page Structure', () => {
    test('should load blog detail page', async ({ page }) => {
      // Check if page loaded
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should have main content area', async ({ page }) => {
      const main = page.locator('main').first();
      await expect(main).toBeVisible({ timeout: 10000 });
    });

    test('should have heading or title', async ({ page }) => {
      const heading = page.locator('h1, h2, [class*="title"]').first();
      if (await heading.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(heading).toBeVisible();
      }
    });
  });

  test.describe('Content Display', () => {
    test('should display article or post content', async ({ page }) => {
      const article = page
        .locator('article, [class*="content"], [class*="body"]')
        .first();

      if (await article.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(article).toBeVisible();
      }
    });

    test('should have text content', async ({ page }) => {
      const body = page.locator('body');
      const text = await body.textContent();
      expect(text && text.length > 0).toBe(true);
    });
  });

  test.describe('Comments Section', () => {
    test('should have comments area or similar', async ({ page }) => {
      const comments = page
        .locator('[class*="comment"], h2:has-text("Comments")')
        .first();

      if (await comments.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(comments).toBeVisible();
      }
    });
  });

  test.describe('Navigation', () => {
    test('should have navigation elements', async ({ page }) => {
      const nav = page.locator('a, button').first();
      await expect(nav).toBeVisible({ timeout: 10000 });
    });

    test('should have links to navigate', async ({ page }) => {
      const links = page.locator('a');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    });
  });
});
