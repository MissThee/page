<!--柱状图，主要用在详情中-->
<template>
  <div class="chart-line">
    <div class="header">
      <div>
        <div class="charts-title"> {{ props.title }}</div>
      </div>
      <img class="charts-icon" v-if="!props.noDownload" @click="emits('download')" :src="HomeAssets.download" alt="download"/>
    </div>
    <div ref="chartEl" class="chart-line__chart"/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChartLine'
}
</script>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {percentDigitalFormatter} from "../NumFormatter.ts";
import * as HomeAssets from "home/assets";

export type ChartLineData = {
  labels: string[],
  values: { name: string, color?: string, data: number[] }[]
}
const props = withDefaults(defineProps<{
  title?: string,
  data?: ChartLineData,
  isPercent?: boolean,
  option?: Record<string, any>
  noDownload?: boolean
}>(), {
  title: '',
  data: () => ({
    labels: [],
    values: []
  }),
  option: () => ({})
})
const emits = defineEmits(['download'])

let currentMinZoomWidth = 100
const isAutoHideLabel = ref(false)
const toolTipPosition = (point: [x: number, y: number], params: any, dom: HTMLElement, rect: { x: number, y: number, width: number, height: number }, size: { contentSize: [width: number, height: number], viewSize: [width: number, height: number] }) => {
  let [x, y] = point
  if (x < size.viewSize[0] / 2) {
    x = Math.min(x, size.viewSize[0] - size.contentSize[0])
  } else {
    x = Math.max(0, x - size.contentSize[0])
  }
  y = Math.min(size.viewSize[1] - size.contentSize[1], y)
  y = Math.max(0, y - 10)
  return [x, y];
}
const chartEl = ref()
let chartInstance = null
let chartOption: Record<string, any> = {
  tooltip: {
    show: true,
    trigger: 'axis',
    position: toolTipPosition,
    formatter(params) {
      let result = `<div>`;
      result += `<div>${params[0].axisValue}</div>`
      for (const index in params) {
        result += `
<div style="white-space: nowrap;display: flex;align-items: center;overflow: hidden;">
    <div style="display: inline-block;height: 10px;width:10px;border-radius: 50%;margin-right:10px;background-color:${params[index].color}" ></div>
    <div style="display:flex;flex:1;font-size: 14px;text-align: left;font-weight: 500;color: #555555;">
       <div style="flex:1;margin-right:10px">${params[index].seriesName}:</div>
       <div>
        <span>${props.isPercent ? percentDigitalFormatter(params[index].data) : params[index].data}</span>
        <span>${props.isPercent ? '%' : ''}</span>
       </div>
    </div>
</div>
`
      }
      result += `</div>`
      return result
    },
    axisPointer: { // 鼠标悬浮激活时阴影
      type: 'line',
      snap: true,
      lineStyle: {
        color: '#0075FF',
      }
    }
  },
  // height: 205,
  xAxis: {
    boundaryGap: true,
    splitArea: { // 列分隔交替色
      show: true,
      interval: 0,
    },
    type: 'category',
    data: [],
    axisLine: {
      show: true,
      lineStyle: {
        color: "#6f6f6f",
      },
    },
    axisTick: {
      show: false,
      alignWithLabel: true
    },
    axisLabel: {
      show: true, // echarts的label不会自动换行，自行添加label替代
      interval: 0, // 不自动隐藏横轴的label
    }
  },
  yAxis: {
    max: props.isPercent ? 100 : 'dataMax',
    min: 0,
    minInterval: props.isPercent ? 'auto' : 1,
    type: 'value',
    axisLine: {
      show: true,
      lineStyle: {
        color: "#cccccc"
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dotted',
        width: 1,
        color: "#cccccc"
      },
      noZero: true
    },
    axisLabel: {
      formatter: '{value}' + (props.isPercent ? '%' : ''),
      show: true,
      color: '#6f6f6f'
    }
  },
  label: {
    show: true
  },
  series: [
    // {
    //   name: '',
    //   cursor: 'default',
    //   smooth: false,
    //   symbolSize: 6,
    //   itemStyle: {
    //     color: '#3769FA',
    //   },
    //   label: {
    //     show: false,
    //   },
    //   data: [],
    //   type: 'line',
    //   z: 3
    // }
  ],
  legend: {
    show: true,
    // selectedMode: false,
    left: 100,
    itemGap: 30,
    type: 'scroll',
    icon: 'circle',
    itemHeight: 8,
    itemWidth: 8,
    itemStyle: {
      borderWidth: 0
    }
  },
  dataZoom: [
    {
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
  ]
}
// 调整数据缩放等级(仅再数据变更时触发即可)
const updateZoomData = () => {
  if (!(chartEl.value && chartInstance)) {
    return
  }
  const chartCurrentOption = chartInstance.getOption()
  let labelMaxWidth = props.data.labels?.reduce((maxWidth, e) => {
    let labelLength = 0
    for (let i = 0; i < String(e || '').length; i++) {
      if (encodeURI(String(e || '').charAt(i)).length === 9) {
        labelLength += chartCurrentOption.xAxis[0].axisLabel.fontSize * 1
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
const updateView = () => {
  if (props.data && props.data.labels && props.data.values) {
    chartOption.xAxis.data = props.data.labels.map(e => String(e || '')) // x轴数据
    props.data.values?.forEach((e, index) => {
      chartOption.series[index] = {
        name: e.name,
        cursor: 'default',
        smooth: false,
        symbolSize: 6,
        itemStyle: {
          color: e.color,
        },
        label: {
          show: false,
        },
        data: e.data || [],
        type: 'line',
        z: props.data.values.length - index + 1
      }
    })
    if (chartInstance) {
      chartInstance.setOption(chartOption, false, true)
      chartInstance.setOption(props.option || {}, false, true)
      chartInstance.setOption(updateZoomData() || {}, false, true)
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
  deep: true
})

watch(() => props.option, () => {
  updateView()
}, {
  deep: true
})

watch(() => props.isPercent, () => {
  updateView()
})

onMounted(() => {
  chartInstance = echarts.init(chartEl.value as HTMLElement, '', {devicePixelRatio: window.devicePixelRatio * 2})// 避免transform缩放导致图形模糊，暂时使用2。值太小，大图形会模糊；值太大，小图形会有锯齿边
  chartInstance.on('datazoom', () => {
    const dataZoomCurrent = chartInstance.getOption()?.dataZoom?.[0] // 用getOption获取改变的值
    const zoomWidth = (dataZoomCurrent?.end || 0) - (dataZoomCurrent?.start || 0)
    isAutoHideLabel.value = zoomWidth > currentMinZoomWidth
  })
  updateView()
  window.addEventListener('resize', resize)
})

watch(isAutoHideLabel, () => {
  chartInstance.setOption({
    xAxis: {
      axisLabel: {
        interval: isAutoHideLabel.value ? 'auto' : 0
      }
    }
  }, false, true)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})

</script>

<style lang="less" scoped>
.chart-line {
  height: 100%;
  position: relative;
  overflow: hidden;

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
