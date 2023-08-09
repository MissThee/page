export const cascadeGroupDataConvert = (data: Record<string, any>[]) =>
  data.map(e => {
    const tmp: Record<string, any> = {
      id: e.id,
      name: e.kpi_name,
      positive: e.p_number, // 圆环蓝色
      positivePercent: e.p_percent,
      negative: e.n_number, // 圆环橙色
      negativePercent: e.n_percent,
      neutral: e.m_number, // 圆环灰色
      neutralPercent: e.m_percent,
      parentId: e.parent_id
    }
    if (e.children?.length) {
      tmp.children = cascadeGroupDataConvert(e.children)
    }
    return tmp
  })
