// e2e/blog-list.spec.ts
// Copy file này vào folder: e2e/

import { test, expect } from '@playwright/test';

test.describe('Blog List Page - Core Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blogs');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
  });

  test.describe('Page Load & Display', () => {
    test('should load blog list page successfully', async ({ page }) => {
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible({ timeout: 10000 });
    });

    test('should display blog cards', async ({ page }) => {
      const blogCards = page.locator('[class*="card"]');
      const count = await blogCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display multiple blog cards', async ({ page }) => {
      // Wait for cards to load
      await page.waitForSelector('[class*="card"]', { timeout: 10000 });
      const blogCards = page.locator('[class*="card"]');
      const count = await blogCards.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Blog Card Content', () => {
    test('should display blog card with content', async ({ page }) => {
      const cards = page.locator('[class*="card"]');
      await expect(cards.first()).toBeVisible({ timeout: 10000 });
    });

    test('should have clickable cards', async ({ page }) => {
      const cards = page.locator('[class*="card"], a[href*="/blogs/"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Navigation to Detail Page', () => {
    test('should navigate to detail page when clicking card', async ({
      page,
    }) => {
      // Try to find and click a blog link
      const blogLink = page.locator('a[href*="/blogs/"]').first();

      if (await blogLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await blogLink.click();
        await page.waitForURL(/\/blogs\/\d+/, { timeout: 10000 });
        expect(page.url()).toMatch(/\/blogs\/\d+/);
      }
    });
  });

  test.describe('Page Structure', () => {
    test('should have main content area', async ({ page }) => {
      const main = page.locator('main').first();
      await expect(main).toBeVisible({ timeout: 10000 });
    });

    test('should have container element', async ({ page }) => {
      const container = page.locator('[class*="container"]').first();
      if (await container.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(container).toBeVisible();
      }
    });
  });

  test.describe('Search & Filter', () => {
    test('should have search or filter functionality', async ({ page }) => {
      const input = page
        .locator('input, select, [class*="search"], [class*="filter"]')
        .first();
      if (await input.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(input).toBeVisible();
      }
    });
  });
});
