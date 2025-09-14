// e2e/filter.spec.ts
import { test, expect } from '@playwright/test';

test('Filtrar por dirección con testids', async ({ page }) => {
  await page.goto('http://localhost:3000/');


  await page.getByTestId('filters-open').click();
  await page.getByTestId('filters-address').fill('calle 5');

  const waitSearch = page.waitForResponse((res) => {
    const m = res.request().method();
    const url = res.url();
    return (m === 'GET' || m === 'POST') && url.includes('/api/properties');
  });

  await page.getByTestId('filters-apply').click();
  await waitSearch;

  await expect(page.getByTestId('property-skeleton')).toHaveCount(0, { timeout: 15000 });

  const grid = page.getByTestId('properties-grid');
  const cards = grid.getByTestId('property-card');
  const empty = page.getByTestId('empty-state');

  const cardsCount = await cards.count();
  if (cardsCount > 0) {

    await expect(cards.first()).toBeVisible();

    await expect(grid.getByText(/calle\s*5/i).first()).toBeVisible();
  } else {
    await expect(empty).toBeVisible();
  }
});
