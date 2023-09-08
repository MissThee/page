<template>
  <div class="single-ring" ref="selfRef">
    <div class="single-ring__map" ref="chartEl"/>
  </div>
</template>
<script>
import * as echarts from 'echarts'

export default {
  name: 'SingleRing',
  props: {
    props: Array, // { key: string, color: string }[]
    option: Object,
    data: {
      type: Object,
      default() {
        return {
          total: 0, // 总数
          percent: 0,
          positive: 0, // 圆环蓝色百分比
          positivePercent: 0, // 圆环蓝色百分比
          negative: 0, // 圆环橙色百分比
          negativePercent: 0, // 圆环橙色百分比
          neutral: 0,  // 圆环灰色百分比
          neutralPercent: 0, // 圆环灰色百分比
        }
      }
    }
  },
  data() {
    return {
      chartInstance: null
    }
  },
  methods: {
    updateView() {
      if (!this.chartInstance) {
        return
      }
      const chartOption = {
        animation: false,
        tooltip: {
          show: false
        },
        series: [
          {
            name: '',
            type: 'pie',
            cursor: 'default',
            // radius: ['95%', '100%'], // 在后面动态设置
            // itemStyle: {
            // borderRadius: 12,
            // borderColor: 'white',
            // borderWidth: 8,
            // },
            silent: true, // true时去除鼠标交互
            data: [
              // { value: 0, name: '正向', itemStyle: { color: '#6BCAF7' } },
              // { value: 0, name: '负向', itemStyle: { color: '#FA8DBF' } },
              // { value: 0, name: '中立', itemStyle: { color: '#979797' } }
            ],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
          }
        ]
      }
      // 设置数据和配置
      this.props?.forEach((p, i) => {
        chartOption.series[0].data[i] = {
          value: this.data[p.key],
          itemStyle: {color: p.color}
        }
      })
      if (chartOption.series[0].data.reduce((total, item) => total + (item.value || 0), 0) === 0) {
        chartOption.series[0].data = [{value: 0, name: '无数据', itemStyle: {color: '#eee'}}]
      }
      // 使用配置内容绘制
      if (this.chartInstance) {
        this.chartInstance.setOption(chartOption, {notMerge: false, lazyUpdate: true, replaceMerge: ['series']})
        this.chartInstance.setOption(this.option || {}, false, true) // 合并父级传入的配置
        this.resize()
      }
    },
    resize() {
      if (!this.chartInstance) {
        return
      }
      const ringWidth = 34
      const option = {
        series: [
          {
            radius: [Math.round((1 - ringWidth / (this.$refs.selfRef.clientWidth || 1)) * 100) + '%', '100%']
          }
        ]
      }
      this.chartInstance.setOption(option)
      setTimeout(() => {
        this.chartInstance?.resize()
      })
    },
  },
  computed: {
    watchTmp() {
      return [this.data, this.option, this.props]
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

<style lang="scss" scoped>
.single-ring {
  display: inline-block;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  border-radius: 50%;

  &__map {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  &__header {
    margin: 8px 16px 0;
    display: flex;
    align-items: center;
    justify-content: space-between
  }

  &__total {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
  }

  .loading {
    width: 80px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
