export const ringScatterDataConvert = (data: Record<string, any>[]): ChartRingScatterData[] =>
  data.map(e => ({
    id: e.id,
    name: e.kpi_name,
    total: e.total_number, // 总数
    percent: e.total_percent,
    positive: e.p_number, // 圆环蓝色百分比
    positivePercent: e.p_percent, // 圆环蓝色百分比
    negative: e.n_number, // 圆环橙色百分比
    negativePercent: e.n_percent, // 圆环橙色百分比
    neutral: e.m_number,  // 圆环灰色百分比
    neutralPercent: e.m_percent, // 圆环灰色百分比
  }))
