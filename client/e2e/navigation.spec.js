import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('all nav links are present', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav.nav-tabs')
    await expect(nav.getByRole('link', { name: 'Overview' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Inventory' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Orders' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Finance' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Demand Forecast' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Reports' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Restocking' })).toBeVisible()
  })

  test('clicking Inventory navigates to /inventory', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Inventory' }).click()
    await expect(page).toHaveURL('/inventory')
    await expect(page.getByRole('heading', { name: 'Inventory' })).toBeVisible()
  })

  test('clicking Orders navigates to /orders', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Orders' }).click()
    await expect(page).toHaveURL('/orders')
    await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible()
  })

  test('clicking Reports navigates to /reports', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Reports' }).click()
    await expect(page).toHaveURL('/reports')
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
  })

  test('clicking Restocking navigates to /restocking', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Restocking' }).click()
    await expect(page).toHaveURL('/restocking')
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations' })).toBeVisible()
  })

  test('active nav link is highlighted for current page', async ({ page }) => {
    await page.goto('/inventory')
    const inventoryLink = page.getByRole('link', { name: 'Inventory' })
    await expect(inventoryLink).toHaveClass(/active/)
  })

  test('filter bar is visible on every page', async ({ page }) => {
    const locationSelect = () =>
      page.locator('.filter-group').filter({ hasText: 'Location' }).locator('select')
    const categorySelect = () =>
      page.locator('.filter-group').filter({ hasText: 'Category' }).locator('select')

    for (const path of ['/', '/inventory', '/orders', '/restocking']) {
      await page.goto(path)
      await expect(locationSelect()).toBeVisible()
      await expect(categorySelect()).toBeVisible()
    }
  })
})
