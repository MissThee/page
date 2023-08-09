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
  name: 'ChartBarHorizontal'
}
</script>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {colorDefault, colorSpecial} from "@/components/AnalyzeCharts/ChartColors.ts";
import {percentDigitalFormatter} from "@/components/AnalyzeCharts/NumFormatter.ts";
import {EChartsType} from "echarts";
import {legendWrap} from "@/components/AnalyzeCharts/NameFormatter.ts";

export type ChartBarHorizontalData = {
  labels: string[],
  percents: number[],
  nums: any[],
}
const props = withDefaults(defineProps<{
  title?: string,
  data: ChartBarHorizontalData,
  option?: Record<string, any>
}>(), {
  title: '',
  data: () => ({
    labels: [],
    percents: [],
    nums: []
  }),
  option: () => ({})
})
const chartEl = ref()
let chartInstance: EChartsType | null = null
const updateView = () => {
  const chartOption: Record<string, any> = {
    animation: false,
    grid: {
      containLabel: true,
      bottom: 0,
      top: 40,
      left: 0,
      right: 20 // 40
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      borderColor: 'transparent',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params: any) => {
        let result = ''
        result += `
<table style="text-align: left">
  <tr>
    <td colspan="10">${params[0].axisValueLabel}</td>
  </tr>
  <tr>
    <td>
      <div style="background-color: ${params[0].color};height:0.6em;width: 0.6em;margin-right: 2px"></div>
    </td>
    <td style="width: 40px">占比 </td>
    <td style=";text-align: right;margin-left: 5px">${percentDigitalFormatter(params[0].data || 0)}%</td>

  </tr>
</table>
      `
        //<td style="width: 3em;text-align: right;">, 声量:</td>
        //   <td style="text-align: right;">${[...props.data.nums || []].reverse()[params[0].dataIndex] || 0}</td>
        return result
      }
    },
    // height: 205,
    yAxis: {
      type: 'category',
      data: [],
      axisLine: {
        show: false,
        lineStyle: {
          color: "#6f6f6f",
          alignWithLabel: true
        },
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        interval: 0, // 不自动隐藏横轴的label
        // formatter: (value) => legendWrap(value,10)
      }
    },
    xAxis: {
      max: 'maxData',
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
        show: false,
        lineStyle: {
          type: 'dotted',
          width: 1,
          color: "#cccccc"
        },
      },
      axisLabel: {
        // formatter: '{value}',
        show: false,
        color: '#6f6f6f'
      }
    },
    label: {
      show: true,
      offset: [0, 1]
    },
    series: [
      {
        name: '',
        type: 'bar',
        cursor: 'default',
        itemStyle: {
          color: colorSpecial,
          // borderRadius: [100, 100, 0, 0]
        },
        barWidth: 16,
        label: {
          show: false, // 条顶部数值
          formatter: '{c}%',
          position: 'right',
          fontFamily: 'OPPOSans-M, OPPOSans,sans-serif',
          fontWeight: 'normal',
          fontSize: 12
        },
        data: [],
      },
    ],
    legend: {
      show: false,
    },
  }

  if (props.data) {
    chartOption.yAxis.data = [...props.data.labels || []].reverse() // x轴数据
    chartOption.series[0].data = [...props.data.percents || []].reverse() // y轴数据
    if (chartInstance) {
      chartInstance.setOption(chartOption, {notMerge: false, lazyUpdate: true, replaceMerge: ['series']})
      chartInstance.setOption(props.option || {}, false, true)
    }
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

  .header {
    left: 0;
    right: 0;
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
