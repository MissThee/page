<template>
  <div class="chart-num-show">
    <div class="header">
      <div class="charts-title">{{ title }}</div>
    </div>
    <div class="body" ref="bodyRef">
      <div class="panel" :style="{height:size+'px',width:size+'px',minWidth:size+'px'}">
        <span class="label">客户声量</span>
        <div class="sub-label">
          <span class="num">{{ data }}</span>
          <span class="unit">条</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChartNum",
  props: {
    data: Number,
    title: String,
  },
  data() {
    return {
      sizeMin: 190,
      sizeMax: 300,
    }
  },
  computed: {
    size() {
      return Math.min(this.sizeMax, Math.max(this.sizeMin, String(this.data || 0).length * 27 + 20))
    }
  }
}
</script>


<style scoped lang="scss">
.chart-num-show {
  height: 100%;
  position: relative;
  overflow: hidden;

  .header {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .body {
    height: 100%;
    display: flex;
    align-items: center;

    .panel {
      margin: auto;
      height: 190px;
      width: 190px;
      border: 1px solid #45DFE0;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .label {
        font-size: 20px;
        font-family: SimHei, sans-serif;
        font-weight: bold;
      }

      .sub-label {
        display: flex;
        align-items: center;

        .num {
          font-size: 38px;
          line-height: 38px;
        }

        .unit {
          font-size: 30px;
          line-height: 30px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
