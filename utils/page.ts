import type { Locator, Page } from '@playwright/test'
import { getAchorListWithContent } from './title'

const HOST = {
  local: 'http://localhost:3333',
  // local: 'https://ant.design/docs/spec/overview-cn',
  en: 'https://vitest.dev',
  v3: 'https://v3.vitest.dev',
  // en: 'https://vite.dev',
  // cn: 'https://cn.vite.dev',
}

type buildLinkOptionsType = {
  key: keyof typeof HOST
  url: string
}
function buildLinkURL(opts: buildLinkOptionsType) {
  const { key = 'local', url } = opts

  if (url.endsWith('.html')) {
    return `${HOST[key]}${url}`
  }
  return `${HOST[key]}${url}.html`
}

/**
 * 前往Vitest 文档页面
 */
export async function gotoDocsPage(page: Page, opts: buildLinkOptionsType) {
  const url = buildLinkURL(opts)
  await page.goto(url, { timeout: 10 * 1000 })
  await page.waitForLoadState()
  await getAchorListWithContent(page).first().getByRole('link').click()
}

/**
 * 获取侧边栏Locator
 */
export function getSiderBarLocator(page: Page) {
  return page.locator('.VPSidebar')
}

/**
 * 获取所有的group Locator
 */
export function getGroupWithSiderBarLocators(page: Page) {
  return getSiderBarLocator(page).locator('.group')
}

type getMenuItemLocatorType = { parentLocator: Locator }
export function getMenuItemLocators(opts: getMenuItemLocatorType) {
  const { parentLocator } = opts
  return parentLocator.getByRole('link')
}
