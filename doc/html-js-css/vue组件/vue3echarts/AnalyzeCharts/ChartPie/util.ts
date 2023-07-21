import {colorNegative, colorNeutral, colorPositive, colorSpecial} from "@/components/AnalyzeCharts/ChartColors.ts";

const colors = [
  colorSpecial,
  colorNegative,
  colorNeutral,
  colorPositive
]

export const chartPieDataConvertSex = (data?: any) => {
  const tmp = [
    {name: '女性', value: 0, color: colors[0]},
    {name: '男性', value: 0, color: colors[1]},
  ]
  tmp.forEach((e, i) => {
    if (i === 0) {
      e.value = Number(data?.find(d => d.sex?.startsWith('女'))?.number || 0)
    } else if (i === 1) {
      e.value = Number(data?.find(d => d.sex?.startsWith('男'))?.number || 0)
    }
  })
  return tmp
}
export const chartPieDataConvertInYear = (data?: any) => {
  const tmp = [
    {name: '1-3个月', value: 0, color: colors[0]},
    {name: '4-12个月', value: 0, color: colors[1]},
  ]
  tmp.forEach((e, i) => {
    if (i === 0) {
      e.value = Number(data?.find(d => d.duration?.startsWith('1-3'))?.number || 0)
    } else if (i === 1) {
      e.value = Number(data?.find(d => d.duration?.startsWith('4-12'))?.number || 0)
    }
  })
  return tmp
}
export const chartPieDataConvertYear = (data?: any) => {
  const tmp = [
    {name: '<1年', value: 0, color: colors[0]},
    {name: '1-3年', value: 0, color: colors[3]},
    {name: '3-5年', value: 0, color: colors[1]},
    {name: '5年以上', value: 0, color: colors[2]},
  ]
  tmp.forEach((e, i) => {
    if (i === 0) {
      e.value = Number(data?.find(d => d.duration?.startsWith('<1'))?.number || 0)
    } else if (i === 1) {
      e.value = Number(data?.find(d => d.duration?.startsWith('1'))?.number || 0)
    } else if (i === 2) {
      e.value = Number(data?.find(d => d.duration?.startsWith('3'))?.number || 0)
    } else if (i === 3) {
      e.value = Number(data?.find(d => d.duration?.startsWith('5'))?.number || 0)
    }
  })
  return tmp
}