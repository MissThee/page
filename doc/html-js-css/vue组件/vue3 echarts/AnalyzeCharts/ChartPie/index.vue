<!--环形图，中间有额外展示数据-->
<template>
  <div class="chart-pie" ref="selfRef">
    <div class="chart-pie__header">
      <div class="charts-title" style="position: absolute">{{ props.title }}</div>
    </div>
    <div class="chart-pie__body" style="height: 100%;margin:auto" :style="{maxWidth:props.maxWidth+'px'}">
      <div class="chart-pie__chart" ref="chartEl"/>
      <div class="chart-pie__info" :class="{'chart-pie__info--center':props.isBottomLegend}" v-if="props.centerInfo">
        <div style="transform-origin: 50% 50%" :style="{transform: `scale(${centerScaleRate})`}">
          <div class="title" v-if="props.centerInfo?.title ">{{ props.centerInfo?.title }}</div>
          <div class="subtitle" v-if="props.centerInfo?.unit">
            <span class="num">{{ totalNum }}</span>
            <span class="unit">{{ props.centerInfo?.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChartPie'
}
</script>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {percentDigitalFormatter} from "../NumFormatter";
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {EChartsType} from "echarts";

export type ChartPieData = {
  value: number,
  name: string,
  color: string,
}

const props = withDefaults(defineProps<{
  title?: string
  centerInfo?: { title?: string, unit?: string }
  data: ChartPieData[],
  option?: Record<string, any>// echarts配置，会在最后使用 setOption 合并到echarts配置中
  isBottomLegend?: boolean
  maxWidth?: number
  tooltipType?: string
  reverseRotate?: boolean
}>(), {
  data: () => ([]),
  option: () => ({})
})
const chartEl = ref()
const totalNum = ref(0)
const selfRef = ref()
const centerScaleRate = ref(1)

let chartInstance: EChartsType | null = null
const getTooltip = (params: any) => {
  if (props.tooltipType === 'sex' || props.tooltipType === 'inYear' || props.tooltipType === 'year') {
    return `
<div style="font-size: 13px;text-align: left;">
    <div >${params.data.name}</div>
    <div style="white-space: nowrap">
      <div style="display: inline-block;vertical-align: middle;margin-top: -2px;height: 8px;width:8px;background-color: ${params.color};border-radius: 50%;margin-right: 5px" ></div>
      <span style="margin-right: 5px">占比${percentDigitalFormatter(params.percent)}%</span>
      <span style="font-weight: bold">${params.value}人</span>
    </div>
</div>
`
  } else {
    return `
<div style="font-size: 13px;text-align: left;">
    <div >${params.data.name}</div>
    <div style="white-space: nowrap">
        <div style="display: inline-block;vertical-align: middle;margin-top: -2px;height: 8px;width:8px;background-color: ${params.color};border-radius: 50%;margin-right: 5px" ></div>
        <span>声量占比: ${params.value}</span>
    </div>
</div>
`
    // <span>声量占比: ${params.value}（${percentDigitalFormatter(params.percent)}%）</span>
  }
}

onMounted(() => {
  chartInstance = echarts.init(chartEl.value as HTMLElement, undefined, {
    renderer: 'canvas',
    useDirtyRect: false
  })
  updateView()
})
watch(() => props.data, () => {
  updateView()
}, {deep: true})
watch(() => props.option, () => {
  updateView()
}, {deep: true})
const updateView = () => {
  const chartOption: Record<string, any> = {
    animation: false,
    // color: ['#3769FA', '#F7B500', '#CFCFCF'],
    tooltip: { // 防止悬浮窗溢出
      show: true,
      borderColor: 'transparent',
      formatter: getTooltip
    },
    series: [
      {
        name: '',
        type: 'pie',
        cursor: 'default',
        left: 0,
        right: '26%',
        radius: [props.centerInfo ? '54%' : 0, '90%'],
        clockwise: !props.reverseRotate,
        // center: ['36%', '50%'],
        itemStyle: {
          // borderRadius: 12,
          // borderColor: 'white',
          // borderWidth: 2,
        },
        // silent: true, // true时去除鼠标交互
        data: [
          // { value: 0, name: '负向', itemStyle: { color: '#FA8DBF' } },
          // { value: 0, name: '正向', itemStyle: { color: '#6BCAF7' } },
          // { value: 0, name: '中立', itemStyle: { color: '#979797' } }
        ],
        label: {
          formatter: (params) => percentDigitalFormatter(params.percent) + '%',
          color: 'white',
          fontSize: 12,
          // fontWeight: 500,
          alignTo: 'edge',
          position: 'inside',
          edgeDistance: 0,
          // padding: [5, 5],
          // borderRadius: 3,
          // shadowColor: 'rgba(0, 0, 0, 0.15)',
          // shadowBlur: 8,
          // shadowOffsetY: 2,
          overflow: 'series'
        },
        emphasis: {
          scaleSize: 12,
          label: {
            show: true,
            // textBorderColor: 'inherit',
            // textBorderWidth: 4,
            backgroundColor: 'inherit',
            padding: 4,
            borderRadius: 6
          }
        },
        labelLayout: {
          hideOverlap: false,
          // draggable: true,
        },
        labelLine: {
          show: true,
          showAbove: true,
          lineStyle: {
            // type: 'dotted',
            width: 1
          },
          length: 13,
          length2: 13,
          smooth: true
          // length: 30
        },
        emptyCircleStyle: {
          color: 'lightgray'
        },
        avoidLabelOverlap: true, // true防止标签重叠
      },
    ],
    legend: {
      show: true,
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemGap: 30,
      icon: 'circle',
      itemHeight: 10,
      itemWidth: 10,
      data: props.data.map(e => ({name: e.name, itemStyle: {color: e.color}}))
    }
  }
  if (!chartInstance) {
    return
  }
  // chartInstance && this.chartInstance.resize()
  // 设置数据和配置
  totalNum.value = 0
  props.data.forEach((e, index) => {
    totalNum.value += e.value
    chartOption.series[0].data[index] = {
      value: e.value,
      name: e.name,
      itemStyle: {
        color: e.color
      }
    }
  })
  // if (props.reverseRotate) {
  //   chartOption.series[0]?.data.reverse()
  // }
  if (totalNum.value === 0) { // 全部数据为0时的样式
    chartOption.legend.selectedMode = false
    chartOption.series[0].silent = true
    chartOption.series[0].label.show = false
    chartOption.series[0].emphasis.label.show = false
    chartOption.series[0].data.forEach(e => {
      e.itemStyle = {color: '#dddddd'}
    })
  } else {
    chartOption.legend.selectedMode = false
    chartOption.series[0].silent = false
    chartOption.series[0].label.show = true
    chartOption.series[0].emphasis.label.show = true
  }

  // 使用配置内容绘制
  chartInstance.setOption(chartOption, {notMerge: false, lazyUpdate: true, replaceMerge: ['series']})
  if (props.reverseRotate) {
    const optionTmp = {
      series: [
        {
          startAngle: 90 - (totalNum.value ? (chartOption.series[0]?.data?.[0].value || 0) / totalNum.value * 360 : 0)
        }
      ],
    }
    chartInstance.setOption(optionTmp, false, true)
  }
  if (props.isBottomLegend) {
    const optionTmp = {
      series: [
        {
          right: 0,
        }
      ],
      legend: {
        orient: 'horizontal',
        left: 'center',
        right: 'auto',
        top: '85%',
      }
    }
    chartInstance.setOption(optionTmp, false, true)
  }
  chartInstance.setOption(props.option || {}, false, true) // 合并父级传入的配置
}

const updateSize = () => {
  setTimeout(() => {
    chartInstance?.resize?.()
    const originWidth = props.isBottomLegend ? 250 : 400
    if (selfRef.value) {
      centerScaleRate.value = Math.max(Math.min(selfRef.value.getBoundingClientRect().width / originWidth, 2), 1)
    }
  })
}
onMounted(() => {
  updateSize()
  window.addEventListener('resize', updateSize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateSize)
})
</script>

<style lang="less" scoped>
.chart-pie {
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  width: 100%;

  &__header {
    text-align: left;
  }

  &__chart {
    padding-top: 20px;
    height: 100%;
  }

  &__info {
    position: absolute;
    right: 26%;
    left: 0;
    transform-origin: 50% 50%;
    top: calc(40% + 10px);

    &--center {
      right: 0;
      top: calc(45% + 10px);
    }

    .title {
      font-size: 12px;
      color: #86909C;
      text-align: center;
    }

    .subtitle {
      text-align: center;

      .num {
        font-size: 32px;
        font-family: HelveticaNeue-Medium, sans-serif;
        font-weight: 500;
        color: #1D2129;
        letter-spacing: -0.2px;
        line-height: 32px;
      }

      .unit {
        font-size: 18px;
        color: #86909C;
        text-align: center;
      }
    }
  }
}
</style>
