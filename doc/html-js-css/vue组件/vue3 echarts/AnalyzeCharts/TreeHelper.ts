interface TreeData__dealer_group {
  id: number,
  group_name: string,
  group_dealer: {
    id: number,
    dealer_name: string
  }[]
}

// 将集团商家两级字段转换为 id, name, children
export const formatTree__dealer_group = (treeData: TreeData__dealer_group[] = []) =>
  treeData.map(e1 => ({
      id: e1.id,
      name: e1.group_name,
      children: e1.group_dealer.map(e2 => ({
        id: e2.id,
        name: e2.dealer_name
      }))
    })
  )

const tip = '使用getOriginId获取id'
const idSplitStr = '<split>'

interface TreeData {
  id: any,
  name: any,
  children: TreeData[]
}

export const makeUniqueIdTree = (treeData: TreeData[] = [], parentId?: any): TreeData[] =>
  treeData.map(e => ({
      id: (parentId ? parentId : tip) + idSplitStr + e.id,
      name: e.name,
      children: makeUniqueIdTree(e.children, e.id)
    })
  )

export const getOriginId = (id: any) => {
  if (String(id).startsWith(tip)) {
    return id?.split(idSplitStr).slice(-1)[0] || undefined
  } else {
    return id
  }
}

export const getLeafIds = (treeData?: TreeData[], result = new Set()) => {
  treeData?.forEach(e => {
    if (e.children?.length) {
      getLeafIds(e.children, result)
    } else {
      result.add(e.id)
    }
  })
  return Array.from(result)
}