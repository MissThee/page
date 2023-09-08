<template>
  <div class="chart-word-cloud" ref="selfRef">
    <div class="header">
      <div class="charts-title">{{ title }}</div>
    </div>
    <div class="chart-word-cloud__chart" ref="chartEl"/>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import 'echarts-wordcloud';

const weightList = [5.5, 3, 3, 2.5, 2, 2, 1]

export default {
  name: "chartWordCloud",
  props: {
    title: String,
    maxValueColor: String,
    data: {
      type: Array,
      default() {
        return []
      }
    },
    option: Object
  },
  data() {
    return {
      centerScaleRate: 1,

    }
  },
  methods: {
    updateView() {
      if (!this.chartInstance) {
        return
      }
      const sortedData = JSON.parse(JSON.stringify(this.data || []))
        .filter(e => e.name)
        .sort((a, b) => a.value < b.value ? 1 : -1)
      sortedData.forEach((e, i) => {
        e.num = e.value
        if (i === 0) {
          e.value = weightList[0]
        } else {
          e.value = weightList[Math.ceil(i / (sortedData.length / (weightList.length - 1)))]
        }
      })
      const chartOption = {
        tooltip: {
          show: true,
          borderColor: 'transparent',
          formatter: () => `
<table style="position: relative;text-align: left;">
  <tr>
    <td>TOP10指标</td>
  </tr>
  ${sortedData.slice(0, 10).map(e => `
  <tr>
    <td >${e.name}</td>
    <td style="min-width: 4em;text-align: right;margin-left: 5px">${e.num}</td>
  </tr>
  `).join('')}
</table>
`,
        },
        series: [{
          type: 'wordCloud',
          shape: 'square',
          keepAspect: false,
          left: 'center',
          top: 'center',
          width: '95%',
          height: '98%',
          right: null,
          bottom: null,
          sizeRange: [10, 27],
          rotationRange: [0, 0],
          rotationStep: 0,
          gridSize: 25,
          drawOutOfBound: false,
          shrinkToFit: false,
          layoutAnimation: true,
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
          },
          data: []
        }],
      }
      // 设置数据和配置
      sortedData.forEach((e, index) => {
        const opacity = 0.2 + 0.8 * (sortedData[0]?.value ? e.value / sortedData[0].value : 1)
        chartOption.series[0].data[index] = {
          value: e.value,
          name: e.name,
          textStyle: {
            color: index === 0 ? this.maxValueColor : `rgba(51,51,51,${opacity})`
          }
        }
      })

      // 使用配置内容绘制
      if (this.chartInstance) {
        this.chartInstance.setOption(chartOption, {notMerge: true, lazyUpdate: true, replaceMerge: ['series']})
        this.chartInstance.setOption(this.option || {}, false, true) // 合并父级传入的配置
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
.chart-word-cloud {
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
}
</style>
