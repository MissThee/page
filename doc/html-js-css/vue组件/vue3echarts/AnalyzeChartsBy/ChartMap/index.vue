<!--柱状图，主要用在详情中-->
<template>
  <div class="chart-map">
    <div class="header">
      <div>
        <div class="charts-title">{{ props.title }}</div>
      </div>
      <!-- <img class="charts-icon" @click="emits('download')" :src="HomeAssets.download" alt="download"/> -->
    </div>
    <div ref="chartEl" class="chart-map__chart"/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChartMap'
}
</script>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import color from 'color'
import {colorDefault, colorSelected} from "@/components/AnalyzeCharts/ChartColors.ts";
import buildMapArea from "@/components/AnalyzeCharts/ChartMap/buildMapArea.ts";
import {EChartsType} from "echarts";

export interface ChartMapData {
  name: string,
  value: number
}

const props = withDefaults(defineProps<{
  title?: string,
  data?: ChartMapData[]
  option?: Record<string, any>
  areaSplit?: { name: string, contain: string[] }[]
  highlightName?: string | string[]
}>(), {
  title: '',
  option: () => ({})
})
const colorTmp = new color(colorDefault)

const colors = [
  `rgba(${colorTmp.red()},${colorTmp.green()},${colorTmp.blue()},${0.2})`,
  `rgba(${colorTmp.red()},${colorTmp.green()},${colorTmp.blue()},${0.8})`
]


const baseColor = `rgba(${colorTmp.red()},${colorTmp.green()},${colorTmp.blue()},${0.05})`

