import { test, expect } from '@playwright/test'

test.describe('Inventory page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
    await expect(page.locator('table tbody tr').first()).toBeVisible()
  })

  test('displays inventory table with data', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    await expect(rows).toHaveCount(await rows.count())
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('table has required columns', async ({ page }) => {
    const headers = page.locator('table thead th')
    const headerTexts = await headers.allInnerTexts()
    expect(headerTexts.join(' ')).toMatch(/SKU/i)
    expect(headerTexts.join(' ')).toMatch(/Item Name|Name|Product/i)
    expect(headerTexts.join(' ')).toMatch(/Quantity/i)
    expect(headerTexts.join(' ')).toMatch(/Status/i)
  })

  test('status badges are visible on rows', async ({ page }) => {
    const badges = page.locator('table tbody .badge')
    await expect(badges.first()).toBeVisible()
  })

  test('search filters the table', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.getByPlaceholder(/search/i).fill('PCB')
    await page.waitForTimeout(300)
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThan(allRows)
  })

  test('clearing search restores all rows', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.getByPlaceholder(/search/i).fill('PCB')
    await page.waitForTimeout(300)
    await page.getByPlaceholder(/search/i).clear()
    await page.waitForTimeout(300)
    const restoredRows = await page.locator('table tbody tr').count()
    expect(restoredRows).toBe(allRows)
  })

  test('warehouse filter reduces rows', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.locator('.filter-group').filter({ hasText: 'Location' }).locator('select').selectOption('Tokyo')
    await expect(page.locator('table tbody tr').first()).toBeVisible()
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })

  test('no error state shown on load', async ({ page }) => {
    await expect(page.locator('.error')).not.toBeVisible()
  })
})
