<template>
  <div class="chart-bar">
    <div class="header">
      <div class="charts-title">{{ title }}</div>
    </div>
    <div ref="chartEl" class="chart-bar__chart"/>
  </div>
</template>

<script>
import {percentDigitalFormatter} from "../NumFormatter";
import {colorSpecial} from "../ChartColors";
import * as echarts from "echarts";

export default {
  name: "chartBarHorizontal",
  props: {
    title: String,
    data: {
      type: Object,
      default() {
        return {
          labels: [],
          percents: [],
          nums: []
        }
      },
      option: Object
    }
  },
  methods: {
    updateView() {
      const chartOption = {
        animation: false,
        grid: {
          containLabel: true,
          bottom: 10,
          top: 30,
          left: 20,
          right: 40
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          borderColor: 'transparent',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            let result = ''
            result += `
<table style="text-align: left">
  <tr>
    <td colspan="10">${params[0].axisValueLabel}</td>
  </tr>
  <tr>
    <td>
      <div style="background-color: ${params[0].color};height:0.6em;width: 0.6em;margin-right: 2px"></div>
    </td>
    <td style="width: 40px">占比 </td>
    <td style=";text-align: right;margin-left: 5px">${percentDigitalFormatter(params[0].data || 0)}%</td>
  </tr>
</table>
      `
            //<td style="width: 3em;text-align: right;">, 声量:</td>
            //   <td style="text-align: right;">${[...props.data.nums || []].reverse()[params[0].dataIndex] || 0}</td>
            return result
          }
        },
        // height: 205,
        yAxis: {
          type: 'category',
          data: [],
          axisLine: {
            show: false,
            lineStyle: {
              color: "#6f6f6f",
              alignWithLabel: true
            },
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            interval: 0, // 不自动隐藏横轴的label
            // formatter: (value) => legendWrap(value,10)
          }
        },
        xAxis: {
          max: 'maxData',
          min: 0,
          type: 'value',
          minInterval: 1,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#cccccc"
            },
          },
          splitLine: {
            show: false,
            lineStyle: {
              type: 'dotted',
              width: 1,
              color: "#cccccc"
            },
          },
          axisLabel: {
            // formatter: '{value}',
            show: false,
            color: '#6f6f6f'
          }
        },
        label: {
          show: true,
          offset: [0, 1]
        },
        series: [
          {
            name: '',
            type: 'bar',
            cursor: 'default',
            itemStyle: {
              color: colorSpecial,
              // borderRadius: [100, 100, 0, 0]
            },
            barWidth: 16,
            label: {
              show: true, // 条顶部数值
              formatter: '{c}%',
              position: 'right',
              fontFamily: 'OPPOSans-M, OPPOSans,sans-serif',
              fontWeight: 'normal',
              fontSize: 12
            },
            data: [],
          },
        ],
        legend: {
          show: false,
        },
      }

      if (this.data) {
        chartOption.yAxis.data = [...this.data.labels || []].reverse() // x轴数据
        chartOption.series[0].data = [...this.data.percents || []].reverse() // y轴数据
        if (this.chartInstance) {
          this.chartInstance.setOption(chartOption, {notMerge: false, lazyUpdate: true, replaceMerge: ['series', 'yAxis']})
          this.chartInstance.setOption(this.option || {}, false, true)
        }
      }
    },
    resize() {
      setTimeout(() => {
        this.chartInstance.resize()
      })
    },
  },
  computed: {
    watchTmp() {
      return [this.data, this.option, this.isPercent, this.hasAreaColor]
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
