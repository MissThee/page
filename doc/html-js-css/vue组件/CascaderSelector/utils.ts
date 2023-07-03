// 传入树状数据data, 激活的id集合ids。获取与激活节点相关的父id与子id

type RelationActiveIds = { parent: number[], active: number[], child: number[] }
export const findRelationNodeId = (data: CascaderSelectorData[] | undefined, ids: RelationActiveIds | number[] = [], path: number[] = []): RelationActiveIds => {
  if (Array.isArray(ids)) {
    ids = {parent: [], active: [...ids], child: []}
  }
  for (const e of data || []) {
    if (ids.active.includes(e.id) || ids.child.includes(e.id)) {
      ids.child.push(...(e.children?.map((item: CascaderSelectorData) => item.id) || []))
    }
    if (ids.active.includes(e.id)) {
      ids.parent.push(...path)
    }
    findRelationNodeId(e.children, ids, [...path, e.id])
  }
  return ids
}