<template>
  <div class="region-overview" v-loading="isLoading">
    <div>
      <div class="label">区域</div>
      <span>{{ props.regionShow }}</span>
    </div>
    <OverviewBoard style="margin-top: 20px" :ignore-ids="['remind_msg']" :data="regionInfo"/>
  </div>
</template>

<script lang="ts">
export default {
  name: "RegionOverview"
}
</script>

<script setup lang="ts">
import * as intelliScheduling from '@/api/intelliScheduling'

import {defineProps, ref, watch, withDefaults} from "vue";
import OverviewBoard from "@/components/overviewBoard/index.vue";

const isLoading = ref(false)
const props = withDefaults(defineProps<{
  params: {
    city_code: string,
    region_no: string,
    choose_date: string,
    id: any, //路线详情data/detail接口获取的recommend_log_id字段
  },
  regionShow: string
}>(), {})


const regionInfo = ref({})
const requestData = async () => {
  isLoading.value = true
  try {
    regionInfo.value = {}
    const res = await intelliScheduling.regionOverview(props.params)
    if (res.errcode === 0) {
      regionInfo.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
  isLoading.value = false
}

watch(() => props.params, requestData, {deep: true, immediate: true})


</script>

<style scoped lang="scss">
.region-overview {
  font-size: 14px;

  .label {
    display: inline-flex;
    align-items: baseline;

    &:after {
      content: '：'
    }
  }

  .table {
    margin-top: 20px;

    td {
      border: 1px solid #ccc;
      padding: 5px;
    }

    &__label {
      font-weight: bold;
      background-color: #eee;
      white-space: nowrap;
    }

    &__value {
      text-align: center;
      min-width: 150px;
    }
  }

  .title {
    font-weight: bold;
    margin: 20px 0 10px;
  }

  .order-id {
    overflow: hidden;
    vertical-align: top;
    display: inline-block;
    border: 1px solid white;
    background-color: #ccc;
    padding: 5px;
    font-size: 12px;
  }
}
</style>