const chartEl = ref()
let chartInstance: EChartsType | null = null
// let clickPart = []
const updateView = () => {
  const sortedData = props.data?.map(e => e.value || 0)?.sort((a, b) => a > b ? 1 : -1) || []
  const maxVal = sortedData?.slice(-1)[0] || 0
  const minVal = sortedData?.[0] || 0

  const getDataColorByValue = (val) => {
    if (!val && val !== 0) {
      return baseColor
    }
    const opacityMin = 0.2
    const opacityMax = 0.8
    let opacity = opacityMin
    if (maxVal === 0 && minVal === 0) {
      opacity = opacityMin
    } else if (maxVal !== 0 && maxVal === minVal) {
      opacity = opacityMax
    } else if (maxVal > minVal) {
      opacity = (val - minVal) / (maxVal - minVal) * (opacityMax - opacityMin) + opacityMin
    }
    return `rgba(${colorTmp.red()},${colorTmp.green()},${colorTmp.blue()},${opacity})`
  }
  const chartOption: Record<string, any> = {
    animation: false,
    tooltip: {
      trigger: 'item',
      borderColor: 'transparent',
      formatter: (params: any) => {
        return params.name ? `
<table style="position: relative;text-align: left;">
  <tr>
    <td colspan="4">${params.name}</td>
  </tr>
  <tr>
    <td style="display: inline-block;background-color: ${getDataColorByValue(params.value)};height:0.6em;width: 0.6em;margin-right:5px"/>
    <td style="display: inline-block">声量</td>
    <td style="display: inline-block;min-width: 4em;text-align: right;margin-left: 5px">${params.value || 0}</td>
  </tr>
</table>
      ` : undefined
      } //'{b}<br/>{c}'
    },
    // toolbox: {
    //   show: true,
    //   orient: 'vertical',
    //   left: 'right',
    //   top: 'center',
    //   feature: {
    //     dataView: {readOnly: false},
    //     restore: {},
    //     saveAsImage: {}
    //   }
    // },
    // visualMap: { // 分段颜色 和 图例
    //   show: false,
    //   type: 'piecewise',
    //   splitNumber: 10, // 连续型数据，总共分几段
    //   // pieces: [
    //   //   {gt: 15000},            // (1500, Infinity]
    //   //   {gt: 10000, lte: 15000},  // (900, 1500]
    //   //   {gt: 3000, lte: 10000},  // (310, 1000]
    //   //   {gt: 2000, lte: 3000},   // (200, 300]
    //   //   {gt: 1, lte: 2000, label: '1 到 2000（自定义label）'},       // (10, 200]
    //   //   // {value: 123, label: '123（自定义特殊颜色）', color: 'grey'},  // [123, 123]
    //   //   // {lt: 5}                 // (-Infinity, 5)
    //   // ],
    //   min: 0,
    //   max: props.data?.map(e => e.value)?.sort((a, b) => a > b ? 1 : -1)?.slice(-1)[0] || 1,
    //   inRange: {
    //     color: colors
    //   },
    // },
    geo: {
      map: 'ZH',
      roam: false,
      zoom: 1.2,
      label: {
        show: true,
        lineHeight: 14,
        textBorderColor: 'white',
        textBorderWidth: 2,
        position: 'bottom',
        formatter: (params) => {
          if (props.areaSplit?.map(e => e.name).includes(params.name)) {
            return params.name + '\n' + (props.data?.find(e => e.name === params.name)?.value || 0)
          }
          return ''
        }
      },
      itemStyle: {
        borderWidth: 1,
        borderColor: 'white',
        areaColor: baseColor
      },
      select: false,
      emphasis: {
        itemStyle: {
          color: '#333',
          // borderColor: 'rgba(255,0,0,0.52)',
          areaColor: 'rgba(234,184,0,0.62)'
        },
      },
      regions: [
        // 以数据量为参考填色，若选中则直接选中色
        ...props.data?.map(e => ({
          name: e.name,
          itemStyle: {
            areaColor: getDataColorByValue(e.value)
          }
        })) || [],
        // 选中的高亮色区域，如果和上面的重复，则会覆盖颜色
        ...props.highlightName?.map(name => ({
          name,
          itemStyle: {
            areaColor: colorSelected
          }
        })) || [],
      ],
    },
    series: [
      {
        geoIndex: 0,
        type: 'map',
        data: props.data || [],
      }
    ]
  }
  echarts.registerMap('ZH', buildMapArea(props.areaSplit, {
    '北京市': '北京',
    '天津市': '天津',
    '河北省': '河北',
    '山西省': '山西',
    '内蒙古自治区': '内蒙古',
    '辽宁省': '辽宁',
    '吉林省': '吉林',
    '黑龙江省': '黑龙江',
    '上海市': '上海',
    '江苏省': '江苏',
    '浙江省': '浙江',
    '安徽省': '安徽',
    '福建省': '福建',
    '江西省': '江西',
    '山东省': '山东',
    '河南省': '河南',
    '湖北省': '湖北',
    '湖南省': '湖南',
    '广东省': '广东',
    '广西壮族自治区': '广西',
    '海南省': '海南',
    '重庆市': '重庆',
    '四川省': '四川',
    '贵州省': '贵州',
    '云南省': '云南',
    '西藏自治区': '西藏',
    '陕西省': '陕西',
    '甘肃省': '甘肃',
    '青海省': '青海',
    '宁夏回族自治区': '宁夏',
    '新疆维吾尔自治区': '新疆',
    '台湾省': '台湾',
    '香港特别行政区': '香港',
    '澳门特别行政区': '澳门',
  }))
  if (chartInstance) {
    chartInstance.setOption(chartOption, {notMerge: true, lazyUpdate: true, replaceMerge: ['series']})
    chartInstance.setOption(props.option || {}, false, true)
    // 设置高亮区域（高亮使用选中的区块效果实现。高亮效果留给鼠标hover，只有红边框，不变色）
    // setTimeout(() => {
    //   chartInstance?.dispatchAction({type: 'unselect', seriesIndex: 0})
    //   const highlightNameArr = Array.isArray(props.highlightName) ? props.highlightName : [props.highlightName]
    //   highlightNameArr.forEach(name => {
    //     chartInstance?.dispatchAction({type: 'select', seriesIndex: 0, name: name})
    //   })
    // })
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
.chart-map {
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
