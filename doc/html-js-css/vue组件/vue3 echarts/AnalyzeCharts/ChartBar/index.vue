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
  name: 'ChartBar'
}
</script>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {colorDefault, colorSelected} from "@/components/AnalyzeCharts/ChartColors.ts";
import {EChartsType} from "echarts";
import {legendWrap} from "@/components/AnalyzeCharts/NameFormatter.ts";

export type ChartBarData = {
  labels: string[],
  values: number[],
}
const props = withDefaults(defineProps<{
  title?: string,
  data: ChartBarData,
  option?: Record<string, any>
  zoom?: boolean
  highlightName?: string | string[]
  labelFormatter?: (val: string) => any
}>(), {
  title: '',
  data: () => ({
    labels: [],
    values: [],
  }),
  labelFormatter: undefined,
  option: () => ({})
})
const chartEl = ref()
let chartInstance: EChartsType | null = null

const defaultLabelFormatter = (value) => {
  if (value.endsWith('服务中心')) {
    return value.substring(0, value.length - 4) + '\n服务中心'
  }
  if (value.includes('(')) {
    return value.split('(').join('\n(')
  }
  if (value.includes('（')) {
    return value.split('（').join('\n（')
  }
  return legendWrap(value, 5)
}

const getFormattedLabel = (val) => {
  const formatterFun = props.labelFormatter || defaultLabelFormatter
  return formatterFun(val)
}

const updateView = () => {
  const chartOption: Record<string, any> = {
    animation: false,
    grid: {
      bottom: 13,
      top: 40,
      left: 40,
      right: 30,
      containLabel: true,
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      borderColor: 'transparent',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        return `
<table style="position: relative;text-align: left;">
  <tr>
    <td>${params[0].axisValueLabel}</td>
  </tr>
  <tr>
    <td style="display: inline-block;background-color: ${params[0].color};height:0.6em;width: 0.6em;margin-right: 2px"/>
    <td style="display: inline-block">声量</td>
    <td style="display: inline-block;min-width: 4em;text-align: right;margin-left: 5px">${params[0].data}</td>
  </tr>
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
        formatter: getFormattedLabel, //每5个字符换行
        color: '#86909C'
      }
    },
    yAxis: {
      // max: 100,
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
        // formatter: '{value}',
        show: true,
        color: '#B8BCC4'
      }
    },
    label: {
      show: true
    },
    series: [
      {
        name: '',
        type: 'bar',
        // selectedMode: 'single',
        // select: {
        //   itemStyle: {
        //     color: colorSelectHighlight,
        //     borderWidth: 0
        //   }
        // },
        cursor: 'default',
        itemStyle: {
          color: (params: any) => (Array.isArray(props.highlightName) ? props.highlightName.includes(params.name) : params.name === props.highlightName) ? colorSelected : colorDefault,
          // borderRadius: [100, 100, 0, 0]
        },
        barWidth: 22,
        // barWidth: '30%',
        // barMinWidth: 22,
        // barMaxWidth: 44,
        label: {
          show: true,
          formatter: '{c}',
          position: 'top',
          fontFamily: 'OPPOSans-M, OPPOSans,sans-serif',
          fontWeight: 'normal',
          fontSize: 12,
        },
        data: [],
      },
    ],
    legend: {
      show: false,
    },
    dataZoom: props.zoom ? [
      {
        bottom: 0,
        type: 'slider',
        show: true,
        xAxisIndex: [0, 1],
        start: 0,
        end: 100,
        height: 13,
        handleSize: 12,
        handleIcon: 'path://M512 512m-208 0a6.5 6.5 0 1 0 416 0 6.5 6.5 0 1 0-416 0Z M512 192C335.264 192 192 335.264 192 512c0 176.736 143.264 320 320 320s320-143.264 320-320C832 335.264 688.736 192 512 192zM512 800c-159.072 0-288-128.928-288-288 0-159.072 128.928-288 288-288s288 128.928 288 288C800 671.072 671.072 800 512 800z',
        // showDataShadow: false,
        moveHandleSize: 0, // 去除滑动区上边的大横条按钮
        moveOnMouseWheel: true,
        fillerColor: 'rgba(0,0,0,0.2)',
        filterMode: 'empty'
      },
      {
        type: 'inside',
        zoomOnMouseWheel: false,
        moveOnMouseWheel: true,
        moveOnMouseMove: true,
        preventDefaultMouseMove: true,
        filterMode: 'empty'
      }
    ] : []
  }
  chartOption.xAxis.data = props.data?.labels || [] // x轴数据
  chartOption.series[0].data = props.data?.values || [] // 数据
  if (chartInstance) {
    chartInstance.setOption(chartOption, {notMerge: false, lazyUpdate: true, replaceMerge: ['series']})
    chartInstance.setOption(props.option || {}, false, true)
    if (props.zoom) {
      chartInstance.setOption(updateZoomData() || {}, false, true)
    }
    // setTimeout(() => {
    //   chartInstance.dispatchAction({type: 'highlight', seriesIndex: 0, dataIndex: 0});
    // })
  }
}
let currentMinZoomWidth = 100
const updateZoomData = () => {
  if (!(chartEl.value && chartInstance)) {
    return
  }
  const chartCurrentOption = chartInstance.getOption()
  let labelMaxWidth = props.data.labels?.reduce((maxWidth, e) => {
    let labelLength = 0
    const labelFormattedOneRow = getFormattedLabel(e)?.split('\n')[0]
    for (let i = 0; i < labelFormattedOneRow.length; i++) {
      if (encodeURI(String(e || '').charAt(i)).length === 9) {
        labelLength += chartCurrentOption.xAxis[0].axisLabel.fontSize * 1.1
      } else {
        labelLength += chartCurrentOption.xAxis[0].axisLabel.fontSize * 0.65
      }
    }
    return Math.max(maxWidth, labelLength)
  }, 0)

  const chartELWidth = chartEl.value?.getBoundingClientRect().width //echarts整个canvas的宽度
  let leftWidth = 0
  {
    const leftValue = chartCurrentOption.grid[0].left
    if (String(leftValue).endsWith('%')) {
      leftWidth = Number(String(leftValue).replace('%', '')) / 100 * chartELWidth
    } else if (!Number.isNaN(Number(leftValue))) {
      leftWidth = Number(leftValue)
    }
  }
  let rightWidth = 0
  {
    const rightValue = chartCurrentOption.grid[0].right
    if (String(rightValue).endsWith('%')) {
      rightWidth = Number(String(rightValue).replace('%', '')) / 100 * chartELWidth
    } else if (!Number.isNaN(Number(rightValue))) {
      rightWidth = Number(rightValue)
    }
  }
  const chartGraphWidth = chartELWidth - rightWidth - leftWidth//echarts实际绘制的宽度

  const zoomEnd = chartGraphWidth / (labelMaxWidth * props.data.labels.length) * 100 || 0
  // 更新一下本次计算的最小间距记录值，之后判断如果小于此间距，则开启自动隐藏横轴label
  currentMinZoomWidth = zoomEnd
  return {
    dataZoom: [{
      type: 'slider',
      start: 0,
      end: zoomEnd || 100,
    }]
  }
}

const resize = () => {
  setTimeout(() => {
    chartInstance?.resize()
  })
}

watch(() => props, () => {
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
