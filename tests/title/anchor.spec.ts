import type { anchorDetailType } from '@/types/title'
import { expect, test } from '@playwright/test'
import { gotoDocsPage } from '@/utils/page'
import { getAchorDetail } from '@/utils/title'

test.describe('标题自定义锚点', () => {
  test('手工添加锚点', async ({ page, context }) => {
    const target = '/guide/profiling-test-performance'
    const CNAnchorList = new Map<string, anchorDetailType>()
    const ENAnchorList = new Map<string, anchorDetailType>()

    await test.step('step1：打开中文文档', async () => {
      await gotoDocsPage(page, { key: 'local', url: target })
    })

    await test.step('step2：获取锚点', async () => {
      const anchors = await getAchorDetail(page)
      for (const anchor of Object.values(anchors)) {
        CNAnchorList.set(anchor.href, anchor)
      }
      console.info('中文锚点列表：', Object.values(anchors).map(item => item.href))
    })

    const ENPage = await context.newPage()

    await test.step('step3：打开英文文档', async () => {
      await gotoDocsPage(ENPage, { key: 'en', url: target })
    })

    await test.step('step4：获取英文的锚点', async () => {
      const anchors = await getAchorDetail(ENPage)
      // 过滤出CNAnchorList中不存在的锚点
      const needAddList = Object.values(anchors).filter(item => !CNAnchorList.has(item.href)).map(item => item.href)
      if (needAddList.length) {
        console.warn('应添加的anchors')
        console.info(needAddList)
      }
      else {
        console.info('✅ 无需添加')
      }
      for (const anchor of Object.values(anchors)) {
        ENAnchorList.set(anchor.href, anchor)
      }
      Object.assign(ENAnchorList, anchors)
    })

    await test.step('step5：断言锚点', async () => {
      for (const key in ENAnchorList) {
        // 锚点不相等
        expect(CNAnchorList.get(key)?.href, key).toBe(ENAnchorList.get(key).href)
      }
      expect(CNAnchorList.size, '数量不等').toBe(ENAnchorList.size)
    })
  })
})
