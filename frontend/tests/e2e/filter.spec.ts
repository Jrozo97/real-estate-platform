import { test, expect } from '@playwright/test';

test('Filtrar propiedades por dirección', async ({ page }) => {
  // navega a la página que muestra el grid
  await page.goto('http://localhost:3000/');

  // abre el popover de filtros
  await page.getByRole('button', { name: /filtros/i }).click();

  // llena el campo de Dirección del popover
  await page.getByTestId('filters-address').fill('Calle 5');

  // aplica
  await page.getByTestId('filters-apply').click();

  // espera el resultado en la grilla
  await expect(page.getByText(/calle 5/i)).toBeVisible();
});
