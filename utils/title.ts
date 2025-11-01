import type { Locator, Page } from '@playwright/test'
import type { anchorAtomType } from '@/types/title'

/**
 * 根据页面内容获取所有的标题Locator
 */
export function getAchorListWithContent(page: Page): Locator {
  return page.locator('.content-container').getByRole('heading')
}
export async function getAchorDetail(page: Page): Promise<anchorAtomType> {
  const anchors: anchorAtomType = {}
  const anchorCount = await getAchorListWithContent(page).count()
  for (const anchor in Array.from({ length: anchorCount })) {
    const anchorLocator = getAchorListWithContent(page).nth(Number.parseInt(anchor, 10))
    Object.assign(anchors, await buildAchorDetail(anchorLocator))
  }
  return anchors
}

/**
 * 构建自定义锚点详情数据
 */
async function buildAchorDetail(locator: Locator) {
  const anchors: anchorAtomType = {}
  const text = await locator.textContent()
  const hrefLocator = locator.locator('a').first()
  const href = await hrefLocator.getAttribute('href')
  await hrefLocator.click()
  anchors[href] = { text, href }
  return anchors
}
