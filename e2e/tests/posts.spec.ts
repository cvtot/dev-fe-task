import { test, expect } from '@playwright/test';

test.describe('Posts flows', () => {
  test('Browse posts list and pagination', async ({ page }) => {
    await page.goto('/posts');
    const posts = page.locator('.main-post');
    const count = await posts.count();
    expect(count).toBeGreaterThan(0);

    // test pagination
    const nextBtn = page.locator('button.load-more');
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
      const newCount = await posts.count();
      expect(newCount).toBeGreaterThan(0);
    }
  });

  test('Search posts realtime', async ({ page }) => {
    await page.goto('/posts');

    const searchInput = page.locator('.my-search-input');
    await searchInput.waitFor({ state: 'visible' });

    // Nhập từ khóa
    await searchInput.fill('he');

    const posts = page.locator('.main-post');

    // Chờ ít nhất 1 post hiển thị
    await expect(posts.first()).toBeVisible();

    // Kiểm tra text realtime search
    await expect(posts).toContainText('he');

    // Optional: check URL đã update
    await expect(page).toHaveURL(/search=he/, { timeout: 10000 });
  });

  test('Navigate to post details and back', async ({ page }) => {
    // click vào post đầu tiên
    await page.click('.main-post:first-child a');

    // chờ container detail render
    const postDetail = page.locator('.post-detail');
    await expect(postDetail).toBeVisible({ timeout: 10000 });

    // quay lại list
    await page.goBack();

    const posts = page.locator('.main-post');
    await expect(posts.first()).toBeVisible({ timeout: 10000 });
  });
});
