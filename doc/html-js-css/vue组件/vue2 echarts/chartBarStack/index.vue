<template>
  <div class="chart-bar">
    <div class="header">
      <div class="charts-title">{{ title }}</div>
    </div>
    <div ref="chartEl" class="chart-bar__chart"/>
  </div>
</template>

<script>
// 获取字符串中文字符个数。中文算1，英文算0.5
import {percentDigitalFormatter} from "../NumFormatter";
import {colorDefault} from "../ChartColors";
import * as echarts from "echarts";

const getZhWordNum = (val) => {
  let labelCharNum = 0
  for (let i = 0; i < val.length; i++) {
    if (encodeURI(val.charAt(i)).length === 9) {
      labelCharNum += 1// 中文
    } else {
      labelCharNum += 0.5
    }
  }
  return labelCharNum
}


export default {
  name: "chartBarStack",
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
    option: Object
  },
  methods: {
    updateView() {
      const chartOption = {
        animation: false,
        grid: {
          containLabel: true,
          bottom: 10,
          top: 40,
          left: 40,
          right: 30
        },
        tooltip: {
          show: true,
          borderColor: 'transparent',
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            const dataRow = params.map((e) => `
<tr>
    <td >
      <div style="display: inline-block;background-color: ${e.color};height:0.6em;width: 0.6em;margin-right: 2px"></div>
    </td>
    <td>${e.seriesName}:</td>
    <td style=";text-align: right;margin-left: 5px">${percentDigitalFormatter(e.data || 0)}%</td>
</tr>
`)
            //   <td style="width: 3em;text-align: right;">, 编码量:</td>
            //   <td style="text-align: right;">${[...props.data.values || []].reverse()[e.seriesIndex]?.nums?.[e.dataIndex] || 0}</td>
            return `
<table style="position: relative;text-align: left;width: 100%">
  <tr>
    <td colspan="5">${params[0].axisValueLabel}</td>
  </tr>
  ${dataRow.reverse().join('')}
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
            formatter: (value) => {
              if (value.includes(' ')) { // 名字有空格的，在空格位换行
                let result = ''
                const valueArr = value.split(' ')
                for (let i = 0; i < valueArr.length; i++) {
                  const currentPiece = (result ? ' ' : '') + valueArr[i]
                  const isNeedCut = getZhWordNum(result.substring(result.lastIndexOf('\n')) + currentPiece) > 4
                  result += isNeedCut ? '\n' + currentPiece.trimStart() : currentPiece
                }
                return result
              }
              if (getZhWordNum(value) > 4) {
                return value.substring(0, Math.ceil(value.length / 2)) + '\n' + value.substring(Math.ceil(value.length / 2))
              }
              return value
            },
            color: '#86909C'
          }
        },
        yAxis: {
          max: 100,
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
            formatter: '{value}%',
            show: true,
            color: '#B8BCC4'
          }
        },
        label: {
          show: true
        },
        series: [],
        legend: {
          top:10,
          right: 30,
          show: true,
          // selectedMode: false,
          // left: 100,
          itemGap: 30,
          type: 'scroll',
          icon: 'rect',
          itemHeight: 8,
          itemWidth: 8,
        },
      }
      chartOption.xAxis.data = this.data?.labels || [] // x轴数据
      chartOption.legend.data = []
      this.data.values.forEach((v, i) => {
        chartOption.legend.data.push({
          name: v.name || '',
          itemStyle: {
            color: v.color || colorDefault,
          }
        })
        chartOption.series[i] = {
          name: v.name || '',
          type: 'bar',
          cursor: 'default',
          stack: 'stack',
          itemStyle: {
            color: v.color || colorDefault,
          },
          barWidth: 40,
          label: {
            show: true,
            formatter: (params) => {
              if (params.value >= 5) {
                return percentDigitalFormatter(params.value) + '%'
              } else {
                return ''
              }
            },
            // position: 'top',
            fontFamily: 'OPPOSans-M, OPPOSans,sans-serif',
            fontWeight: 'normal',
            fontSize: 12,
            color: 'white'
          },
          data: v.percents || [],
        }
      })
      chartOption.series = chartOption.series.reverse()
      if (this.chartInstance) {
        this.chartInstance.setOption(chartOption, {notMerge: false, lazyUpdate: true, replaceMerge: ['series', 'yAxis']})
        this.chartInstance.setOption(this.option || {}, false, true)
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
}
</script>

<style scoped lang="scss">
.chart-bar {
  height: 100%;
  position: relative;
  overflow: hidden;

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
