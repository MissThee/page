// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {ChartCascadeProgressData} from "@/components/AnalyzeCharts/ChartCascadeProgress/index.vue";

export const cascadeDataConvert = (data: Record<string, any>[]) =>
  data.map(e => {
    const tmp: ChartCascadeProgressData = {
      id: e.id,
      name: e.kpi_name,
      value: e.total_number,
      percent: e.percent,

      parentId: e.parent_id,
    }
    if (e.children?.length) {
      tmp.children = cascadeDataConvert(e.children)
    }
    return tmp
  })

export const cascadeDataConvert_1 = (data: Record<string, any>[]) =>
  data.filter(e => !!e.kpi).map(e => {
    const tmp: ChartCascadeProgressData = {
      id: e.kpi,
      name: e.kpi,
      value: e.number,

      parentId: e.parent_id,
    }
    if (e.children?.length) {
      tmp.children = cascadeDataConvert_1(e.children)
    }
    return tmp
  })
