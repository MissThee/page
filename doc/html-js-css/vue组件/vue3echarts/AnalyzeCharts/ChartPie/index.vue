<!--环形图，中间有额外展示数据-->
<template>
  <div class="chart-pie">
    <div class="chart-pie__header">
      <div class="charts-title" style="position: absolute">{{ props.title }}</div>
    </div>
    <div class="chart-pie__map" ref="chartEl"/>
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
  isLoading?: boolean
  title?: string
  data: ChartPieData[],
  option?: Record<string, any>// echarts配置，会在最后使用 setOption 合并到echarts配置中
}>(), {
  data: () => ([]),
  option: () => ({})
})
const chartEl = ref()
let chartInstance: EChartsType | null = null
let chartOption: Record<string, any> = {}
let chartOptionOrigin: Record<string, any> = {}

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
  chartOption = {
    // animation: false,
    // color: ['#3769FA', '#F7B500', '#CFCFCF'],
    tooltip: { // 防止悬浮窗溢出
      show: true,
      position: (point: [x: number, y: number], params: any, dom: HTMLElement, rect: { x: number, y: number, width: number, height: number }, size: { contentSize: [width: number, height: number], viewSize: [width: number, height: number] }) => {
        let [x, y] = point
        if (x < size.viewSize[0] / 2) {
          x = Math.min(x, size.viewSize[0] - size.contentSize[0])
        } else {
          x = Math.max(0, x - size.contentSize[0])
        }
        y = Math.min(size.viewSize[1] - size.contentSize[1], y)
        y = Math.max(0, y)
        return [x, y];
      },
      formatter: (params: any) => `
<div style="font-size: 13px">
    <div style="display: inline-block;vertical-align: middle;margin-top: -2px;height: 8px;width:8px;background-color: ${params.color};border-radius: 50%" ></div>
    <span style="font-size: inherit;color:${params.color}">${params.data.name}</span>
    <div style="font-size: inherit;display: inline-block;width:10px"></div>
    <span style="font-size: inherit;float:right">${params.value} （${params.percent}%）</span>
</div>
  `
    },
    series: [
      {
        name: '',
        type: 'pie',
        cursor: 'default',
        left: 0,
        right: '26%',
        radius: ['0', '60%'],
        // center: ['36%', '50%'],
        itemStyle: {
          // borderRadius: 12,
          borderColor: 'white',
          borderWidth: 2,
        },
        // silent: true, // true时去除鼠标交互
        data: [
          // { value: 0, name: '负向', itemStyle: { color: '#FA8DBF' } },
          // { value: 0, name: '正向', itemStyle: { color: '#6BCAF7' } },
          // { value: 0, name: '中立', itemStyle: { color: '#979797' } }
        ],
        label: {
          formatter: (params) => percentDigitalFormatter(params.percent) + '%',
          color: '#555555',
          fontSize: 14,
          fontWeight: 600,
          alignTo: 'edge',
          position: 'outer',
          edgeDistance: 0,
          // padding: [5, 5],
          // borderRadius: 3,
          // shadowColor: 'rgba(0, 0, 0, 0.15)',
          // shadowBlur: 8,
          // shadowOffsetY: 2,
          overflow:'none'
        },
        emphasis: {label: {show: true}},
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
        avoidLabelOverlap: true, // true防止标签重叠
      }
    ],
    legend: {
      show: true,
      selectedMode: false,
      orient: 'vertical',
      right: '8%',
      top: 'center',
      itemGap: 30,
      icon: 'circle',
      itemHeight: 10,
      itemWidth: 10
    }
  }
  chartOptionOrigin = JSON.parse(JSON.stringify(chartOption))
  if (!chartInstance) {
    return
  }
  // chartInstance && this.chartInstance.resize()
  // 设置数据和配置
  if (props.isLoading) {
    chartOption.series[0].data[0] = {value: 0, name: '加载中', itemStyle: {color: '#eee'}}
    delete chartOption.series[0].data[1]
  } else {
    props.data.forEach((e, index) => {
      chartOption.series[0].data[index] = {
        value: e.value,
        name: e.name,
        itemStyle: {
          color: e.color
        }
      }
    })
    let noEmptyDataNum = 0
    let isEmpty = true
    chartOption.series[0].data.forEach(item => {
      if (item.value) {
        isEmpty = false
        noEmptyDataNum++
      }
    })
    chartOption.series[0].label.show = true
    chartOption.series[0].emphasis.label.show = true
    chartOption.series[0].labelLine.show = true
    if (isEmpty) {
      chartOption.series[0].label.show = false
      chartOption.series[0].emphasis.label.show = false
      chartOption.series[0].labelLine.show = false
      chartOption.series[0].data.forEach(e=>{
        e.itemStyle= {color: '#dddddd'}
      })
      chartOption.series[0].itemStyle.borderWidth = 0
    } else if (noEmptyDataNum <= 1) {
      chartOption.series[0].itemStyle.borderWidth = 0
    } else {
      chartOption.series[0].itemStyle.borderWidth = chartOptionOrigin.series[0].itemStyle.borderWidth
    }
  }
  // 使用配置内容绘制
  chartInstance.setOption(chartOption, false, true)
  chartInstance.setOption(props.option || {}, false, true) // 合并父级传入的配置
}

const updateSize = () => {
  setTimeout(() => {
    chartInstance?.resize?.()
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

  &__map {
    height: 100%;
  }

  .loading {
    width: 80px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
