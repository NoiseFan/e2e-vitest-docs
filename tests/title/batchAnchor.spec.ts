import type { anchorDetailType, checkTaskQueueType } from '@/types/title'
import fs from 'node:fs'
import { test } from '@playwright/test'
import { gotoDocsPage } from '@/utils/page'
import { handleAchorDetail } from '@/utils/title'

test.describe('锚点批量检查', () => {
  test.setTimeout(3000 * 1000)

  const checkTaskQueue = JSON.parse(fs.readFileSync('playwright/anchor.json', 'utf-8')) as checkTaskQueueType[]
  if (!checkTaskQueue.length) {
    console.warn('请执行 tests/title/anchor.spec.ts:57:7')
  }

  for (const task of checkTaskQueue) {
    test(`处理${task.groupName} ${task.title}`, async ({ page, context }) => {
      const CNAnchorList = new Map<string, anchorDetailType>()
      const ENAnchorList = new Map<string, anchorDetailType>()

      await test.step('step1：打开中文文档', async () => {
        await gotoDocsPage(page, { key: 'local', url: task.href })
      })

      await test.step('step2：获取锚点', async () => {
        await handleAchorDetail(page, { targetMap: CNAnchorList })
      })

      const ENPage = await context.newPage()

      await test.step('step3：打开英文文档', async () => {
        await gotoDocsPage(ENPage, { key: 'en', url: task.href })
      })

      await test.step('step4：获取英文锚点', async () => {
        await handleAchorDetail(ENPage, { targetMap: ENAnchorList })
      })

      await test.step('step5：输出对比教过', async () => {
        if (CNAnchorList.size === ENAnchorList.size) {
          console.info(`${task.title} 锚点数量相等`)
        }
        else {
          console.warn(`${task.title} 锚点数量不相等，需处理页面${task.href}`)
        }
        for (const key in ENAnchorList) {
          if (!CNAnchorList.get(key))
            console.warn(`${task.title} 锚点${key}不存在`)
          if (ENAnchorList.get(key) !== CNAnchorList.get(key))
            console.warn(`${task.title} 锚点${key}不一致`)
        }
      })
    })
  }
})
