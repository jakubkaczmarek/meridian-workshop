import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
  },
  timeout: 15000,
  expect: { timeout: 8000 },
  reporter: 'list',
})
