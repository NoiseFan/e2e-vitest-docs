import type { Locator, Page } from '@playwright/test'
import type { anchorAtomType, anchorDetailType } from '@/types/title'

/**
 * 根据页面内容获取所有的标题Locator
 */
export function getAchorListWithContent(page: Page): Locator {
  return page.locator('.content-container').getByRole('heading')
}

/**
 * 获取achor详情
 */
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
 * 获取achor详情，并添加到目标Map中
 */
export async function handleAchorDetail(page: Page, opts: { targetMap: Map<string, anchorDetailType> }): Promise<anchorAtomType> {
  const { targetMap } = opts
  const anchors = await getAchorDetail(page)
  for (const anchor of Object.values(anchors)) {
    targetMap.set(anchor.href, anchor)
  }
  return anchors
}

/**
 * 构建自定义锚点详情数据
 */
async function buildAchorDetail(locator: Locator) {
  const anchors: anchorAtomType = {}
  const text = await locator.textContent()
  const hrefLocator = locator.locator('a').last()
  const href = await hrefLocator.getAttribute('href')
  await hrefLocator.click()
  anchors[href] = { text, href }
  return anchors
}
