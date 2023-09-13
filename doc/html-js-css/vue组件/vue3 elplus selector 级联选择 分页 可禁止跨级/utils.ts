type RelationActiveIds = { parent: number[], active: number[], child: number[], fullChecked: number[] }

// 传入树状数据data, 激活的id集合ids。获取与激活节点相关的父id与子id
export const findRelationNodeId = (data: CascaderSelectorData[] = [], ids: RelationActiveIds | number[] = [], path: number[] = []): RelationActiveIds => {
    if (Array.isArray(ids)) {
        ids = {parent: [], active: [...ids], child: []}
    }
    for (const e of data) {
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

export const addArrUnique = (arr: any[], ...val: any[]) => {
    val?.forEach(e => {
        const existIndex = arr.indexOf(e)
        if (existIndex === -1) {
            arr.push(e)
        }
    })
}


export const removeArr = (arr: any[], ...val: any[]) => {
    val?.forEach(e => {
        const existIndex = arr.indexOf(e)
        if (existIndex !== -1) {
            arr.splice(existIndex, 1)
        }
    })
}