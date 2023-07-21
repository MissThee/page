// 固定配置
import {colorDefault} from "@/components/AnalyzeCharts/ChartColors.ts";
import {legendWrap} from "@/components/AnalyzeCharts/NameFormatter.ts";

export const overallLineMultiOption = {
  color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
  grid: {
    right: 90
  },
  legend: {
    show: true,
    right: 0,
    height: '70%',
    formatter: (value) => legendWrap(value, 9),
    top: 'center',
    orient: 'vertical',
    itemGap: 10
  }
}
// 固定配置
export const overallLineSingleOption = {
  color: colorDefault,
  grid: {
    right: 30
  },
  legend: {
    show: false,
  }
}