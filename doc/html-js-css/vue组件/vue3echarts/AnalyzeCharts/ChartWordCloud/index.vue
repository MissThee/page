<!--环形图，中间有额外展示数据-->
<template>
  <div class="chart-word-cloud" ref="selfRef">
    <div class="chart-word-cloud__header">
      <div class="charts-title" style="position: absolute">{{ props.title }}</div>
    </div>
    <div class="chart-word-cloud__chart" ref="chartEl"/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChartWordCloud'
}
</script>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {EChartsType} from "echarts";
import 'echarts-wordcloud';

export type ChartCloudData = {
  value: number,
  name: string,
}

const props = withDefaults(defineProps<{
  title?: string
  maxValueColor?: string,
  data: ChartCloudData[],
  option?: Record<string, any>// echarts配置，会在最后使用 setOption 合并到echarts配置中
}>(), {
  data: () => ([]),
  option: () => ({})
})
const chartEl = ref()
const selfRef = ref()
const centerScaleRate = ref(1)

let chartInstance: EChartsType | null = null

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


const weightList = [5.5, 3, 3, 2.5, 2, 2, 1]
const updateView = () => {
  if (!chartInstance) {
    return
  }
  const sortedData = JSON.parse(JSON.stringify(props.data || [])).sort((a, b) => a.value < b.value ? 1 : -1)
  sortedData.forEach((e, i) => {
    e.num = e.value
    if (i === 0) {
      e.value = weightList[0]
    } else {
      e.value = weightList[Math.ceil(i / (sortedData.length / (weightList.length - 1)))]
    }
  })
  const chartOption: Record<string, any> = {
    tooltip: {
      show: true,
      borderColor:'transparent',
      formatter: () => `
<table style="position: relative;text-align: left;">
  <tr>
    <td>TOP10指标</td>
  </tr>
  ${sortedData.slice(0, 10).map(e => `
  <tr>
    <td >${e.name}</td>
    <td style="min-width: 4em;text-align: right;margin-left: 5px">${e.num}</td>
  </tr>
  `).join('')}
</table>
`,
//       formatter: (params) => `
// <table style="position: relative;text-align: left;">
//   <tr>
//     <td>${params.name}</td>
//   </tr>
//   <tr>
//     <td style="display: inline-block;background-color: ${params.color};height:0.6em;width: 0.6em;margin-right: 2px;border-radius: 50%"/>
//     <td style="display: inline-block">数量</td>
//     <td style="display: inline-block;min-width: 4em;text-align: right;margin-left: 5px">${sortedData[params.dataIndex].num}</td>
//   </tr>
// `
    },
    series: [{
      type: 'wordCloud',
      // silent: true,
      // The shape of the "cloud" to draw. Can be any polar equation represented as a
      // callback function, or a keyword present. Available presents are circle (default),
      // cardioid (apple or heart shape curve, the most known polar equation), diamond (
      // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.
      shape: 'square',
      // Keep aspect ratio of maskImage or 1:1 for shapes
      // This option is supported since echarts-wordcloud@2.1.0
      keepAspect: false,
      // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
      // Default to be put in the center and has 75% x 80% size.
      left: 'center',
      top: 'center',
      width: '95%',
      height: '98%',
      right: null,
      bottom: null,

      // Text size range which the value in data will be mapped to.
      // Default to have minimum 12px and maximum 60px size.

      sizeRange: [10, 27],
      // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
      rotationRange: [0, 0],
      rotationStep: 0,

      // size of the grid in pixels for marking the availability of the canvas
      // the larger the grid size, the bigger the gap between words.

      gridSize: 25,

      // set to true to allow word to be drawn partly outside of the canvas.
      // Allow word bigger than the size of the canvas to be drawn
      // This option is supported since echarts-wordcloud@2.1.0
      drawOutOfBound: false,

      // if the font size is too large for the text to be displayed,
      // whether to shrink the text. If it is set to false, the text will
      // not be rendered. If it is set to true, the text will be shrinked.
      // This option is supported since echarts-wordcloud@2.1.0
      shrinkToFit: false,

      // If perform layout animation.
      // NOTE disable it will lead to UI blocking when there is lots of words.
      layoutAnimation: true,

      // Global text style
      textStyle: {
        fontFamily: 'sans-serif',
        fontWeight: 'bold',
      },
      // Data is an array. Each array item must have name and value property.
      data: []
    }],
  }
  // 设置数据和配置
  sortedData.forEach((e, index) => {
    let opacity = 0.2 + 0.8 * (sortedData[0]?.value ? e.value / sortedData[0].value : 1)
    chartOption.series[0].data[index] = {
      value: e.value,
      name: e.name,
      textStyle: {
        color: index === 0 ? props.maxValueColor : `rgba(51,51,51,${opacity})`
      }
    }
  })

  // 使用配置内容绘制
  chartInstance.setOption(chartOption, false, true)
  chartInstance.setOption(props.option || {}, false, true) // 合并父级传入的配置
}

const updateSize = () => {
  setTimeout(() => {
    chartInstance?.resize?.()
    centerScaleRate.value = Math.max(Math.min(selfRef.value.getBoundingClientRect().width / 400, 2), 1)
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
.chart-word-cloud {
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
}
</style>
