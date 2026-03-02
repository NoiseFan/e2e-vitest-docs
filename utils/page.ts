import type { Locator, Page } from '@playwright/test'
import type { anchorDetailType } from '@/types/title'
import { getAchorListWithContent } from './title'

const HOST = {
  local: 'http://localhost:3333',
  en: 'https://vitest.dev',
  v3: 'https://v3.vitest.dev',
  v2: 'https://v2.vitest.dev',
  v1: 'https://v1.vitest.dev',
  v0: 'https://v0.vitest.dev',
}

type buildLinkOptionsType = {
  key: keyof typeof HOST
  url: string
}
function buildLinkURL(opts: buildLinkOptionsType) {
  let { key = 'local', url } = opts

  if (!url.startsWith('/')) {
    url = `/${url}`
  }
  if (url.endsWith('.md')) {
    url = url.replace('.md', '')
  }

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

type AnchorMapType = Map<string, anchorDetailType>
export function getDifferentKeys(map1: AnchorMapType, map2: AnchorMapType) {
  const keys1 = Array.from(map1.keys())
  const keys2 = Array.from(map2.keys())

  const allKeys = new Set([...keys1, ...keys2])
  const diffKeys = []

  for (const key of allKeys) {
    if (map1.has(key) !== map2.has(key)) {
      diffKeys.push(key)
    }
  }

  return diffKeys
}
