<template>
  <div class="single-ring" ref="singleRingRef">
    <div class="single-ring__map" ref="chartEl"/>
  </div>
</template>
<script lang="ts">
export default {
  name: 'SingleRing',
}
</script>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {EChartsType} from "echarts";
import {onMounted, onUnmounted, ref, watch} from "vue";

const props = withDefaults(defineProps<{
  isLoading?: boolean,
  option?: Record<string, any>// echarts配置，会在最后使用 setOption 合并到echarts配置中
  data: SingleRingData
}>(), {
  data: () => ({
    total: 0, // 总数
    percent: 0,
    positive: 0, // 圆环蓝色百分比
    positivePercent: 0, // 圆环蓝色百分比
    negative: 0, // 圆环橙色百分比
    negativePercent: 0, // 圆环橙色百分比
    neutral: 0,  // 圆环灰色百分比
    neutralPercent: 0, // 圆环灰色百分比
  }),
  option: () => ({})
})

const chartEl = ref()
const singleRingRef = ref()
let chartInstance: EChartsType | null = null
let chartOption: Record<string, any> = {}
const updateView = () => {
  if (!chartInstance) {
    return
  }
  chartOption = {
    // animation: false,
    color: ['#F7B500', '#3769FA', '#CFCFCF'],
    tooltip: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        cursor: 'default',
        radius: ['95%', '100%'],
        // itemStyle: {
        // borderRadius: 12,
        // borderColor: 'white',
        // borderWidth: 8,
        // },
        silent: true, // true时去除鼠标交互
        data: [
          // { value: 0, name: '正向', itemStyle: { color: '#6BCAF7' } },
          // { value: 0, name: '负向', itemStyle: { color: '#FA8DBF' } },
          // { value: 0, name: '中立', itemStyle: { color: '#979797' } }
        ],
        label: {
          show: false,
        },
        labelLine: {
          show: false,
        },
      }
    ]
  }
  // 设置数据和配置
  if (props.isLoading) {
    chartOption.series[0].data = [{value: 0, name: '加载中', itemStyle: {color: '#eee'}}]
    delete chartOption.series[0].data[1]
  } else {
    chartOption.series[0].data[0] = {
      value: props.data.negative,
      name: '负面体验',
    }
    chartOption.series[0].data[1] = {
      value: props.data.positive,
      name: '正面体验',
    }
    chartOption.series[0].data[2] = {
      value: props.data.neutral,
      name: '中立体验',
    }
    if (chartOption.series[0].data.reduce((total, item) => total + (item.value || 0), 0) === 0) {
      chartOption.series[0].data = [{value: 0, name: '无数据', itemStyle: {color: '#eee'}}]
    }
  }
  // 使用配置内容绘制
  chartInstance.setOption(chartOption, false, true)
  chartInstance.setOption(props.option || {}, false, true) // 合并父级传入的配置
  updateRingWidth()
}

const updateRingWidth = () => {
  if (!chartInstance) {
    return
  }
  const option = {
    series: [
      {
        radius: [Math.round((1 - 12 / (singleRingRef.value.clientWidth || 1)) * 100) + '%', '100%']
      }
    ]
  }
  chartInstance.setOption(option)
  setTimeout(() => {
    chartInstance?.resize()
  })
}
onMounted(() => {
  chartInstance = echarts.init(chartEl.value, '', {devicePixelRatio: window.devicePixelRatio * 2})// 避免transform缩放导致图形模糊。值太小，大图形会模糊；值太大，小图形会有锯齿边
  updateView()
  window.addEventListener('resize', updateRingWidth)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateRingWidth)
})
watch(() => props.data, () => {
  updateView()
}, {deep: true})
watch(() => props.isLoading, () => {
  updateView()
})

</script>

<style lang="less" scoped>
.single-ring {
  display: inline-block;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  border-radius: 50%;

  &__map {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  &__header {
    margin: 8px 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between
  }

  &__total {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
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
