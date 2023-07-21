<!--柱状图，主要用在详情中-->
<template>
  <div class="chart-map-screen">
    <div ref="chartEl" class="chart-map-screen__chart"/>
    <div class="chart-map-screen__shadow-mask">
      声量排名:
    </div>
    <!--    <div class="chart-map-screen__shadow-mask" :style="{width:`${(String(maxValue).length-1)*15 + 70}px`}"></div>-->
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChartMapScreen'
}
</script>
<script lang="ts" setup>
import * as echarts from 'echarts'
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {colorSelected} from "@/components/AnalyzeCharts/ChartColors.ts";
import chinaJson from './china.geo.json'

const props = withDefaults(defineProps<{
  title?: string,
  data?: { name: string, value: number }[]
  option?: Record<string, any>
  areaSplit?: { name: string, contain: string[] }[]
  highlightName?: string
}>(), {
  title: '',
  option: () => ({})
})

const colors = [
  '#0600d2',
  '#62c1fb',
]

const maxValue = ref(0) // 记录数据中最大的值，利用其字符长度，设置图例的边框
const baseColors = '#adcefc'

const chartEl = ref()
let chartInstance: any = null
const nameMap = {
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
}
// 处理地图json，加右下角海南小窗口，修改宽高比。（原始json由https://github.com/TangSY/echarts-map-demo的在线demo中获取）
const buildMapJson = () => {
  const resultMapJson = JSON.parse(JSON.stringify(chinaJson))
  {
    // 重复海南省及虚线，制造右下角缩略图
    let extraData: any[] = []
    resultMapJson.features.forEach((e: any) => {
      // 区域改名
      if (nameMap && nameMap[e.properties.name]) {
        e.properties.name = nameMap[e.properties.name]
      }
      // 海南地图调整
      if (e.properties.name === '海南' || e.properties.name === '') {
        const tmp = JSON.parse(JSON.stringify(e))
        if (tmp.properties.name === '') {
          // 缩略边框部分
          tmp.geometry.coordinates.push([
            [[106, 20.7], [123, 20.7], [123, 20.71], [106, 20.71]],
            [[123, 20.7], [123, 2.7], [123.1, 2.7], [123.1, 20.7]],
            [[123, 2.7], [106, 2.7], [106, 2.71], [123, 2.71]],
            [[106, 20.7], [106, 2.7], [106, 2.71], [106, 20.71]],
          ])
        }
        // 缩略内容部分
        tmp.geometry.coordinates.forEach((c1: any) => {
          c1.forEach((c2: any) => {
            c2.forEach((coordinate: any) => {
              if (coordinate[1] > 20.8) {
                coordinate = []
              }
              const miniMapScaleRate = 1.9
              coordinate[0] += 142.5
              coordinate[1] += 32
              coordinate[0] /= miniMapScaleRate
              coordinate[1] /= miniMapScaleRate
            })
          })
        })
        extraData.push(tmp)
      }

    })

    resultMapJson.features.push(...extraData)
  }
  // 将地图变扁
  {
    const scaleY = 1.15
    const moveY = 5
    resultMapJson.features.forEach(e => {
      e.geometry.coordinates.forEach(c1 => {
        c1.forEach(c2 => {
          if (Array.isArray(c2) && !Number.isNaN(c2[1])) {
            c2[1] /= scaleY
            c2[1] += moveY
          }
          c2.forEach(coordinate => {
            if (Array.isArray(coordinate) && !Number.isNaN(coordinate[1])) {
              coordinate[1] /= scaleY
              coordinate[1] += moveY
            }
          })
        })
      })
    })
  }
  return resultMapJson
}
const chinaMap = buildMapJson()

let dataSorted = []

