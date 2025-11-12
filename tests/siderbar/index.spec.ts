import { test } from '@playwright/test'
import { getGroupWithSiderBarLocators, getMenuItemLocators, gotoDocsPage } from '@/utils/page'

test('获取侧边栏所有页面的url', async ({ page }) => {
  await test.step('step1：打开英文文档', async () => {
    await gotoDocsPage(page, { key: 'v3', url: '/advanced/api/' })

    const gruopLocators = getGroupWithSiderBarLocators(page)
    const groupCount = await gruopLocators.count()

    for (let i = 0; i < groupCount; i++) {
      const menuItemLocators = getMenuItemLocators({ parentLocator: gruopLocators.nth(i) })
      const itemCount = await menuItemLocators.count()

      // 循环获取当前菜单组下的所有URL
      for (let j = 0; j < itemCount; j++) {
        const itemLocator = menuItemLocators.nth(j)
        const itemURL = await itemLocator.getAttribute('href')
        console.info(itemURL)
      }
    }
  })
})
