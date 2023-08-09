<!--柱状图，主要用在详情中-->
<template>
  <div class="chart-bar">
    <div class="header">
      <div>
        <div class="charts-title">{{ props.title }}</div>
      </div>
    </div>
    <div ref="chartEl" class="chart-bar__chart"/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChartBarStack'
}
</script>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {colorDefault} from "@/components/AnalyzeCharts/ChartColors.ts";
import {percentDigitalFormatter} from "@/components/AnalyzeCharts/NumFormatter.ts";
import {EChartsType} from "echarts";

interface ChartBarMultiData {
  name?: string,
  percents: number[],
  nums: number[],
  color?: string
}

export interface ChartBarStackData {
  labels: string[],
  values: ChartBarMultiData[],
}

const props = withDefaults(defineProps<{
  title?: string,
  data: ChartBarStackData,
  option?: Record<string, any>
}>(), {
  title: '',
  data: () => ({
    labels: [],
    values: [],
  }),
  option: () => ({})
})
const chartEl = ref()

// 获取字符串中文字符个数。中文算1，英文算0.5
const getZhWordNum = (val: string) => {
  let labelCharNum = 0
  for (let i = 0; i < val.length; i++) {
    if (encodeURI(val.charAt(i)).length === 9) {
      labelCharNum += 1// 中文
    } else {
      labelCharNum += 0.5
    }
  }
  return labelCharNum
}

let chartInstance: EChartsType | null = null

const updateView = () => {
  const chartOption: Record<string, any> = {
    animation: false,
    grid: {
      containLabel: true,
      bottom: 10,
      top: 40,
      left: 40,
      right: 30
    },
    tooltip: {
      show: true,
      borderColor:'transparent',
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        const dataRow = params.map((e: any) => `
<tr>
    <td >
      <div style="display: inline-block;background-color: ${e.color};height:0.6em;width: 0.6em;margin-right: 2px"></div>
    </td>
    <td>${e.seriesName}:</td>
    <td style=";text-align: right;margin-left: 5px">${percentDigitalFormatter(e.data || 0)}%</td>
</tr>
`)
        //   <td style="width: 3em;text-align: right;">, 编码量:</td>
        //   <td style="text-align: right;">${[...props.data.values || []].reverse()[e.seriesIndex]?.nums?.[e.dataIndex] || 0}</td>
        return `
<table style="position: relative;text-align: left;width: 100%">
  <tr>
    <td colspan="5">${params[0].axisValueLabel}</td>
  </tr>
  ${dataRow.reverse().join('')}
</table>
      `
      }
    },
    // height: 205,
    xAxis: {
      type: 'category',
      data: [],
      axisLine: {
        show: true,
        lineStyle: {
          color: "#F2F3F5",
          alignWithLabel: true
        },
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        interval: 0, // 不自动隐藏横轴的label
        formatter: (value: string) => {
          if (value.includes(' ')) { // 名字有空格的，在空格位换行
            let result = ''
            const valueArr = value.split(' ')
            for (let i = 0; i < valueArr.length; i++) {
              const currentPiece = (result ? ' ' : '') + valueArr[i]
              const isNeedCut = getZhWordNum(result.substring(result.lastIndexOf('\n')) + currentPiece) > 4
              result += isNeedCut ? '\n' + currentPiece.trimStart() : currentPiece
            }
            return result
          }
          if (getZhWordNum(value) > 4) {
            return value.substring(0, Math.ceil(value.length / 2)) + '\n' + value.substring(Math.ceil(value.length / 2))
          }
          return value
        },
        color: '#86909C'
      }
    },
    yAxis: {
      max: 100,
      // min: 0,
      type: 'value',
      minInterval: 1,
      axisLine: {
        show: false,
        lineStyle: {
          color: "#cccccc"
        },
      },
      splitLine: {
        show: true,
        lineStyle: {
          // type: 'dotted',
          width: 1,
          color: "#F2F3F5"
        },
      },
      axisLabel: {
        formatter: '{value}%',
        show: true,
        color: '#B8BCC4'
      }
    },
    label: {
      show: true
    },
    series: [],
    legend: {
      right: 30,
      show: true,
      // selectedMode: false,
      // left: 100,
      itemGap: 30,
      type: 'scroll',
      icon: 'rect',
      itemHeight: 8,
      itemWidth: 8,
    },
  }
  chartOption.xAxis.data = props.data?.labels || [] // x轴数据
  chartOption.legend.data = []
  props.data.values.forEach((v, i) => {
    chartOption.legend.data.push({
      name: v.name || '',
      itemStyle: {
        color: v.color || colorDefault,
      }
    })
    chartOption.series[i] = {
      name: v.name || '',
      type: 'bar',
      cursor: 'default',
      stack: 'stack',
      itemStyle: {
        color: v.color || colorDefault,
      },
      barWidth: 22,
      label: {
        show: false,
        // formatter: '{c}',
        // position: 'top',
        // fontFamily: 'OPPOSans-M, OPPOSans,sans-serif',
        // fontWeight: 'normal',
        // fontSize: 12,
      },
      data: v.percents || [],
    }
  })
  chartOption.series = chartOption.series.reverse()
  if (chartInstance) {
    chartInstance.setOption(chartOption, false, true)
    chartInstance.setOption(props.option || {}, false, true)
  }

}

const resize = () => {
  setTimeout(() => {
    chartInstance?.resize()
  })
}
watch(() => props.data, () => {
  updateView()
}, {
  immediate: true,
  deep: true
})

watch(() => props.option, () => {
  updateView()
}, {
  deep: true
})

onMounted(() => {
  chartInstance = echarts.init(chartEl.value as HTMLElement, '', {devicePixelRatio: window.devicePixelRatio * 2})// 避免transform缩放导致图形模糊，暂时使用2。值太小，大图形会模糊；值太大，小图形会有锯齿边
  updateView()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})

</script>

<style lang="less" scoped>
.chart-bar {
  height: 100%;
  position: relative;
  overflow: hidden;

  .header {
    left: 0;
    position: absolute;
    margin: 0 30px 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 9;
  }

  &__chart {
    height: 100%;
  }
}
</style>
