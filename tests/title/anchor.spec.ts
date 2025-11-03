import type { anchorDetailType, checkTaskQueueType } from '@/types/title'
import fs from 'node:fs'
import { expect, test } from '@playwright/test'
import { gotoDocsPage } from '@/utils/page'
import { getAchorDetail, handleAchorDetail } from '@/utils/title'

test.describe('标题自定义锚点', () => {
  test.slow()

  test.setTimeout(3000 * 1000)

  test('手工添加锚点', async ({ page, context }) => {
    const target = '/guide/migration'
    const CNAnchorList = new Map<string, anchorDetailType>()
    const ENAnchorList = new Map<string, anchorDetailType>()

    await test.step('step1：打开中文文档', async () => {
      await gotoDocsPage(page, { key: 'local', url: target })
    })

    await test.step('step2：获取锚点', async () => {
      const anchors = handleAchorDetail(page, { targetMap: CNAnchorList })
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
    })

    await test.step('step5：断言锚点', async () => {
      for (const key in ENAnchorList) {
        // 锚点不相等
        expect(CNAnchorList.get(key)?.href, key).toBe(ENAnchorList.get(key).href)
      }
      expect(CNAnchorList.size, '数量不等').toBe(ENAnchorList.size)
    })
  })

  test('获取需要处理的页面 @script', async ({ page }) => {
    const checkQueue = []

    await test.step('step1：打开中文文档', async () => {
      await gotoDocsPage(page, { key: 'local', url: '/guide/' })
    })

    await test.step('step2：获取所有页面', async () => {
      const sliderBarLocator = page.locator('.VPSidebar')
      // 获取分类
      const groupLocator = sliderBarLocator.locator('.group')
      const groupCount = await groupLocator.count()

      // 分类名称
      for (let i = 0; i < groupCount; i++) {
        const parentLocator = groupLocator.nth(i)
        const entryLocators = parentLocator.getByRole('link')
        const entryCount = await entryLocators.count()
        const groupName = await parentLocator.locator('h2').isVisible() ? await parentLocator.locator('h2').textContent() : ''
        for (let index = 0; index < entryCount; index++) {
          const entryData: checkTaskQueueType = {
            href: await entryLocators.nth(index).getAttribute('href'),
            title: await entryLocators.nth(index).textContent(),
            groupName,
          }
          checkQueue.push(entryData)
        }
      }
      fs.writeFileSync('playwright/anchor.json', JSON.stringify(checkQueue))
    })

    await test.step('step3：输出日志', async () => {
      console.info(`需要处理${checkQueue.length}个页面`)
    })
  })
})
