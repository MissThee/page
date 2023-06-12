<template>
  <div class="num-show">
    <div class="header">
      <div class="charts-title">客户声量</div>
      <img v-if="!props.noTrend" class="charts-icon" :src="HomeAssets.trend" alt="" @click="trendClickHandler"/>
    </div>
    <div class="container">
      <div class="panel">
        <div class="label">分析数据量</div>
        <div class="num">
          <AnimateNum :num="props.num" :formatter="e=>(e===null||e===undefined)?'-':e"/>
          <span>条</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ChartNumShow"
}
</script>

<script setup lang="ts">

import AnimateNum from "@/components/AnimateNum.vue";
import * as HomeAssets from 'home/assets/index.ts'

const props = withDefaults(defineProps<{
  num?: number,
  noTrend?: boolean
}>(), {})
const emits = defineEmits(['trendClick'])
const trendClickHandler = () => {
  emits('trendClick')
}
</script>

<style scoped lang="less">
.num-show {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .trend {
      cursor: pointer;
      height: 21px;
      width: 21px;
    }
  }

  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .panel {
      border-radius: 50%;
      height: 220px;
      width: 220px;
      border: 2px solid #45dfe0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .label {
        font-size: 18px;
        font-weight: bold;
      }

      .num {
        white-space: nowrap;
        font-size: 36px;
        font-weight: bold;
      }
    }
  }

}
</style>