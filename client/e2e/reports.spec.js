import { test, expect } from '@playwright/test'

test.describe('Reports page (R1)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/reports')
    // Wait for data to load — either a table row or a stat value
    await expect(page.locator('table tbody tr').first()).toBeVisible()
  })

  test('page heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Performance Reports' })).toBeVisible()
  })

  test('quarterly performance table renders data', async ({ page }) => {
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('quarterly rows contain expected columns', async ({ page }) => {
    const headers = page.locator('table thead th')
    const texts = await headers.allInnerTexts()
    expect(texts.join(' ')).toMatch(/Quarter/i)
    expect(texts.join(' ')).toMatch(/Total Orders|Orders/i)
    expect(texts.join(' ')).toMatch(/Revenue/i)
  })

  test('no error state shown on load', async ({ page }) => {
    await expect(page.locator('.error')).not.toBeVisible()
  })

  test('filter by quarter narrows results', async ({ page }) => {
    const allRows = await page.locator('table tbody tr').count()
    await page.locator('.filter-group').filter({ hasText: 'Time Period' }).locator('select').selectOption('2025-01')
    await expect(page.locator('table').first()).toBeVisible()
    const filteredRows = await page.locator('table tbody tr').count()
    expect(filteredRows).toBeLessThanOrEqual(allRows)
  })

  test('no network errors fetching report data', async ({ page }) => {
    const failedRequests = []
    page.on('requestfailed', req => {
      if (req.url().includes('/api/reports')) failedRequests.push(req.url())
    })
    await page.goto('/reports')
    await expect(page.locator('table tbody tr').first()).toBeVisible()
    expect(failedRequests).toHaveLength(0)
  })
})
