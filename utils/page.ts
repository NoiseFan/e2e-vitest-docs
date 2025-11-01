import type { Page } from '@playwright/test'
import { getAchorListWithContent } from './title'

const HOST = {
  local: 'http://localhost:3333',
  en: 'https://vitest.dev',
  cn: 'https://cn.vitest.dev',
}

type buildLinkOptionsType = {
  key: keyof typeof HOST
  url: string
}
function buildLinkURL(opts: buildLinkOptionsType) {
  const { key = 'local', url } = opts
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