const updateView = () => {
  // 从大到小排序
  dataSorted = JSON.parse(JSON.stringify(props.data || []))
  dataSorted.sort((a, b) => {
    if (a.value < b.value) {
      return 1
    } else if (a.value === b.value) {
      return 0
    } else {
      return -1
    }
  })

  echarts.registerMap('ZH', chinaMap)
  const minSplit = 5 * 1000
  let maxTmp = dataSorted.map(e => e.value)?.sort((a, b) => a > b ? 1 : -1)?.slice(-1)[0] || 0
  if (maxTmp % minSplit) {
    maxTmp += minSplit - (maxTmp % (minSplit))
  }
  const chartOption: Record<string, any> = {
    tooltip: {
      trigger: 'item',
      backgroundColor: "rgba(1,41,112,0.8)",
      padding: [5, 10],
      borderWidth: 1,
      borderColor: 'rgb(26,85,173)',
      formatter: (params) => {
        if (!params.name) {
          return ``
        }
        const num = dataSorted[params.dataIndex]?.value
        return `
<table style="position: relative;text-align: left;color:white">
  <tr>
    <td colspan="2">声量排名</td>
  </tr>
  <tr>
    <td style="display: inline-block;text-align: left">${params.name} :</td>
    <td style="display: inline-block;text-align: right;margin-left: 5px">${num || 0}</td>
  </tr>
</table>
      `
      }
    },
    visualMap: { // 分段颜色 和 图例
      inverse: true,
      show: true,
      type: 'piecewise',
      splitNumber: 5, // 连续型数据，总共分几段
      precision: 0,
      itemHeight: 4,
      itemWidth: 14,
      itemSymbol: 'rect',
      backgroundColor: 'rgba(2,25,59,0.8)',
      // borderColor: 'rgba(255,255,255,0.49)',
      // borderWidth: 1,
      padding: 10,
      textStyle: {
        color: 'white'
      },
      pieces: [
        {gte: 1, lte: 5},
        {gte: 6, lte: 10},
        {gte: 11, lte: 15},
        {gte: 16, lte: 20},
        {gt: 21, label: '21以后'},
      ],
      align: 'left',
      right: 55,
      bottom: 155,
      min: 0,
      max: maxTmp || 100,
      inRange: {
        color: colors
      },
    },
    series: [
      {
        selectedMode: true, // 板块选中
        // boundingCoords: [ // 变形前的位置
        //   [72, 50.2], // 定位左上角经纬度
        //   [135, 21.5]// 定位右下角经纬度
        // ],
        boundingCoords: [
          [76, 42.2], // 定位左上角经纬度
          [135, 30.5] // 定位右下角经纬度
        ],
        // layoutCenter: ['49%', '70%'], // 地图位置(弃用，使用boundingCoords定位)
        // layoutSize: 720, // 地图大小(弃用，使用boundingCoords定位)
        select: {
          itemStyle: {
            areaColor: colorSelected,
          },
          label: {
            color: 'black',
            textBorderColor: 'white',
            textBorderWidth: 3,
            position: 'inside'
          }
        },
        type: 'map',
        name: '',
        // zoom: 1,
        map: 'ZH',
        label: {
          show: false,
          position: 'inside'
        },
        itemStyle: {
          borderWidth: 1,
          borderColor: 'rgb(226,249,253)',
          areaColor: baseColors
        },
        data: dataSorted.map((e, i) => ({name: e.name, value: i + 1, num: e.value})),
        // 自定义名称映射
        nameMap: {},
        emphasis: {
          label: {
            show: false,
            position: 'inside'
          },
          itemStyle: {
            borderColor: colorSelected,
            areaColor: colorSelected
          },
        },
      },
    ]
  }

  maxValue.value = chartOption.visualMap.max || 0
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
watch(() => props, () => {
  updateView()
}, {
  deep: true
})
const stopEvent = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}

onMounted(() => {
  chartInstance = echarts.init(chartEl.value as HTMLElement, '', {devicePixelRatio: window.devicePixelRatio * 2})// 避免transform缩放导致图形模糊，暂时使用2。值太小，大图形会模糊；值太大，小图形会有锯齿边
  updateView()
  // 阻止点击地图切换选中项
  chartEl.value.addEventListener('click', stopEvent, {passive: false, capture: true})
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  chartEl.value?.removeEventListener('click', stopEvent)
  window.removeEventListener('resize', resize)
})

</script>

<style lang="less" scoped>
.chart-map-screen {
  height: 100%;
  position: relative;
  overflow: hidden;

  &__chart {
    height: 100%;
  }

  &__shadow-mask {
    width: 115px;
    height: 150px;
    position: absolute;
    bottom: 155px;
    right: 30px;
    pointer-events: none;
    box-shadow: 0 0 20px rgba(0, 102, 204, 0.73) inset;

    font-size: 13px;
    text-align: left;
    padding: 10px 15px;
  }
}
</style>
