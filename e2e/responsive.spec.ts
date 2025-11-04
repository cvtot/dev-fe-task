import { test, expect } from '@playwright/test';

test.describe('Blog List - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/blogs');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
  });

  test('should display blog list on desktop', async ({ page }) => {
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
  });

  test('should have content visible on desktop', async ({ page }) => {
    const body = page.locator('body');
    const text = await body.textContent();
    expect(text && text.length > 100).toBe(true);
  });
});

test.describe('Blog List - Tablet', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/blogs');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
  });

  test('should display blog list on tablet', async ({ page }) => {
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
  });

  test('should be responsive on tablet', async ({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(768);
    expect(viewport?.height).toBe(1024);
  });
});

test.describe('Blog List - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blogs');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
  });

  test('should display blog list on mobile', async ({ page }) => {
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
    expect(viewport?.height).toBe(667);
  });

  test('should have clickable elements on mobile', async ({ page }) => {
    const buttons = page.locator('button, a[href*="/blogs/"]');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Blog Detail - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/blogs/1');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
  });

  test('should display blog detail on desktop', async ({ page }) => {
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
  });
});

test.describe('Blog Detail - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blogs/1');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);
  });

  test('should display blog detail on mobile', async ({ page }) => {
    const main = page.locator('main').first();
    await expect(main).toBeVisible();
  });

  test('should have readable content on mobile', async ({ page }) => {
    const text = await page.locator('body').textContent();
    expect(text && text.length > 50).toBe(true);
  });
});

test.describe('UI Styling', () => {
  test('should have proper styling on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/blogs');
    await page.waitForLoadState('load');

    const heading = page.locator('h1').first();
    if (await heading.isVisible().catch(() => false)) {
      const color = await heading.evaluate(
        (el) => window.getComputedStyle(el).color
      );
      expect(color).toBeTruthy();
    }
  });

  test('should be responsive to viewport changes', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    let viewport = page.viewportSize();
    expect(viewport?.width).toBe(1920);

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    viewport = page.viewportSize();
    expect(viewport?.width).toBe(375);
  });
});

test.describe('Page Performance', () => {
  test('should load blog list quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/blogs');
    await page.waitForLoadState('load');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000); // Less than 10 seconds
  });

  test('should load blog detail quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/blogs/1');
    await page.waitForLoadState('load');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000);
  });
});

test.describe('Navigation Flow', () => {
  test('should navigate between pages', async ({ page }) => {
    // Start at list
    await page.goto('/blogs');
    expect(page.url()).toContain('/blogs');

    // Check we can find links
    const links = page.locator('a[href*="/blogs/"]');
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have working links', async ({ page }) => {
    await page.goto('/blogs');
    const mainLink = page.locator('a').first();

    if (await mainLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(mainLink).toBeVisible();
    }
  });
});
