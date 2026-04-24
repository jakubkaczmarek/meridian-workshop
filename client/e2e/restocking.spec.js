import { test, expect } from '@playwright/test'

test.describe('Restocking Recommendations page (R2)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/restocking')
    await expect(page.locator('table tbody tr').first()).toBeVisible()
  })

  test('page heading and description are visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Restocking Recommendations', level: 2 })).toBeVisible()
    await expect(page.getByText('Purchase order recommendations based on stock levels')).toBeVisible()
  })

  test('budget ceiling input and Apply button are present', async ({ page }) => {
    await expect(page.getByPlaceholder(/max budget/i)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Apply' })).toBeVisible()
  })

  test('stat cards show items recommended and total cost', async ({ page }) => {
    await expect(page.getByText('Items Recommended')).toBeVisible()
    await expect(page.getByText('Total Cost')).toBeVisible()
  })

  test('recommendations table renders rows', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('table has required columns', async ({ page }) => {
    const headers = page.locator('table thead th')
    const texts = await headers.allInnerTexts()
    expect(texts.join(' ')).toMatch(/SKU/i)
    expect(texts.join(' ')).toMatch(/Shortage/i)
    expect(texts.join(' ')).toMatch(/Rec\. Order Qty|Recommended/i)
    expect(texts.join(' ')).toMatch(/Est\. Cost|Estimated/i)
    expect(texts.join(' ')).toMatch(/Priority/i)
  })

  test('high-priority items appear before medium-priority', async ({ page }) => {
    const badges = await page.locator('table tbody .badge.high, table tbody .badge.medium').allInnerTexts()
    const firstMedium = badges.indexOf('Medium')
    const lastHigh = badges.lastIndexOf('High')
    // All High badges should come before any Medium badge (or no Medium at all)
    if (firstMedium !== -1 && lastHigh !== -1) {
      expect(lastHigh).toBeLessThan(firstMedium)
    }
  })

  test('applying a budget shows Within Budget stat card', async ({ page }) => {
    const withinBudgetCard = page.locator('.stat-card').filter({ hasText: 'Within Budget' })
    await expect(withinBudgetCard).not.toBeVisible()
    await page.getByPlaceholder(/max budget/i).fill('50000')
    await page.getByRole('button', { name: 'Apply' }).click()
    await expect(withinBudgetCard).toBeVisible()
  })

  test('budget ceiling adds Budget Status column to table', async ({ page }) => {
    await page.getByPlaceholder(/max budget/i).fill('50000')
    await page.getByRole('button', { name: 'Apply' }).click()
    await expect(page.locator('table tbody tr').first()).toBeVisible()
    const headers = await page.locator('table thead th').allInnerTexts()
    expect(headers.join(' ')).toMatch(/Budget Status/i)
  })

  test('over-budget rows are visually distinct', async ({ page }) => {
    await page.getByPlaceholder(/max budget/i).fill('50000')
    await page.getByRole('button', { name: 'Apply' }).click()
    await expect(page.locator('table tbody tr').first()).toBeVisible()
    const overBudgetBadge = page.locator('table tbody .badge.danger').filter({ hasText: 'Over Budget' })
    await expect(overBudgetBadge.first()).toBeVisible()
  })

  test('warehouse filter reloads table', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.locator('.filter-group').filter({ hasText: 'Location' }).locator('select').selectOption('Tokyo')
    await expect(page.locator('table tbody tr').first()).toBeVisible()
    const tokyoRows = await page.locator('table tbody tr').count()
    expect(tokyoRows).toBeLessThanOrEqual(allRows)
  })

  test('no error state shown on load', async ({ page }) => {
    await expect(page.locator('.error')).not.toBeVisible()
  })
})
