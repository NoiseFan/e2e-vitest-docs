export type anchorDetailType = { text: string, href: string }
// 自定义锚点的数据结构
export type anchorAtomType = Record<string, anchorDetailType>

export type checkTaskQueueType = {
  href: string
  title: string
  groupName: string
}
