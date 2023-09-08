<template>
  <div class="chart-map">
    <div class="header">
      <div class="charts-title">{{ this.title }}</div>
    </div>
    <div ref="chartEl" class="chart-map__chart"/>
    <!--  图例  -->
    <div class="legend">
      <div>声量排名：</div>
      <div class="legend__item" v-for="item in legendNum" :key="item">
        <div class="legend__color" :style="{backgroundColor: getDataColorByRank( (item - 1) * legendRange + 1)}"></div>
        <div v-if="item!==legendNum">
          <span>{{ (item - 1) * legendRange + 1 }}</span>
          <span>-</span>
          <span>{{ item * legendRange }}</span>
        </div>
        <div v-else>{{ (item - 1) * legendRange + 1 }}以后</div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
import Color from 'color'
import {colorDefault, colorSelected} from "../ChartColors";
import buildMapArea from "./buildMapArea";

export default {
  name: "chartMap",
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    option: {
      type: Object,
      default() {
        return {}
      }
    },
    areaSplit: {
      type: Array,
      default() {
        return []
      }
    },
    highlightName: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      chartInstance: null,
      legendNum: 5,
      legendRange: 5,
      colors: [
        colorDefault,
        '#a6dbff'
      ]
    }
  },
  computed: {
    watchTmp() {
      return [this.data, this.option, this.areaSplit, this.highlightName]
    }
  },
  watch: {
    watchTmp: {
      handler() {
        this.updateView()
      },
      deep: true
    }
  },
  mounted() {
    this.chartInstance = echarts.init(this.$refs.chartEl, '', {devicePixelRatio: window.devicePixelRatio * 2})
    this.updateView()
    window.addEventListener('resize', this.resize)
  },
  destroyed() {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    resize() {
      setTimeout(() => {
        this.chartInstance.resize()
      })
    },
    getOpacityColor(hexColor, opacity) {
      const colorTmp = new Color(hexColor)
      return `rgba(${colorTmp.red()},${colorTmp.green()},${colorTmp.blue()},${opacity})`
    },
    getDataColorByRank(val) {
      const sColor = new Color(this.colors[0]).array()
      const eColor = new Color(this.colors[1]).array()
      const splitNum = this.legendNum - 1
      const rStep = (eColor[0] - sColor[0]) / splitNum;
      const gStep = (eColor[1] - sColor[1]) / splitNum;
      const bStep = (eColor[2] - sColor[2]) / splitNum;

      if (val === null || val === undefined) {
        return this.getOpacityColor(colorDefault, 0.05)
      } else if (val === 0) {
        return this.getOpacityColor(colorDefault, 0.1)
      } else {
        const r = Math.floor(rStep * Math.floor(Math.min((val - 1) / this.legendRange, splitNum)) + sColor[0])
        const g = Math.floor(gStep * Math.floor(Math.min((val - 1) / this.legendRange, splitNum)) + sColor[1])
        const b = Math.floor(bStep * Math.floor(Math.min((val - 1) / this.legendRange, splitNum)) + sColor[2])
        return new Color(`rgb(${r},${g},${b})`).hex()
      }
    },
    updateView() {
      this.legendRange = this.areaSplit?.length ? 1 : 5
      const sortedData = this.data
          ?.map(e => ({...e, value: e.value || 0}))?.sort((a, b) => a.value < b.value ? 1 : -1)
          .filter(e => e.name) || []
      const isAllZero = sortedData[0]?.value === 0
      sortedData.forEach((e, i) => {
        e.num = e.value
        e.value = isAllZero ? 0 : i + 1
      })
      this.legendNum = 5
      const chartOption = {
        animation: false,
        tooltip: {
          trigger: 'item',
          borderColor: 'transparent',
          formatter: (params) => {
            if (!params.name) {
              return undefined// 不显示tooltip
            }
            if (!params.value && params.value !== 0) {
              return params.name
            }
            const dataDetail = sortedData?.[params.dataIndex]?.detail
            if (dataDetail?.length) { // 合并的 有详情
              let result = '<table style="position: relative;text-align: left;">'
              result += dataDetail.map(e => `
  <tr>
    <td colspan="4">${e.name}</td>
  </tr>
  <tr>
    <td style="display: inline-block;background-color: ${this.getDataColorByRank(params.value)};height:0.6em;width: 0.6em;margin-right:5px"/>
    <td style="display: inline-block">声量</td>
    <td style="display: inline-block;min-width: 4em;text-align: right;margin-left: 5px">${e.value || 0}</td>
  </tr>`).join('')
              result += '</table>'
              return result;
            } else { // 无详情
              return `
<table style="position: relative;text-align: left;">
  <tr>
    <td colspan="4">${params.name}</td>
  </tr>
  <tr>
    <td style="display: inline-block;background-color: ${this.getDataColorByRank(params.value)};height:0.6em;width: 0.6em;margin-right:5px"/>
    <td style="display: inline-block">声量</td>
    <td style="display: inline-block;min-width: 4em;text-align: right;margin-left: 5px">${sortedData?.[params.dataIndex].num || 0}</td>
  </tr>
</table>
      `
            }
          }
        },
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
              if (this.areaSplit?.map(e => e.name).includes(params.name)) {
                return params.name + '\n' + (sortedData?.find(e => e.name === params.name)?.num || 0)
              }
              return ''
            }
          },
          itemStyle: {
            borderWidth: 1,
            borderColor: 'white',
            areaColor: this.getDataColorByRank()
          },
          select: false,
          emphasis: {
            itemStyle: {
              color: '#333',
              // borderWidth: 2,
              // borderColor: 'rgba(255,106,0,1)',
              // areaColor: 'inherit',
              areaColor: this.getOpacityColor(colorSelected, 0.65) //'rgba(255,106,0,0.6)'
            },
          },
          regions: [
            // 以数据量为参考填色，若选中则直接选中色
            ...sortedData?.map(e => ({
              name: e.name,
              itemStyle: {
                areaColor: this.getDataColorByRank(e.value)
              }
            })) || [],
            // 选中的高亮色区域，如果和上面的重复，则会覆盖颜色
            ...this.highlightName?.map(name => ({
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
            data: sortedData || [],
          }
        ]
      }
      echarts.registerMap('ZH', buildMapArea(this.areaSplit, {
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
      if (this.chartInstance) {
        this.chartInstance.setOption(chartOption, {notMerge: true, lazyUpdate: true, replaceMerge: ['series']})
        this.chartInstance.setOption(this.option || {}, false, true)
      }
    }
  }
}
</script>


<style scoped lang="scss">
.chart-map {
  height: 100%;
  position: relative;
  overflow: hidden;

  .header {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  &__chart {
    height: 100%;
  }

  .legend {
    font-size: 12px;
    pointer-events: none;
    text-align: left;
    position: absolute;
    bottom: 10px;
    right: 10px;

    &__item {
      display: flex;
      align-items: center;
      margin: 4px 0;
    }

    &__color {
      margin-right: 5px;
      display: inline-block;
      height: 3px;
      width: 15px;
    }
  }
}
</style>
