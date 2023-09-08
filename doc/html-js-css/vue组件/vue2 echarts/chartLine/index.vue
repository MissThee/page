<template>
  <div class="chart-line">
    <div class="header">
      <div class="charts-title">{{ this.title }}</div>
    </div>
    <div ref="chartEl" class="chart-line__chart"/>
  </div>
</template>

<script>
import {colorNegative, colorNeutral, colorPositive} from "../ChartColors";
import Color from 'color';
import * as echarts from 'echarts'
import {percentDigitalFormatter} from "../NumFormatter.js";

export default {
  name: "chartLine",
  props: {
    title: String,
    data: {
      type: Object,
      default() {
        return {
          labels: [],
          values: []
        }
      }
    },
    isPercent: Boolean,
    hasAreaColor: Boolean,
    option: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currentMinZoomWidth: 100,
      chartInstance: null,

    }
  },
  methods: {
    updateView() {
      if (this.data) {
        const chartOption = {
          animation: false,
          color: [colorPositive, colorNegative, colorNeutral],
          grid: {
            bottom: 0,
            top: 40,
            left: 0,
            right: 0,
            containLabel: true
          },
          tooltip: {
            show: true,
            borderColor: 'transparent',
            trigger: 'axis',
            formatter: (params) => {
              let result = `<div>`;
              result += `<div style="text-align: left">${params[0].axisValue}</div>`
              for (const index in params) {
                result += `
<div style="white-space: nowrap;display: flex;align-items: center;overflow: hidden;">
    <div style="display: inline-block;height: 2px;width:10px;margin-right:10px;background-color:${params[index].color}" ></div>
    <div style="display:flex;flex:1;font-size: 14px;text-align: left;font-weight: 500;color: #555555;">
       <div style="flex:1;margin-right:10px">${params[index].seriesName}:</div>
       <div>
        <span>${this.isPercent ? percentDigitalFormatter(params[index].data) : params[index].data}</span>
        <span>${this.isPercent ? '%' : ''}</span>
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
              show: false,
              interval: 0,
            },
            type: 'category',
            data: [],
            axisLine: {
              show: false,
              lineStyle: {
                color: "#F2F3F5",
              },
            },
            axisTick: {
              show: true,
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              // interval: 0, // 不自动隐藏横轴的label
              color: '#86909C'
            }
          },
          yAxis: {
            max: this.isPercent ? 100 : 'dataMax',
            min: 0,
            minInterval: this.isPercent ? 'auto' : 1,
            type: 'value',
            // axisLine: {
            // show: true,
            // lineStyle: {
            //   color: "#cccccc"
            // },
            // },
            splitLine: {
              show: true,
              lineStyle: {
                // type: 'line',
                width: 1,
                color: "#F2F3F5"
              },
              noZero: true
            },
            axisLabel: {
              formatter: '{value}' + (this.isPercent ? '%' : ''),
              show: true,
              color: '#B8BCC4'
            }
          },
          label: {
            show: true
          },
          series: [],
          legend: {
            top:0,
            right: 30,
            show: true,
            itemGap: 30,
            type: 'scroll',
            icon: 'path://M0 10 H 100 V 30 H 0 Z',
            itemHeight: 8,
            itemWidth: 12,
            itemStyle: {
              borderWidth: 0
            }
          },
        };
        chartOption.xAxis.data = this.data?.labels?.map(e => String(e || '')) || [] // x轴数据
        chartOption.series.length = 0
        this.data?.values?.forEach((e, index) => {
          chartOption.series[index] = {
            name: e.name,
            cursor: 'default',
            smooth: false,
            symbol: 'circle',
            symbolSize: 4,
            emphasis: {
              scale: 2.5
            },
            itemStyle: {
              color: e.color,
            },
            label: {
              show: false,
            },
            data: e.data || [],
            type: 'line',
            z: this.data.values.length - index + 1,
            areaStyle: this.hasAreaColor ? {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {offset: 0.1, color: `rgba(${Color(e.color || chartOption?.color[index] || 'white').array().join(',')}, 0.2)`},
                  {offset: 1, color: 'rgba(255,255,255,0)'}
                ],
              },
            } : undefined
          }
        })
        if (this.chartInstance) {
          this.chartInstance.setOption(chartOption, {notMerge: false, lazyUpdate: true, replaceMerge: ['series']})
          this.chartInstance.setOption(this.option || {}, {notMerge: false, lazyUpdate: true})
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
.chart-line {
  height: 100%;
  position: relative;

  .header {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  &__chart {
    height: 100%;
    padding: 10px 20px;
  }
}
</style>
