import { test, expect } from '@playwright/test';
import path, { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
const ROOT_PATH = resolve(__dirname, 'screenshots')

test('has input element', async ({ page, baseURL }) => {
  await page.goto(baseURL + '/');
  const input = page.locator('input').first();

  await input.focus()
  await page.screenshot({ path: join(ROOT_PATH, 'index-page.png') })
  expect(input).toBeVisible();
});

test('mask aligns with locale', async ({ page, baseURL }) => {
  // en-GB configured in playwright.config.ts (can be changed)
  await page.goto(baseURL + '/');
  const mask = page.locator('.mask-text').first();

  await mask.focus()
  await page.screenshot({ path: join(ROOT_PATH, 'index-page.png') })
  expect(mask).toHaveText('DD/MM/YYYY');
});

test('input element autocorrects input if possible', async ({ page, baseURL }) => {
  // en-GB configured in playwright.config.ts (can be changed)
  await page.goto(baseURL + '/');
  const input = page.locator('input').first();

  await input.focus()
  const textToEnter = '01/31/2022'
  textToEnter.split('').forEach(async (char) => {
    await input.press(char)
  })
  await page.screenshot({ path: join(ROOT_PATH, 'index-page.png') })
  expect(input).toHaveValue('31/01/2022');
});
