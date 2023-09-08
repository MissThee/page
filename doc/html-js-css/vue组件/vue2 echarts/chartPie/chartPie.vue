<template>
  <div class="chart-pie" ref="selfRef">
    <div class="header">
      <div class="charts-title">{{ title }}</div>
    </div>
    <div class="chart-pie__body" style="height: 100%;margin:auto" :style="{maxWidth:maxWidth+'px'}">
      <div class="chart-pie__chart" ref="chartEl"/>
      <div class="chart-pie__info" :class="{'chart-pie__info--center':isBottomLegend}" v-if="centerInfo">
        <div style="transform-origin: 50% 50%" :style="{transform: `scale(${centerScaleRate})`}">
          <div class="title" v-if="centerInfo.title ">{{ centerInfo.title }}</div>
          <div class="subtitle" v-if="centerInfo.unit">
            <span class="num">{{ totalNum }}</span>
            <span class="unit">{{ centerInfo.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {percentDigitalFormatter} from "../NumFormatter";
import * as echarts from "echarts";

const getTooltip = (params) => {
  return `
<div style="font-size: 13px;text-align: left;">
    <div >${params.data.name}</div>
    <div style="white-space: nowrap">
        <div style="display: inline-block;vertical-align: middle;margin-top: -2px;height: 8px;width:8px;background-color: ${params.color};border-radius: 50%;margin-right: 5px" ></div>
        <span>占比: ${percentDigitalFormatter(params.percent)}%</span>
    </div>
</div>
`
}
export default {
  name: "chartPie",
  props: {
    title: String,
    centerInfo: Object,
    data: {
      type: Array,
      default() {
        return []
      }
    },
    option: Object,
    isBottomLegend: Boolean,
    isTopLegend: Boolean,
    maxWidth: Number,
    reverseRotate: Boolean,
  },
  data() {
    return {
      totalNum: 0,
      centerScaleRate: 1
    }
  },
  methods: {
    updateView() {
      const chartOption = {
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
            minAngle: 23,
            left: 0,
            right: '26%',
            radius: [this.centerInfo ? '54%' : 0, '90%'],
            clockwise: !this.reverseRotate,
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
            // minShowLabelAngle: 20,
            label: {
              formatter: (params) => params.percent ? percentDigitalFormatter(params.percent) + '%' : '',
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
              overflow: 'truncate',
              backgroundColor: 'inherit',
              padding: 2,
              borderRadius: 6
            },
            emphasis: {
              scaleSize: 12,
              label: {
                show: true,
                // textBorderColor: 'inherit',
                // textBorderWidth: 4,
                backgroundColor: 'inherit',
                padding: 2,
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
          type: 'scroll',
          itemGap: Math.max(Math.min((this.$refs.chartEl?.getBoundingClientRect()?.height || 0) / (this.data.length + 1) - 14, 30), 5),
          icon: 'circle',
          itemHeight: 10,
          itemWidth: 10,
          data: this.data.map(e => ({name: e.name, itemStyle: {color: e.color}}))
        }
      }
      if (!this.chartInstance) {
        return
      }
      // chartInstance && this.chartInstance.resize()
      // 设置数据和配置
      this.totalNum = this.data.reduce((total, e) => total + Number(e.value), 0)
      this.data.forEach((e, index) => {
        let valueTmp
        if (this.totalNum) {
          valueTmp = e.value
          if (Number(percentDigitalFormatter(Number(e.value) * 100 / this.totalNum)) === 0) {
            valueTmp = undefined
          }
        } else {
          valueTmp = 0
        }
        chartOption.series[0].data[index] = {
          value: valueTmp === undefined ? undefined : Number(valueTmp),
          name: e.name,
          itemStyle: {
            color: e.color
          }
        }
      })
      if (this.totalNum === 0) { // 全部数据为0时的样式
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
      this.chartInstance.setOption(chartOption, {notMerge: false, lazyUpdate: true, replaceMerge: ['series']})
      // 是否逆时针绘制饼图
      if (this.reverseRotate) {
        const optionTmp = {
          series: [
            {
              startAngle: 90 - (this.totalNum ? (Number(chartOption.series[0]?.data?.[0].value) || 0) / this.totalNum * 360 : 0)
            }
          ],
        }
        this.chartInstance.setOption(optionTmp, false, true)
      }
      // 是否是低端图例
      if (this.isBottomLegend) {
        const optionTmp = {
          series: [
            {
              right: 0,
            }
          ],
          legend: {
            orient: 'horizontal',
            itemGap: 30,
            left: 'center',
            right: 'auto',
            top: '85%',
          }
        }
        this.chartInstance.setOption(optionTmp, false, true)
      }
      if(this.isTopLegend){
        const optionTmp = {
          series: [
            {
              right: 0,
            }
          ],
          legend: {
            orient: 'horizontal',
            itemGap: 30,
            left: 'center',
            right: 'auto',
            top: '15%',
          }
        }
        this.chartInstance.setOption(optionTmp, false, true)
      }

      this.chartInstance.setOption(this.option || {}, false, true) // 合并父级传入的配置
    },
    resize() {
      setTimeout(() => {
        this.chartInstance?.resize()
        const originWidth = this.isBottomLegend ? 250 : 400
        if (this.$refs.selfRef) {
          this.centerScaleRate = Math.max(Math.min(this.$refs.selfRef.getBoundingClientRect().width / originWidth, 2), 1)
        }
      })
    }
  },
  computed: {
    watchTmp() {
      return [this.data, this.option]
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
}
</script>

<style scoped lang="scss">
.chart-pie {
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  width: 100%;

  .header {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  &__chart {
    padding-top: 20px;
    height: 100%;
  }

  &__info {
    pointer-events: none;
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
