<template>
  <div class="chart-bar">
    <div class="header">
        <div class="charts-title">{{ title }}</div>
    </div>
    <div ref="chartEl" class="chart-bar__chart"/>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {legendWrap} from "../NameFormatter.js";
import {colorDefault, colorSelected} from "../ChartColors.js";

const defaultLabelFormatter = (value) => {
  if (value.endsWith('服务中心')) {
    return value.substring(0, value.length - 4) + '\n服务中心'
  }
  if (value.includes('(')) {
    return value.split('(').join('\n(')
  }
  if (value.includes('（')) {
    return value.split('（').join('\n（')
  }
  return legendWrap(value, 5)
}

export default {
  name: "chartBar",
  props: {
    title: String,
    data: {
      type: Object,
      default() {
        return {
          labels: [],
          values: [],
        }
      }
    },
    option: Object,
    zoom: Boolean,
    zoomWhenResize: Boolean,
    highlightName: Array,
    labelFormatter: Function,
  },
  data() {
    return {}
  },
  methods: {
    getFormattedLabel(val) {
      const formatterFun = this.labelFormatter || defaultLabelFormatter
      return formatterFun(val)
    },
    updateView() {
      const chartOption = {
        animation: false,
        grid: {
          bottom: 13,
          top: 40,
          left: 40,
          right: 30,
          containLabel: true,
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          borderColor: 'transparent',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            return `
<table style="position: relative;text-align: left;">
  <tr>
    <td>${params[0].axisValueLabel}</td>
  </tr>
  <tr>
    <td style="display: inline-block;background-color: ${params[0].color};height:0.6em;width: 0.6em;margin-right: 2px"/>
    <td style="display: inline-block">声量</td>
    <td style="display: inline-block;min-width: 4em;text-align: right;margin-left: 5px">${params[0].data}</td>
  </tr>
</table>
      `
          }
        },
        // height: 205,
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            show: true,
            lineStyle: {
              color: "#F2F3F5",
              alignWithLabel: true
            },
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 0, // 不自动隐藏横轴的label
            formatter: this.getFormattedLabel,
            color: '#86909C'
          }
        },
        yAxis: {
          // max: 100,
          // min: 0,
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#cccccc"
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              // type: 'dotted',
              width: 1,
              color: "#F2F3F5"
            },
          },
          axisLabel: {
            // formatter: '{value}',
            show: true,
            color: '#B8BCC4'
          }
        },
        label: {
          show: true
        },
        series: [
          {
            name: '',
            type: 'bar',
            // selectedMode: 'single',
            // select: {
            //   itemStyle: {
            //     color: colorSelectHighlight,
            //     borderWidth: 0
            //   }
            // },
            cursor: 'default',
            itemStyle: {
              color: (params) => (Array.isArray(this.highlightName) ? this.highlightName.includes(params.name) : params.name === this.highlightName) ? colorSelected : colorDefault,
              // borderRadius: [100, 100, 0, 0]
            },
            barWidth: 22,
            // barWidth: '30%',
            // barMinWidth: 22,
            // barMaxWidth: 44,
            label: {
              show: true,
              formatter: '{c}',
              position: 'top',
              fontFamily: 'OPPOSans-M, OPPOSans,sans-serif',
              fontWeight: 'normal',
              fontSize: 12,
            },
            data: [],
          },
        ],
        legend: {
          show: false,
        },
        dataZoom: this.zoom ? [
          {
            bottom: 0,
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
        ] : []
      }
      chartOption.xAxis.data = this.data?.labels || [] // x轴数据
      chartOption.series[0].data = this.data?.values || [] // 数据
      if (this.chartInstance) {
        this.chartInstance.setOption(chartOption, {notMerge: false, lazyUpdate: true, replaceMerge: ['series']})
        this.chartInstance.setOption(this.option || {}, false, true)
        if (this.zoom) {
          this.chartInstance.setOption(this.updateZoomData() || {}, false, true)
        }
      }
    },
    getChartWidth() {
      const chartCurrentOption = this.chartInstance.getOption()
      const chartELWidth = this.$refs.chartEl?.getBoundingClientRect().width //echarts整个canvas的宽度
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

      return chartELWidth - rightWidth - leftWidth//echarts实际绘制的宽度
    },
    updateZoomData() {
      if (!this.chartInstance) {
        return
      }
      const chartCurrentOption = this.chartInstance.getOption()
      let labelMaxWidth = this.data.labels?.reduce((maxWidth, e) => {
        let labelLength = 0
        const labelFormattedOneRow = this.getFormattedLabel(e)?.split('\n')[0]
        for (let i = 0; i < labelFormattedOneRow.length; i++) {
          if (encodeURI(String(e || '').charAt(i)).length === 9) {
            labelLength += chartCurrentOption.xAxis[0].axisLabel.fontSize * 1.5
          } else {
            labelLength += chartCurrentOption.xAxis[0].axisLabel.fontSize * 0.65
          }
        }
        return Math.max(maxWidth, labelLength)
      }, 0)

      const chartGraphWidth = this.getChartWidth()

      const zoomEnd = chartGraphWidth / (labelMaxWidth * this.data.labels.length) * 100 || 0
      return {
        dataZoom: [{
          type: 'slider',
          start: 0,
          end: zoomEnd || 100,
        }]
      }
    },
    resize() {
      if (this.zoomWhenResize) {
        this.chartInstance?.setOption(this.updateZoomData() || {}, false, true)
      }
      setTimeout(() => {
        this.chartInstance.resize()
      })
    },
  },
  computed: {
    watchTmp() {
      return [this.data, this.option, this.highlightName, this.labelFormatter]
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
.chart-bar {
  height: 100%;
  position: relative;

  .header {
    position: absolute;
    left: 10px;
    top: 10px;
  }

  &__chart {
    height: 100%;
  }
}
</style>
