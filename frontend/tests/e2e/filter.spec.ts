import { test, expect } from '@playwright/test';

test('Filtrar por dirección con testids', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await page.getByTestId('filters-open').click();
  await page.getByTestId('filters-address').fill('calle 5');
  await page.getByTestId('filters-price-min').fill('300000000');
  await page.getByTestId('filters-price-max').fill('700000000');

  const waitSearch = page.waitForResponse((res) => {
    const url = res.url();
    const m = res.request().method();
    return url.includes('/api/properties') && (m === 'GET' || m === 'POST');
  });

  await page.getByTestId('filters-apply').click();
  await waitSearch;

  const grid = page.getByTestId('properties-grid');
  const firstCard = grid.getByTestId('property-card').first();
  const empty = page.getByTestId('empty-state');

  const appeared = await Promise.race([
    firstCard.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'card' as const).catch(() => null),
    empty.waitFor({ state: 'visible', timeout: 15000 }).then(() => 'empty' as const).catch(() => null),
  ]);

  expect(appeared).not.toBeNull();

  if (appeared === 'card') {
    console.log("Se encontraron propiedades que coinciden con el filtro.");
    await expect(grid.getByText(/calle\s*5/i).first()).toBeVisible();
  } else {
    await expect(empty).toBeVisible();
  }
});
