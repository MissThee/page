import {ChartCascadeGroupProgressData} from "@/components/AnalyzeCharts/ChartCascadeGroupProgress/index.vue";

export const cascadeGroupDataConvert = (data: Record<string, any>[]) =>
  data.map(e => {
    const tmp: ChartCascadeGroupProgressData = {
      id: e.id,
      name: e.name,
      positive: e.p_number,
      positivePercent: e.p_percent,
      negative: e.n_number,
      negativePercent: e.n_percent,
      neutral: e.m_number,
      neutralPercent: e.m_percent,
      parentId: e.parent_id
    }
    if (e.children?.length) {
      tmp.children = cascadeGroupDataConvert(e.children)
    }
    return tmp
  })
