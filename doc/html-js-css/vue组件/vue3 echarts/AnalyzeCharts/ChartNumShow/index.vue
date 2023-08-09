<template>
  <div class="chart-num-show">
    <div class="header">
      <div>
        <div class="charts-title">{{ props.title }}</div>
      </div>
    </div>
    <div class="body">
      <div class="panel">
        <span class="label">客户声量</span>
        <div class="sub-label">
          <span class="num">{{ props.data }}</span>
          <span class="unit">条</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ChartNumShow'
}
</script>
<script lang="ts" setup>

const props = withDefaults(defineProps<{
  title?: string,
  data?: number,
}>(), {
  title: '',
})


</script>

<style lang="less" scoped>
.chart-num-show {
  height: 100%;
  position: relative;
  overflow: hidden;

  .header {
    left: 0;
    position: absolute;
    margin: 0 30px 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 9;
  }

  .body {
    height: 100%;
    display: flex;
    align-items: center;

    .panel {
      margin: auto;
      height: 190px;
      width: 190px;
      border: 1px solid var(--el-color-primary);
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
