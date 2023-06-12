<!--柱状图，主要用在详情中-->
<template>
  <div class="chart-bar">
    <div class="header">
      <div>
        <div class="charts-title"> {{ props.title }}</div>
      </div>
      <img class="charts-icon" @click="emits('download')" :src="HomeAssets.download" alt="download"/>
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
import * as HomeAssets from "home/assets";

export type ChartBarData = {
  labels: string[],
  values: number[],
}
const props = withDefaults(defineProps<{
  title?: string,
  data: ChartBarData,
  option?: Record<string, any>
}>(), {
  title: '',
  data: () => ({
    labels: [],
    values: [],
  }),
  option: () => ({})
})
const emits = defineEmits(['download'])
const chartEl = ref()
let chartInstance = null
let chartOption: Record<string, any> = {
  grid: {},
  tooltip: {
    show: true,
  },
  // height: 205,
  xAxis: {
    type: 'category',
    data: [],
    axisLine: {
      show: true,
      lineStyle: {
        color: "#6f6f6f",
        alignWithLabel: true
      },
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true, // echarts的label不会自动换行，自行添加label替代
      interval: 0, // 不自动隐藏横轴的label
      formatter: (value) => value.replace(/(.{5})/g, '$1\n') //每5个字符换行
    }
  },
  yAxis: {
    // max: 100,
    // min: 0,
    type: 'value',
    minInterval:1,
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
    },
    axisLabel: {
      // formatter: '{value}',
      show: true,
      color: '#6f6f6f'
    }
  },
  label: {
    show: true
  },
  series: [
    {
      name: '',
      cursor: 'default',
      itemStyle: {
        color: '#3769FA',
        borderRadius: [100, 100, 0, 0]
      },
      barWidth: '20',
      label: {
        show: true,
        formatter: '{c}',
        position: 'top',
        fontFamily: 'OPPOSans-M, OPPOSans,sans-serif',
        fontWeight: 'normal',
        fontSize: 14
      },
      data: [],
      type: 'bar',
    },
  ],
  legend: {
    show: false,
  },
}
const updateView = () => {
  if (props.data && props.data.labels && props.data.values) {
    chartOption.xAxis.data = props.data.labels // x轴数据
    chartOption.series[0].data = props.data.values // 数据
    if (chartInstance) {
      chartInstance.setOption(chartOption, false, true)
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
  overflow: hidden;

  .header {
    left:0;
    right:0;
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
