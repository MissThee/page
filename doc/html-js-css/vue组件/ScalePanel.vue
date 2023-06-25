<template>
  <div class="scale-panel">
    <div ref="fullEl" style="height: 100%;width: 100%;position: absolute;pointer-events: none"/>
    <div :style="{
          width:originWidth===null?'':( originWidth*scaleRate+'px'),
          height:originHeight===null?'100%':( originHeight*scaleRate+'px'),
        }"
         style="position: relative;margin: auto;overflow: visible;"
    >
      <div :style="{
          width: originWidth===null?'':(originWidth+'px'),
          height: originHeight===null?'':(originHeight+'px'),
          transform: 'scale(' +scaleRate+ ')'
        }"
           style="transform-origin: 0 0;position: relative;overflow: hidden"
      >
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScalePanel',
  props: {
    originHeight: { // 设计高度
      type: Number,
      default() {
        return null
      }
    },
    originWidth: { // 设计宽度
      type: Number,
      default() {
        return null
      }
    },
    isFullWindow: Boolean, // true参照窗口宽度（全屏弹窗时用），false参照父级宽度
    widthScaleOnly: Boolean, // 仅参照宽度缩放
    heightScaleOnly: Boolean, // 仅参照高度缩放
  },
  data() {
    return {
      scaleRate: 1,
    }
  },
  watch: {
    $route() {
      this.$nextTick(() => {
        this.updateView()
      })
    },
    scaleRate(newVal) {
      this.$emit('scale', newVal)
    }
  },
  mounted() {
    this.updateView()
    // window.addEventListener('click', this.updateView)
    window.addEventListener('resize', this.updateView)
  },
  beforeDestroy() {
    // window.removeEventListener('click', this.updateView)
    window.removeEventListener('resize', this.updateView)
  },
  methods: {
    updateView() {
      this.$nextTick(() => {


        let scaleRateWidth = 0
        if (this.$refs.fullEl && this.$refs.fullEl.offsetWidth) {
          if (this.isFullWindow) {
            scaleRateWidth = window.innerWidth / this.originWidth
          } else {
            scaleRateWidth = this.$refs.fullEl.offsetWidth ? (this.$refs.fullEl.offsetWidth / this.originWidth) : 1
          }
        }

        let scaleRateHeight = 0
        if (this.$refs.fullEl && this.$refs.fullEl.offsetHeight) {
          if (this.isFullWindow) {
            scaleRateHeight = window.innerHeight / this.originHeight
          } else {
            scaleRateHeight = this.$refs.fullEl.offsetHeight ? (this.$refs.fullEl.offsetHeight / this.originHeight) : 1
          }
        }
        if (this.widthScaleOnly && !this.heightScaleOnly) {
          return this.scaleRate = scaleRateWidth
        }
        if (this.heightScaleOnly && !this.widthScaleOnly) {
          return this.scaleRate = scaleRateHeight
        }
        this.scaleRate = Math.min(scaleRateWidth, scaleRateHeight)
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.scale-panel {
}
</style>
