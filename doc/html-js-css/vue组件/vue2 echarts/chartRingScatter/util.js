import {percentDigitalFormatter} from "../NumFormatter.js";

export const ringScatterDataConvert = (data) => {
  return data.map(e => {
    const totalNum = Number(e.p_number || 0) + Number(e.n_number || 0) + Number(e.m_number || 0)
    let pPercent = 0
    let nPercent = 0
    let mPercent = 0

    if (totalNum !== 0) {
      pPercent = percentDigitalFormatter(Number(e.p_number || 0) * 100 / totalNum)
      nPercent = percentDigitalFormatter(Number(e.n_number || 0) * 100 / totalNum)
      mPercent = percentDigitalFormatter(Number(e.m_number || 0) * 100 / totalNum)
    }
    return {
      id: e.id,
      name: e.kpi_name,
      total: e.kpi_number, // 总数
      percent: e.kpi_percent,
      positive: e.p_number, // 圆环蓝色百分比
      positivePercent: pPercent, // 圆环蓝色百分比
      negative: e.n_number, // 圆环橙色百分比
      negativePercent: nPercent, // 圆环橙色百分比
      neutral: e.m_number,  // 圆环灰色百分比
      neutralPercent: mPercent, // 圆环灰色百分比
    }
  })
}
